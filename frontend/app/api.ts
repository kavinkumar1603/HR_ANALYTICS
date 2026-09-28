import {
  RecordsResponse,
  FilterOptions,
  DatasetStats,
  AnalyticsData,
  PredictionRequest,
  PredictionResponse,
} from "./types";

const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchHealth(): Promise<{ status: string; dataset_loaded: boolean; total_records: number; model_loaded: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    console.error("Health check error:", err);
    throw err;
  }
}

export async function fetchMetadata(): Promise<{ filter_options: FilterOptions; stats: DatasetStats }> {
  const res = await fetch(`${API_BASE}/meta`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch metadata");
  return await res.json();
}

export async function fetchRecords(params: {
  page?: number;
  limit?: number;
  search?: string;
  job_title?: string;
  education_level?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  remote_work?: string;
  min_exp?: number;
  max_exp?: number;
  min_salary?: number;
  max_salary?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}): Promise<RecordsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page.toString());
  if (params.limit) query.set("limit", params.limit.toString());
  if (params.search) query.set("search", params.search);
  if (params.job_title) query.set("job_title", params.job_title);
  if (params.education_level) query.set("education_level", params.education_level);
  if (params.industry) query.set("industry", params.industry);
  if (params.company_size) query.set("company_size", params.company_size);
  if (params.location) query.set("location", params.location);
  if (params.remote_work) query.set("remote_work", params.remote_work);
  if (params.min_exp !== undefined) query.set("min_exp", params.min_exp.toString());
  if (params.max_exp !== undefined) query.set("max_exp", params.max_exp.toString());
  if (params.min_salary !== undefined) query.set("min_salary", params.min_salary.toString());
  if (params.max_salary !== undefined) query.set("max_salary", params.max_salary.toString());
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.sort_order) query.set("sort_order", params.sort_order);

  const res = await fetch(`${API_BASE}/records?${query.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch records");
  return await res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return await res.json();
}

export async function predictSalary(payload: PredictionRequest): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to predict salary");
  }
  return await res.json();
}
