import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box, Paper, InputBase, IconButton, Grid, Popover, Menu, MenuItem, FormControl, InputLabel, Select, TextField, Button, Tabs, Tab } from '@mui/material';

import JobCard from '../components/JobCard';
import GigCard from '../components/GigCard';
import UserSidebar from '../components/UserSidebar';
import WelcomeSidebar from '../components/WelcomeSidebar';
import RightSidebar from '../components/RightSidebar';
import PostJobBox from '../components/PostJobBox';
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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
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

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Grid container spacing={3} alignItems="stretch" sx={{ minHeight: '100vh' }}>
        {/* Left Sidebar - User Profile (3 columns) */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            {user ? <UserSidebar /> : <WelcomeSidebar />}
          </Box>
        </Grid>

        {/* Main Feed (6 columns) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)} 
              textColor="inherit" 
              indicatorColor="primary"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  py: 1.5,
                  color: 'text.secondary'
                },
                '& .Mui-selected': {
                  color: '#000',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#000',
                  height: 3,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3
                }
              }}
            >
              <Tab label="Jobs" />
              <Tab label="Gigs" />
            </Tabs>
          </Box>

          {activeTab === 0 && <PostJobBox />}

          {/* Search & Filter Bar */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
             <Paper 
                elevation={0} 
                sx={{ 
                  p: '2px 4px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: 'white', 
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  flexGrow: 1
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
                sx={{ 
                  p: '2px 4px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: 'white', 
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  cursor: 'pointer'
                }}
              >
                 <IconButton sx={{ p: '10px' }} onClick={handleFilterClick}>
                  <FilterListIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mr: 2, fontWeight: 500 }} onClick={handleFilterClick}>Filters</Typography>
                
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            <RightSidebar />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
