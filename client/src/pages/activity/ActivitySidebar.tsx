import { 
  Box, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider,
  Paper
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LoopIcon from '@mui/icons-material/Loop';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import SendIcon from '@mui/icons-material/Send';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WorkIcon from '@mui/icons-material/Work';

interface ActivitySidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const ActivitySidebar = ({ currentView, onViewChange }: ActivitySidebarProps) => {
  
  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      ]
    },
    {
      title: 'My Requests (Seeker)',
      items: [
        { id: 'received-offers', label: 'Received Offers', icon: <CallReceivedIcon /> },
        { id: 'posted-jobs', label: 'Posted Jobs', icon: <WorkIcon /> },
        { id: 'assigned-jobs', label: 'Assigned Jobs', icon: <AssignmentIndIcon /> },
        { id: 'ongoing-jobs', label: 'Ongoing Jobs', icon: <LoopIcon /> },
      ]
    },
    {
      title: 'My Work (Provider)',
      items: [
        { id: 'sent-offers', label: 'Sent Offers', icon: <SendIcon /> },
        { id: 'upcoming-jobs', label: 'Upcoming Jobs', icon: <CalendarTodayIcon /> },
        { id: 'completed-jobs', label: 'Completed Jobs', icon: <CheckCircleIcon /> },
      ]
    },
    {
      title: 'Saved',
      items: [
        { id: 'saved-jobs', label: 'Saved Jobs', icon: <BookmarkIcon /> },
      ]
    }
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: 280, 
        flexShrink: 0, 
        borderRight: '1px solid #e0e0e0',
        height: '100%',
        bgcolor: '#fff',
        borderRadius: 0
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold">Activity</Typography>
        <Typography variant="caption" color="text.secondary">Manage your interactions</Typography>
      </Box>
      
      <Box sx={{ overflow: 'auto' }}>
        {menuGroups.map((group, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                px: 3, 
                py: 1, 
                display: 'block', 
                fontWeight: 'bold', 
                color: 'text.secondary',
                textTransform: 'uppercase',
                fontSize: '0.7rem'
              }}
            >
              {group.title}
            </Typography>
            <List disablePadding>
              {group.items.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={currentView === item.id}
                  onClick={() => onViewChange(item.id)}
                  sx={{
                    px: 3,
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      borderRight: '3px solid',
                      borderColor: 'primary.main',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                      '&:hover': {
                        bgcolor: 'primary.light',
                      }
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem', 
                      fontWeight: currentView === item.id ? 600 : 400 
                    }} 
                  />
                </ListItemButton>
              ))}
            </List>
            {index < menuGroups.length - 1 && <Divider sx={{ my: 1, mx: 3 }} />}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ActivitySidebar;
