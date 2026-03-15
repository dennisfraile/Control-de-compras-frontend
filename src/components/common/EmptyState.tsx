import { Box, Typography } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={300}
      gap={2}
      py={4}
    >
      <Box sx={{ color: 'text.disabled', fontSize: 64 }}>
        {icon || <InboxIcon sx={{ fontSize: 64 }} />}
      </Box>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.disabled" textAlign="center">
          {description}
        </Typography>
      )}
      {action && <Box mt={1}>{action}</Box>}
    </Box>
  );
}
