import { Card, CardContent, Button, Avatar, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PostJobBox = () => {
  const { user } = useAuthStore();

  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={user?.avatar} 
            alt={user?.name}
            sx={{ width: 48, height: 48, border: '1px solid #eee' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          
          <Link to="/post-job" style={{ flexGrow: 1, textDecoration: 'none' }}>
            <Box 
              sx={{ 
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
          </Link>

          <Button 
            variant="contained" 
            component={Link} 
            to="/post-job"
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
