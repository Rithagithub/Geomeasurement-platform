import React from 'react';
import { Layers, Globe, FileType, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { FileDetailResponse, FileUploadResponse } from '../types';

interface SummaryCardsProps {
  fileData: FileDetailResponse | FileUploadResponse;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ fileData }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Completed',
        };
      case 'FAILED':
        return {
          icon: <AlertCircle className="h-4 w-4 text-rose-600" />,
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'Failed',
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-amber-600 animate-pulse" />,
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Processing',
        };
    }
  };

  const statusBadge = getStatusBadge(fileData.status);
  const fileTypeDisplay =
    'file_type' in fileData
      ? fileData.file_type === 'zip_shapefile'
        ? 'ESRI Shapefile (.zip)'
        : fileData.file_type.toUpperCase()
      : fileData.filename.endsWith('.zip')
      ? 'ESRI Shapefile (.zip)'
      : 'KML Vector';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Feature Count Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Features
          </span>
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Layers className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {fileData.feature_count}
          </span>
          <span className="ml-2 text-xs font-medium text-slate-500">features extracted</span>
        </div>
      </div>

      {/* 2. Source CRS Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Source CRS
          </span>
          <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Globe className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-base font-bold text-slate-900 truncate" title={fileData.crs || 'Unknown'}>
            {fileData.crs || 'EPSG:4326 (Default)'}
          </div>
          <span className="text-xs text-indigo-600 font-medium">Reprojected to UTM for metric math</span>
        </div>
      </div>

      {/* 3. File Type Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            File Type
          </span>
          <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <FileType className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-sm font-bold text-slate-900 truncate">
            {fileTypeDisplay}
          </div>
          <span className="text-xs text-slate-500 truncate block mt-0.5" title={fileData.filename}>
            {fileData.filename}
          </span>
        </div>
      </div>

      {/* 4. Processing Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pipeline Status
          </span>
          <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            {statusBadge.icon}
          </div>
        </div>
        <div className="mt-3">
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold border ${statusBadge.bg}`}
          >
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </span>
          <span className="text-xs text-slate-500 block mt-1">Ready for measurement analysis</span>
        </div>
      </div>
    </div>
  );
};
