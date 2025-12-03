import { Box, Container, useTheme, useMediaQuery, IconButton, Drawer } from '@mui/material';
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8, px: { xs: 0, md: 3 } }}>
      <Box sx={{ display: 'flex', minHeight: '80vh', bgcolor: '#f9fafb', borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ position: 'absolute', top: 80, left: 16, zIndex: 1200, bgcolor: 'white', boxShadow: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

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
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - 280px)` } }}>
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default ActivityLayout;
