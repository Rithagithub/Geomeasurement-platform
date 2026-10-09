import React, { useState } from 'react';
import { RefreshCw, Download, PlusCircle, Copy, Check, Info } from 'lucide-react';
import type { MeasurementItem, FileDetailResponse, FileUploadResponse } from '../types';
import { exportMeasurementsToCsv } from '../utils/csv';
import { formatDate } from '../utils/formatters';

interface ResultsActionsProps {
  fileData: FileDetailResponse | FileUploadResponse;
  measurements: MeasurementItem[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onReset: () => void;
}

export const ResultsActions: React.FC<ResultsActionsProps> = ({
  fileData,
  measurements,
  isRefreshing,
  onRefresh,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(fileData.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    exportMeasurementsToCsv(measurements, fileData.filename);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: ID display & Copy */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">File ID:</span>
          <code className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md max-w-[180px] sm:max-w-none truncate">
            {fileData.id}
          </code>
          <button
            onClick={handleCopyId}
            title="Copy File UUID"
            className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Info Modal Button */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors"
          >
            <Info className="h-3.5 w-3.5 text-slate-600" />
            <span>File Details</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={measurements.length === 0}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>

          {/* Upload Another File */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Upload New File</span>
          </button>
        </div>
      </div>

      {/* File Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Stored File Information</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Record ID:</span>
                <span className="font-mono text-slate-900 font-bold">{fileData.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Original Filename:</span>
                <span className="text-slate-900 font-bold">
                  {'original_filename' in fileData ? fileData.original_filename : fileData.filename}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Internal Storage Name:</span>
                <span className="font-mono text-slate-900">{fileData.filename}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Feature Count:</span>
                <span className="text-slate-900 font-bold">{fileData.feature_count} features</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Coordinate System (CRS):</span>
                <span className="text-indigo-600 font-bold">{fileData.crs || 'EPSG:4326 (Default)'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Processing Status:</span>
                <span className="text-emerald-700 font-bold uppercase">{fileData.status}</span>
              </div>
              {'created_at' in fileData && (
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Uploaded At:</span>
                  <span className="text-slate-700">{formatDate(fileData.created_at)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
