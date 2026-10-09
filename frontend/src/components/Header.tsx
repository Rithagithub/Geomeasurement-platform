import React from 'react';
import { Layers, FileText, XCircle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  apiOnline: boolean | null;
  checkingApi: boolean;
  onRefreshHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ apiOnline, checkingApi, onRefreshHealth }) => {
  const swaggerUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/docs`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">GeoMeasure</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                AEREO Edition
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Geospatial File Measurement Platform</p>
          </div>
        </div>

        {/* Status Badges & Swagger Action */}
        <div className="flex items-center space-x-3">
          {/* API Status Indicator */}
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              apiOnline === true
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : apiOnline === false
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {apiOnline === true ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>FastAPI Connected</span>
              </>
            ) : apiOnline === false ? (
              <>
                <XCircle className="h-3.5 w-3.5 text-rose-500" />
                <span>API Offline</span>
              </>
            ) : (
              <span>Checking backend...</span>
            )}
            <button
              onClick={onRefreshHealth}
              disabled={checkingApi}
              title="Refresh connection status"
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded ml-1"
            >
              <RefreshCw className={`h-3 w-3 ${checkingApi ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Swagger / OpenAPI Button */}
          <a
            href={swaggerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            <span>OpenAPI Swagger</span>
          </a>
        </div>
      </div>
    </header>
  );
};
