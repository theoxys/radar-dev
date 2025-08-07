export interface Submission {
  id: string;
  companyName: string;
  companyLink: string;
  position: string;
  salary: number;
  comments?: string;
  benefits?: string;
  createdAt: Date;
}

export interface CreateSubmissionRequest {
  companyName: string;
  companyLink: string;
  position: string;
  salary: number;
  comments?: string;
  benefits?: string;
}

export interface ListSubmissionsRequest {
  page?: number;
  perPage?: number;
  salaryMin?: number;
  salaryMax?: number;
  q?: string;
}

export interface ListSubmissionsResponse {
  submissions: Submission[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
