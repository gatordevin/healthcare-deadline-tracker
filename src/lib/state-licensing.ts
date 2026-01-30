import { StateLicensingInfo, Deadline } from '@/types';

// State medical licensing information for key states
// FL, CA, SC, MD, NJ as specified
export const stateLicensingData: StateLicensingInfo[] = [
  {
    state: 'Florida',
    stateCode: 'FL',
    boardName: 'Florida Board of Medicine',
    renewalPeriod: 'Biennial (every 2 years)',
    renewalMonth: 'January 31 (odd years) or based on birth month',
    cmeRequirements: '40 hours per biennium, including 2 hours medical errors, 2 hours laws/rules, 2 hours controlled substances, 1 hour human trafficking',
    website: 'https://flboardofmedicine.gov/',
    notes: 'Must complete HIV/AIDS course once, Domestic Violence every third renewal cycle',
  },
  {
    state: 'California',
    stateCode: 'CA',
    boardName: 'Medical Board of California',
    renewalPeriod: 'Biennial (every 2 years)',
    renewalMonth: 'Last day of birth month in odd or even years',
    cmeRequirements: '50 hours per biennium, including 12 hours geriatric medicine (one-time for new licenses)',
    website: 'https://www.mbc.ca.gov/',
    notes: 'No CME reporting required but must maintain records for 4 years',
  },
  {
    state: 'South Carolina',
    stateCode: 'SC',
    boardName: 'South Carolina Board of Medical Examiners',
    renewalPeriod: 'Biennial (every 2 years)',
    renewalMonth: 'April 30 (even years)',
    cmeRequirements: '40 hours per biennium, including 4 hours controlled substances, 2 hours opioid prescribing',
    website: 'https://llr.sc.gov/med/',
    notes: 'Must complete ethics course every other renewal',
  },
  {
    state: 'Maryland',
    stateCode: 'MD',
    boardName: 'Maryland Board of Physicians',
    renewalPeriod: 'Biennial (every 2 years)',
    renewalMonth: 'September 30 (based on license issue date)',
    cmeRequirements: '50 hours per biennium, including 2 hours controlled substances (every 5 years)',
    website: 'https://www.mbp.state.md.us/',
    notes: 'Must maintain patient records for 5 years after last treatment',
  },
  {
    state: 'New Jersey',
    stateCode: 'NJ',
    boardName: 'New Jersey State Board of Medical Examiners',
    renewalPeriod: 'Biennial (every 2 years)',
    renewalMonth: 'July 31 (based on triennial cycle)',
    cmeRequirements: '100 hours per biennial period, including 20 hours Category 1',
    website: 'https://www.njconsumeraffairs.gov/med/',
    notes: 'Opioid prescribing course required, DEA licensees need additional DEA renewal',
  },
];

// Generate sample licensing renewal deadlines for each state
export function generateLicensingDeadlines(): Deadline[] {
  const deadlines: Deadline[] = [];
  const currentYear = new Date().getFullYear();

  for (const state of stateLicensingData) {
    // Create a sample renewal deadline for this year or next
    const renewalYear = currentYear % 2 === 0
      ? (state.stateCode === 'SC' ? currentYear : currentYear + 1)
      : (state.stateCode === 'SC' ? currentYear + 1 : currentYear);

    let renewalMonth = '06'; // Default to June
    let renewalDay = '30';

    // Parse renewal month from data
    if (state.renewalMonth) {
      if (state.renewalMonth.includes('January')) {
        renewalMonth = '01';
        renewalDay = '31';
      } else if (state.renewalMonth.includes('April')) {
        renewalMonth = '04';
        renewalDay = '30';
      } else if (state.renewalMonth.includes('September')) {
        renewalMonth = '09';
        renewalDay = '30';
      } else if (state.renewalMonth.includes('July')) {
        renewalMonth = '07';
        renewalDay = '31';
      }
    }

    const renewalDate = `${renewalYear}-${renewalMonth}-${renewalDay}`;

    deadlines.push({
      id: `license-${state.stateCode}-${renewalYear}`,
      title: `${state.state} Medical License Renewal`,
      description: `${state.boardName} license renewal deadline. CME Requirements: ${state.cmeRequirements}`,
      date: renewalDate,
      category: 'licensing',
      source: 'state_board',
      sourceUrl: state.website,
      state: state.stateCode,
      priority: determineLicensePriority(renewalDate),
      status: determineLicenseStatus(renewalDate),
    });

    // Add CME deadline (typically 30 days before renewal)
    const cmeDate = new Date(renewalDate);
    cmeDate.setDate(cmeDate.getDate() - 30);

    deadlines.push({
      id: `cme-${state.stateCode}-${renewalYear}`,
      title: `${state.state} CME Completion Deadline`,
      description: `Complete CME requirements before license renewal. ${state.cmeRequirements}`,
      date: cmeDate.toISOString().split('T')[0],
      category: 'licensing',
      source: 'state_board',
      sourceUrl: state.website,
      state: state.stateCode,
      priority: determineLicensePriority(cmeDate.toISOString().split('T')[0]),
      status: determineLicenseStatus(cmeDate.toISOString().split('T')[0]),
    });
  }

  return deadlines;
}

function determineLicensePriority(dateStr: string): Deadline['priority'] {
  const daysUntil = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntil <= 30) return 'high';
  if (daysUntil <= 90) return 'medium';
  return 'low';
}

function determineLicenseStatus(dateStr: string): Deadline['status'] {
  const daysUntil = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntil < 0) return 'passed';
  if (daysUntil <= 30) return 'urgent';
  return 'upcoming';
}

export function getStateInfo(stateCode: string): StateLicensingInfo | undefined {
  return stateLicensingData.find((s) => s.stateCode === stateCode);
}
