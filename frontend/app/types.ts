export interface SalaryRecord {
  job_title: string;
  experience_years: number;
  education_level: string;
  skills_count: number;
  industry: string;
  company_size: string;
  location: string;
  remote_work: string;
  certifications: number;
  salary: number;
}

export interface SubsetStats {
  filtered_total: number;
  avg_salary: number;
  min_salary: number;
  max_salary: number;
}

export interface RecordsResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  subset_stats: SubsetStats;
  records: SalaryRecord[];
}

export interface FilterOptions {
  job_titles: string[];
  education_levels: string[];
  industries: string[];
  company_sizes: string[];
  locations: string[];
  remote_options: string[];
  experience_range: { min: number; max: number };
  salary_range: { min: number; max: number };
  skills_range: { min: number; max: number };
  certifications_range: { min: number; max: number };
}

export interface DatasetStats {
  total_records: number;
  avg_salary: number;
  median_salary: number;
  min_salary: number;
  max_salary: number;
  avg_experience: number;
  top_paying_job: {
    title: string;
    avg_salary: number;
  };
  top_paying_location: {
    location: string;
    avg_salary: number;
  };
  top_paying_industry: {
    industry: string;
    avg_salary: number;
  };
  remote_distribution: Record<string, number>;
}

export interface AnalyticsData {
  salary_by_job: Array<{
    job_title: string;
    avg_salary: number;
    median_salary: number;
    min_salary: number;
    max_salary: number;
    count: number;
  }>;
  salary_by_experience: Array<{
    experience_years: number;
    avg_salary: number;
    count: number;
  }>;
  salary_by_education: Array<{
    education_level: string;
    avg_salary: number;
    count: number;
  }>;
  salary_by_industry: Array<{
    industry: string;
    avg_salary: number;
    count: number;
  }>;
  salary_by_company_size: Array<{
    company_size: string;
    avg_salary: number;
    count: number;
  }>;
  salary_by_remote: Array<{
    remote_work: string;
    avg_salary: number;
    count: number;
  }>;
  salary_by_location: Array<{
    location: string;
    avg_salary: number;
    count: number;
  }>;
  salary_distribution: Array<{
    range_label: string;
    low: number;
    high: number;
    count: number;
  }>;
}

export interface PredictionRequest {
  job_title: string;
  experience_years: number;
  education_level: string;
  skills_count: number;
  industry: string;
  company_size: string;
  location: string;
  remote_work: string;
  certifications: number;
}

export interface PredictionResponse {
  predicted_salary: number;
  formatted_salary: string;
  percentile: number;
  job_title: string;
  job_mean_salary: number;
  overall_mean_salary: number;
  diff_vs_job_mean: number;
  diff_vs_overall_mean: number;
  benchmark_range: {
    p10: number;
    p90: number;
  };
}
