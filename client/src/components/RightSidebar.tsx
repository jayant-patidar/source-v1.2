import { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Divider, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import { useAuthStore } from '../store/authStore';

const RightSidebar = () => {
  const { recentJobs, recommendedJobs, fetchRecentJobs, fetchRecommendedJobs } = useJobStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchRecentJobs();
    fetchRecommendedJobs();
  }, [fetchRecentJobs, fetchRecommendedJobs]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Recommended Jobs */}
      <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recommended Jobs
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          {recommendedJobs.filter((job: any) => !user || job.seekerId?._id !== user._id).length > 0 ? (
            recommendedJobs
              .filter((job: any) => !user || job.seekerId?._id !== user._id)
              .slice(0, 5)
              .map((job) => (
              <Box key={job._id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                      {job.title}
                    </Typography>
                  </Link>
                  <Chip label={job.category} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#e8eaf6', color: '#3f51b5', fontWeight: 'bold' }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, lineHeight: 1.4 }}>
                  {job.description.substring(0, 60)}...
                </Typography>
                <Typography variant="caption" fontWeight="500" color="text.primary">
                  Pay: ${job.originalPay} • {job.type === 'hourly' ? 'Hourly' : 'One-Time'}
                </Typography>
                <Divider sx={{ mt: 2, mb: 0 }} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">No recommended jobs.</Typography>
          )}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="#" style={{ fontSize: '0.875rem', color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
              View All Recommended Jobs
            </Link>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recent Jobs
          </Typography>
          <Divider sx={{ my: 2 }} />

          {recentJobs.filter((job: any) => !user || job.seekerId?._id !== user._id).length > 0 ? (
            recentJobs
              .filter((job: any) => !user || job.seekerId?._id !== user._id)
              .slice(0, 5)
              .map((job) => (
              <Box key={job._id} sx={{ mb: 2 }}>
                <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                      {job.title}
                    </Typography>
                </Link>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                   {new Date(job.createdAt).toLocaleDateString()}
                </Typography>
                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, lineHeight: 1.4 }}>
                  {job.description.substring(0, 50)}...
                </Typography>
                <Typography variant="caption" fontWeight="500">
                  Pay: ${job.originalPay} : {job.type}
                </Typography>
                <Divider sx={{ mt: 2, mb: 0 }} />
              </Box>
            ))
          ) : (
             <Typography variant="body2" color="text.secondary">No recent jobs.</Typography>
          )}

           <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="#" style={{ fontSize: '0.875rem', color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
              View All Recent Jobs
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RightSidebar;
