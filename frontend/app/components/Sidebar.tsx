"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Table,
  TrendingUp,
  Sparkles,
  Layers,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  activeTab: "overview" | "records" | "analytics" | "predictor";
  setActiveTab: (tab: "overview" | "records" | "analytics" | "predictor") => void;
  isBackendConnected?: boolean;
  totalRecords?: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      id: "overview" as const,
      label: "Overview",
      description: "Executive KPIs & metrics",
      icon: BarChart3,
    },
    {
      id: "records" as const,
      label: "Records Explorer",
      description: "Filter 250,000 salaries",
      icon: Table,
      badge: "250k",
    },
    {
      id: "analytics" as const,
      label: "Market Trends",
      description: "Compensation analytics",
      icon: TrendingUp,
    },
    {
      id: "predictor" as const,
      label: "AI Salary Predictor",
      description: "ML benchmark model",
      icon: Sparkles,
      badge: "ML",
    },
  ];

  const handleTabSelect = (tab: "overview" | "records" | "analytics" | "predictor") => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between text-slate-900 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900">
              TalentPulse
            </span>
            <span className="block text-[10px] text-slate-500 font-medium">
              HR Salary Analytics
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Curved Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:h-screen lg:sticky p-3 sm:p-4 shrink-0 flex flex-col`}
      >
        {/* Curved Panel: Clean Minimalist White & Blue */}
        <div className="h-full w-full bg-white text-slate-800 rounded-[28px] border border-slate-200/90 shadow-sm flex flex-col justify-between p-5 overflow-y-auto">
          
          {/* Main Navigation Section */}
          <div className="space-y-6">
            {/* Brand Header */}
            <div className="flex items-center space-x-3 pb-5 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/30">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900">
                    TalentPulse
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded">
                    HR
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Compensation Intelligence
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                Main Menu
              </span>

              <nav className="space-y-1.5 pt-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/25"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold tracking-tight truncate">
                            {item.label}
                          </div>
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? "text-blue-100" : "text-slate-400"
                            }`}
                          >
                            {item.description}
                          </div>
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Minimalist Clean Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span>TalentPulse HR</span>
            <span className="font-mono text-slate-400">v1.2</span>
          </div>
        </div>
      </aside>
    </>
  );
}
