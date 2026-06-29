import { useTheme, useMediaQuery } from '@mui/material';
import ActivityLayout from './activity/ActivityLayout';
import DashboardView from './activity/DashboardView';
import ReceivedOffersView from './activity/ReceivedOffersView';
import SentOffersView from './activity/SentOffersView';
import SavedJobsView from './activity/SavedJobsView';
import PostedJobsView from './activity/PostedJobsView';
import UpcomingJobsView from './activity/UpcomingJobsView';
import CompletedJobsView from './activity/CompletedJobsView';
import SeekerAssignedJobsView from './activity/SeekerAssignedJobsView';
import SeekerOngoingJobsView from './activity/SeekerOngoingJobsView';
import ProviderOngoingJobsView from './activity/ProviderOngoingJobsView';
import RejectedOffersView from './activity/RejectedOffersView';
import ArchivedJobsView from './activity/ArchivedJobsView';
import CancelledJobsView from './activity/CancelledJobsView';
import ExpiredJobsView from './activity/ExpiredJobsView';
import MyGigsView from './activity/MyGigsView';

import { useSearchParams } from 'react-router-dom';

const ActivityPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || (isMobile ? 'dashboard' : 'received-offers');

  const handleViewChange = (newView: string) => {
    setSearchParams({ view: newView });
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'received-offers':
        return <ReceivedOffersView />;
      case 'rejected-offers':
        return <RejectedOffersView />;
      case 'sent-offers':
        return <SentOffersView />;
      case 'saved-jobs':
        return <SavedJobsView />;
      case 'posted-jobs':
        return <PostedJobsView />;
      case 'upcoming-jobs':
        return <UpcomingJobsView />;
      case 'completed-jobs':
        return <CompletedJobsView role="provider" />;
      case 'seeker-completed-jobs':
        return <CompletedJobsView role="seeker" />;
      case 'assigned-jobs':
        return <SeekerAssignedJobsView />;
      case 'seeker-ongoing':
        return <SeekerOngoingJobsView />;
      case 'provider-ongoing':
        return <ProviderOngoingJobsView />;
      case 'archived-jobs':
        return <ArchivedJobsView />;
      case 'cancelled-jobs':
        return <CancelledJobsView />;
      case 'expired-jobs':
        return <ExpiredJobsView />;
      case 'my-gigs':
        return <MyGigsView />;
      default:
        return <ReceivedOffersView />;
    }
  };

  return (
    <ActivityLayout currentView={currentView} onViewChange={handleViewChange}>
      {renderView()}
    </ActivityLayout>
  );
};

export default ActivityPage;
