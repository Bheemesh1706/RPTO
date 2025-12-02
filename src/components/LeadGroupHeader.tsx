import { Typography, Box } from '@mui/material';

interface LeadGroupHeaderProps {
  title: string;
  count: number;
}

export default function LeadGroupHeader({ title, count }: LeadGroupHeaderProps) {
  return (
    <Box
      sx={{
        mt: 3,
        mb: 2,
        pb: 1,
        borderBottom: '2px solid',
        borderColor: 'primary.light',
      }}
    >
      <Typography variant="h6" color="primary" fontWeight="bold">
        {title} ({count} Leads)
      </Typography>
    </Box>
  );
}

