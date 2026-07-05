import { Box, Typography, Avatar, Button, Paper, Divider, Chip } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const UserSidebar = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 4, bgcolor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      {/* Cover Image Area */}
      <Box sx={{ height: 120, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(20px)' }} />
      </Box>

      {/* Avatar & Info */}
      <Box sx={{ px: 3, pb: 4, textAlign: 'center', mt: -6, position: 'relative' }}>
        <Avatar 
          src={user.avatar} 
          alt={user.name}
          sx={{ 
            width: 96, 
            height: 96, 
            border: '4px solid white', 
            mx: 'auto',
            bgcolor: '#000000',
            fontSize: '2.5rem',
            color: 'white'
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        
        <Typography variant="h6" fontWeight="900" sx={{ mt: 1.5, fontSize: '1.25rem' }}>
          {user.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {user.email}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            <Chip label="Seeker" size="small" sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }} />
            <Chip label="Provider" size="small" sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, px: 2 }}>
          <Typography variant="body2" color="text.secondary">Seeker Rating</Typography>
          <Typography variant="body2" fontWeight="bold">{user.seekerRating || 'N/A'} ★</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, px: 2 }}>
          <Typography variant="body2" color="text.secondary">Provider Rating</Typography>
          <Typography variant="body2" fontWeight="bold">{user.providerRating || 'N/A'} ★</Typography>
        </Box>

        <Button 
          fullWidth 
          variant="outlined" 
          component={Link} 
          to="/profile"
          startIcon={<EditIcon />}
          sx={{ 
            color: 'white', 
            bgcolor: '#000',
            fontWeight: 'bold',
            textTransform: 'none',
            py: 1,
            borderRadius: 3,
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: '#333' }
          }}
        >
          Edit Profile
        </Button>
      </Box>
    </Paper>
  );
};

export default UserSidebar;
