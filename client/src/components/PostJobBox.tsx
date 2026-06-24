import { Card, CardContent, Button, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const PostJobBox = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  const handlePostClick = () => {
    if (!user) {
      showToast('Please login to seek a service', 'warning');
      return;
    }
    navigate('/post-job');
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={user?.avatar} 
            alt={user?.name}
            sx={{ width: 48, height: 48, border: '1px solid #eee' }}
          >
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Avatar>
          
          <Box 
            onClick={handlePostClick}
            sx={{ 
              flexGrow: 1,
              bgcolor: '#f5f5f5', 
              borderRadius: 2, 
              px: 2, 
              py: 1.5, 
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#eeeeee' },
              border: '1px solid transparent',
              transition: '0.2s'
            }}
          >
            Source it...
          </Box>

          <Button 
            variant="contained" 
            onClick={handlePostClick}
            sx={{ 
              bgcolor: '#000000', 
              color: 'white', 
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: '#333' }
            }}
          >
            Post Job
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostJobBox;
