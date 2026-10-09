import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadPanel } from './components/UploadPanel';
import { SummaryCards } from './components/SummaryCards';
import { MeasurementsTable } from './components/MeasurementsTable';
import { FeatureDetails } from './components/FeatureDetails';
import { ResultsActions } from './components/ResultsActions';
import { ErrorMessage } from './components/ErrorMessage';
import { api, parseApiError } from './services/api';
import type {
  FileDetailResponse,
  FileUploadResponse,
  MeasurementItem,
  FeatureItem,
} from './types';
import { Compass, Sparkles, MapPin, Zap } from 'lucide-react';

export const App: React.FC = () => {
  // Backend Connection State
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [checkingApi, setCheckingApi] = useState<boolean>(false);

  // File Upload & Pipeline State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileData, setFileData] = useState<FileDetailResponse | FileUploadResponse | null>(null);

  // Measurements & Features Data State
  const [measurements, setMeasurements] = useState<MeasurementItem[]>([]);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [isLoadingMeasurements, setIsLoadingMeasurements] = useState<boolean>(false);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Error States
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [measurementError, setMeasurementError] = useState<string | null>(null);
  const [featureError, setFeatureError] = useState<string | null>(null);

  // Check backend health
  const checkHealth = useCallback(async () => {
    setCheckingApi(true);
    const online = await api.checkHealth();
    setApiOnline(online);
    setCheckingApi(false);
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Fetch measurements and features for a processed file
  const fetchFileDetailsAndMeasurements = async (fileId: string) => {
    setIsLoadingMeasurements(true);
    setIsLoadingFeatures(true);
    setMeasurementError(null);
    setFeatureError(null);

    try {
      // 1. Fetch file measurements
      const measData = await api.getFileMeasurements(fileId);
      setMeasurements(measData.measurements || []);
    } catch (err) {
      setMeasurementError(parseApiError(err));
    } finally {
      setIsLoadingMeasurements(false);
    }

    try {
      // 2. Fetch full file metadata
      const infoData = await api.getFileInfo(fileId);
      setFileData(infoData);
    } catch {
      // Keep existing fileData if detail fetch fails
    }

    try {
      // 3. Fetch feature breakdown
      const featData = await api.getFileFeatures(fileId);
      setFeatures(featData || []);
    } catch (err) {
      setFeatureError(parseApiError(err));
    } finally {
      setIsLoadingFeatures(false);
    }
  };

  // Handle file submission
  const handleProcessFile = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);
    setGeneralError(null);
    setMeasurements([]);
    setFeatures([]);

    try {
      const uploadResponse = await api.uploadFile(file, (percent) => {
        setUploadProgress(percent);
      });

      setFileData(uploadResponse);

      if (uploadResponse.status === 'COMPLETED') {
        await fetchFileDetailsAndMeasurements(uploadResponse.id);
      } else if (uploadResponse.status === 'FAILED') {
        setGeneralError('File processing failed on the backend. Check file format or CRS.');
      }
    } catch (err) {
      const errMsg = parseApiError(err);
      setGeneralError(errMsg);
      setFileData(null);
    } finally {
      setIsProcessing(false);
      setUploadProgress(null);
    }
  };

  // Refresh current data
  const handleRefresh = async () => {
    if (!fileData) return;
    setIsRefreshing(true);
    await fetchFileDetailsAndMeasurements(fileData.id);
    setIsRefreshing(false);
  };

  // Reset to upload another file
  const handleReset = () => {
    setFileData(null);
    setMeasurements([]);
    setFeatures([]);
    setGeneralError(null);
    setMeasurementError(null);
    setFeatureError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* 1. Header */}
      <Header
        apiOnline={apiOnline}
        checkingApi={checkingApi}
        onRefreshHealth={checkHealth}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Banner if backend is offline */}
        {apiOnline === false && (
          <ErrorMessage
            title="Backend Server Offline"
            message="Cannot communicate with FastAPI at http://localhost:8000. Please start your backend server using: uvicorn app.main:app --reload"
            onRetry={checkHealth}
          />
        )}

        {/* Global Error Banner */}
        {generalError && (
          <ErrorMessage
            title="Upload / Processing Error"
            message={generalError}
            onDismiss={() => setGeneralError(null)}
          />
        )}

        {/* 3. Hero / Intro when no file is uploaded yet */}
        {!fileData && (
          <div className="text-center max-w-2xl mx-auto pt-4 pb-2 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Enterprise Drone & GIS Measurement Engine</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Precise Vector Area & Length Calculations
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upload KML surveys or Shapefile ZIP archives. Coordinates in geographic CRS are automatically transformed to optimal metric UTM zones for accurate planar measurements.
            </p>
          </div>
        )}

        {/* 4. Upload Panel */}
        {!fileData ? (
          <div className="max-w-3xl mx-auto">
            <UploadPanel
              onProcess={handleProcessFile}
              isProcessing={isProcessing}
              uploadProgress={uploadProgress}
              disabled={apiOnline === false}
            />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start space-x-3.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Auto UTM Projection</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Reprojects degree coordinates (EPSG:4326) to metric Cartesian coordinate systems.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start space-x-3.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Polygon & Line Metrics</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Calculates surface area in m² for Polygons and line distance in meters for LineStrings.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start space-x-3.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Zip Slip Protection</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Secure archive extraction with validation of required Shapefile components.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 5. Processed Results View */
          <div className="space-y-6 animate-fadeIn">
            {/* Action Bar */}
            <ResultsActions
              fileData={fileData}
              measurements={measurements}
              isRefreshing={isRefreshing}
              onRefresh={handleRefresh}
              onReset={handleReset}
            />

            {/* Summary KPI Cards */}
            <SummaryCards fileData={fileData} />

            {/* Measurements Table */}
            <MeasurementsTable
              measurements={measurements}
              isLoading={isLoadingMeasurements}
              error={measurementError}
            />

            {/* Feature Attribute & Geometry Breakdown */}
            <FeatureDetails
              features={features}
              isLoading={isLoadingFeatures}
              error={featureError}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GeoMeasure • AEREO Engineering Assignment Dashboard</span>
          <span>FastAPI • GeoPandas • Shapely • PyProj • PostgreSQL • React</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
