import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileCode2, Archive, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

interface UploadPanelProps {
  onProcess: (file: File) => void;
  isProcessing: boolean;
  uploadProgress: number | null;
  disabled?: boolean;
}

const MAX_SIZE_MB = 10;
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.kml', '.zip'];

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onProcess,
  isProcessing,
  uploadProgress,
  disabled = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setValidationError(null);
    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      setValidationError(
        `Invalid file type "${file.name}". Please upload a .kml file or a .zip archive containing a Shapefile.`
      );
      return false;
    }

    if (file.size > MAX_BYTES) {
      setValidationError(
        `File size (${formatBytes(file.size)}) exceeds the maximum allowed limit of ${MAX_SIZE_MB} MB.`
      );
      return false;
    }

    if (file.size === 0) {
      setValidationError('The selected file is empty (0 Bytes).');
      return false;
    }

    return true;
  };

  const handleFileSelection = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isProcessing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcessClick = () => {
    if (selectedFile && !isProcessing) {
      onProcess(selectedFile);
    }
  };

  const isZip = selectedFile?.name.toLowerCase().endsWith('.zip');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 lg:p-7">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Geospatial File Upload</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload your survey files to calculate metric area and length measurements
          </p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
          <span>Max {MAX_SIZE_MB} MB</span>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-800 text-xs">
          <ShieldAlert className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">{validationError}</div>
          <button
            onClick={() => setValidationError(null)}
            className="text-rose-500 hover:text-rose-800 p-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Drag and Drop Zone */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/60 scale-[1.005]'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50 bg-slate-50/20'
          } ${disabled || isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".kml,.zip"
            onChange={handleInputChange}
            disabled={disabled || isProcessing}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
              <UploadCloud className="h-7 w-7" />
            </div>

            <p className="text-sm font-semibold text-slate-800">
              <span className="text-blue-600 hover:underline">Click to browse</span> or drag and drop your file here
            </p>
            <p className="text-xs text-slate-500 mt-1.5 font-normal">
              Supported Formats: <strong className="text-slate-700">.KML</strong> or <strong className="text-slate-700">.ZIP (ESRI Shapefile with .shp, .shx, .dbf)</strong>
            </p>

            <div className="mt-5 flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Auto-UTM Reprojection
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                Zip Slip Protected
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="border border-slate-200 bg-slate-50/60 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5 min-w-0">
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm ${
                  isZip ? 'bg-amber-600' : 'bg-blue-600'
                }`}
              >
                {isZip ? <Archive className="h-6 w-6" /> : <FileCode2 className="h-6 w-6" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                  <span>{formatBytes(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="font-semibold uppercase text-slate-700">
                    {isZip ? 'Shapefile Archive' : 'KML Vector'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              disabled={isProcessing}
              title="Remove file"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress Bar */}
          {uploadProgress !== null && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>Uploading file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-5 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Change File
            </button>
            <button
              type="button"
              onClick={handleProcessClick}
              disabled={isProcessing}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing File...</span>
                </>
              ) : (
                <>
                  <span>Process File</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
