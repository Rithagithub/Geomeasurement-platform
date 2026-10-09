import React, { useState } from 'react';
import { Database, ChevronDown, ChevronRight, Code, Tag } from 'lucide-react';
import type { FeatureItem } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface FeatureDetailsProps {
  features: FeatureItem[];
  isLoading: boolean;
  error: string | null;
}

export const FeatureDetails: React.FC<FeatureDetailsProps> = ({
  features,
  isLoading,
  error,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading extracted feature details..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center text-xs text-slate-500">
        Feature details could not be loaded: {error}
      </div>
    );
  }

  if (features.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-6 py-4.5 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Extracted Features & Attributes</h3>
            <p className="text-xs text-slate-500">
              Raw vector features, geometry definitions, and ingested attribute table records
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
          {features.length} {features.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {features.map((feature, idx) => {
          const isExpanded = expandedIndex === idx;
          const hasProps = feature.properties && Object.keys(feature.properties).length > 0;

          return (
            <div key={feature.id || idx} className="transition-colors hover:bg-slate-50/50">
              <button
                type="button"
                onClick={() => toggleExpand(idx)}
                className="w-full px-6 py-3.5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    #{feature.feature_index}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{feature.geometry_type}</span>
                  {feature.source_crs && (
                    <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                      ({feature.source_crs})
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                    {hasProps ? `${Object.keys(feature.properties!).length} properties` : 'No attributes'}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-4 pt-1 space-y-3 bg-slate-50/40 border-t border-slate-100 text-xs">
                  {/* Properties Table */}
                  <div>
                    <div className="flex items-center space-x-1.5 font-bold text-slate-700 mb-2">
                      <Tag className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Feature Properties</span>
                    </div>
                    {hasProps ? (
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                              <th className="py-2 px-3">Attribute Name</th>
                              <th className="py-2 px-3">Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {Object.entries(feature.properties!).map(([key, val]) => (
                              <tr key={key} className="hover:bg-slate-50/40">
                                <td className="py-2 px-3 font-mono font-medium text-slate-600">{key}</td>
                                <td className="py-2 px-3 font-mono text-slate-900">
                                  {val === null ? (
                                    <span className="text-slate-400 italic">null</span>
                                  ) : typeof val === 'object' ? (
                                    JSON.stringify(val)
                                  ) : (
                                    String(val)
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic pl-5">No metadata properties attached.</p>
                    )}
                  </div>

                  {/* Geometry Definition */}
                  <div>
                    <div className="flex items-center space-x-1.5 font-bold text-slate-700 mb-1.5">
                      <Code className="h-3.5 w-3.5 text-blue-600" />
                      <span>Geometry Definition (WKT)</span>
                    </div>
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[11px] overflow-x-auto max-h-32">
                      {feature.geometry}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
