import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';

interface GreetingModalProps {
  open: boolean;
  onClose: () => void;
  greetingText: string;
}

export default function GreetingModal({ open, onClose, greetingText }: GreetingModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const tempInput = document.createElement('textarea');
    tempInput.value = greetingText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
          maxHeight: { xs: '90vh', sm: '90vh' },
        }
      }}
    >
      <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Converted Lead Greeting
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Alert severity="info" sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
          This message is ready to be copied and sent!
        </Alert>
        <TextField
          fullWidth
          multiline
          rows={12}
          value={greetingText}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            },
            '& .MuiInputBase-root': {
              minHeight: { xs: '200px', sm: '240px' },
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1 }}>
        <Button 
          onClick={onClose}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          variant="outlined"
        >
          Close
        </Button>
        <Button
          onClick={handleCopy}
          variant="contained"
          startIcon={copied ? <Check /> : <ContentCopy />}
          color={copied ? 'success' : 'primary'}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

