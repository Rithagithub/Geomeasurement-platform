export type FileProcessingStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface FileUploadResponse {
  id: string;
  filename: string;
  status: FileProcessingStatus;
  feature_count: number;
  crs: string | null;
}

export interface FileDetailResponse {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  status: FileProcessingStatus;
  feature_count: number;
  crs: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeasurementItem {
  feature_index: number;
  geometry_type: string;
  measurement_type: 'area' | 'length' | string;
  value: number;
  unit: string;
}

export interface FileMeasurementsResponse {
  file_id: string;
  measurements: MeasurementItem[];
}

export interface FeatureItem {
  id: string;
  file_id: string;
  feature_index: number;
  geometry_type: string;
  geometry: string;
  properties: Record<string, any> | null;
  source_crs: string | null;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}
