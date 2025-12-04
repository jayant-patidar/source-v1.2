import { useState, useEffect } from 'react';
import { Badge, Menu, Typography, Box, Divider, List, ListItemButton, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', { withCredentials: true });
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Poll for notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await axios.put(`http://localhost:5000/api/notifications/${notification._id}/read`, {}, { withCredentials: true });
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
          await axios.put('http://localhost:5000/api/notifications/read-all', {}, { withCredentials: true });
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          setUnreadCount(0);
      } catch (error) {
          console.error('Error marking all read:', error);
      }
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ cursor: 'pointer', display: 'flex' }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
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
