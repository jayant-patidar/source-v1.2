import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ActivityLayout from './activity/ActivityLayout';
import ReceivedOffersView from './activity/ReceivedOffersView';
import SentOffersView from './activity/SentOffersView';
import SavedJobsView from './activity/SavedJobsView';
import PostedJobsView from './activity/PostedJobsView';
import UpcomingJobsView from './activity/UpcomingJobsView';
import CompletedJobsView from './activity/CompletedJobsView';
import SeekerAssignedJobsView from './activity/SeekerAssignedJobsView';
import SeekerOngoingJobsView from './activity/SeekerOngoingJobsView';

const ActivityPage = () => {
  const [currentView, setCurrentView] = useState('received-offers');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" color="text.secondary">Dashboard Overview</Typography>
                <Typography variant="body2" color="text.secondary">Summary stats coming soon...</Typography>
            </Box>
        );
      case 'received-offers':
        return <ReceivedOffersView />;
      case 'sent-offers':
        return <SentOffersView />;
      case 'saved-jobs':
        return <SavedJobsView />;
      case 'posted-jobs':
        return <PostedJobsView />;
      case 'upcoming-jobs':
        return <UpcomingJobsView />;
      case 'completed-jobs':
        return <CompletedJobsView />;
      case 'assigned-jobs':
        return <SeekerAssignedJobsView />;
      case 'ongoing-jobs':
        return <SeekerOngoingJobsView />;
      default:
        return <ReceivedOffersView />;
    }
  };

  return (
    <ActivityLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </ActivityLayout>
  );
};

export default ActivityPage;
