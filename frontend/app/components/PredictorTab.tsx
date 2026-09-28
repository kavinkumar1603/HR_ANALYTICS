"use client";

import React, { useState, useEffect } from "react";
import {
  FilterOptions,
  PredictionRequest,
  PredictionResponse,
} from "../types";
import { predictSalary } from "../api";
import {
  Sparkles,
  Calculator,
  CheckCircle,
} from "lucide-react";

interface PredictorTabProps {
  filterOptions: FilterOptions | null;
  initialPreset: PredictionRequest | null;
}

export default function PredictorTab({
  filterOptions,
  initialPreset,
}: PredictorTabProps) {
  const [jobTitle, setJobTitle] = useState(
    initialPreset?.job_title || "AI Engineer"
  );
  const [experienceYears, setExperienceYears] = useState<number>(
    initialPreset?.experience_years ?? 5
  );
  const [educationLevel, setEducationLevel] = useState(
    initialPreset?.education_level || "Bachelor"
  );
  const [skillsCount, setSkillsCount] = useState<number>(
    initialPreset?.skills_count ?? 10
  );
  const [industry, setIndustry] = useState(
    initialPreset?.industry || "Technology"
  );
  const [companySize, setCompanySize] = useState(
    initialPreset?.company_size || "Enterprise"
  );
  const [location, setLocation] = useState(
    initialPreset?.location || "USA"
  );
  const [remoteWork, setRemoteWork] = useState(
    initialPreset?.remote_work || "Hybrid"
  );
  const [certifications, setCertifications] = useState<number>(
    initialPreset?.certifications ?? 2
  );

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync if preset changes
  useEffect(() => {
    if (initialPreset) {
      setJobTitle(initialPreset.job_title);
      setExperienceYears(initialPreset.experience_years);
      setEducationLevel(initialPreset.education_level);
      setSkillsCount(initialPreset.skills_count);
      setIndustry(initialPreset.industry);
      setCompanySize(initialPreset.company_size);
      setLocation(initialPreset.location);
      setRemoteWork(initialPreset.remote_work);
      setCertifications(initialPreset.certifications);
    }
  }, [initialPreset]);

  // Handle Predict
  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: PredictionRequest = {
        job_title: jobTitle,
        experience_years: Number(experienceYears),
        education_level: educationLevel,
        skills_count: Number(skillsCount),
        industry: industry,
        company_size: companySize,
        location: location,
        remote_work: remoteWork,
        certifications: Number(certifications),
      };
      const result = await predictSalary(payload);
      setPrediction(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to predict salary");
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction on load
  useEffect(() => {
    handlePredict();
  }, []);

  const loadPreset = (preset: Partial<PredictionRequest>) => {
    if (preset.job_title) setJobTitle(preset.job_title);
    if (preset.experience_years !== undefined)
      setExperienceYears(preset.experience_years);
    if (preset.education_level) setEducationLevel(preset.education_level);
    if (preset.skills_count !== undefined)
      setSkillsCount(preset.skills_count);
    if (preset.industry) setIndustry(preset.industry);
    if (preset.company_size) setCompanySize(preset.company_size);
    if (preset.location) setLocation(preset.location);
    if (preset.remote_work) setRemoteWork(preset.remote_work);
    if (preset.certifications !== undefined)
      setCertifications(preset.certifications);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Presets Bar */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                AI Salary Simulator & Benchmark Predictor
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time inference using the trained Linear Regression pipeline (OneHotEncoder + numerical features).
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">
              Sample Profiles:
            </span>
            <button
              onClick={() =>
                loadPreset({
                  job_title: "AI Engineer",
                  experience_years: 10,
                  education_level: "PhD",
                  skills_count: 15,
                  industry: "Technology",
                  company_size: "Enterprise",
                  location: "USA",
                  remote_work: "Hybrid",
                  certifications: 3,
                })
              }
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Principal AI (USA)
            </button>
            <button
              onClick={() =>
                loadPreset({
                  job_title: "Data Analyst",
                  experience_years: 3,
                  education_level: "Bachelor",
                  skills_count: 8,
                  industry: "Finance",
                  company_size: "Medium",
                  location: "UK",
                  remote_work: "Yes",
                  certifications: 1,
                })
              }
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Mid Data Analyst (UK)
            </button>
            <button
              onClick={() =>
                loadPreset({
                  job_title: "Cloud Engineer",
                  experience_years: 7,
                  education_level: "Master",
                  skills_count: 12,
                  industry: "Healthcare",
                  company_size: "Large",
                  location: "Germany",
                  remote_work: "Hybrid",
                  certifications: 4,
                })
              }
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Staff Cloud (Germany)
            </button>
          </div>
        </div>

        {/* Prediction Grid: Controls Form + 100% Light Theme Output Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Left Form: 7 Columns */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Job Specialization
                </label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
                >
                  {filterOptions?.job_titles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Education Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Education Level
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
                >
                  {filterOptions?.education_levels.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Industry Sector
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
                >
                  {filterOptions?.industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Candidate Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
                >
                  {filterOptions?.locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Company Scale
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
                >
                  {filterOptions?.company_sizes.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remote Work */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Workplace Mode
                </label>
                <select
                  value={remoteWork}
                  onChange={(e) => setRemoteWork(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Yes">100% Fully Remote</option>
                  <option value="Hybrid">Flexible Hybrid</option>
                  <option value="No">On-site / In Office</option>
                </select>
              </div>
            </div>

            {/* Sliders Section */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              {/* Experience Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">
                    Total Experience (Years):
                  </span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {experienceYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Entry (0y)</span>
                  <span>Mid (10y)</span>
                  <span>Veteran (20y)</span>
                </div>
              </div>

              {/* Skills Count Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">
                    Demonstrated Skills Count:
                  </span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {skillsCount} Skills
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={skillsCount}
                  onChange={(e) => setSkillsCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Foundational (1)</span>
                  <span>Versatile (10)</span>
                  <span>Polymath (20)</span>
                </div>
              </div>

              {/* Certifications Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">
                    Industry Certifications:
                  </span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {certifications} Certifications
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={certifications}
                  onChange={(e) => setCertifications(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 Certs</span>
                  <span>3 Certs</span>
                  <span>5 Certs</span>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="pt-2">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Running ML Model Inference...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4" />
                    <span>Calculate Market Benchmark Salary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Result Card: 100% Light Theme */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {prediction ? (
              <div className="h-full flex flex-col justify-between rounded-2xl bg-gradient-to-b from-blue-50/60 via-white to-slate-50 text-slate-900 p-6 sm:p-7 border border-blue-100 shadow-sm space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold tracking-wider uppercase border border-blue-200">
                    <Sparkles className="h-3 w-3 text-blue-600" />
                    <span>ML Pipeline Forecast</span>
                  </div>

                  <div className="mt-5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Estimated Annual Compensation
                    </span>
                    <div className="text-4xl font-extrabold tracking-tight text-slate-900 mt-1 font-mono">
                      {prediction.formatted_salary}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Base Salary (USD) • Adjusted for market & profile factors
                    </p>
                  </div>

                  {/* Percentile Card */}
                  <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">
                        Talent Pool Standing
                      </span>
                      <span className="font-bold text-blue-700 font-mono">
                        {prediction.percentile}th Percentile
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${prediction.percentile}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Higher than{" "}
                      <strong className="text-slate-900">
                        {prediction.percentile}%
                      </strong>{" "}
                      of all 250,000 compensation records.
                    </p>
                  </div>

                  {/* Comparisons */}
                  <div className="mt-5 space-y-2 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                      <span className="text-slate-600">
                        Vs. Average {prediction.job_title}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          prediction.diff_vs_job_mean >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {prediction.diff_vs_job_mean >= 0 ? "+" : ""}$
                        {Math.round(prediction.diff_vs_job_mean).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                      <span className="text-slate-600">
                        Vs. Overall Global Mean
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          prediction.diff_vs_overall_mean >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {prediction.diff_vs_overall_mean >= 0 ? "+" : ""}$
                        {Math.round(
                          prediction.diff_vs_overall_mean
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Benchmark Range */}
                  <div className="mt-5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs">
                    <span className="text-slate-500 block text-[11px] uppercase tracking-wider mb-1 font-semibold">
                      Role Market Benchmark Range (10th - 90th %ile)
                    </span>
                    <div className="flex justify-between font-mono font-semibold text-slate-800">
                      <span>${prediction.benchmark_range.p10.toLocaleString()}</span>
                      <span className="text-slate-400">to</span>
                      <span>${prediction.benchmark_range.p90.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Model evaluation R² score ~0.94 validated on 50,000 holdout records.
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8 rounded-2xl bg-white border border-dashed border-slate-300 text-center text-slate-500">
                <div>
                  <Calculator className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs">
                    Adjust candidate parameters and click "Calculate Market Benchmark Salary"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
