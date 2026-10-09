import type { MeasurementItem } from '../types';

export function exportMeasurementsToCsv(
  measurements: MeasurementItem[],
  baseFilename = 'measurements'
): void {
  if (!measurements || measurements.length === 0) return;

  const headers = ['Feature Index', 'Geometry Type', 'Measurement Type', 'Value', 'Unit'];
  const rows = measurements.map((m) => [
    m.feature_index,
    `"${m.geometry_type}"`,
    `"${m.measurement_type}"`,
    m.value,
    `"${m.unit}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const cleanName = baseFilename.replace(/[^a-zA-Z0-9_-]/g, '_');
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${cleanName}_measurements.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
