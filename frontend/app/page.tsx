"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import OverviewTab from "./components/OverviewTab";
import RecordsTab from "./components/RecordsTab";
import AnalyticsTab from "./components/AnalyticsTab";
import PredictorTab from "./components/PredictorTab";
import {
  DatasetStats,
  FilterOptions,
  AnalyticsData,
  PredictionRequest,
} from "./types";
import { fetchHealth, fetchMetadata, fetchAnalytics } from "./api";
import {
  AlertCircle,
  RefreshCw,
  Sparkles,
  Layers,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "records" | "analytics" | "predictor"
  >("overview");

  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preset profile selected from records table to simulate
  const [selectedRecordPreset, setSelectedRecordPreset] =
    useState<PredictionRequest | null>(null);

  const initData = async () => {
    setLoadingInitial(true);
    setErrorMsg(null);
    try {
      // 1. Health check
      const health = await fetchHealth();
      if (health.status === "healthy") {
        setIsBackendConnected(true);
      }

      // 2. Metadata & Stats
      const meta = await fetchMetadata();
      setFilterOptions(meta.filter_options);
      setStats(meta.stats);

      // 3. Analytics
      const analyticsData = await fetchAnalytics();
      setAnalytics(analyticsData);
    } catch (err: any) {
      console.error("Initialization error:", err);
      setErrorMsg(
        "Could not connect to FastAPI backend at http://127.0.0.1:8000. Please ensure the backend server is running."
      );
      setIsBackendConnected(false);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const handleSelectRecordForPrediction = (record: PredictionRequest) => {
    setSelectedRecordPreset(record);
    setActiveTab("predictor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Curved Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendConnected={isBackendConnected}
        totalRecords={stats?.total_records || 250000}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Backend Error Banner if disconnected */}
          {!isBackendConnected && !loadingInitial && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-3 text-xs">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <span>
                  {errorMsg ||
                    "Backend server offline or unreachable. Please launch the backend server."}
                </span>
              </div>
              <button
                onClick={initData}
                className="px-3.5 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          )}

          {/* Loading State */}
          {loadingInitial ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-800 text-base">
                  Initializing TalentPulse Intelligence Engine
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting to 250,000 compensation records and linear regression model...
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <OverviewTab
                  stats={stats}
                  analytics={analytics}
                  onExploreRecords={() => setActiveTab("records")}
                  onOpenPredictor={() => setActiveTab("predictor")}
                />
              )}

              {/* TAB 2: RECORDS EXPLORER */}
              {activeTab === "records" && (
                <RecordsTab
                  filterOptions={filterOptions}
                  onSelectRecordForPrediction={handleSelectRecordForPrediction}
                />
              )}

              {/* TAB 3: ANALYTICS & MARKET TRENDS */}
              {activeTab === "analytics" && (
                <AnalyticsTab analytics={analytics} />
              )}

              {/* TAB 4: AI PREDICTOR */}
              {activeTab === "predictor" && (
                <PredictorTab
                  filterOptions={filterOptions}
                  initialPreset={selectedRecordPreset}
                />
              )}
            </div>
          )}
        </main>

        {/* Cohesive Footer */}
        <footer className="border-t border-slate-200 py-6 text-slate-500 text-xs bg-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                TP
              </div>
              <span className="font-semibold text-slate-800">
                TalentPulse HR Analytics
              </span>
              <span className="text-slate-400">•</span>
              <span>250,000 Verified Records</span>
            </div>

            <div className="flex items-center space-x-6 text-slate-500">
              <span>Linear Regression Pipeline • scikit-learn</span>
              <span>FastAPI Backend • Next.js 16</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
