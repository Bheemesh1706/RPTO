import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { getLeads, createLead, updateLead, deleteLead, bulkInsertLeads } from '../db/localDB';
import { groupLeadsByDate, GroupedLeads } from '../utils/dateUtils';
import { parseCSV, exportToCsv, downloadCSV, generateSampleCSV } from '../utils/csvUtils';

export interface LeadFilters {
  name: string;
  place: string;
  phone: string;
  status: LeadStatus | '';
  date: string;
}

export function useLeads() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [groupedLeads, setGroupedLeads] = useState<GroupedLeads>({
    'Today': [],
    'Yesterday': [],
    'Last 7 Days': [],
    'Older': []
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>({
    name: '',
    place: '',
    phone: '',
    status: '',
    date: ''
  });

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const leads = await getLeads();
      // Sort by created_at descending (newest first)
      const sorted = leads.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setAllLeads(sorted);
      return sorted;
    } catch (error) {
      console.error('Failed to load leads:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback((leads: Lead[], currentFilters: LeadFilters) => {
    return leads.filter(lead => {
      const matchesName = lead.name.toLowerCase().includes(currentFilters.name.toLowerCase());
      const matchesPlace = lead.place.toLowerCase().includes(currentFilters.place.toLowerCase());
      
      const cleanLeadPhone = lead.phone.replace(/[^0-9]/g, '');
      const cleanFilterPhone = currentFilters.phone.replace(/[^0-9]/g, '');
      const matchesPhone = cleanLeadPhone.includes(cleanFilterPhone);

      const matchesStatus = !currentFilters.status || lead.status === currentFilters.status;
      
      let matchesDate = true;
      if (currentFilters.date) {
        const leadDatePart = lead.created_at.substring(0, 10);
        matchesDate = leadDatePart === currentFilters.date;
      }

      return matchesName && matchesPlace && matchesPhone && matchesStatus && matchesDate;
    });
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    const filtered = applyFilters(allLeads, filters);
    setFilteredLeads(filtered);
    
    // Group filtered leads by date
    const grouped = groupLeadsByDate(filtered);
    setGroupedLeads(grouped);
  }, [allLeads, filters, applyFilters]);

  const handleCreateLead = useCallback(async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    try {
      await createLead(leadData);
      await loadLeads();
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error;
    }
  }, [loadLeads]);

  const handleUpdateLead = useCallback(async (id: string, updates: Partial<Omit<Lead, 'id' | 'created_at'>>) => {
    try {
      await updateLead(id, updates);
      await loadLeads();
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw error;
    }
  }, [loadLeads]);

  const handleDeleteLead = useCallback(async (id: string) => {
    try {
      await deleteLead(id);
      await loadLeads();
    } catch (error) {
      console.error('Failed to delete lead:', error);
      throw error;
    }
  }, [loadLeads]);

  const handleImportCSV = useCallback(async (csvContent: string) => {
    try {
      const leads = parseCSV(csvContent);
      const count = await bulkInsertLeads(leads);
      await loadLeads();
      return count;
    } catch (error) {
      console.error('Failed to import CSV:', error);
      throw error;
    }
  }, [loadLeads]);

  const handleExportCSV = useCallback(() => {
    const csvContent = exportToCsv(filteredLeads);
    const filename = `rpto_leads_export_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(csvContent, filename);
  }, [filteredLeads]);

  const handleDownloadSampleCSV = useCallback(() => {
    const sampleCsv = generateSampleCSV();
    downloadCSV(sampleCsv, 'rpto_leads_template.csv');
  }, []);

  const generateGreeting = useCallback((name: string, place: string): string => {
    return `Dear ${name},

Congratulations! We are thrilled to welcome you as a fully converted lead to the Remote Pilot Training Organisation (RPTO) family.

Your commitment to becoming a certified drone pilot is the first step in a high-flying career!

Next Steps:
1. We have sent your welcome kit to your email.
2. Our team will contact you shortly to schedule your first practical session in the ${place} region.

Welcome aboard, and we look forward to helping you achieve your commercial drone pilot license!

Best Regards,
The RPTO Team`;
  }, []);

  return {
    allLeads,
    filteredLeads,
    groupedLeads,
    loading,
    filters,
    setFilters,
    loadLeads,
    createLead: handleCreateLead,
    updateLead: handleUpdateLead,
    deleteLead: handleDeleteLead,
    importCSV: handleImportCSV,
    exportCSV: handleExportCSV,
    downloadSampleCSV: handleDownloadSampleCSV,
    generateGreeting,
  };
}

