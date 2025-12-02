import { Lead } from '../types/lead';
import { formatDate } from './dateUtils';

const EXPECTED_CSV_HEADERS = ['name', 'age', 'phone', 'email', 'place', 'status', 'image_url', 'remarks'];

export function parseLine(line: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let currentField = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }
  result.push(currentField);

  return result.map(field => field.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
}

export function parseCSV(csvString: string): Omit<Lead, 'id' | 'created_at'>[] {
  const lines = csvString.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) {
    throw new Error('The uploaded file is empty or invalid.');
  }

  const headers = parseLine(lines[0].toLowerCase());
  const leads: Omit<Lead, 'id' | 'created_at'>[] = [];

  const requiredHeaders = EXPECTED_CSV_HEADERS.filter(h => h !== 'image_url' && h !== 'age' && h !== 'email');
  if (!requiredHeaders.every(h => headers.includes(h))) {
    throw new Error(`Missing required column headers: ${requiredHeaders.join(', ')}. Please use the sample template.`);
  }

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length !== headers.length) {
      console.warn(`Skipping row ${i + 1} due to incorrect column count.`);
      continue;
    }

    const lead: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      lead[headers[j]] = values[j];
    }

    const leadData: Omit<Lead, 'id' | 'created_at'> = {
      name: lead.name || '',
      age: lead.age || 'N/A',
      phone: lead.phone ? String(lead.phone).replace(/[^0-9]/g, '') : 'N/A',
      email: lead.email || 'N/A',
      place: lead.place || '',
      status: (lead.status || 'New') as Lead['status'],
      image_url: lead.image_url || 'https://placehold.co/100x100/e0f2fe/1e3a8a?text=NO+IMG',
      remarks: lead.remarks || 'Imported via bulk upload.',
    };

    if (!leadData.name || !leadData.place) {
      console.warn(`Skipping row ${i + 1} due to missing required fields (Name or Place).`);
      continue;
    }

    const validStatuses: Lead['status'][] = ['New', 'Contacted', 'Converted', 'Lost'];
    if (!validStatuses.includes(leadData.status)) {
      leadData.status = 'New';
    }

    leads.push(leadData);
  }

  if (leads.length === 0) {
    throw new Error('No valid leads found in the file after processing.');
  }

  return leads;
}

export function exportToCsv(leads: Lead[]): string {
  if (leads.length === 0) return '';

  const headers = ['ID', 'Name', 'Age', 'Phone', 'Email', 'Place', 'Status', 'Remarks', 'Created At'];

  const escapeCsv = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    let str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const csv = [headers.join(',')];

  leads.forEach(lead => {
    const row = [
      escapeCsv(lead.id),
      escapeCsv(lead.name),
      escapeCsv(lead.age),
      escapeCsv(lead.phone),
      escapeCsv(lead.email),
      escapeCsv(lead.place),
      escapeCsv(lead.status),
      escapeCsv(lead.remarks),
      escapeCsv(formatDate(lead.created_at)),
    ];
    csv.push(row.join(','));
  });

  return csv.join('\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateSampleCSV(): string {
  const sampleData = [
    EXPECTED_CSV_HEADERS.join(','),
    'John Smith,35,9876543210,john.smith@example.com,Mumbai,New,https://placehold.co/100x100/e0f2fe/1e3a8a?text=JOHN,Initial interest in pilot course.',
    'Jane Doe,28,9911223344,jane.doe@other.com,Delhi,Converted,https://placehold.co/100x100/e0f2fe/1e3a8a?text=JANE,"Paid deposit, ready for practicals."',
  ];
  
  return sampleData.join('\n');
}

