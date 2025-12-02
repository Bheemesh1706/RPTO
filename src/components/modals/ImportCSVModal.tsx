import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
  Link,
  Typography,
} from '@mui/material';
import { CloudUpload, Download } from '@mui/icons-material';

interface ImportCSVModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (csvContent: string) => Promise<number>;
  onDownloadSample: () => void;
}

export default function ImportCSVModal({ open, onClose, onImport, onDownloadSample }: ImportCSVModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setMessage('Invalid file type. Please upload a CSV (.csv) file.');
        setMessageType('error');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setMessage('Please select a file.');
      setMessageType('error');
      return;
    }

    setImporting(true);
    setMessage('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvContent = event.target?.result as string;
        const count = await onImport(csvContent);
        setMessage(`Successfully imported ${count} new leads! Reloading dashboard...`);
        setMessageType('success');
        
        setTimeout(() => {
          onClose();
          setFile(null);
          setMessage('');
        }, 1500);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Import failed');
        setMessageType('error');
      } finally {
        setImporting(false);
      }
    };

    reader.onerror = () => {
      setMessage('Failed to read file.');
      setMessageType('error');
      setImporting(false);
    };

    reader.readAsText(file);
  };

  const handleClose = () => {
    setFile(null);
    setMessage('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Bulk Import Leads
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Alert severity="info" sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
          Upload a file with lead details. For best results, use a CSV format file (.csv) saved from Excel.
        </Alert>

        {message && (
          <Alert severity={messageType} sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
            {message}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="csv-file-input"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="csv-file-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ mb: 2 }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  maxWidth: { xs: '200px', sm: 'none' }
                }}
              >
                {file ? file.name : 'Select CSV File'}
              </Typography>
            </Button>
          </label>
        </Box>

        <Box>
          <Link
            component="button"
            variant="body2"
            onClick={onDownloadSample}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            <Download fontSize="small" />
            Download Sample CSV Template
          </Link>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={importing}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleImport} 
          variant="contained" 
          disabled={importing || !file}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {importing ? 'Importing...' : 'Import Leads'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

