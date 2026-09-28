"use client";

import React from "react";
import {
  Briefcase,
  Table,
  BarChart3,
  Sparkles,
  Database,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface NavbarProps {
  activeTab: "overview" | "records" | "analytics" | "predictor";
  setActiveTab: (tab: "overview" | "records" | "analytics" | "predictor") => void;
  isBackendConnected: boolean;
  totalRecords: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  isBackendConnected,
  totalRecords,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  TalentPulse
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
                  Enterprise HR
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal hidden sm:block">
                Global Compensation & Salary Intelligence Dashboard
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-white text-blue-700 shadow-xs shadow-slate-200/80 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("records")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "records"
                  ? "bg-white text-blue-700 shadow-xs shadow-slate-200/80 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span>Records Explorer</span>
              <span className="text-[10px] bg-slate-200/70 text-slate-700 font-mono px-1.5 py-0.2 rounded-full">
                250k
              </span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-white text-blue-700 shadow-xs shadow-slate-200/80 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Market Trends</span>
            </button>

            <button
              onClick={() => setActiveTab("predictor")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "predictor"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs font-bold"
                  : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Salary Predictor</span>
            </button>
          </nav>

          {/* Backend Status indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isBackendConnected ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isBackendConnected ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </span>
              <span className="font-medium text-slate-700">
                {isBackendConnected
                  ? `${totalRecords.toLocaleString()} Records Active`
                  : "Connecting to Backend..."}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 ${
              activeTab === "records"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Records (250k)
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Market Trends
          </button>
          <button
            onClick={() => setActiveTab("predictor")}
            className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 ${
              activeTab === "predictor"
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 text-indigo-700"
            }`}
          >
            AI Predictor
          </button>
        </div>
      </div>
    </header>
  );
}
