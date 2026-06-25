import { Box, Typography, Button, Paper, Divider, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PaymentsIcon from '@mui/icons-material/Payments';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const WelcomeSidebar = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: 'white', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
        {/* Decorative background blobs */}
        <Box sx={{ position: 'absolute', top: -40, left: -40, width: 120, height: 120, bgcolor: '#f3e5f5', borderRadius: '50%', opacity: 0.7, zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: -30, right: -30, width: 100, height: 100, bgcolor: '#e3f2fd', borderRadius: '50%', opacity: 0.7, zIndex: 0 }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <AutoAwesomeIcon sx={{ fontSize: 48, color: '#000', mb: 1 }} />
          <Typography variant="h5" fontWeight="900" gutterBottom>
            Join the Community
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            Connect with skilled professionals, post jobs, book gigs, and get work done efficiently.
          </Typography>

          <Button 
            component={Link} 
            to="/register" 
            variant="contained" 
            fullWidth 
            sx={{ 
              bgcolor: 'black', 
              color: 'white', 
              py: 1.2, 
              fontWeight: 'bold', 
              borderRadius: 2,
              mb: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { bgcolor: '#333' }
            }}
          >
            Create an Account
          </Button>
          <Button 
            component={Link} 
            to="/login" 
            variant="outlined" 
            fullWidth 
            sx={{ 
              color: 'black', 
              borderColor: '#e0e0e0', 
              py: 1.2, 
              fontWeight: 'bold', 
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { borderColor: 'black', bgcolor: '#f5f5f5' }
            }}
          >
            Log In
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: 'white' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          How it Works
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 2 }}>
              <WorkOutlineIcon sx={{ color: '#000' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Post or Browse</Typography>
              <Typography variant="caption" color="text.secondary">Find the perfect job or post your own requirements.</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 2 }}>
              <HandshakeIcon sx={{ color: '#000' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Connect & Negotiate</Typography>
              <Typography variant="caption" color="text.secondary">Discuss terms and agree on the best price.</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 2 }}>
              <PaymentsIcon sx={{ color: '#000' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Get Paid Safely</Typography>
              <Typography variant="caption" color="text.secondary">Secure transactions and verified completion.</Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default WelcomeSidebar;
