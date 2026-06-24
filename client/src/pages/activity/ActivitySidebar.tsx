import { 
  Box, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoopIcon from '@mui/icons-material/Loop';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import SendIcon from '@mui/icons-material/Send';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BlockIcon from '@mui/icons-material/Block';
import ArchiveIcon from '@mui/icons-material/Archive';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import WorkIcon from '@mui/icons-material/Work';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useState } from 'react';

interface ActivitySidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const ActivitySidebar = ({ currentView, onViewChange }: ActivitySidebarProps) => {
  
  const menuGroups = [
    {
      title: 'Overview',
      type: 'static',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      ]
    },
    {
      title: 'My Requests (Seeker)',
      type: 'accordion',
      items: [
        { id: 'received-offers', label: 'Received Offers', icon: <CallReceivedIcon /> },
        { id: 'rejected-offers', label: 'Rejected Offers', icon: <BlockIcon /> },
        { id: 'posted-jobs', label: 'Jobs I Posted', icon: <WorkIcon /> },
        { id: 'seeker-ongoing', label: 'Ongoing Jobs', icon: <LoopIcon /> },
        { id: 'seeker-completed-jobs', label: 'Completed Jobs', icon: <CheckCircleIcon /> },
      ]
    },
    {
      title: 'My Work (Provider)',
      type: 'accordion',
      items: [
        { id: 'my-gigs', label: 'My Gigs', icon: <StorefrontIcon /> },
        { id: 'sent-offers', label: 'Sent Offers', icon: <SendIcon /> },
        { id: 'upcoming-jobs', label: 'Upcoming Jobs', icon: <CalendarTodayIcon /> },
        { id: 'provider-ongoing', label: 'Ongoing Jobs', icon: <LoopIcon /> },
        { id: 'completed-jobs', label: 'Completed Jobs', icon: <CheckCircleIcon /> },
      ]
    },
    {
      title: 'Saved',
      type: 'static',
      items: [
        { id: 'saved-jobs', label: 'Saved Jobs', icon: <BookmarkIcon /> },
      ]
    },
    {
      title: 'History',
      type: 'accordion',
      items: [
        { id: 'cancelled-jobs', label: 'Cancelled Jobs', icon: <CancelIcon /> },
        { id: 'archived-jobs', label: 'Archived Jobs', icon: <ArchiveIcon /> },
        { id: 'expired-jobs', label: 'Expired Jobs', icon: <TimerOffIcon /> },
      ]
    }
  ];

  const [expanded, setExpanded] = useState<string | false>(() => {
    // Find the group that contains the current view
    const activeGroup = menuGroups.find(group => 
      group.items.some(item => item.id === currentView)
    );
    // If found and it's an accordion, return title. Otherwise default to Seeker or false.
    if (activeGroup && activeGroup.type === 'accordion') {
      return activeGroup.title;
    }
    // Fallback: if user is on a static page defined above, we might want to close accordions or keep default
    // If strict default is needed:
    return 'My Requests (Seeker)'; 
  });

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

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
          <Box key={index} sx={{ mb: 1 }}>
            {group.type === 'static' ? (
              <>
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
                <Divider sx={{ my: 1, mx: 3 }} />
              </>
            ) : (
              <Accordion 
                disableGutters 
                elevation={0} 
                expanded={expanded === group.title} 
                onChange={handleChange(group.title)}
                sx={{ 
                  '&:before': { display: 'none' },
                  borderBottom: '1px solid #f0f0f0' 
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />}
                  sx={{ 
                    px: 3, 
                    minHeight: 40, 
                    '& .MuiAccordionSummary-content': { margin: '8px 0' },
                    bgcolor: expanded === group.title ? '#fafafa' : 'transparent'
                  }}
                >
                   <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      fontSize: '0.7rem'
                    }}
                  >
                    {group.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pb: 1 }}>
                  <List disablePadding>
                    {group.items.map((item) => (
                      <ListItemButton
                        key={item.id}
                        selected={currentView === item.id}
                        onClick={() => onViewChange(item.id)}
                        sx={{
                          pl: 4, 
                          pr: 3,
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
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ActivitySidebar;
