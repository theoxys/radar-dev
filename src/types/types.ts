export interface Technology {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Submission {
  id: string;
  companyName: string;
  companyLink: string;
  position: string;
  salary_in_cents: number;
  comments?: string;
  benefits?: string;
  technologies: Technology[];
  createdAt: Date;
}

export interface CreateSubmissionRequest {
  companyName: string;
  companyLink: string;
  position: string;
  salary_in_cents: number;
  comments?: string;
  benefits?: string;
  technologyIds: string[];
}

export interface ListSubmissionsRequest {
  page?: number;
  perPage?: number;
  salaryMin?: number;
  salaryMax?: number;
  q?: string;
  technologyIds?: string[];
}

export interface ListSubmissionsResponse {
  submissions: Submission[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface SearchTechnologiesRequest {
  q: string;
  limit?: number;
}

export interface SearchTechnologiesResponse {
  technologies: Technology[];
}

export interface CreateTechnologyRequest {
  name: string;
}
