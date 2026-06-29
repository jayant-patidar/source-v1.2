import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, CircularProgress, Divider, Avatar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { jobService } from '../../services/job.service';
import { offerService } from '../../services/offer.service';
import { reviewService } from '../../services/review.service';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const DashboardView = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        totalSpent: 0,
        activeJobs: 0,
        completedJobs: 0,
    });
    
    const [statusData, setStatusData] = useState<any[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [reviewData, setReviewData] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Fetch all relevant data
                const [postedJobs, workedJobs, receivedOffers,, userReviews] = await Promise.all([
                    jobService.getPostedJobs(),
                    jobService.getWorkedJobs(),
                    offerService.getReceivedOffers(),
                    offerService.getSentOffers(),
                    user ? reviewService.getUserReviews(user._id) : Promise.resolve([])
                ]);

                // Calculate KPI Stats
                let earnings = 0;
                let spent = 0;
                let active = 0;
                let completed = 0;

                const allJobs = [...postedJobs, ...workedJobs];
                const statusCounts: Record<string, number> = {};

                // Process Worked Jobs (Earnings)
                workedJobs.forEach((job: any) => {
                    if (job.status === 'completed' || job.status === 'paid') {
                        earnings += (job.currentPay || job.originalPay);
                        completed++;
                    } else if (['accepted', 'started', 'in_progress', 'pending_completion'].includes(job.status)) {
                        active++;
                    }
                });

                // Process Posted Jobs (Spent)
                postedJobs.forEach((job: any) => {
                    if (job.status === 'completed' || job.status === 'paid') {
                        spent += (job.currentPay || job.originalPay);
                        completed++;
                    } else if (['accepted', 'started', 'in_progress', 'pending_completion'].includes(job.status)) {
                        active++;
                    }
                });

                setStats({
                    totalEarnings: earnings,
                    totalSpent: spent,
                    activeJobs: active,
                    completedJobs: completed
                });

                // Prepare Status Data for Pie Chart
                allJobs.forEach((job: any) => {
                    statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
                });
                const pieData = Object.keys(statusCounts).map(key => ({
                    name: key.toUpperCase().replace('_', ' '),
                    value: statusCounts[key]
                }));
                setStatusData(pieData);

                // Prepare Monthly Data for Bar Chart
                const monthlyCounts: Record<string, { name: string; jobs: number }> = {};
                
                // Initialize last 6 months
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const monthName = format(d, 'MMM yyyy');
                    monthlyCounts[monthName] = { name: monthName, jobs: 0 };
                }

                allJobs.forEach((job: any) => {
                    const monthName = format(new Date(job.createdAt), 'MMM yyyy');
                    if (monthlyCounts[monthName]) {
                        monthlyCounts[monthName].jobs++;
                    }
                });
                
                setMonthlyData(Object.values(monthlyCounts));

                // Recent Activity (combine newest jobs and offers)
                const activities = [
                    ...allJobs.map(j => ({ ...j, type: 'job', date: new Date(j.createdAt) })),
                    ...receivedOffers.map((o: any) => ({ ...o, type: 'offer_received', date: new Date(o.createdAt) }))
                ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

                setRecentActivity(activities);

                // Prepare Review Data
                const ratingsCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                userReviews.forEach((review: any) => {
                    if (ratingsCount[review.rating] !== undefined) {
                        ratingsCount[review.rating]++;
                    }
                });
                const reviewChartData = [
                    { rating: '5 Stars', count: ratingsCount[5] },
                    { rating: '4 Stars', count: ratingsCount[4] },
                    { rating: '3 Stars', count: ratingsCount[3] },
                    { rating: '2 Stars', count: ratingsCount[2] },
                    { rating: '1 Star', count: ratingsCount[1] },
                ];
                setReviewData(reviewChartData);

            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Dashboard Overview</Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
                Your performance and activity at a glance.
            </Typography>

            {/* KPI Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, bgcolor: '#f0fdf4' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Total Earnings</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">${stats.totalEarnings}</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#dcfce7', color: '#166534' }}>
                                    <AttachMoneyIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, bgcolor: '#fff1f2' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Total Spent</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="error.main">${stats.totalSpent}</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#ffe4e6', color: '#9f1239' }}>
                                    <AttachMoneyIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, bgcolor: '#eff6ff' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Active Jobs</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">{stats.activeJobs}</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#dbeafe', color: '#1e40af' }}>
                                    <PendingActionsIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, bgcolor: '#f5f3ff' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Completed Jobs</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="secondary.main">{stats.completedJobs}</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#ede9fe', color: '#5b21b6' }}>
                                    <CheckCircleIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Area */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" mb={3}>Activity Over Time (Last 6 Months)</Typography>
                        <Box height={300}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#f5f5f5'}} />
                                    <Legend />
                                    <Bar dataKey="jobs" name="Total Jobs" fill="#1976d2" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" mb={3}>Job Status Breakdown</Typography>
                        {statusData.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                                <Typography color="text.secondary">No data available.</Typography>
                            </Box>
                        ) : (
                            <Box height={300}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Reviews & Feedback Chart */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" mb={3}>Ratings & Feedback Overview</Typography>
                        <Box height={300}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reviewData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                                    <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
                                    <YAxis dataKey="rating" type="category" axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#f5f5f5'}} />
                                    <Legend />
                                    <Bar dataKey="count" name="Number of Reviews" fill="#ffc658" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Recent Activity Feed */}
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Recent Activity Feed</Typography>
                <Divider sx={{ mb: 2 }} />
                {recentActivity.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={3}>No recent activity found.</Typography>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {recentActivity.map((activity, index) => (
                            <Box key={index} display="flex" alignItems="center" p={2} bgcolor="#f9fafb" borderRadius={2} border="1px solid #f0f0f0">
                                <Avatar sx={{ bgcolor: activity.type === 'offer_received' ? 'warning.light' : 'primary.light', mr: 2 }}>
                                    {activity.type === 'offer_received' ? <AttachMoneyIcon /> : <WorkIcon />}
                                </Avatar>
                                <Box flex={1}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {activity.type === 'offer_received' 
                                            ? `New offer received for job "${activity.job?.title || 'Unknown'}"`
                                            : `Job "${activity.title}" was created/updated.`}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {format(activity.date, 'PPP p')}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default DashboardView;
