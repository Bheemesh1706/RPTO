import { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  Avatar,
  Grid,
  Stack,
} from '@mui/material';
import {
  WhatsApp,
  Edit,
  Delete,
  Message,
} from '@mui/icons-material';
import { Lead } from '../types/lead';
import { formatDate } from '../utils/dateUtils';
import { openWhatsApp } from '../utils/whatsappUtils';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onGreet: (lead: Lead) => void;
}

const DEFAULT_IMAGE = 'https://placehold.co/100x100/e0f2fe/1e3a8a?text=NO+IMG';
const ERROR_IMAGE = 'https://placehold.co/100x100/e0f2fe/1e3a8a?text=IMG+Error';

const statusColors: Record<Lead['status'], { bg: string; text: string }> = {
  'New': { bg: '#f3f4f6', text: '#1f2937' },
  'Contacted': { bg: '#bfdbfe', text: '#1e3a8a' },
  'Converted': { bg: '#d1fae5', text: '#065f46', },
  'Lost': { bg: '#fee2e2', text: '#991b1b' },
};

export default function LeadCard({ lead, onEdit, onDelete, onGreet }: LeadCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const statusColor = statusColors[lead.status] || statusColors['New'];
  const firstRemarkLine = lead.remarks ? lead.remarks.split('\n')[0].trim() : '';

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm="auto">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar
                src={imageError ? ERROR_IMAGE : (lead.image_url || DEFAULT_IMAGE)}
                onError={handleImageError}
                sx={{
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  border: '4px solid',
                  borderColor: 'primary.light',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'flex-start' }, 
              mb: 1,
              gap: 1
            }}>
              <Typography 
                variant="h6" 
                color="primary" 
                fontWeight="bold"
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  wordBreak: 'break-word',
                  flex: 1
                }}
              >
                {lead.name}
              </Typography>
              <Chip
                label={lead.status}
                size="small"
                sx={{
                  bgcolor: statusColor.bg,
                  color: statusColor.text,
                  fontWeight: lead.status === 'Converted' ? 'bold' : 'normal',
                  alignSelf: { xs: 'flex-start', sm: 'flex-start' },
                }}
              />
            </Box>
            <Grid container spacing={1} sx={{ mb: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' }, wordBreak: 'break-word' }}
                >
                  <strong>Place:</strong> {lead.place}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                >
                  <strong>Age:</strong> {lead.age}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <strong>Email:</strong> {lead.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                >
                  <strong>Phone:</strong> {lead.phone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                >
                  <strong>Created:</strong> {formatDate(lead.created_at)}
                </Typography>
              </Grid>
            </Grid>
            {firstRemarkLine && (
              <Box
                sx={{
                  pt: 1,
                  mt: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, wordBreak: 'break-word' }}
                >
                  <strong>Latest Note:</strong> {firstRemarkLine}...
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm="auto">
            <Stack 
              spacing={1} 
              direction={{ xs: 'row', sm: 'column' }} 
              flexWrap="wrap"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsApp />}
                size="small"
                onClick={() => openWhatsApp(lead.phone, lead.name)}
                sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: '120px' } }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>WhatsApp</Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>WA</Box>
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Edit />}
                size="small"
                onClick={() => onEdit(lead)}
                sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: '120px' } }}
              >
                Edit
              </Button>
              {lead.status === 'Converted' && (
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<Message />}
                  size="small"
                  onClick={() => onGreet(lead)}
                  sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: '120px' } }}
                >
                  Greet
                </Button>
              )}
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                size="small"
                onClick={() => onDelete(lead)}
                sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: '120px' } }}
              >
                Delete
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

