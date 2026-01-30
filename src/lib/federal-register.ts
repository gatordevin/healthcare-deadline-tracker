import { FederalRegisterResponse, FederalRegisterDocument, Deadline } from '@/types';

const FEDERAL_REGISTER_API = 'https://www.federalregister.gov/api/v1';

// Search terms for healthcare compliance
const HEALTHCARE_SEARCH_TERMS = [
  'HIPAA',
  'HITECH',
  'health information',
  'electronic health records',
  'interoperability',
  'patient privacy',
  'healthcare cybersecurity',
  'CMS final rule',
  'Medicare compliance',
];

export async function searchFederalRegister(
  term: string,
  options: {
    perPage?: number;
    page?: number;
    documentTypes?: string[];
  } = {}
): Promise<FederalRegisterResponse> {
  const { perPage = 20, page = 1, documentTypes = ['RULE', 'PRORULE', 'NOTICE'] } = options;

  const params = new URLSearchParams();
  params.append('conditions[term]', term);
  params.append('per_page', perPage.toString());
  params.append('page', page.toString());
  params.append('order', 'newest');

  documentTypes.forEach((type) => {
    params.append('conditions[type][]', type);
  });

  const response = await fetch(`${FEDERAL_REGISTER_API}/documents.json?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Federal Register API error: ${response.status}`);
  }

  return response.json();
}

export async function getDocument(documentNumber: string): Promise<FederalRegisterDocument> {
  const response = await fetch(`${FEDERAL_REGISTER_API}/documents/${documentNumber}.json`);

  if (!response.ok) {
    throw new Error(`Federal Register API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchHealthcareDeadlines(): Promise<Deadline[]> {
  const deadlines: Deadline[] = [];
  const seenDocuments = new Set<string>();

  // Search for multiple relevant terms
  for (const term of HEALTHCARE_SEARCH_TERMS.slice(0, 5)) {
    try {
      const response = await searchFederalRegister(term, { perPage: 10 });

      for (const doc of response.results) {
        if (seenDocuments.has(doc.document_number)) continue;
        seenDocuments.add(doc.document_number);

        const deadline = documentToDeadline(doc);
        if (deadline) {
          deadlines.push(deadline);
        }
      }
    } catch (error) {
      console.error(`Error fetching documents for term "${term}":`, error);
    }
  }

  return deadlines;
}

function documentToDeadline(doc: FederalRegisterDocument): Deadline | null {
  // Determine the relevant date
  const deadlineDate = doc.comments_close_on || doc.effective_on;

  if (!deadlineDate) {
    return null;
  }

  // Determine category based on title/abstract
  const category = categorizeDocument(doc);

  // Determine priority based on document type and timing
  const priority = determinePriority(doc, deadlineDate);

  // Determine status
  const status = determineStatus(deadlineDate);

  return {
    id: doc.document_number,
    title: doc.title,
    description: doc.abstract || '',
    date: deadlineDate,
    category,
    source: 'federal_register',
    sourceUrl: doc.html_url,
    documentNumber: doc.document_number,
    agency: doc.agencies?.[0]?.name || 'Unknown',
    priority,
    status,
  };
}

function categorizeDocument(doc: FederalRegisterDocument): Deadline['category'] {
  const text = `${doc.title} ${doc.abstract}`.toLowerCase();

  if (text.includes('hipaa') || text.includes('health insurance portability')) {
    return 'hipaa';
  }
  if (text.includes('cms') || text.includes('medicare') || text.includes('medicaid')) {
    return 'cms';
  }
  if (text.includes('interoperability') || text.includes('tefca') || text.includes('fhir')) {
    return 'interoperability';
  }
  if (text.includes('oig') || text.includes('inspector general')) {
    return 'oig';
  }

  return 'other';
}

function determinePriority(
  doc: FederalRegisterDocument,
  deadlineDate: string
): Deadline['priority'] {
  const daysUntil = Math.ceil(
    (new Date(deadlineDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  // Proposed rules with upcoming comment periods are high priority
  if (doc.type === 'Proposed Rule' && daysUntil > 0 && daysUntil <= 30) {
    return 'high';
  }

  // Final rules with upcoming effective dates
  if (doc.type === 'Rule' && daysUntil > 0 && daysUntil <= 60) {
    return 'high';
  }

  if (daysUntil <= 14) {
    return 'high';
  }

  if (daysUntil <= 60) {
    return 'medium';
  }

  return 'low';
}

function determineStatus(deadlineDate: string): Deadline['status'] {
  const daysUntil = Math.ceil(
    (new Date(deadlineDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntil < 0) {
    return 'passed';
  }

  if (daysUntil <= 14) {
    return 'urgent';
  }

  return 'upcoming';
}
