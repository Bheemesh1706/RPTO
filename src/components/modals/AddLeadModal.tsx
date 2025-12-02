import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
} from '@mui/material';
import { Lead, LeadStatus } from '../../types/lead';

interface AddLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'created_at'>) => Promise<void>;
  editingLead?: Lead | null;
}

export default function AddLeadModal({ open, onClose, onSave, editingLead }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    place: '',
    status: 'New' as LeadStatus,
    image_url: '',
    remarks: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingLead) {
      setFormData({
        name: editingLead.name,
        age: String(editingLead.age),
        phone: editingLead.phone,
        email: editingLead.email,
        place: editingLead.place,
        status: editingLead.status,
        image_url: editingLead.image_url === 'https://placehold.co/100x100/e0f2fe/1e3a8a?text=NO+IMG' ? '' : editingLead.image_url,
        remarks: editingLead.remarks,
      });
    } else {
      setFormData({
        name: '',
        age: '',
        phone: '',
        email: '',
        place: '',
        status: 'New',
        image_url: '',
        remarks: '',
      });
    }
    setError('');
  }, [editingLead, open]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.place.trim()) {
      setError('Place is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required for WhatsApp');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const leadData: Omit<Lead, 'id' | 'created_at'> = {
        name: formData.name.trim(),
        age: formData.age || 'N/A',
        phone: formData.phone.replace(/[^0-9]/g, ''),
        email: formData.email || 'N/A',
        place: formData.place.trim(),
        status: formData.status,
        image_url: formData.image_url || 'https://placehold.co/100x100/e0f2fe/1e3a8a?text=NO+IMG',
        remarks: formData.remarks || '',
      };

      await onSave(leadData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={false}
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
          maxHeight: { xs: '90vh', sm: '90vh' },
        }
      }}
    >
      <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        {editingLead ? `Edit Lead: ${editingLead.name}` : 'Add New Lead'}
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2} sx={{ mt: { xs: 0, sm: 1 } }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name (Required)"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number (Required for WhatsApp)"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
              inputProps={{ pattern: '[0-9]{10,15}' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email ID"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Place (City/Region) (Required)"
              value={formData.place}
              onChange={(e) => handleChange('place', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Converted">Converted</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL (e.g., Profile Picture, ID Copy)"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              placeholder="Paste direct image link here"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks / Contact Notes"
              multiline
              rows={3}
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Enter notes about contact attempts, conversations, and next steps."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={saving}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={saving}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {saving ? 'Saving...' : 'Save Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

