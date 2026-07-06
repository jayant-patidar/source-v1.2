import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, Menu, MenuItem, InputBase, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationMenu from './NotificationMenu';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { showToast } = useToastStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery('');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    showToast('Logout Successful!', 'success');
    handleClose();
    setMobileOpen(false);
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(12px)'
    }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Toolbar disableGutters sx={{ height: 72, display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            <img
              src="/logo1.png"
              alt="Source"
              style={{ height: 66, objectFit: 'contain' }}
            />
          </Box>

          {/* Search Bar - Glassmorphism */}
          <Box sx={{ 
            flexGrow: 1, 
            maxWidth: { xs: '100%', md: 500 }, 
            bgcolor: 'rgba(255,255,255,0.08)', 
            borderRadius: 3, 
            display: { xs: 'none', sm: 'flex' }, 
            alignItems: 'center',
            px: 2.5,
            py: 0.8,
            mx: { xs: 2, md: 4 },
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            '&:focus-within': {
              bgcolor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(99, 102, 241, 0.5)',
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)'
            }
          }}>
            <SearchIcon sx={{ color: 'rgba(255,255,255,0.6)', mr: 1, cursor: 'pointer' }} onClick={handleSearch} />
            <InputBase
              placeholder="Search services, jobs, or users..."
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              sx={{ 
                fontSize: '0.95rem',
                color: 'white',
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255,255,255,0.5)',
                  opacity: 1
                }
              }}
            />
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: { md: 2, lg: 4 }, alignItems: 'center' }}>
            <Box component={RouterLink} to="/" sx={{ 
              width: 85, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', 
              color: 'white', textDecoration: 'none', borderRadius: 3, opacity: 0.7,
              transition: 'all 0.2s', '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.05)' } 
            }}>
              <HomeIcon sx={{ fontSize: 26, mb: 0.5 }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px' }}>HOME</Typography>
            </Box>
            
            <Box component={RouterLink} to="/wallet" sx={{ 
              width: 85, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', 
              color: 'white', textDecoration: 'none', borderRadius: 3, opacity: 0.7,
              transition: 'all 0.2s', '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.05)' } 
            }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 26, mb: 0.5 }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px' }}>WALLET</Typography>
            </Box>

            <Box component={RouterLink} to="/activity" sx={{ 
              width: 85, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', 
              color: 'white', textDecoration: 'none', borderRadius: 3, opacity: 0.7,
              transition: 'all 0.2s', '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.05)' } 
            }}>
              <MessageIcon sx={{ fontSize: 26, mb: 0.5 }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px' }}>ACTIVITY</Typography>
            </Box>

            <NotificationMenu />
            
            {user ? (
              <Box 
                sx={{ 
                  display: 'flex', alignItems: 'center', ml: 2, p: 0.5, pr: 1.5,
                  borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } 
                }} 
                onClick={handleMenu}
              >
                <Box sx={{ 
                  p: '2px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  mr: 1
                }}>
                  <Avatar src={user.avatar} alt={user.name} sx={{ width: 40, height: 40, border: '2px solid #1e293b' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
                <ArrowDropDownIcon sx={{ color: 'white' }} />
              </Box>
            ) : (
              <Button component={RouterLink} to="/login" variant="contained" sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                color: 'white', fontWeight: 700, borderRadius: 3, ml: 2, px: 3,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)' } 
              }}>
                Login
              </Button>
            )}

            {/* Premium Dropdown Menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.4))',
                  mt: 1.5,
                  bgcolor: '#1e293b',
                  color: 'white',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: 180,
                  '& .MuiMenuItem-root': {
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                    transition: '0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                  },
                },
              }}
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>Profile Settings</MenuItem>
              <MenuItem component={RouterLink} to="/wallet" onClick={handleClose}>My Wallet</MenuItem>
              <MenuItem component={RouterLink} to="/post-job" onClick={handleClose}>Post a Job</MenuItem>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
              <MenuItem onClick={handleLogout} sx={{ color: '#f87171 !important' }}>Log Out</MenuItem>
            </Menu>
          </Box>

          {/* Mobile Menu Icon (Right Aligned) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
            <IconButton color="inherit" onClick={handleMobileToggle} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer 
        anchor="left" 
        open={mobileOpen} 
        onClose={handleMobileToggle} 
        sx={{ 
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            width: 280,
            borderRight: '1px solid rgba(255,255,255,0.05)'
          }
        }}
      >
        <Box sx={{ width: 280 }} role="presentation">
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.2)' }}>
            <img src="/logo1.png" alt="Source" style={{ height: 36, objectFit: 'contain' }} />
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <List sx={{ px: 2, py: 3 }}>
            {[
              { text: 'Home', icon: <HomeIcon />, to: '/' },
              { text: 'Wallet', icon: <AccountBalanceWalletIcon />, to: '/wallet' },
              { text: 'Activity', icon: <MessageIcon />, to: '/activity' }
            ].map((item) => (
              <ListItem 
                key={item.text}
                component={RouterLink} 
                to={item.to} 
                onClick={handleMobileToggle} 
                sx={{ 
                  color: 'white', mb: 1, borderRadius: 3,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />
          
          <List sx={{ px: 2, py: 3 }}>
            {user ? (
              <>
                <ListItem component={RouterLink} to="/profile" onClick={handleMobileToggle} sx={{ color: 'white', mb: 1, borderRadius: 3, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar src={user.avatar} sx={{ width: 28, height: 28, border: '2px solid #6366f1' }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary="Profile Settings" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItem>
                <ListItem component={RouterLink} to="/post-job" onClick={handleMobileToggle} sx={{ color: 'white', mb: 1, borderRadius: 3, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}><WorkIcon /></ListItemIcon>
                  <ListItemText primary="Post a Job" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItem>
                <ListItem onClick={handleLogout} sx={{ color: '#f87171', borderRadius: 3, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' } }}>
                  <ListItemIcon sx={{ color: '#f87171', minWidth: 40 }}><ExitToAppIcon /></ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItem>
              </>
            ) : (
              <ListItem component={RouterLink} to="/login" onClick={handleMobileToggle} sx={{ color: 'white', borderRadius: 3, bgcolor: 'rgba(99, 102, 241, 0.2)', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.4)' } }}>
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}><PersonIcon /></ListItemIcon>
                <ListItemText primary="Login" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
