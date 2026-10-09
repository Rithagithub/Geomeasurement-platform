import React from 'react';
import { Ruler, Maximize2, Route, Info } from 'lucide-react';
import type { MeasurementItem } from '../types';
import { formatNumber } from '../utils/formatters';
import { LoadingSpinner } from './LoadingSpinner';

interface MeasurementsTableProps {
  measurements: MeasurementItem[];
  isLoading: boolean;
  error: string | null;
}

export const MeasurementsTable: React.FC<MeasurementsTableProps> = ({
  measurements,
  isLoading,
  error,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-4.5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Ruler className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Spatial Measurements</h3>
            <p className="text-xs text-slate-500">
              Calculated on projected Universal Transverse Mercator (UTM) metric coordinates
            </p>
          </div>
        </div>
        {!isLoading && !error && measurements.length > 0 && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
            {measurements.length} measurable {measurements.length === 1 ? 'feature' : 'features'}
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner message="Fetching calculated measurements..." />}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-rose-600 mb-1">{error}</p>
          <p className="text-xs text-slate-500">Failed to load measurements from the backend API.</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && measurements.length === 0 && (
        <div className="p-10 text-center flex flex-col items-center">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Info className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Measurable Features Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            This file contains only zero-dimensional features (e.g. Points) or unsupported geometry types which do not have metric area or length dimensions.
          </p>
        </div>
      )}

      {/* Table Content */}
      {!isLoading && !error && measurements.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6"># Index</th>
                <th className="py-3 px-6">Geometry Type</th>
                <th className="py-3 px-6">Measurement Type</th>
                <th className="py-3 px-6 text-right">Value</th>
                <th className="py-3 px-6">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {measurements.map((m, idx) => {
                const isArea = m.measurement_type.toLowerCase() === 'area';
                return (
                  <tr key={`${m.feature_index}-${idx}`} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-semibold text-slate-600">
                      Feature #{m.feature_index}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-slate-800">{m.geometry_type}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
                          isArea
                            ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                        }`}
                      >
                        {isArea ? <Maximize2 className="h-3 w-3 mr-1" /> : <Route className="h-3 w-3 mr-1" />}
                        {m.measurement_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono text-sm font-bold text-slate-900">
                      {formatNumber(m.value)}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {m.unit}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
