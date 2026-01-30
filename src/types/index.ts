// Healthcare Deadline Types

export interface Deadline {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  category: DeadlineCategory;
  source: DeadlineSource;
  sourceUrl?: string;
  documentNumber?: string;
  agency?: string;
  state?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'passed' | 'urgent';
}

export type DeadlineCategory =
  | 'hipaa'
  | 'cms'
  | 'interoperability'
  | 'licensing'
  | 'oig'
  | 'state'
  | 'other';

export type DeadlineSource =
  | 'federal_register'
  | 'cms'
  | 'state_board'
  | 'manual';

export interface FederalRegisterDocument {
  document_number: string;
  title: string;
  abstract: string;
  type: string;
  html_url: string;
  pdf_url: string;
  publication_date: string;
  comments_close_on?: string;
  effective_on?: string;
  agencies: {
    name: string;
    id: number;
  }[];
  dates?: string;
  action?: string;
}

export interface FederalRegisterResponse {
  count: number;
  total_pages: number;
  results: FederalRegisterDocument[];
  next_page_url?: string;
}

export interface StateLicensingInfo {
  state: string;
  stateCode: string;
  boardName: string;
  renewalPeriod: string;
  renewalMonth?: string;
  cmeRequirements: string;
  website: string;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: {
    deadline: Deadline;
  };
}
