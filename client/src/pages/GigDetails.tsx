import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Divider, Chip, CircularProgress, Avatar, Alert } from '@mui/material';
import { getGigById } from '../services/gig.service';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import SendIcon from '@mui/icons-material/Send';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { format, formatDistanceToNow } from 'date-fns';
import BookGigModal from '../components/BookGigModal';

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const requireAuth = (action: () => void) => {
    if (!user) {
      showToast('Please login', 'warning');
      return;
    }
    action();
  };

  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        if (!id) return;
        const data = await getGigById(id);
        setGig(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load gig details');
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleSave = async () => {
    showToast('Save Gig functionality coming soon!', 'info');
    setIsSaved(!isSaved);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
  if (!gig) return <Container><Typography>Gig not found</Typography></Container>;

  const isPoster = user && (gig.providerId === user._id || (gig.providerId && gig.providerId._id === user._id));
  const provider = gig.providerId;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary' }}>
          Back to Gigs
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e0e0e0' }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h3" fontWeight="800" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1.2, mb: 1 }}>
                {gig.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Posted {formatDistanceToNow(new Date(gig.createdAt))} ago
                </Typography>
            </Box>
            
            {/* Prominent Pay Display */}
            <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                <Typography variant="h4" fontWeight="900" color="success.main">
                    ${gig.price}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    FIXED PRICE
                </Typography>
            </Box>
          </Box>

          {/* Key Info Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip 
              icon={<CategoryIcon sx={{ fontSize: 18 }} />}
              label={gig.category} 
              sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: '600', fontSize: '0.9rem', py: 0.5 }} 
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Description Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Service Description
          </Typography>
          <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {gig.description}
          </Typography>
        </Box>

        {gig.tags && gig.tags.length > 0 && (
            <Box sx={{ mb: 5 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {gig.tags.map((tag: string, index: number) => (
                        <Chip
                            key={index}
                            label={tag}
                            variant="outlined"
                            sx={{ borderColor: '#bdbdbd', fontWeight: '500' }}
                        />
                    ))}
                </Box>
            </Box>
        )}

        <Box sx={{ mb: 5, bgcolor: '#f9fafb', p: 3, borderRadius: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
            * Date, Time, and Location will be specified by you during the booking process.
          </Typography>
        </Box>

        {/* Action Buttons & Book Button */}
        {!isPoster && (
            <Box sx={{ mb: 5 }}>
                {/* Actions Icons Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }} onClick={() => requireAuth(() => showToast('Share functionality coming soon!', 'info'))}>
                        <SendIcon sx={{ fontSize: 28, color: 'black' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.8rem', mt: 0.5, fontWeight: 'bold' }}>Share</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: isSaved ? 1 : 0.7, '&:hover': { opacity: 1 } }} onClick={() => requireAuth(handleSave)}>
                        {isSaved ? <BookmarkIcon sx={{ fontSize: 28, color: 'black' }} /> : <BookmarkBorderIcon sx={{ fontSize: 28, color: 'black' }} />}
                        <Typography variant="caption" sx={{ fontSize: '0.8rem', mt: 0.5, fontWeight: 'bold' }}>{isSaved ? 'Saved' : 'Save'}</Typography>
                    </Box>
                </Box>

                {/* Book Button */}
                <Button 
                    fullWidth
                    variant="contained" 
                    size="large"
                    onClick={() => requireAuth(() => setIsBookModalOpen(true))}
                    sx={{ 
                        bgcolor: 'black', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        '&:hover': { bgcolor: '#333', transform: 'translateY(-2px)' },
                        transition: 'all 0.2s'
                    }}
                >
                    BOOK NOW
                </Button>
            </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Provider Details (Bottom) */}
        <Box sx={{ mb: 4 }}>
             <Typography variant="h6" fontWeight="bold" gutterBottom>
                About the Provider
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Avatar 
                    src={provider?.avatar} 
                    alt={provider?.name}
                    sx={{ width: 72, height: 72, border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                    {provider?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" component={Link} to={`/profile/${provider?._id}`} sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}>
                        {provider?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Provider Rating</Typography>
                            <Typography variant="body2" fontWeight="bold">★ {provider?.providerRating?.toFixed(1) || 'N/A'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Seeker Rating</Typography>
                            <Typography variant="body2" fontWeight="bold">★ {provider?.seekerRating?.toFixed(1) || 'N/A'}</Typography>
                        </Box>
                         <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Member Since</Typography>
                            <Typography variant="body2" fontWeight="bold">{provider?.createdAt ? format(new Date(provider.createdAt), 'MMM yyyy') : 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Button component={Link} to={`/profile/${provider?._id}`} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    View Profile
                </Button>
            </Paper>
        </Box>
      </Paper>

      {/* Book Gig Modal */}
      <BookGigModal 
        open={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
        gig={gig} 
      />
    </Container>
  );
};

export default GigDetails;
