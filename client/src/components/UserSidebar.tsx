import { Box, Typography, Avatar, Button, Paper, Divider, Chip } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const UserSidebar = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: 'white' }}>
      {/* Cover Image Area */}
      <Box sx={{ height: 100, bgcolor: '#212121', position: 'relative' }}>
        {/* Optional: Add a subtle pattern or gradient here if needed */}
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
            color: 'black', 
            borderColor: '#e0e0e0',
            fontWeight: 'bold',
            textTransform: 'none',
            py: 1,
            borderRadius: 2,
            '&:hover': { bgcolor: '#f5f5f5', borderColor: '#bdbdbd' }
          }}
        >
          Edit Profile
        </Button>
      </Box>
    </Paper>
  );
};

export default UserSidebar;
