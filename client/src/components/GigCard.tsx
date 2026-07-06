import { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import BookGigModal from './BookGigModal';

interface GigCardProps {
  gig: any;
}

const GigCard = ({ gig }: GigCardProps) => {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const provider = gig.providerId;

  const handleBookClick = () => {
    setIsBookModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookModalOpen(false);
  };

  return (
    <>
      <Card sx={{ 
        mb: 4, 
        borderRadius: 4, 
        bgcolor: 'white',
        boxShadow: '0 12px 40px rgba(0,0,0,0.06)', 
        border: '1px solid #f1f5f9', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        overflow: 'visible',
        '&:hover': { 
          transform: 'translateY(-6px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
          borderColor: 'rgba(99, 102, 241, 0.2)'
        } 
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link to={`/profile/${provider._id}`} style={{ textDecoration: 'none' }}>
                <Box sx={{ 
                  p: '3px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  boxShadow: '0 4px 10px rgba(99,102,241,0.2)'
                }}>
                  <Avatar 
                    src={provider.avatar} 
                    alt={provider.name}
                    sx={{ width: 48, height: 48, border: '2px solid white', bgcolor: '#0f172a', fontWeight: 'bold' }}
                  >
                    {provider.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
              </Link>
              <Box>
                <Typography 
                  variant="h5" 
                  fontWeight="900" 
                  component={Link}
                  to={`/gigs/${gig._id}`}
                  sx={{ 
                    letterSpacing: '-0.5px',
                    lineHeight: 1.3, 
                    textDecoration: 'none', 
                    color: '#0f172a',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {gig.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Typography variant="body2" component={Link} to={`/profile/${provider._id}`} sx={{ textDecoration: 'none', color: '#64748b', fontWeight: 600, '&:hover': { color: '#4f46e5' }}}>
                    {provider.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>•</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#eab308' }}>
                    <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="#64748b" fontWeight="700">
                      {provider.providerRating?.toFixed(1) || '0.0'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            <Chip 
              label={`$${gig.price}`} 
              sx={{ 
                bgcolor: 'rgba(16, 185, 129, 0.1)', 
                color: '#059669', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                fontWeight: 900, 
                borderRadius: '8px', 
                px: 1,
                py: 2.5, 
                fontSize: '1.2rem' 
              }} 
            />
          </Box>

          <Typography variant="body1" sx={{ mt: 2, color: '#475569', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {gig.description}
          </Typography>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #e2e8f0', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label={gig.category} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(99, 102, 241, 0.08)', 
                  color: '#4f46e5', 
                  fontWeight: 700,
                  borderRadius: 2
                }} 
              />
              {gig.tags?.map((tag: string, index: number) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  sx={{ 
                    bgcolor: '#f1f5f9', 
                    color: '#64748b', 
                    fontWeight: 600,
                    borderRadius: 2
                  }} 
                />
              ))}
            </Box>
            
            <Button 
              variant="contained" 
              onClick={handleBookClick}
              sx={{ 
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                px: { xs: 3, sm: 5 },
                py: 1.2,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: '800',
                boxShadow: '0 8px 20px rgba(15,23,42,0.2)',
                transition: 'all 0.3s',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 25px rgba(15,23,42,0.3)',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                }
              }}
            >
              Book Now
            </Button>
          </Box>
        </CardContent>
      </Card>

      <BookGigModal 
        open={isBookModalOpen} 
        onClose={handleCloseModal} 
        gig={gig} 
      />
    </>
  );
};

export default GigCard;
