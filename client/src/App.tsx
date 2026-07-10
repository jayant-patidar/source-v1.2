import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateJob from './pages/CreateJob';
import CreateGig from './pages/CreateGig';
import JobDetails from './pages/JobDetails';
import GigDetails from './pages/GigDetails';
import PaymentPage from './pages/payment/PaymentPage';
import ContractView from './pages/contract/ContractView';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import ActivityPage from './pages/ActivityPage';
import Wallet from './pages/Wallet';
import SearchResults from './pages/SearchResults';
import GlobalToast from './components/GlobalToast';
import ChatWidget from './components/ChatWidget';
import { useAuthStore } from './store/authStore';
import { Box, CircularProgress } from '@mui/material';

function App() {
  const { checkAuth, isCheckingAuth, user } = useAuthStore();
  const location = useLocation();

  const hideChatWidget = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Layout>
      <GlobalToast />
      {!hideChatWidget && <ChatWidget />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/post-job" element={<CreateJob />} />
        <Route path="/create-gig" element={<CreateGig />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/login" />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
        <Route path="/activity" element={user ? <ActivityPage /> : <Navigate to="/login" />} />
        <Route path="/payment/:id" element={user ? <PaymentPage /> : <Navigate to="/login" />} />
        <Route path="/contract/:id" element={user ? <ContractView /> : <Navigate to="/login" />} />
      </Routes>
    </Layout>
  );
}

export default App;
