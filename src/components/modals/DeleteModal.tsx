import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName: string;
  deleting?: boolean;
}

export default function DeleteModal({ open, onClose, onConfirm, leadName, deleting = false }: DeleteModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{ color: 'error.main', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Confirm Deletion
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, wordBreak: 'break-word' }}>
          Are you sure you want to permanently delete the lead &quot;{leadName}&quot;?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={deleting}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained" 
          disabled={deleting}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {deleting ? 'Deleting...' : 'Delete Permanently'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

