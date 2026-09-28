"use client";

import React, { useState, useEffect } from "react";
import {
  SalaryRecord,
  FilterOptions,
  RecordsResponse,
  PredictionRequest,
} from "../types";
import { fetchRecords } from "../api";
import {
  Search,
  ArrowUpDown,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  SlidersHorizontal,
  X,
  Building2,
  MapPin,
} from "lucide-react";

interface RecordsTabProps {
  filterOptions: FilterOptions | null;
  onSelectRecordForPrediction: (record: PredictionRequest) => void;
}

export default function RecordsTab({
  filterOptions,
  onSelectRecordForPrediction,
}: RecordsTabProps) {
  // Query States
  const [search, setSearch] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");
  const [remoteWork, setRemoteWork] = useState("");
  const [minExp, setMinExp] = useState<number | "">("");
  const [maxExp, setMaxExp] = useState<number | "">("");
  const [minSalary, setMinSalary] = useState<number | "">("");
  const [maxSalary, setMaxSalary] = useState<number | "">("");
  const [sortBy, setSortBy] = useState("salary");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  // Data States
  const [data, setData] = useState<RecordsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchRecords({
        page,
        limit,
        search: search.trim() || undefined,
        job_title: jobTitle || undefined,
        education_level: educationLevel || undefined,
        industry: industry || undefined,
        company_size: companySize || undefined,
        location: location || undefined,
        remote_work: remoteWork || undefined,
        min_exp: minExp !== "" ? Number(minExp) : undefined,
        max_exp: maxExp !== "" ? Number(maxExp) : undefined,
        min_salary: minSalary !== "" ? Number(minSalary) : undefined,
        max_salary: maxSalary !== "" ? Number(maxSalary) : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setData(res);
    } catch (err) {
      console.error("Failed to load records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      loadData();
    }, 200);
    return () => clearTimeout(handler);
  }, [
    page,
    limit,
    search,
    jobTitle,
    educationLevel,
    industry,
    companySize,
    location,
    remoteWork,
    minExp,
    maxExp,
    minSalary,
    maxSalary,
    sortBy,
    sortOrder,
  ]);

  const handleResetFilters = () => {
    setSearch("");
    setJobTitle("");
    setEducationLevel("");
    setIndustry("");
    setCompanySize("");
    setLocation("");
    setRemoteWork("");
    setMinExp("");
    setMaxExp("");
    setMinSalary("");
    setMaxSalary("");
    setSortBy("salary");
    setSortOrder("desc");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search ||
      jobTitle ||
      educationLevel ||
      industry ||
      companySize ||
      location ||
      remoteWork ||
      minExp !== "" ||
      maxExp !== "" ||
      minSalary !== "" ||
      maxSalary !== ""
  );

  const handleSortToggle = (col: string) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
    setPage(1);
  };

  // Export current records to CSV
  const handleExportCSV = () => {
    if (!data || data.records.length === 0) return;
    const headers = [
      "Job Title",
      "Experience (Years)",
      "Education Level",
      "Skills Count",
      "Industry",
      "Company Size",
      "Location",
      "Remote Work",
      "Certifications",
      "Salary (USD)",
    ];
    const rows = data.records.map((r) => [
      `"${r.job_title}"`,
      r.experience_years,
      `"${r.education_level}"`,
      r.skills_count,
      `"${r.industry}"`,
      `"${r.company_size}"`,
      `"${r.location}"`,
      `"${r.remote_work}"`,
      r.certifications,
      r.salary,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hr_salary_records_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search Bar, Filter Toggle, Export */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search across 250,000 records by job title, industry, or location..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showFilters || hasActiveFilters
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent transition-all cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              disabled={!data || data.records.length === 0}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filter Panel */}
        {showFilters && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            {/* Job Title Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Job Title
              </label>
              <select
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Job Titles (12)</option>
                {filterOptions?.job_titles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => {
                  setEducationLevel(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Education Levels</option>
                {filterOptions?.education_levels.map((edu) => (
                  <option key={edu} value={edu}>
                    {edu}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Industries (10)</option>
                {filterOptions?.industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Locations (10)</option>
                {filterOptions?.locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Company Size
              </label>
              <select
                value={companySize}
                onChange={(e) => {
                  setCompanySize(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Sizes</option>
                {filterOptions?.company_sizes.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            </div>

            {/* Remote Work */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Work Arrangement
              </label>
              <select
                value={remoteWork}
                onChange={(e) => {
                  setRemoteWork(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Arrangements</option>
                <option value="Yes">100% Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="No">On-site / Office</option>
              </select>
            </div>

            {/* Experience Range */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Experience Years
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min (0)"
                  min={0}
                  max={20}
                  value={minExp}
                  onChange={(e) => {
                    setMinExp(e.target.value === "" ? "" : Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-1/2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max (20)"
                  min={0}
                  max={20}
                  value={maxExp}
                  onChange={(e) => {
                    setMaxExp(e.target.value === "" ? "" : Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-1/2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Salary USD
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min ($31k)"
                  step={10000}
                  value={minSalary}
                  onChange={(e) => {
                    setMinSalary(e.target.value === "" ? "" : Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-1/2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max ($333k)"
                  step={10000}
                  value={maxSalary}
                  onChange={(e) => {
                    setMaxSalary(e.target.value === "" ? "" : Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-1/2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter Summary Banner */}
        {data && (
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100 gap-2">
            <div>
              Showing{" "}
              <span className="font-bold text-slate-900">
                {data.records.length > 0
                  ? ((data.page - 1) * data.limit + 1).toLocaleString()
                  : 0}
                {" - "}
                {Math.min(
                  data.page * data.limit,
                  data.total
                ).toLocaleString()}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {data.total.toLocaleString()}
              </span>{" "}
              matching records
            </div>

            {data.subset_stats && data.total > 0 && (
              <div className="flex items-center space-x-4 text-[11px]">
                <span>
                  Filtered Mean:{" "}
                  <strong className="text-blue-700 font-mono">
                    ${data.subset_stats.avg_salary.toLocaleString()}
                  </strong>
                </span>
                <span className="hidden sm:inline">
                  Range:{" "}
                  <strong className="text-slate-700 font-mono">
                    ${data.subset_stats.min_salary.toLocaleString()} - $
                    {data.subset_stats.max_salary.toLocaleString()}
                  </strong>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th
                  onClick={() => handleSortToggle("job_title")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Role & Industry</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle("experience_years")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Experience</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Education</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Company Size</th>
                <th className="py-3.5 px-4">Work Mode</th>
                <th
                  onClick={() => handleSortToggle("skills_count")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors text-center"
                >
                  <div className="flex items-center justify-center space-x-1.5">
                    <span>Skills / Certs</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle("salary")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end space-x-1.5">
                    <span>Annual Salary</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-500">
                    <div className="inline-flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                      <span>Loading records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : !data || data.records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-semibold text-slate-700">
                        No matching records found
                      </p>
                      <p className="text-xs text-slate-500">
                        Try adjusting your filters or search terms.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                data.records.map((r, idx) => {
                  const remoteBadgeColors: Record<string, string> = {
                    Yes: "bg-blue-50 text-blue-700 border-blue-200",
                    Hybrid: "bg-slate-100 text-slate-800 border-slate-300",
                    No: "bg-slate-100 text-slate-600 border-slate-200",
                  };

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Job Title & Industry */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {r.job_title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          <span>{r.industry}</span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900 font-mono">
                            {r.experience_years} yrs
                          </span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{
                                width: `${(r.experience_years / 20) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Education */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                          {r.education_level}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5 text-slate-700">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span className="font-medium">{r.location}</span>
                        </div>
                      </td>

                      {/* Company Size */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-600 font-medium">
                          {r.company_size}
                        </span>
                      </td>

                      {/* Remote Work */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            remoteBadgeColors[r.remote_work] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {r.remote_work === "Yes"
                            ? "Remote"
                            : r.remote_work === "Hybrid"
                            ? "Hybrid"
                            : "On-site"}
                        </span>
                      </td>

                      {/* Skills & Certs */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center space-x-1.5 font-mono text-[11px]">
                          <span
                            className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold"
                            title={`${r.skills_count} Technical Skills`}
                          >
                            {r.skills_count} sk
                          </span>
                          <span
                            className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold"
                            title={`${r.certifications} Certifications`}
                          >
                            {r.certifications} cert
                          </span>
                        </div>
                      </td>

                      {/* Annual Salary */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-bold text-slate-900 font-mono text-sm">
                          ${r.salary.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-400">USD/yr</span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() =>
                            onSelectRecordForPrediction({
                              job_title: r.job_title,
                              experience_years: r.experience_years,
                              education_level: r.education_level,
                              skills_count: r.skills_count,
                              industry: r.industry,
                              company_size: r.company_size,
                              location: r.location,
                              remote_work: r.remote_work,
                              certifications: r.certifications,
                            })
                          }
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors cursor-pointer"
                          title="Simulate this profile in AI Predictor"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {data && data.total_pages > 0 && (
          <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            {/* Rows Per Page */}
            <div className="flex items-center space-x-2">
              <span>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">
                Page <strong className="text-slate-900">{data.page}</strong> of{" "}
                <strong className="text-slate-900">{data.total_pages}</strong>
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={data.page <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={data.page <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(data.total_pages, prev + 1))
                  }
                  disabled={data.page >= data.total_pages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setPage(data.total_pages)}
                  disabled={data.page >= data.total_pages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
