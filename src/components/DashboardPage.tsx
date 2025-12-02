import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
  AppBar,
  Toolbar,
  Grid,
  Stack,
} from '@mui/material';
import {
  Add,
  CloudUpload,
  Download,
} from '@mui/icons-material';
import { useLeads } from '../hooks/useLeads';
import { Lead } from '../types/lead';
import LeadCard from './LeadCard';
import LeadGroupHeader from './LeadGroupHeader';
import AddLeadModal from './modals/AddLeadModal';
import DeleteModal from './modals/DeleteModal';
import ImportCSVModal from './modals/ImportCSVModal';
import GreetingModal from './modals/GreetingModal';

const RPTO_LOGO_URL = 'https://i.postimg.cc/dQWjj6rS/rpto1-logo.png';

export default function DashboardPage() {
  const {
    filteredLeads,
    groupedLeads,
    loading,
    filters,
    setFilters,
    createLead,
    updateLead,
    deleteLead,
    importCSV,
    exportCSV,
    downloadSampleCSV,
    generateGreeting,
  } = useLeads();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [greetingModalOpen, setGreetingModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [greetingText, setGreetingText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleAddLead = () => {
    setEditingLead(null);
    setAddModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setAddModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setDeletingLead(lead);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLead) return;
    setDeleting(true);
    try {
      await deleteLead(deletingLead.id);
      setDeleteModalOpen(false);
      setDeletingLead(null);
    } catch (error) {
      console.error('Failed to delete lead:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    if (editingLead) {
      await updateLead(editingLead.id, leadData);
    } else {
      await createLead(leadData);
    }
    setAddModalOpen(false);
    setEditingLead(null);
  };

  const handleImportCSV = async (csvContent: string) => {
    return await importCSV(csvContent);
  };

  const handleGreet = (lead: Lead) => {
    const greeting = generateGreeting(lead.name, lead.place);
    setGreetingText(greeting);
    setGreetingModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      place: '',
      phone: '',
      status: '',
      date: '',
    });
  };

  const renderLeads = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading leads...</Typography>
        </Box>
      );
    }

    if (filteredLeads.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No leads found matching the current criteria.
          </Typography>
        </Box>
      );
    }

    const groups: Array<{ title: string; leads: Lead[] }> = [
      { title: 'Today', leads: groupedLeads['Today'] },
      { title: 'Yesterday', leads: groupedLeads['Yesterday'] },
      { title: 'Last 7 Days', leads: groupedLeads['Last 7 Days'] },
      { title: 'Older', leads: groupedLeads['Older'] },
    ];

    return (
      <Box>
        {groups.map((group) => {
          if (group.leads.length === 0) return null;
          return (
            <Box key={group.title}>
              <LeadGroupHeader title={group.title} count={group.leads.length} />
              {group.leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditLead}
                  onDelete={handleDeleteLead}
                  onGreet={handleGreet}
                />
              ))}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: { xs: 12, sm: 10 } }}>
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' }, py: { xs: 1, sm: 0 } }}>
          <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' }, mb: { xs: 1, sm: 0 } }}>
            <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Lead Management Dashboard
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Track and convert your RPTO pilot leads.
            </Typography>
          </Box>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={1} 
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CloudUpload />}
              onClick={() => setImportModalOpen(true)}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Import</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Import Data</Box>
            </Button>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Download />}
              onClick={exportCSV}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Download CSV</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Export</Box>
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddLead}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Add Lead
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Filter Leads
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Filter by Name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Filter by Place"
                value={filters.place}
                onChange={(e) => setFilters({ ...filters, place: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Filter by Phone"
                value={filters.phone}
                onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Filter by Status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Contacted">Contacted</MenuItem>
                  <MenuItem value="Converted">Converted</MenuItem>
                  <MenuItem value="Lost">Lost</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Filter by Creation Date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => {}}
                size="small"
              >
                Apply Filters
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                size="small"
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            All Leads
          </Typography>
          <Box
            sx={{
              maxHeight: { xs: '60vh', sm: '70vh' },
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'primary.light',
                borderRadius: '20px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#e0f2fe',
              },
            }}
          >
            {renderLeads()}
          </Box>
        </Paper>
      </Container>

      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1, sm: 2 },
          textAlign: 'center',
          zIndex: 1000,
        }}
      >
        <Box
          component="img"
          src={RPTO_LOGO_URL}
          alt="RPTO Logo"
          sx={{ width: { xs: 48, sm: 64 }, height: { xs: 48, sm: 64 }, objectFit: 'contain', mb: { xs: 0.5, sm: 1 } }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
          © 2025 Remote Pilot Training Organisation CRM. All rights reserved.
        </Typography>
      </Box>

      <AddLeadModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        editingLead={editingLead}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingLead(null);
        }}
        onConfirm={handleConfirmDelete}
        leadName={deletingLead?.name || ''}
        deleting={deleting}
      />

      <ImportCSVModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportCSV}
        onDownloadSample={downloadSampleCSV}
      />

      <GreetingModal
        open={greetingModalOpen}
        onClose={() => setGreetingModalOpen(false)}
        greetingText={greetingText}
      />
    </Box>
  );
}

