import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      mb={3}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box display="flex" gap={1} alignItems="center">
        {children}
        {actionLabel && onAction && (
          <Button
            variant="contained"
            startIcon={actionIcon || <AddIcon />}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
}
