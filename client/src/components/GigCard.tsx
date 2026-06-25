import { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button, Chip, Stack } from '@mui/material';
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
      <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar 
                src={provider.avatar} 
                component={Link} 
                to={`/profile/${provider._id}`}
                sx={{ width: 56, height: 56, textDecoration: 'none' }}
              >
                {provider.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  component={Link}
                  to={`/gigs/${gig._id}`}
                  sx={{ 
                    lineHeight: 1.2, 
                    textDecoration: 'none', 
                    color: 'inherit',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {gig.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" component={Link} to={`/profile/${provider._id}`} sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' }}}>
                    {provider.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">•</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#faaf00' }}>
                    <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      {provider.providerRating?.toFixed(1) || '0.0'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              ${gig.price}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {gig.description}
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1}>
              <Chip label={gig.category} size="small" sx={{ bgcolor: '#f5f5f5' }} />
              {gig.tags?.map((tag: string, index: number) => (
                <Chip key={index} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
            
            <Button 
              variant="contained" 
              onClick={handleBookClick}
              sx={{ 
                bgcolor: '#000000', 
                color: 'white',
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#333' }
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
