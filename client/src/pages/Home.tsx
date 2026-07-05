import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box, Paper, InputBase, IconButton, Grid, Popover, Menu, MenuItem, FormControl, InputLabel, Select, TextField, Button } from '@mui/material';

import JobCard from '../components/JobCard';
import GigCard from '../components/GigCard';
import UserSidebar from '../components/UserSidebar';
import WelcomeSidebar from '../components/WelcomeSidebar';
import RightSidebar from '../components/RightSidebar';
import { useAuthStore } from '../store/authStore';
import { useJobStore } from '../store/jobStore';
import { useGigStore } from '../store/gigStore';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const Home = () => {
  const { jobs, isLoading: isJobsLoading, fetchJobs } = useJobStore();
  const { gigs, isLoading: isGigsLoading, fetchGigs } = useGigStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState(0);

  // Filter & Sort State
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [category, setCategory] = useState('All');
  const [minPay, setMinPay] = useState('');
  const [maxPay, setMaxPay] = useState('');
  const [type, setType] = useState('all');
  const [location, setLocation] = useState('');
  const [datePosted, setDatePosted] = useState('all');

  // Filter Popover State
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openFilter = Boolean(anchorEl);

  // Sort Menu State
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const openSort = Boolean(sortAnchorEl);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, sortBy, category, minPay, maxPay, type, location, datePosted]);

  const applyFilters = () => {
    if (activeTab === 0) {
      fetchJobs({
        keyword,
        sortBy,
        category,
        minPay,
        maxPay,
        type,
        location,
        datePosted
      });
    } else {
      fetchGigs({
        keyword,
        category
      });
    }
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, [activeTab]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (option?: string) => {
    if (option) setSortBy(option);
    setSortAnchorEl(null);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 1, mb: 4, maxWidth: '1400px' }}>
      <Grid container spacing={3} alignItems="stretch" sx={{ minHeight: '100vh' }}>
        {/* Left Sidebar - User Profile (3 columns) */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            {user ? <UserSidebar /> : <WelcomeSidebar />}
          </Box>
        </Grid>

        {/* Main Feed (6 columns) */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Enhanced Premium Hero Section */}
          <Box sx={{ 
            p: { xs: 4, md: 6 }, 
            mb: 4, 
            borderRadius: 4, 
            bgcolor: '#0a0a0a', 
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            {/* Ambient Glows */}
            <Box sx={{ position: 'absolute', top: '-30%', right: '-10%', width: '60%', height: '70%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: 0 }} />
            <Box sx={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '50%', height: '60%', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: 0 }} />
            
            {/* Subtle Grid Pattern */}
            <Box sx={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 0 }} />

            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                fontWeight="900" 
                gutterBottom 
                sx={{ 
                  letterSpacing: '-1.5px',
                  background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                Welcome {user ? user.name.split(' ')[0] : 'Back'}.
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: '#94a3b8', fontSize: '1.2rem', maxWidth: '80%', lineHeight: 1.6 }}>
                Discover top-tier opportunities or source the perfect talent. The next big thing starts right here.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  href={user ? "/post-job" : undefined}
                  onClick={(e) => { 
                    if (!user) { 
                      e.preventDefault(); 
                    } 
                  }}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'black', 
                    fontWeight: '800', 
                    borderRadius: 3, 
                    px: { xs: 3, md: 5 }, 
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(255,255,255,0.2)',
                    '&:hover': { 
                      bgcolor: '#f8fafc',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(255,255,255,0.3)',
                    } 
                  }}
                >
                  Post a Job
                </Button>
                <Button 
                  variant="outlined" 
                  href={user ? "/create-gig" : undefined}
                  onClick={(e) => { 
                    if (!user) { 
                      e.preventDefault(); 
                    } 
                  }}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.2)', 
                    fontWeight: '700', 
                    borderRadius: 3, 
                    px: { xs: 3, md: 4 }, 
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    transition: 'all 0.2s',
                    '&:hover': { 
                      borderColor: 'rgba(255,255,255,0.5)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                      transform: 'translateY(-2px)'
                    } 
                  }}
                >
                  Offer a Service
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Sleek Feed Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box sx={{ 
              display: 'inline-flex', 
              bgcolor: 'white', 
              p: 0.5, 
              borderRadius: '24px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}>
              <Button
                disableElevation
                variant={activeTab === 0 ? "contained" : "text"}
                onClick={() => setActiveTab(0)}
                sx={{ 
                  borderRadius: '20px', 
                  px: 4, 
                  py: 1,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  color: activeTab === 0 ? 'white' : '#64748b',
                  bgcolor: activeTab === 0 ? '#0f172a' : 'transparent',
                  '&:hover': { bgcolor: activeTab === 0 ? '#1e293b' : '#f8f9fa' }
                }}
              >
                Explore Jobs
              </Button>
              <Button
                disableElevation
                variant={activeTab === 1 ? "contained" : "text"}
                onClick={() => setActiveTab(1)}
                sx={{ 
                  borderRadius: '20px', 
                  px: 4, 
                  py: 1,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  color: activeTab === 1 ? 'white' : '#64748b',
                  bgcolor: activeTab === 1 ? '#0f172a' : 'transparent',
                  '&:hover': { bgcolor: activeTab === 1 ? '#1e293b' : '#f8f9fa' }
                }}
              >
                Explore Gigs
              </Button>
            </Box>
          </Box>

          {/* Search & Filter Bar */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
             <Paper 
                elevation={0} 
                sx={{ 
                  p: '6px 12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: '1px solid #f0f0f0',
                  flexGrow: 1,
                  transition: '0.3s',
                  '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }
                }}
              >
                <IconButton sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search jobs..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <IconButton sx={{ p: '10px' }} onClick={handleSortClick}>
                   <Typography variant="caption" fontWeight="bold">
                     {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'payHigh' ? 'Pay: High' : 'Pay: Low'} ▼
                   </Typography>
                </IconButton>
                <Menu
                  anchorEl={sortAnchorEl}
                  open={openSort}
                  onClose={() => handleSortClose()}
                >
                  <MenuItem onClick={() => handleSortClose('newest')}>Newest First</MenuItem>
                  <MenuItem onClick={() => handleSortClose('oldest')}>Oldest First</MenuItem>
                  <MenuItem onClick={() => handleSortClose('payHigh')}>Pay: High to Low</MenuItem>
                  <MenuItem onClick={() => handleSortClose('payLow')}>Pay: Low to High</MenuItem>
                </Menu>
              </Paper>

              <Paper 
                elevation={0} 
                onClick={handleFilterClick}
                sx={{ 
                  p: '6px 12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: 'white', 
                  borderRadius: 4,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: '0.3s',
                  '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }
                }}
              >
                 <IconButton sx={{ p: '10px' }}>
                  <FilterListIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mr: 2, fontWeight: 500 }}>Filters</Typography>
                
                <Popover
                  open={openFilter}
                  anchorEl={anchorEl}
                  onClose={handleFilterClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Box sx={{ p: 3, width: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Filters</Typography>
                    
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={category}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <MenuItem value="All">All Categories</MenuItem>
                        <MenuItem value="Development">Development</MenuItem>
                        <MenuItem value="Design">Design</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Writing">Writing</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>

                    <Box>
                      <Typography variant="caption" fontWeight="bold">Pay Range ($)</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <TextField 
                          size="small" 
                          placeholder="Min" 
                          type="number" 
                          value={minPay} 
                          onChange={(e) => setMinPay(e.target.value)} 
                        />
                        <TextField 
                          size="small" 
                          placeholder="Max" 
                          type="number" 
                          value={maxPay} 
                          onChange={(e) => setMaxPay(e.target.value)} 
                        />
                      </Box>
                    </Box>

                    <FormControl fullWidth size="small">
                      <InputLabel>Job Type</InputLabel>
                      <Select
                        value={type}
                        label="Job Type"
                        onChange={(e) => setType(e.target.value)}
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="hourly">Hourly</MenuItem>
                        <MenuItem value="fixed-price">Fixed Price</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      size="small"
                      label="Location"
                      fullWidth
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />

                    <FormControl fullWidth size="small">
                      <InputLabel>Date Posted</InputLabel>
                      <Select
                        value={datePosted}
                        label="Date Posted"
                        onChange={(e) => setDatePosted(e.target.value)}
                      >
                        <MenuItem value="all">Any Time</MenuItem>
                        <MenuItem value="24h">Last 24 Hours</MenuItem>
                        <MenuItem value="7d">Last 7 Days</MenuItem>
                        <MenuItem value="30d">Last 30 Days</MenuItem>
                      </Select>
                    </FormControl>

                    <Button variant="contained" onClick={handleFilterClose} fullWidth sx={{ bgcolor: 'black' }}>
                      Apply Filters
                    </Button>
                    <Button variant="outlined" onClick={() => {
                      setCategory('All');
                      setMinPay('');
                      setMaxPay('');
                      setType('all');
                      setLocation('');
                      setDatePosted('all');
                      setKeyword(''); // Optional: clear search too? User said "clear all filters", usually implies search too or just the popover filters. Let's stick to popover filters + search for a true reset.
                      fetchJobs({}); // Immediately fetch all jobs
                      handleFilterClose();
                    }} fullWidth>
                      Clear All Filters
                    </Button>
                  </Box>
                </Popover>
              </Paper>
          </Box>

          {/* Feed Content */}
          <Box>
            {activeTab === 0 ? (
              // JOBS FEED
              isJobsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 0,
                  animation: 'fadeIn 0.5s ease-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(15px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}>
                  {jobs && jobs.length > 0 ? (
                    jobs
                      .filter((job: any) => !user || job.seekerId?._id !== user._id)
                      .map((job: any) => (
                        <JobCard key={job._id} job={job} />
                      ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No jobs found matching your criteria.
                    </Typography>
                  )}
                </Box>
              )
            ) : (
              // GIGS FEED
              isGigsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 0,
                  animation: 'fadeIn 0.5s ease-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(15px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}>
                  {gigs && gigs.length > 0 ? (
                    gigs
                      .filter((gig: any) => !user || gig.providerId?._id !== user._id)
                      .map((gig: any) => (
                        <GigCard key={gig._id} gig={gig} />
                      ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No gigs found matching your criteria.
                    </Typography>
                  )}
                </Box>
              )
            )}
          </Box>
        </Grid>

        {/* Right Sidebar - Recommendations (3 columns) */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            <RightSidebar />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
