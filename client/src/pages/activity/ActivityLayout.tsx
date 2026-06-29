import { Box, Container, useTheme, useMediaQuery, IconButton, Drawer, Typography } from '@mui/material';
import { useState } from 'react';
import type { ReactNode } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ActivitySidebar from './ActivitySidebar';

interface ActivityLayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const ActivityLayout = ({ children, currentView, onViewChange }: ActivityLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleViewChange = (view: string) => {
    onViewChange(view);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getViewName = (viewId: string) => {
    const views: Record<string, string> = {
      'dashboard': 'Dashboard',
      'received-offers': 'Received Offers',
      'rejected-offers': 'Rejected Offers',
      'posted-jobs': 'Jobs I Posted',
      'seeker-ongoing': 'Ongoing Jobs (Seeker)',
      'seeker-completed-jobs': 'Completed Jobs (Seeker)',
      'my-gigs': 'My Gigs',
      'sent-offers': 'Sent Offers',
      'upcoming-jobs': 'Upcoming Jobs',
      'provider-ongoing': 'Ongoing Jobs (Provider)',
      'completed-jobs': 'Completed Jobs (Provider)',
      'saved-jobs': 'Saved Jobs',
      'cancelled-jobs': 'Cancelled Jobs',
      'archived-jobs': 'Archived Jobs',
      'expired-jobs': 'Expired Jobs',
    };
    return views[viewId] || 'Activity Menu';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8, px: { xs: 0, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '80vh', bgcolor: '#f9fafb', borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
        
        {/* Mobile Menu Button - Moved to a header block within the layout */}
        {isMobile && (
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="bold">{getViewName(currentView)}</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {/* Sidebar - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <ActivitySidebar currentView={currentView} onViewChange={handleViewChange} />
          </Box>

        {/* Sidebar - Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          <ActivitySidebar currentView={currentView} onViewChange={handleViewChange} />
        </Drawer>

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { md: `calc(100% - 280px)` } }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ActivityLayout;
