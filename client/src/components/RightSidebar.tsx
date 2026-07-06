import { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
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
      <Card sx={{ 
        borderRadius: 4, 
        bgcolor: '#ffffff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)', 
        border: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2.5, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight="900" sx={{ letterSpacing: '-0.3px', color: 'white' }}>
            Recommended Jobs
          </Typography>
        </Box>
        <CardContent sx={{ p: 2, pt: 1 }}>
          
          {recommendedJobs.filter((job: any) => !user || job.seekerId?._id !== user._id).length > 0 ? (
            recommendedJobs
              .filter((job: any) => !user || job.seekerId?._id !== user._id)
              .slice(0, 5)
              .map((job) => (
              <Box key={job._id} sx={{ 
                mb: 0.5, 
                p: 1.5, 
                borderRadius: 2.5, 
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#f8fafc', transform: 'translateX(4px)' } 
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
                  <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#0f172a', '&:hover': { color: '#6366f1' } }}>
                      {job.title}
                    </Typography>
                  </Link>
                  <Chip label={job.category} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontWeight: 700, borderRadius: 1.5 }} />
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, lineHeight: 1.4, color: '#64748b' }}>
                  {job.description.substring(0, 60)}...
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={`$${job.originalPay}`} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 800, borderRadius: 1.5 }} />
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                    {job.type === 'hourly' ? 'Hourly' : 'Fixed'}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#94a3b8', p: 1 }}>No recommended jobs.</Typography>
          )}

          <Box sx={{ mt: 2, textAlign: 'center', p: 1 }}>
            <Link to="#" style={{ fontSize: '0.85rem', color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>
              View All Recommended Jobs
            </Link>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card sx={{ 
        borderRadius: 4, 
        bgcolor: '#ffffff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)', 
        border: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2.5, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight="900" sx={{ letterSpacing: '-0.3px', color: 'white' }}>
            Recent Jobs
          </Typography>
        </Box>
        <CardContent sx={{ p: 2, pt: 1 }}>

          {recentJobs.filter((job: any) => !user || job.seekerId?._id !== user._id).length > 0 ? (
            recentJobs
              .filter((job: any) => !user || job.seekerId?._id !== user._id)
              .slice(0, 5)
              .map((job) => (
              <Box key={job._id} sx={{ 
                mb: 0.5, 
                p: 1.5, 
                borderRadius: 2.5, 
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#f8fafc', transform: 'translateX(4px)' } 
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
                  <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#0f172a', '&:hover': { color: '#6366f1' } }}>
                      {job.title}
                    </Typography>
                  </Link>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                    {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, lineHeight: 1.4, color: '#64748b' }}>
                  {job.description.substring(0, 50)}...
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={`$${job.originalPay}`} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 800, borderRadius: 1.5 }} />
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                    {job.type === 'hourly' ? 'Hourly' : 'Fixed'}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
             <Typography variant="body2" sx={{ color: '#94a3b8', p: 1 }}>No recent jobs.</Typography>
          )}

           <Box sx={{ mt: 2, textAlign: 'center', p: 1 }}>
            <Link to="#" style={{ fontSize: '0.85rem', color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>
              View All Recent Jobs
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RightSidebar;
