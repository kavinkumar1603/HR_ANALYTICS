"use client";

import React, { useState } from "react";
import { AnalyticsData } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  ComposedChart,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  GraduationCap,
  Globe,
  Layers,
} from "lucide-react";

interface AnalyticsTabProps {
  analytics: AnalyticsData | null;
}

export default function AnalyticsTab({ analytics }: AnalyticsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "roles" | "experience" | "education" | "geography" | "distribution"
  >("roles");

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Format currency tooltip helper
  const currencyFormatter: any = (val: any, name?: any) => {
    const num = Number(val);
    if (!isNaN(num)) {
      return [`$${num.toLocaleString()}`, name || "Salary"];
    }
    return [String(val), name || ""];
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Sub-tab switcher with clean rounded buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab("roles")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === "roles"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Role Benchmarks</span>
        </button>

        <button
          onClick={() => setActiveSubTab("experience")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === "experience"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Experience Curve</span>
        </button>

        <button
          onClick={() => setActiveSubTab("education")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === "education"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Education & Scale</span>
        </button>

        <button
          onClick={() => setActiveSubTab("geography")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === "geography"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Global Markets & Remote</span>
        </button>

        <button
          onClick={() => setActiveSubTab("distribution")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === "distribution"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Salary Density Curve</span>
        </button>
      </div>

      {/* VIEW 1: ROLE BENCHMARKS */}
      {activeSubTab === "roles" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Annual Compensation by Job Role
                </h3>
                <p className="text-xs text-slate-500">
                  Comparison of Mean vs. Median Annual Base Salary across all 12 job specializations
                </p>
              </div>
              <div className="text-xs font-medium text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-blue-600" /> Mean Salary
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-slate-400" /> Median Salary
                </span>
              </div>
            </div>

            <div className="h-96 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={analytics.salary_by_job}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="job_title"
                    stroke="#64748b"
                    fontSize={11}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    height={60}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={currencyFormatter}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "0.75rem",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="avg_salary"
                    name="Mean Salary"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="median_salary"
                    name="Median Salary"
                    stroke="#64748b"
                    strokeWidth={2.5}
                    dot={{ fill: "#64748b", r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Industry Breakdown */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Compensation Across Industries
              </h3>
              <p className="text-xs text-slate-500">
                Mean compensation ranking by employer industry sector
              </p>
            </div>

            <div className="h-72 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.salary_by_industry}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 70, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <YAxis
                    dataKey="industry"
                    type="category"
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <Tooltip
                    formatter={currencyFormatter}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "0.75rem",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="avg_salary"
                    name="Average Salary"
                    fill="#3b82f6"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EXPERIENCE CURVE */}
      {activeSubTab === "experience" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">
              Experience Career Ladder: 0 to 20 Years
            </h3>
            <p className="text-xs text-slate-500">
              Salary progression showing direct positive correlation with professional tenure
            </p>
          </div>

          <div className="h-96 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics.salary_by_experience}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="experience_years"
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(v) => `${v} yrs`}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  formatter={currencyFormatter}
                  labelFormatter={(v) => `${v} Years Experience`}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    borderRadius: "0.75rem",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avg_salary"
                  name="Average Salary"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <span>
              📈 <strong>Growth Insight:</strong> Senior professionals (15-20 yrs) earn approximately <strong>60-70% more</strong> than entry-level associates (0-2 yrs).
            </span>
          </div>
        </div>
      )}

      {/* VIEW 3: EDUCATION & COMPANY SIZE */}
      {activeSubTab === "education" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Education Tier */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Compensation by Education Level
              </h3>
              <p className="text-xs text-slate-500">
                Progression across educational qualifications
              </p>
            </div>

            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.salary_by_education}
                  margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="education_level" stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={currencyFormatter}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "0.75rem",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="avg_salary"
                    name="Mean Salary"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Company Size */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Salary Scale by Company Scale
              </h3>
              <p className="text-xs text-slate-500">
                From nimble Startups to Global Enterprises
              </p>
            </div>

            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.salary_by_company_size}
                  margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="company_size" stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={currencyFormatter}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "0.75rem",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="avg_salary"
                    name="Mean Salary"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: GEOGRAPHY & REMOTE */}
      {activeSubTab === "geography" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Bar Chart */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Geographic Market Compensation
              </h3>
              <p className="text-xs text-slate-500">
                Average salary across 10 international talent hubs
              </p>
            </div>

            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.salary_by_location}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <YAxis
                    dataKey="location"
                    type="category"
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <Tooltip
                    formatter={currencyFormatter}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "0.75rem",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="avg_salary"
                    name="Mean Salary"
                    fill="#2563eb"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Remote Work Comparison */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Remote Work Compensation Equity
              </h3>
              <p className="text-xs text-slate-500">
                Mean salary parity between Onsite, Hybrid, and Fully Remote
              </p>
            </div>

            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.salary_by_remote.map((item) => ({
                    ...item,
                    label:
                      item.remote_work === "Yes"
                        ? "100% Remote"
                        : item.remote_work === "Hybrid"
                        ? "Flexible Hybrid"
                        : "On-site / Office",
                  }))}
                  margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={currencyFormatter}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "0.75rem",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="avg_salary"
                    name="Average Salary"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: DISTRIBUTION HISTOGRAM */}
      {activeSubTab === "distribution" && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">
              Workforce Salary Density Distribution (Bell Curve)
            </h3>
            <p className="text-xs text-slate-500">
              Talent count distributed across 12 compensation tiers ($31k - $333k)
            </p>
          </div>

          <div className="h-96 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.salary_distribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range_label" stroke="#64748b" fontSize={11} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(v) => `${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(v: any) => [`${Number(v).toLocaleString()} professionals`, "Talent Count"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    borderRadius: "0.75rem",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Employee Count"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
