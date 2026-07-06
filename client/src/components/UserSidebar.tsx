import { Box, Typography, Avatar, Button, Paper, Divider, Chip } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const UserSidebar = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        overflow: 'hidden', 
        borderRadius: 4, 
        bgcolor: 'white', 
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.12)'
        }
      }}
    >
      {/* Cover Image Area */}
      <Box sx={{ 
        height: 140, 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Orbs */}
        <Box sx={{ position: 'absolute', top: -40, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.4) 100%)', filter: 'blur(30px)' }} />
        <Box sx={{ position: 'absolute', bottom: -50, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(56,189,248,0.3)', filter: 'blur(30px)' }} />
        
        {/* Subtle Grid Pattern Overlay */}
        <Box sx={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />
      </Box>

      {/* Avatar & Info */}
      <Box sx={{ px: 4, pb: 4, textAlign: 'center', mt: -7, position: 'relative', zIndex: 2 }}>
        
        {/* Avatar with Premium Border */}
        <Box sx={{ 
          display: 'inline-block', 
          p: 0.5, 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
          mb: 2
        }}>
          <Avatar 
            src={user.avatar} 
            alt={user.name}
            sx={{ 
              width: 100, 
              height: 100, 
              border: '4px solid white',
              bgcolor: '#0f172a',
              fontSize: '2.5rem',
              fontWeight: '900',
              color: 'white'
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
        
        <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.5px', color: '#0f172a' }}>
          {user.name}
        </Typography>
        
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3, fontWeight: 500 }}>
          {user.email}
        </Typography>

        {/* Role Badges */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 4 }}>
          <Chip 
            label="Seeker" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(99,102,241,0.1)', 
              color: '#4f46e5', 
              fontWeight: 'bold',
              px: 1,
              borderRadius: '8px'
            }} 
          />
          <Chip 
            label="Provider" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(168,85,247,0.1)', 
              color: '#9333ea', 
              fontWeight: 'bold',
              px: 1,
              borderRadius: '8px'
            }} 
          />
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed', opacity: 0.6 }} />

        {/* Ratings Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9' }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(99,102,241,0.1)', color: '#4f46e5', display: 'flex' }}>
                <StarRoundedIcon fontSize="small" />
              </Box>
              <Typography variant="body2" fontWeight="600" color="#334155">Seeker Rating</Typography>
            </Box>
            <Typography variant="body1" fontWeight="900" color="#0f172a">
              {user.seekerRating || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9' }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(168,85,247,0.1)', color: '#9333ea', display: 'flex' }}>
                <WorkspacePremiumIcon fontSize="small" />
              </Box>
              <Typography variant="body2" fontWeight="600" color="#334155">Provider Rating</Typography>
            </Box>
            <Typography variant="body1" fontWeight="900" color="#0f172a">
              {user.providerRating || 'N/A'}
            </Typography>
          </Box>
          
        </Box>

        <Button 
          fullWidth 
          variant="contained" 
          component={Link} 
          to="/profile"
          startIcon={<EditIcon sx={{ fontSize: '1.2rem' }} />}
          sx={{ 
            color: 'white', 
            bgcolor: '#0f172a',
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'none',
            py: 1.5,
            borderRadius: 3,
            boxShadow: '0 8px 20px rgba(15,23,42,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': { 
              bgcolor: '#1e293b',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 24px rgba(15,23,42,0.3)'
            }
          }}
        >
          Edit Profile
        </Button>
      </Box>
    </Paper>
  );
};

export default UserSidebar;
