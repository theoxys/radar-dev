import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CreateSubmissionRequest, Submission, Technology } from "@/types/types";

type SortDirection = "asc" | "desc";

export interface GetSubmissionsParams {
  page?: number;
  perPage?: number;
  salaryMin?: number;
  salaryMax?: number;
  searchQuery?: string;
  technologyIds?: string[];
  // Deprecated: prefer `sort` below; kept for backward-compat
  sortSalary?: SortDirection; // asc | desc
  sort?: "recent" | "oldest" | "salary_desc" | "salary_asc" | "alpha";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

function mapSubmissionRow(row: any): Submission {
  const technologies: Technology[] = (row.submission_technologies || [])
    .map((st: any) => st.technologies)
    .filter(Boolean)
    .map((t: any) => ({
      id: String(t.id),
      name: String(t.name ?? ""),
      createdAt: new Date(t.created_at),
    }));

  return {
    id: String(row.id),
    companyName: String(row.company_name ?? ""),
    companyLink: String(row.company_link ?? ""),
    position: String(row.position ?? ""),
    salary_in_cents: Number(row.salary_in_cents ?? 0),
    comments: row.comments ?? undefined,
    benefits: row.benefits ?? undefined,
    technologies,
    createdAt: new Date(row.created_at),
  };
}

async function insertSubmissionWithTechnologies(input: CreateSubmissionRequest): Promise<Submission> {
  const { technologyIds = [], ...rest } = input;

  const payload = {
    company_name: rest.companyName,
    company_link: rest.companyLink,
    position: rest.position,
    salary_in_cents: rest.salary_in_cents,
    comments: rest.comments ?? "",
    benefits: rest.benefits ?? "",
  };

  const { data: created, error: insertError } = await supabase
    .from("submissions")
    .insert(payload)
    .select("id")
    .single();

  if (insertError) throw insertError;

  const submissionId = created!.id as number;

  if (technologyIds.length > 0) {
    const bridgeRows = technologyIds.map((tid) => ({
      submission_id: submissionId,
      technology_id: Number(tid),
    }));

    const { error: bridgeError } = await supabase.from("submission_technologies").insert(bridgeRows);
    if (bridgeError) throw bridgeError;
  }

  const { data: fullRow, error: fetchError } = await supabase
    .from("submissions")
    .select(
      "id, created_at, company_name, company_link, position, salary_in_cents, comments, benefits, submission_technologies(technology_id, technologies(id, name, created_at))"
    )
    .eq("id", submissionId)
    .single();

  if (fetchError) throw fetchError;

  return mapSubmissionRow(fullRow);
}

export function useCreateSubmission() {
  return useMutation({
    mutationFn: insertSubmissionWithTechnologies,
  });
}

async function fetchSubmissions(params: GetSubmissionsParams): Promise<PaginatedResult<Submission>> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const perPage = params.perPage && params.perPage > 0 ? params.perPage : 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const hasTechFilter = Boolean(params.technologyIds && params.technologyIds.length > 0);
  const relation = hasTechFilter
    ? "submission_technologies!inner(technology_id, technologies(id, name, created_at))"
    : "submission_technologies(technology_id, technologies(id, name, created_at))";

  let query = supabase
    .from("submissions")
    .select(`id, created_at, company_name, company_link, position, salary_in_cents, comments, benefits, ${relation}`, {
      count: "exact",
    })
    .range(from, to);

  if (typeof params.salaryMin === "number") {
    query = query.gte("salary_in_cents", params.salaryMin);
  }
  if (typeof params.salaryMax === "number") {
    query = query.lte("salary_in_cents", params.salaryMax);
  }
  if (params.searchQuery && params.searchQuery.trim() !== "") {
    const q = params.searchQuery.trim();
    query = query.or(`company_name.ilike.%${q}%,position.ilike.%${q}%`);
  }
  if (hasTechFilter) {
    const ids = (params.technologyIds as string[]).map((id) => Number(id));
    // Filter across the joined relation
    query = query.in("submission_technologies.technology_id", ids);
  }

  // Sorting
  const sortOption = params.sort;
  if (!sortOption && params.sortSalary) {
    // Backward-compat: only salary sort provided
    query = query.order("salary_in_cents", { ascending: params.sortSalary === "asc" });
  } else {
    switch (sortOption) {
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "salary_desc":
        query = query.order("salary_in_cents", { ascending: false });
        break;
      case "salary_asc":
        query = query.order("salary_in_cents", { ascending: true });
        break;
      case "alpha":
        query = query.order("company_name", { ascending: true });
        break;
      case "recent":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const items: Submission[] = (data ?? []).map(mapSubmissionRow);
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return { items, total, page, perPage, totalPages };
}

export function useGetSubmissions(params: GetSubmissionsParams) {
  const key = useMemo(
    () => [
      "submissions",
      {
        page: params.page ?? 1,
        perPage: params.perPage ?? 20,
        salaryMin: params.salaryMin ?? null,
        salaryMax: params.salaryMax ?? null,
        searchQuery: params.searchQuery ?? "",
        technologyIds: params.technologyIds ?? [],
        sortSalary: params.sortSalary ?? "asc",
        sort: params.sort ?? "recent",
      },
    ],
    [
      params.page,
      params.perPage,
      params.salaryMin,
      params.salaryMax,
      params.searchQuery,
      params.technologyIds,
      params.sortSalary,
      params.sort,
    ]
  );

  return useQuery({
    queryKey: key,
    queryFn: () => fetchSubmissions(params),
  });
}

export interface GetTechnologiesParams {
  page?: number;
  perPage?: number;
  searchQuery?: string;
}

async function fetchTechnologies(params: GetTechnologiesParams): Promise<PaginatedResult<Technology>> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const perPage = params.perPage && params.perPage > 0 ? params.perPage : 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("technologies")
    .select("id, name, created_at", { count: "exact" })
    .order("name", { ascending: true })
    .range(from, to);

  if (params.searchQuery && params.searchQuery.trim() !== "") {
    const q = params.searchQuery.trim();
    query = query.ilike("name", `%${q}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const items: Technology[] = (data ?? []).map((t: any) => ({
    id: String(t.id),
    name: String(t.name ?? ""),
    createdAt: new Date(t.created_at),
  }));

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return { items, total, page, perPage, totalPages };
}

export function useGetTechnologies(params: GetTechnologiesParams) {
  const key = useMemo(
    () => [
      "technologies",
      {
        page: params.page ?? 1,
        perPage: params.perPage ?? 20,
        searchQuery: params.searchQuery ?? "",
      },
    ],
    [params.page, params.perPage, params.searchQuery]
  );

  return useQuery({
    queryKey: key,
    queryFn: () => fetchTechnologies(params),
    enabled: Boolean((params.searchQuery ?? "").length > 0),
  });
}

async function insertTechnology(name: string): Promise<Technology> {
  const { data, error } = await supabase.from("technologies").insert({ name }).select("id, name, created_at").single();

  if (error) throw error;

  return {
    id: String(data.id),
    name: String(data.name ?? ""),
    createdAt: new Date(data.created_at),
  };
}

export function useCreateTechnology() {
  return useMutation({
    mutationFn: insertTechnology,
  });
}
