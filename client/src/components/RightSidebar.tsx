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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>
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
                mb: 1, 
                p: 1.5, 
                borderRadius: 3, 
                transition: 'all 0.2s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.03)', transform: 'translateX(4px)' } 
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
                  <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="subtitle2" fontWeight="800" sx={{ color: 'white', '&:hover': { color: '#818cf8', textDecoration: 'underline' } }}>
                      {job.title}
                    </Typography>
                  </Link>
                  <Chip label={job.category} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700, borderRadius: 1.5 }} />
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, lineHeight: 1.4, color: '#94a3b8' }}>
                  {job.description.substring(0, 60)}...
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={`$${job.originalPay}`} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800, borderRadius: 1.5 }} />
                  <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                    {job.type === 'hourly' ? 'Hourly' : 'Fixed'}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#94a3b8', p: 1 }}>No recommended jobs.</Typography>
          )}

          <Box sx={{ mt: 2, textAlign: 'center', p: 1 }}>
            <Link to="#" style={{ fontSize: '0.85rem', color: '#818cf8', textDecoration: 'none', fontWeight: 700 }}>
              View All Recommended Jobs
            </Link>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card sx={{ 
        borderRadius: 4, 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>
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
                mb: 1, 
                p: 1.5, 
                borderRadius: 3, 
                transition: 'all 0.2s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.03)', transform: 'translateX(4px)' } 
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
                  <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="subtitle2" fontWeight="800" sx={{ color: 'white', '&:hover': { color: '#818cf8', textDecoration: 'underline' } }}>
                      {job.title}
                    </Typography>
                  </Link>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, lineHeight: 1.4, color: '#94a3b8' }}>
                  {job.description.substring(0, 50)}...
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={`$${job.originalPay}`} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800, borderRadius: 1.5 }} />
                  <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                    {job.type === 'hourly' ? 'Hourly' : 'Fixed'}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
             <Typography variant="body2" sx={{ color: '#94a3b8', p: 1 }}>No recent jobs.</Typography>
          )}

           <Box sx={{ mt: 2, textAlign: 'center', p: 1 }}>
            <Link to="#" style={{ fontSize: '0.85rem', color: '#818cf8', textDecoration: 'none', fontWeight: 700 }}>
              View All Recent Jobs
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RightSidebar;
