"use client";

import React from "react";
import { DatasetStats, AnalyticsData } from "../types";
import {
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Briefcase,
  Laptop,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

interface OverviewTabProps {
  stats: DatasetStats | null;
  analytics: AnalyticsData | null;
  onExploreRecords: () => void;
  onOpenPredictor: () => void;
}

export default function OverviewTab({
  stats,
  analytics,
  onExploreRecords,
  onOpenPredictor,
}: OverviewTabProps) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const topJobs = analytics?.salary_by_job.slice(0, 5) || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner - 100% Light Theme */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-blue-50/80 via-white to-slate-50 p-8 sm:p-10 text-slate-900 shadow-xs border border-blue-100">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-200">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>250,000 Verified Compensation Records</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Workforce Salary Analytics & Intelligence
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Gain data-driven visibility into compensation benchmarks across{" "}
            <span className="text-slate-900 font-semibold">250,000 verified global records</span>.
            Analyze role compensation, geographic pay disparities, remote work dynamics,
            and leverage our trained linear regression model to predict competitive market salaries.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onExploreRecords}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs tracking-wide shadow-sm shadow-blue-600/20 transition-all cursor-pointer text-white"
            >
              <span>Explore 250k Records</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenPredictor}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-semibold text-xs tracking-wide transition-all cursor-pointer text-slate-700 shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Simulate Candidate Salary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards - Light Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Records */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Talent Pool Records
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.total_records.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>100% clean & validated entries</span>
            </p>
          </div>
        </div>

        {/* Card 2: Average Salary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Mean Base Salary
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ${stats.avg_salary.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Median: <span className="font-semibold text-slate-700">${stats.median_salary.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Card 3: Highest Paying Role */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Top Earning Role
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-extrabold text-slate-900 tracking-tight truncate">
              {stats.top_paying_job.title}
            </div>
            <p className="mt-1 text-xs font-semibold text-blue-600">
              ${stats.top_paying_job.avg_salary.toLocaleString()}{" "}
              <span className="text-slate-400 font-normal">avg/yr</span>
            </p>
          </div>
        </div>

        {/* Card 4: Top Market */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Highest Market
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Globe className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.top_paying_location.location}
            </div>
            <p className="mt-1 text-xs font-semibold text-blue-600">
              ${stats.top_paying_location.avg_salary.toLocaleString()}{" "}
              <span className="text-slate-400 font-normal">avg/yr</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Remote Distribution & Top Roles Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Remote Work Dynamics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">
                Remote Work Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Workplace arrangement split across all employees
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Laptop className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {Object.entries(stats.remote_distribution).map(([type, pct]) => {
              const labels: Record<string, { bar: string; text: string }> = {
                Hybrid: {
                  bar: "bg-blue-600",
                  text: "Flexible Hybrid",
                },
                Yes: {
                  bar: "bg-blue-400",
                  text: "100% Fully Remote",
                },
                No: {
                  bar: "bg-slate-300",
                  text: "On-site / Office",
                },
              };
              const c = labels[type] || {
                bar: "bg-blue-500",
                text: type,
              };

              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{c.text}</span>
                    <span className="font-mono font-bold text-slate-900">{pct}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${c.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            💡 The workforce is evenly balanced across remote, hybrid, and onsite roles, enabling robust cross-workstyle salary comparisons.
          </div>
        </div>

        {/* Highest Paying Job Roles */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">
                Top Earning Technical Roles
              </h2>
              <p className="text-xs text-slate-500">
                Mean compensation benchmark across key specializations
              </p>
            </div>
            <button
              onClick={onExploreRecords}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>View all 12 roles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {topJobs.map((job, idx) => (
              <div
                key={job.job_title}
                className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center h-6 w-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {job.job_title}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Sample Size: {job.count.toLocaleString()} professionals
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    ${job.avg_salary.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Range: ${job.min_salary.toLocaleString()} - ${job.max_salary.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Spec Feature Card (Light Theme) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Trained Machine Learning Model Integrated
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Our high-accuracy scikit-learn Linear Regression model is loaded directly from{" "}
              <code className="bg-slate-200/80 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">
                backend/salary_linear_regression_model.pkl
              </code>
              . It utilizes OneHotEncoder for categorical attributes and passthrough scaling for numerical factors (experience, skills count, certifications) to deliver instant salary forecasts.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenPredictor}
          className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Try Salary Simulator
        </button>
      </div>
    </div>
  );
}
