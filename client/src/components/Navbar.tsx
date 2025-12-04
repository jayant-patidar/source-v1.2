import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, Menu, MenuItem, InputBase } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NotificationMenu from './NotificationMenu';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#000000', borderBottom: '1px solid #333' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{ 
              mr: 4, 
              textDecoration: 'none', 
              color: 'white', 
              fontWeight: 900, 
              letterSpacing: '-0.5px',
              fontSize: '1.8rem',
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1
            }}
          >
            SOURCE
            <Typography variant="caption" sx={{ fontSize: '0.5rem', letterSpacing: '1px', color: '#888', textTransform: 'uppercase' }}>
              For the People, By the People
            </Typography>
          </Typography>

          {/* Search Bar */}
          <Box sx={{ 
            flexGrow: 1, 
            maxWidth: 600, 
            bgcolor: 'white', 
            borderRadius: 1, 
            display: 'flex', 
            alignItems: 'center',
            px: 2,
            py: 0.5,
            mr: 4
          }}>
            <InputBase
              placeholder="Search"
              fullWidth
              sx={{ fontSize: '0.95rem' }}
            />
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            <Box component={RouterLink} to="/" sx={{ width: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', textDecoration: 'none', opacity: 0.7, '&:hover': { opacity: 1 } }}>
              <HomeIcon sx={{ fontSize: 28 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5, fontWeight: 500 }}>HOME</Typography>
            </Box>
            
            <Box component={RouterLink} to="/" sx={{ width: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', textDecoration: 'none', opacity: 0.7, '&:hover': { opacity: 1 } }}>
              <WorkIcon sx={{ fontSize: 28 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5, fontWeight: 500 }}>JOBS</Typography>
            </Box>

            <Box component={RouterLink} to="/activity" sx={{ width: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', textDecoration: 'none', opacity: 0.7, '&:hover': { opacity: 1 } }}>
              <MessageIcon sx={{ fontSize: 28 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5, fontWeight: 500 }}>ACTIVITY</Typography>
            </Box>

            <Box sx={{ width: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}>
               <NotificationMenu />
               <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5, fontWeight: 500 }}>ALERTS</Typography>
            </Box>
            
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 4, cursor: 'pointer' }} onClick={handleMenu}>
                <Avatar src={user.avatar} alt={user.name} sx={{ width: 44, height: 44, border: '2px solid white' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <ArrowDropDownIcon sx={{ color: 'white' }} />
              </Box>
            ) : (
              <Button component={RouterLink} to="/login" variant="contained" sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#f0f0f0' }, ml: 2 }}>
                Login
              </Button>
            )}

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>Profile</MenuItem>
              <MenuItem component={RouterLink} to="/post-job" onClick={handleClose}>Post a Job</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
