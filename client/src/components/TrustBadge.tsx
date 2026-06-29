import React from 'react';
import { Chip, Tooltip, Box, Typography } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldIcon from '@mui/icons-material/Shield';
import GppBadIcon from '@mui/icons-material/GppBad';

interface TrustBadgeProps {
  score?: number;
  isVerified?: boolean;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ score = 100, isVerified = false }) => {
  let tierName = 'New / Needs Improvement';
  let color = 'default';
  let icon = <ShieldIcon />;
  let customColor = undefined;

  if (score > 850) {
    tierName = 'Platinum/Gold (Top Tier)';
    customColor = '#FFD700'; // Gold
    icon = <VerifiedUserIcon style={{ color: '#B8860B' }} />;
  } else if (score > 600) {
    tierName = 'Silver (Highly Trusted)';
    customColor = '#C0C0C0'; // Silver
    icon = <VerifiedUserIcon style={{ color: '#808080' }} />;
  } else if (score > 300) {
    tierName = 'Bronze (Reliable)';
    customColor = '#CD7F32'; // Bronze
    icon = <ShieldIcon style={{ color: '#8B4513' }} />;
  } else {
    // 0-300
    color = 'error';
    icon = <GppBadIcon />;
  }

  const chipStyle = customColor ? { backgroundColor: customColor, color: '#000', fontWeight: 'bold' } : { fontWeight: 'bold' };

  return (
    <Tooltip 
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">Trust Score: {score}/1000</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Tier: {tierName}</Typography>
          <Typography variant="caption" display="block">Points are awarded for profile completeness, ID verification (+200), high reviews, and job completions.</Typography>
          <Typography variant="caption" display="block">Points are deducted for cancellations.</Typography>
          {isVerified && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#4caf50' }}>
              <VerifiedUserIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption" fontWeight="bold">ID Verified</Typography>
            </Box>
          )}
        </Box>
      }
      arrow
    >
      <Chip 
        icon={icon} 
        label={`Trust Score: ${score}`} 
        size="small" 
        color={color as any} 
        sx={chipStyle} 
        clickable
      />
    </Tooltip>
  );
};

export default TrustBadge;
