import axios, { AxiosError } from 'axios';
import type { AxiosProgressEvent } from 'axios';
import type {
  FileUploadResponse,
  FileDetailResponse,
  FileMeasurementsResponse,
  FeatureItem,
  ApiErrorResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 30000,
});

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiErrorResponse>;
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message;
    }
    if (axiosErr.response?.data?.error) {
      return axiosErr.response.data.error;
    }
    if (axiosErr.message === 'Network Error') {
      return `Cannot connect to backend server at ${API_BASE_URL}. Ensure FastAPI is running.`;
    }
    return axiosErr.message || 'An unexpected error occurred while communicating with the server.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}

export const api = {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health', { timeout: 3000 });
      return response.status === 200;
    } catch {
      try {
        const rootResponse = await apiClient.get('/', { timeout: 3000 });
        return rootResponse.status === 200;
      } catch {
        return false;
      }
    }
  },

  async uploadFile(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<FileUploadResponse>('/api/files/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  async getFileInfo(fileId: string): Promise<FileDetailResponse> {
    const response = await apiClient.get<FileDetailResponse>(`/api/files/${fileId}/`);
    return response.data;
  },

  async getFileMeasurements(fileId: string): Promise<FileMeasurementsResponse> {
    const response = await apiClient.get<FileMeasurementsResponse>(`/api/files/${fileId}/measurements/`);
    return response.data;
  },

  async getFileFeatures(fileId: string): Promise<FeatureItem[]> {
    const response = await apiClient.get<FeatureItem[]>(`/api/files/${fileId}/features/`);
    return response.data;
  },
};
