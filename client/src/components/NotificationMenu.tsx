import { useState, useEffect } from 'react';
import { Badge, Menu, Typography, Box, Divider, List, ListItemButton, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Notification {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  type: string;
  message: string;
  job: {
    _id: string;
    title: string;
  };
  isRead: boolean;
  createdAt: string;
}

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    // Optional: Poll for notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await api.put(`/notifications/${notification._id}/read`);
        // Update local state
        setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      handleClose();
      
      // Navigate based on notification type
      if (notification.job) {
          navigate(`/jobs/${notification.job._id}`);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleMarkAllRead = async () => {
      try {
          await api.put('/notifications/read-all');
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          setUnreadCount(0);
      } catch (error) {
          console.error('Error marking all read:', error);
      }
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ 
              width: 85, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', 
              color: 'white', borderRadius: 3, opacity: 0.7, cursor: 'pointer',
              transition: 'all 0.2s', '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.05)' } 
       }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ fontSize: 26, mb: 0.5 }} />
        </Badge>
        <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px' }}>ALERTS</Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 480 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">Notifications</Typography>
            {unreadCount > 0 && (
                <Typography 
                    variant="caption" 
                    color="primary" 
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={handleMarkAllRead}
                >
                    Mark all read
                </Typography>
            )}
        </Box>
        <Divider />
        {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No notifications</Typography>
            </Box>
        ) : (
            <List sx={{ p: 0 }}>
                {notifications.map((notification) => (
                    <div key={notification._id}>
                        <ListItemButton 
                            alignItems="flex-start" 
                            onClick={() => handleNotificationClick(notification)}
                            sx={{ bgcolor: notification.isRead ? 'transparent' : 'action.hover' }}
                        >
                            <ListItemAvatar>
                                <Avatar src={notification.sender?.avatar} alt={notification.sender?.name}>
                                    {notification.sender?.name?.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" fontWeight={notification.isRead ? 'normal' : 'bold'}>
                                        {notification.message}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDistanceToNow(new Date(notification.createdAt))} ago
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                        <Divider component="li" />
                    </div>
                ))}
            </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
