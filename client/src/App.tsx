import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateJob from './pages/CreateJob';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import { useAuthStore } from './store/authStore';
import { Box, CircularProgress } from '@mui/material';

import PublicProfile from './pages/PublicProfile';

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-job" element={<CreateJob />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
      </Routes>
    </Layout>
  );
}

export default App;
