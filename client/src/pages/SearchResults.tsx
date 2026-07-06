import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid,
  FormControl, InputLabel, Select, MenuItem, TextField, Button,
  Chip, InputBase, Tabs, Tab, Drawer, IconButton, Divider, Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import JobCard from '../components/JobCard';
import GigCard from '../components/GigCard';
import { jobService } from '../services/job.service';
import { searchGigs } from '../services/gig.service';

const CATEGORIES = ['All', 'Development', 'Design', 'Marketing', 'Writing', 'Cleaning', 'Tutoring', 'Plumbing', 'Landscaping', 'Web Design', 'Other'];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';

  // Search state
  const [searchInput, setSearchInput] = useState(queryFromUrl);
  const [activeTab, setActiveTab] = useState(0); // 0=All, 1=Jobs, 2=Gigs

  // Filter state
  const [category, setCategory] = useState('All');
  const [minPay, setMinPay] = useState('');
  const [maxPay, setMaxPay] = useState('');
  const [jobType, setJobType] = useState('all');
  const [location, setLocation] = useState('');
  const [datePosted, setDatePosted] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Results state
  const [jobs, setJobs] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingGigs, setIsLoadingGigs] = useState(false);

  // Mobile filter drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchResults = useCallback(async () => {
    const keyword = searchParams.get('q') || '';
    
    // Map sortBy for gigs (priceHigh/priceLow vs payHigh/payLow)
    const gigSortMap: Record<string, string> = {
      newest: 'newest',
      oldest: 'oldest',
      payHigh: 'priceHigh',
      payLow: 'priceLow',
    };

    if (activeTab === 0 || activeTab === 1) {
      setIsLoadingJobs(true);
      try {
        const result = await jobService.getJobs({
          keyword,
          category,
          minPay,
          maxPay,
          type: jobType,
          location,
          datePosted,
          sortBy,
        });
        setJobs(result);
      } catch {
        setJobs([]);
      }
      setIsLoadingJobs(false);
    }

    if (activeTab === 0 || activeTab === 2) {
      setIsLoadingGigs(true);
      try {
        const result = await searchGigs({
          keyword,
          category,
          minPrice: minPay,
          maxPrice: maxPay,
          sortBy: gigSortMap[sortBy] || 'newest',
        });
        setGigs(result);
      } catch {
        setGigs([]);
      }
      setIsLoadingGigs(false);
    }
  }, [searchParams, category, minPay, maxPay, jobType, location, datePosted, sortBy, activeTab]);

  // Debounced fetch on filter/sort changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchResults]);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    }
  };

  const handleClearFilters = () => {
    setCategory('All');
    setMinPay('');
    setMaxPay('');
    setJobType('all');
    setLocation('');
    setDatePosted('all');
    setSortBy('newest');
  };

  const isLoading = isLoadingJobs || isLoadingGigs;
  const allResults = [...jobs.map(j => ({ ...j, _type: 'job' })), ...gigs.map(g => ({ ...g, _type: 'gig' }))];
  const displayResults = activeTab === 0 ? allResults : activeTab === 1 ? jobs : gigs;
  const hasActiveFilters = category !== 'All' || minPay || maxPay || jobType !== 'all' || location || datePosted !== 'all';

  // ── Filter Panel Content (reused for sidebar & mobile drawer) ──
  const FilterPanel = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="subtitle2" fontWeight={900} sx={{ letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.7rem' }}>
        Filters
      </Typography>

      {/* Category */}
      <FormControl fullWidth size="small">
        <InputLabel sx={{ fontWeight: 700 }}>Category</InputLabel>
        <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}
          sx={{ borderRadius: 2, fontWeight: 600, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}>
          {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c === 'All' ? 'All Categories' : c}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Pay Range */}
      <Box>
        <Typography variant="caption" fontWeight={800} sx={{ color: '#64748b', letterSpacing: '0.5px', mb: 1, display: 'block' }}>PAY / PRICE RANGE ($)</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField size="small" placeholder="Min" type="number" value={minPay} onChange={(e) => setMinPay(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 600 } }} />
          <TextField size="small" placeholder="Max" type="number" value={maxPay} onChange={(e) => setMaxPay(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 600 } }} />
        </Box>
      </Box>

      {/* Job Type — only show when Jobs tab is active */}
      {(activeTab === 0 || activeTab === 1) && (
        <FormControl fullWidth size="small">
          <InputLabel sx={{ fontWeight: 700 }}>Job Type</InputLabel>
          <Select value={jobType} label="Job Type" onChange={(e) => setJobType(e.target.value)}
            sx={{ borderRadius: 2, fontWeight: 600, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}>
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="fixed-price">Fixed Price</MenuItem>
            <MenuItem value="hourly">Hourly</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Location — only show for Jobs */}
      {(activeTab === 0 || activeTab === 1) && (
        <TextField size="small" label="Location" placeholder="e.g. San Francisco" value={location}
          onChange={(e) => setLocation(e.target.value)} fullWidth
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 600 } }} />
      )}

      {/* Date Posted — only show for Jobs */}
      {(activeTab === 0 || activeTab === 1) && (
        <FormControl fullWidth size="small">
          <InputLabel sx={{ fontWeight: 700 }}>Date Posted</InputLabel>
          <Select value={datePosted} label="Date Posted" onChange={(e) => setDatePosted(e.target.value)}
            sx={{ borderRadius: 2, fontWeight: 600, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}>
            <MenuItem value="all">Any Time</MenuItem>
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button onClick={handleClearFilters} variant="text" size="small"
          sx={{ color: '#ef4444', fontWeight: 800, textTransform: 'none', alignSelf: 'flex-start', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' } }}>
          ✕ Clear All Filters
        </Button>
      )}
    </Box>
  );

  // ── Skeleton Loader ──
  const ResultSkeleton = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {[1, 2, 3, 4].map(i => (
        <Paper key={i} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f1f5f9' }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="70%" height={20} />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width={100} height={28} sx={{ borderRadius: 2 }} />
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Container maxWidth={false} sx={{ mt: 3, mb: 8, maxWidth: '1400px' }}>
      {/* ── Search Header ── */}
      <Paper elevation={0} sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative gradient orbs */}
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-1px', mb: 2, position: 'relative' }}>
          {queryFromUrl ? (
            <>Results for "<span style={{ color: '#818cf8' }}>{queryFromUrl}</span>"</>
          ) : 'Search Jobs & Gigs'}
        </Typography>

        {/* Re-search bar */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.1)',
          px: 2.5, py: 0.8, maxWidth: 600,
          transition: 'all 0.3s',
          '&:focus-within': { bgcolor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(99,102,241,0.5)', boxShadow: '0 0 0 3px rgba(99,102,241,0.2)' }
        }}>
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
          <InputBase
            placeholder="Search jobs, gigs, services..."
            fullWidth
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            sx={{ fontSize: '1rem', color: 'white', fontWeight: 600, '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 } }}
          />
          <Button onClick={handleSearchSubmit} variant="contained" size="small"
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              fontWeight: 800, borderRadius: 2, px: 3, minWidth: 'auto', textTransform: 'none',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)' }
            }}>
            Search
          </Button>
        </Box>

        {/* Result count */}
        {!isLoading && queryFromUrl && (
          <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.5)', fontWeight: 600, position: 'relative' }}>
            Found <span style={{ color: '#818cf8', fontWeight: 900 }}>{displayResults.length}</span> result{displayResults.length !== 1 ? 's' : ''}
            {hasActiveFilters && <span> (filtered)</span>}
          </Typography>
        )}
      </Paper>

      {/* ── Tabs + Sort Bar ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
          sx={{
            '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #6366f1, #a855f7)', height: 3, borderRadius: 2 },
            '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: '0.95rem', color: '#94a3b8', '&.Mui-selected': { color: '#0f172a' } }
          }}>
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              All
              {!isLoading && <Chip label={allResults.length} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 900, bgcolor: '#f1f5f9', color: '#64748b' }} />}
            </Box>
          } />
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkOutlineIcon sx={{ fontSize: 18 }} /> Jobs
              {!isLoadingJobs && <Chip label={jobs.length} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 900, bgcolor: 'rgba(99,102,241,0.1)', color: '#6366f1' }} />}
            </Box>
          } />
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StorefrontIcon sx={{ fontSize: 18 }} /> Gigs
              {!isLoadingGigs && <Chip label={gigs.length} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 900, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }} />}
            </Box>
          } />
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Mobile filter toggle */}
          <IconButton onClick={() => setMobileFilterOpen(true)} sx={{ display: { xs: 'flex', md: 'none' }, bgcolor: '#f1f5f9', borderRadius: 2 }}>
            <TuneIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Sort dropdown */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} displayEmpty
              startAdornment={<SortIcon sx={{ fontSize: 18, mr: 1, color: '#94a3b8' }} />}
              sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.85rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="payHigh">Pay: High → Low</MenuItem>
              <MenuItem value="payLow">Pay: Low → High</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* ── Main Layout: Filter Sidebar + Results ── */}
      <Grid container spacing={4}>
        {/* Filter Sidebar (Desktop) */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper elevation={0} sx={{
            p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            position: 'sticky', top: 88, bgcolor: '#ffffff'
          }}>
            <FilterPanel />
          </Paper>
        </Grid>

        {/* Results Area */}
        <Grid size={{ xs: 12, md: 9 }}>
          {isLoading ? (
            <ResultSkeleton />
          ) : displayResults.length === 0 ? (
            /* ── Empty State ── */
            <Paper elevation={0} sx={{
              p: { xs: 4, md: 8 }, textAlign: 'center', borderRadius: 4,
              border: '2px dashed #e2e8f0', bgcolor: '#fafbfc'
            }}>
              <SearchOffIcon sx={{ fontSize: 72, color: '#cbd5e1', mb: 3 }} />
              <Typography variant="h5" fontWeight={900} sx={{ color: '#334155', mb: 1 }}>
                No results found
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: 400, mx: 'auto', mb: 3 }}>
                {queryFromUrl
                  ? `We couldn't find anything matching "${queryFromUrl}". Try adjusting your filters or search with different keywords.`
                  : 'Enter a search term to find jobs and gigs.'}
              </Typography>
              {hasActiveFilters && (
                <Button onClick={handleClearFilters} variant="outlined"
                  sx={{ fontWeight: 800, borderRadius: 3, borderColor: '#6366f1', color: '#6366f1', '&:hover': { bgcolor: 'rgba(99,102,241,0.05)' } }}>
                  Clear All Filters
                </Button>
              )}
            </Paper>
          ) : (
            /* ── Results List ── */
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {displayResults.map((item: any, index: number) => {
                const itemType = item._type || (item.originalPay !== undefined ? 'job' : 'gig');
                return (
                  <Box key={item._id || index} sx={{
                    animation: `fadeSlideIn 0.4s ease ${index * 0.05}s both`,
                    '@keyframes fadeSlideIn': {
                      from: { opacity: 0, transform: 'translateY(12px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}>
                    {/* Type badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip
                        icon={itemType === 'job' ? <WorkOutlineIcon sx={{ fontSize: '14px !important' }} /> : <StorefrontIcon sx={{ fontSize: '14px !important' }} />}
                        label={itemType === 'job' ? 'JOB' : 'GIG'}
                        size="small"
                        sx={{
                          height: 22, fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.5px',
                          bgcolor: itemType === 'job' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)',
                          color: itemType === 'job' ? '#6366f1' : '#10b981',
                          '& .MuiChip-icon': { color: itemType === 'job' ? '#6366f1' : '#10b981' }
                        }}
                      />
                    </Box>
                    {itemType === 'job' ? <JobCard job={item} /> : <GigCard gig={item} />}
                  </Box>
                );
              })}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* ── Mobile Filter Drawer ── */}
      <Drawer anchor="bottom" open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80vh' }
        }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={900}>Filters</Typography>
            <IconButton onClick={() => setMobileFilterOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <FilterPanel />
          <Button fullWidth variant="contained" onClick={() => setMobileFilterOpen(false)}
            sx={{
              mt: 3, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              fontWeight: 900, borderRadius: 3, py: 1.5,
              '&:hover': { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }
            }}>
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default SearchResults;
