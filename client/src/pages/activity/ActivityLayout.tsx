import { Box, Container, Typography, ToggleButtonGroup, ToggleButton, Tabs, Tab } from '@mui/material';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import WorkIcon from '@mui/icons-material/Work';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Mapping of all views
const HIRING_VIEWS = [
  { id: 'posted-jobs', label: 'Jobs I Posted' },
  { id: 'received-offers', label: 'Received Offers' },
  { id: 'assigned-jobs', label: 'Assigned Jobs' },
  { id: 'seeker-ongoing', label: 'Ongoing Jobs' },
  { id: 'seeker-completed-jobs', label: 'Completed Jobs' },
  { id: 'rejected-offers', label: 'Rejected Offers' },
];

const WORKING_VIEWS = [
  { id: 'upcoming-jobs', label: 'Upcoming Jobs' },
  { id: 'provider-ongoing', label: 'Ongoing Jobs' },
  { id: 'sent-offers', label: 'Sent Offers' },
  { id: 'my-gigs', label: 'My Gigs' },
  { id: 'completed-jobs', label: 'Completed Jobs' },
];

const OVERVIEW_VIEWS = [
  { id: 'dashboard', label: 'Dashboard' }
];

const GLOBAL_VIEWS = [
  { id: 'saved-jobs', label: 'Saved Jobs' },
  { id: 'cancelled-jobs', label: 'Cancelled Jobs' },
  { id: 'archived-jobs', label: 'Archived Jobs' },
  { id: 'expired-jobs', label: 'Expired Jobs' },
];

interface ActivityLayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const ActivityLayout = ({ children, currentView, onViewChange }: ActivityLayoutProps) => {
  // Determine initial mode based on currentView
  const [mode, setMode] = useState<'overview' | 'hiring' | 'working' | 'global'>(() => {
    if (OVERVIEW_VIEWS.some(v => v.id === currentView)) return 'overview';
    if (WORKING_VIEWS.some(v => v.id === currentView)) return 'working';
    if (GLOBAL_VIEWS.some(v => v.id === currentView)) return 'global';
    return 'hiring';
  });

  // Keep mode in sync if URL changes externally
  useEffect(() => {
    if (OVERVIEW_VIEWS.some(v => v.id === currentView)) setMode('overview');
    else if (WORKING_VIEWS.some(v => v.id === currentView)) setMode('working');
    else if (GLOBAL_VIEWS.some(v => v.id === currentView)) setMode('global');
    else setMode('hiring');
  }, [currentView]);

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'overview' | 'hiring' | 'working' | 'global' | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode);
      // Navigate to the first item of the selected mode
      if (newMode === 'overview') onViewChange(OVERVIEW_VIEWS[0].id);
      else if (newMode === 'hiring') onViewChange(HIRING_VIEWS[0].id);
      else if (newMode === 'working') onViewChange(WORKING_VIEWS[0].id);
      else if (newMode === 'global') onViewChange(GLOBAL_VIEWS[0].id);
    }
  };

  const currentTabs = mode === 'overview' ? OVERVIEW_VIEWS : mode === 'hiring' ? HIRING_VIEWS : mode === 'working' ? WORKING_VIEWS : GLOBAL_VIEWS;

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: '#f4f6f8', pb: 8 }}>
      {/* Top Banner & Toggle */}
      <Box sx={{ 
        pt: { xs: 4, md: 6 }, 
        pb: 5, 
        px: { xs: 2, md: 4 },
        background: mode === 'overview'
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' // Dark Slate
          : mode === 'hiring' 
          ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' // Indigo to Purple
          : mode === 'working' 
          ? 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)' // Light Blue to Teal
          : 'linear-gradient(135deg, #475569 0%, #1e293b 100%)', // Slate
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderBottomLeftRadius: { xs: 0, md: 32 },
        borderBottomRightRadius: { xs: 0, md: 32 },
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.5s ease'
      }}>
        {/* Decorative Shapes */}
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(40px)', transition: 'all 0.5s ease' }} />
        <Box sx={{ position: 'absolute', bottom: -50, left: 100, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)', transition: 'all 0.5s ease' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h3" fontWeight="900" sx={{ mb: 4, letterSpacing: '-1px' }}>
            Activity Dashboard
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', px: { xs: 1, sm: 2 }, width: '100%' }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="dashboard mode"
            sx={{
              bgcolor: 'rgba(255,255,255,0.08)',
              p: 0.75,
              borderRadius: '24px',
              display: 'flex',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              justifyContent: 'center',
              gap: { xs: 0.5, md: 1.5 },
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '20px !important',
                px: { xs: 2, sm: 3 },
                py: { xs: 0.5, sm: 1 },
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: { xs: '0.85rem', sm: '1.05rem' },
                display: 'flex',
                gap: { xs: 0.5, sm: 1.5 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                },
                '&.Mui-selected': {
                  bgcolor: '#ffffff',
                  color: mode === 'overview' ? '#1e293b' : mode === 'hiring' ? '#6d28d9' : mode === 'working' ? '#0f766e' : '#334155',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: '#ffffff',
                  }
                }
              }
            }}
          >
            <ToggleButton value="overview" aria-label="overview">
              <DashboardIcon /> Dashboard
            </ToggleButton>
            <ToggleButton value="hiring" aria-label="hiring">
              <WorkIcon /> I'm Hiring
            </ToggleButton>
            <ToggleButton value="working" aria-label="working">
              <StorefrontIcon /> I'm Working
            </ToggleButton>
            <ToggleButton value="global" aria-label="global">
              <MoreHorizIcon /> More
            </ToggleButton>
          </ToggleButtonGroup>
          </Box>
        </Container>
      </Box>

      {/* Navigation Pills */}
      <Container maxWidth="xl" sx={{ mt: -3, mb: 4, position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 4, 
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          px: { xs: 0, sm: 2 },
          pt: 1,
          pb: 0,
          border: '1px solid #f0f0f0',
          width: '100%',
          overflow: 'hidden'
        }}>
          <Tabs
            value={currentView}
            onChange={(_e, newValue) => onViewChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: '60px',
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
                bgcolor: mode === 'overview' ? '#334155' : mode === 'hiring' ? '#7c3aed' : mode === 'working' ? '#0d9488' : '#475569',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                minWidth: 'auto',
                px: { xs: 2, md: 4 },
                color: '#64748b',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: mode === 'overview' ? '#0f172a' : mode === 'hiring' ? '#7c3aed' : mode === 'working' ? '#0d9488' : '#475569',
                },
                '&:hover': {
                  color: '#0f172a',
                  bgcolor: 'rgba(0,0,0,0.02)'
                }
              }
            }}
          >
            {currentTabs.map(tab => (
              <Tab key={tab.id} label={tab.label} value={tab.id} disableRipple />
            ))}
          </Tabs>
        </Box>
      </Container>

      {/* Main Content View */}
      <Container maxWidth="xl">
        <Box sx={{ 
          animation: 'fadeIn 0.4s ease-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default ActivityLayout;
