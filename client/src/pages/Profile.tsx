import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Paper, Avatar, TextField, Button, Grid, Chip, MenuItem, Alert, CircularProgress, IconButton, Divider, Tabs, Tab, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import WorkIcon from '@mui/icons-material/Work';
import LockIcon from '@mui/icons-material/Lock';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ReplyIcon from '@mui/icons-material/Reply';
import MenuIcon from '@mui/icons-material/Menu';
import { Rating } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

import TrustBadge from '../components/TrustBadge';

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

import { useAutoDismiss } from '../hooks/useAutoDismiss';

const Profile = () => {
  const { user: authUser } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useAutoDismiss('');
  const [error, setError] = useAutoDismiss('');
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState({
    personal: false,
    skills: false,
    portfolio: false,
    social: false,
    security: false
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleProfileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);
  const tabNames = [
    "Personal Info", 
    "Skills & Preferences", 
    "Portfolio", 
    "Contact & Social", 
    "Security", 
    "My Activity", 
    "Reviews"
  ];

  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    address: { unit: '', street: '', city: '', province: '', postalCode: '', county: '' },
    DOB: '',
    about: '',
    providerProfile: { skills: [], serviceCategories: [], availability: '' },
    seekerProfile: { requestCategories: [] },
    portfolio: [],
    socialLinks: {
      linkedin: '',
      github: '',
      website: ''
    }
  });
  const [skillInput, setSkillInput] = useState('');
  const [jobTypeInput, setJobTypeInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [portfolioInput, setPortfolioInput] = useState({ title: '', link: '', description: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [workedJobs, setWorkedJobs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({}); // Map review ID to reply text

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/profile');
      setProfileData(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: { 
          unit: data.address?.unit || '', 
          street: data.address?.street || '', 
          city: data.address?.city || '', 
          province: data.address?.province || '', 
          postalCode: data.address?.postalCode || '', 
          county: data.address?.county || '' 
        },
        DOB: data.DOB ? format(new Date(data.DOB), 'yyyy-MM-dd') : '',
        about: data.about || '',
        providerProfile: {
          skills: data.providerProfile?.skills || [],
          serviceCategories: data.providerProfile?.serviceCategories || [],
          availability: data.providerProfile?.availability || ''
        },
        seekerProfile: {
          requestCategories: data.seekerProfile?.requestCategories || []
        },
        portfolio: data.portfolio || [],
        socialLinks: {
          linkedin: data.socialLinks?.linkedin || '',
          github: data.socialLinks?.github || '',
          website: data.socialLinks?.website || ''
        }
      });

      // Fetch Activity Data
      const postedRes = await api.get('/jobs/posted');
      setPostedJobs(postedRes.data);

      const offersRes = await api.get('/negotiations/my-offers');
      setMyOffers(offersRes.data);

      const workedRes = await api.get('/jobs/worked');
      setWorkedJobs(workedRes.data);

      const reviewsRes = await api.get(`/reviews/${data._id}`);
      setReviews(reviewsRes.data);

    } catch (err: any) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateVerify = async () => {
    try {
      setLoading(true);
      await api.post('/users/verify');
      await fetchProfile(); // re-fetch to get updated user and score
      setSuccess('Identity verified! Trust score updated.');
    } catch (err: any) {
      setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const sanitized = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: sanitized });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };



  const handleAddArrayItem = (e: React.KeyboardEvent, field: string, inputState: string, setInputState: (val: string) => void, nestedField?: string) => {
    if (e.key === 'Enter' && inputState.trim()) {
      e.preventDefault();
      if (nestedField) {
        const currentArray = formData[field][nestedField] || [];
        if (!currentArray.includes(inputState.trim())) {
           handleNestedChange(field, nestedField, [...currentArray, inputState.trim()]);
        }
      } else {
         if (!formData[field].includes(inputState.trim())) {
           setFormData({ ...formData, [field]: [...formData[field], inputState.trim()] });
         }
      }
      setInputState('');
    }
  };

  const handleDeleteArrayItem = (itemToDelete: string, field: string, nestedField?: string) => {
      if (nestedField) {
         const currentArray = formData[field][nestedField] || [];
         handleNestedChange(field, nestedField, currentArray.filter((item: string) => item !== itemToDelete));
      } else {
         setFormData({ ...formData, [field]: formData[field].filter((item: string) => item !== itemToDelete) });
      }
  };

  const handleAddPortfolio = () => {
    if (portfolioInput.title && portfolioInput.link) {
      setFormData({ ...formData, portfolio: [...formData.portfolio, portfolioInput] });
      setPortfolioInput({ title: '', link: '', description: '' });
    }
  };

  const handleDeletePortfolio = (index: number) => {
    setFormData({ ...formData, portfolio: formData.portfolio.filter((_: any, i: number) => i !== index) });
  };

  const handleEditToggle = (section: keyof typeof editMode) => {
    setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async (section: keyof typeof editMode) => {
    setSaving(true);
    setError('');
    setSuccess('');

    if (section === 'security') {
        if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            setSaving(false);
            return;
        }
    }

    // Basic validation for personal section
    if (section === 'personal') {
      if (formData.DOB) {
        const dob = new Date(formData.DOB);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dob >= today) {
          setError('Date of birth cannot be today or in the future');
          setSaving(false);
          return;
        }
      }
    }

    // Basic validation for social/contact section
    if (section === 'social') {
      if (formData.phone && formData.phone.replace(/\D/g, '').length !== 10 && formData.phone.length > 0) {
        setError('Phone number must be exactly 10 digits');
        setSaving(false);
        return;
      }
    }

    try {
      let payload: any = {};

      if (section === 'security') {
          if (passwordData.currentPassword && passwordData.newPassword) {
            payload.currentPassword = passwordData.currentPassword;
            payload.newPassword = passwordData.newPassword;
          }
      } else {
        payload = { ...formData };
      }

      const { data } = await api.put('/users/profile', payload);
      const updatedUser = { ...authUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully!');
      setEditMode(prev => ({ ...prev, [section]: false }));
      if (section === 'security') {
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
      const message = replyInput[reviewId];
      if (!message) return;

      try {
          // console.log(`[DEBUG] handleReplySubmit: Submitting reply for review ${reviewId}, message: ${message}`);
          const { data } = await api.post(`/reviews/${reviewId}/reply`, { message });
          // console.log(`[DEBUG] handleReplySubmit success, data:`, data);

          // Update local state
          setReviews(reviews.map(r => r._id === reviewId ? { ...r, response: data.response } : r));
          setSuccess('Reply posted successfully');
          setReplyInput({ ...replyInput, [reviewId]: '' });
      } catch (err: any) {
          console.error(`[DEBUG] handleReplySubmit error:`, err);
          setError(err.response?.data?.message || 'Failed to post reply');
      }
  };

  if (!authUser) return <Container><Typography>Please login to view your profile.</Typography></Container>;
  if (loading && !profileData) return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Container>;

  const user = profileData || authUser;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ 
          borderRadius: 4, 
          overflow: 'hidden', 
          mb: 4, 
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
          bgcolor: '#ffffff'
      }}>
        {/* Cover Photo */}
        <Box 
          sx={{ 
            height: 250, 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            position: 'relative'
          }}
        />
        
        {/* Profile Content */}
        <Box sx={{ px: 4, pb: 4, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: -10, mb: 2 }}>
              <Avatar 
                src={user.avatar} 
                alt={user.name}
                sx={{ 
                  width: 180, 
                  height: 180, 
                  border: '6px solid white', 
                  bgcolor: '#6366f1', 
                  fontSize: '4.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ ml: 4, mb: 2, mt: 11 }}>
                <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '-0.5px', color: '#0f172a' }}>{user.name}</Typography>
                <Typography variant="subtitle1" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>{user.about?.split('.')[0] || 'No headline'}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Ratings */}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2, alignItems: 'center', flexWrap: 'wrap' }}>
             <TrustBadge score={user.trustScore} isVerified={user.isVerified} />
             <Chip 
                label={`Seeker: ${user.seekerRating !== undefined ? Number(user.seekerRating).toFixed(1) : 'N/A'} ★`} 
                sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', fontWeight: 800, borderRadius: 2 }}
              />
              <Chip 
                label={`Provider: ${user.providerRating !== undefined ? Number(user.providerRating).toFixed(1) : 'N/A'} ★`} 
                sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 800, borderRadius: 2 }}
              />
          </Box>
        </Box>

        {/* Tabs - Desktop */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 2, md: 4 }, display: { xs: 'none', md: 'block' } }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            sx={{
              '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #6366f1, #a855f7)', height: 3, borderRadius: 2 },
              '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: '0.95rem', color: '#94a3b8', minWidth: 'auto', mr: 3, px: 1, '&.Mui-selected': { color: '#0f172a' } }
            }}
          >
            <Tab label="Personal Info" {...a11yProps(0)} />
            <Tab label="Skills & Prefs" {...a11yProps(1)} />
            <Tab label="Portfolio" {...a11yProps(2)} />
            <Tab label="Contact" {...a11yProps(3)} />
            <Tab label="Security" {...a11yProps(4)} />
            <Tab label="Activity" {...a11yProps(5)} />
            <Tab label="Reviews" {...a11yProps(6)} />
          </Tabs>
        </Box>

        {/* Mobile Menu for Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 2 }}>
           <IconButton color="primary" onClick={handleProfileMenuToggle} edge="start">
             <MenuIcon />
           </IconButton>
           <Typography variant="subtitle1" fontWeight="bold">
             {tabNames[tabValue]}
           </Typography>
        </Box>
        
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleProfileMenuToggle}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box' } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Profile Sections</Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
               {tabNames.map((name, index) => (
                 <ListItemButton 
                   key={index} 
                   selected={tabValue === index}
                   onClick={() => {
                     setTabValue(index);
                     setMobileMenuOpen(false);
                   }}
                 >
                   <ListItemText primary={name} />
                 </ListItemButton>
               ))}
            </List>
          </Box>
        </Drawer>

          {success && <Alert severity="success" sx={{ m: 3 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>}

          {/* Personal Info Tab */}
          <CustomTabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a' }}>About Me</Typography>
                {!editMode.personal ? (
                  <IconButton onClick={() => handleEditToggle('personal')} sx={{ color: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.1)', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' } }}>
                    <EditIcon />
                  </IconButton>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('personal')} sx={{ borderRadius: 2, fontWeight: 700 }}>Cancel</Button>
                    <Button variant="contained" size="small" onClick={() => handleSubmit('personal')} disabled={saving} sx={{ borderRadius: 2, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>Save</Button>
                  </Box>
                )}
              </Box>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#f8fafc' }}>
                {editMode.personal ? (
                  <TextField fullWidth multiline rows={4} label="About Me" name="about" value={formData.about} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.95rem' }}>{user.about || 'No bio provided. Tell us about yourself!'}</Typography>
                )}
              </Paper>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a' }}>Personal Details</Typography>
                {!user.isVerified && (
                  <Button variant="outlined" color="success" size="small" onClick={handleSimulateVerify} sx={{ borderRadius: 2, fontWeight: 700 }}>
                    Verify Identity
                  </Button>
                )}
              </Box>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#f8fafc' }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {editMode.personal ? (
                       <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.name}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     {editMode.personal ? (
                       <TextField fullWidth label="Date of Birth" name="DOB" type="date" InputLabelProps={{ shrink: true }} value={formData.DOB} onChange={handleChange} inputProps={{ max: new Date().toISOString().split('T')[0] }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date of Birth</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.DOB ? format(new Date(user.DOB), 'MMMM d, yyyy') : 'Not specified'}</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a', mb: 2 }}>Location</Typography>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#f8fafc' }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {editMode.personal ? (
                      <TextField fullWidth label="Street" value={formData.address.street} onChange={(e) => handleNestedChange('address', 'street', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Street</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.address?.street || '-'}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    {editMode.personal ? (
                      <TextField fullWidth label="Unit/Apt" value={formData.address.unit} onChange={(e) => handleNestedChange('address', 'unit', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unit/Apt</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.address?.unit || '-'}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    {editMode.personal ? (
                      <TextField fullWidth label="City" value={formData.address.city} onChange={(e) => handleNestedChange('address', 'city', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>City</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.address?.city || '-'}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {editMode.personal ? (
                      <TextField fullWidth select label="Province" value={formData.address.province} onChange={(e) => handleNestedChange('address', 'province', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}>
                        {['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].map(prov => (
                           <MenuItem key={prov} value={prov}>{prov}</MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Province</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.address?.province || '-'}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {editMode.personal ? (
                      <TextField fullWidth label="Postal Code" value={formData.address.postalCode} onChange={(e) => handleNestedChange('address', 'postalCode', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Postal Code</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.address?.postalCode || '-'}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {editMode.personal ? (
                      <TextField fullWidth label="County" value={formData.address.county} onChange={(e) => handleNestedChange('address', 'county', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>County</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.address?.county || '-'}</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </CustomTabPanel>

          {/* Skills & Preferences Tab */}
          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a' }}>Role Profiles</Typography>
              {!editMode.skills ? (
                <IconButton onClick={() => handleEditToggle('skills')} sx={{ color: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.1)', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' } }}>
                  <EditIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('skills')} sx={{ borderRadius: 2, fontWeight: 700 }}>Cancel</Button>
                  <Button variant="contained" size="small" onClick={() => handleSubmit('skills')} disabled={saving} sx={{ borderRadius: 2, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>Save</Button>
                </Box>
              )}
            </Box>

            {/* Provider Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WorkIcon sx={{ color: '#059669' }} />
                <Typography variant="h6" fontWeight="800" sx={{ color: '#059669' }}>Provider Profile</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>Settings for when you are offering services.</Typography>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(16, 185, 129, 0.2)', bgcolor: '#f0fdf4' }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" sx={{ color: '#047857', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 1 }}>Skills</Typography>
                    {editMode.skills && (
                      <TextField 
                        fullWidth size="small" placeholder="Add a skill (Press Enter)" value={skillInput} 
                        onChange={(e) => setSkillInput(e.target.value)} 
                        onKeyDown={(e) => handleAddArrayItem(e, 'providerProfile', skillInput, setSkillInput, 'skills')} 
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                      />
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(editMode.skills ? formData.providerProfile.skills : user.providerProfile?.skills)?.map((skill: string, index: number) => (
                        <Chip key={index} label={skill} onDelete={editMode.skills ? () => handleDeleteArrayItem(skill, 'providerProfile', 'skills') : undefined} sx={{ bgcolor: 'white', border: '1px solid #10b981', color: '#047857', fontWeight: 600, borderRadius: 2 }} />
                      ))}
                      {(!user.providerProfile?.skills?.length && !editMode.skills) && <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>No skills added.</Typography>}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" sx={{ color: '#047857', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 1 }}>Service Categories</Typography>
                    {editMode.skills && (
                      <TextField 
                        fullWidth size="small" placeholder="Add category (Press Enter)" value={categoryInput} 
                        onChange={(e) => setCategoryInput(e.target.value)} 
                        onKeyDown={(e) => handleAddArrayItem(e, 'providerProfile', categoryInput, setCategoryInput, 'serviceCategories')} 
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                      />
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(editMode.skills ? formData.providerProfile.serviceCategories : user.providerProfile?.serviceCategories)?.map((cat: string, index: number) => (
                        <Chip key={index} label={cat} onDelete={editMode.skills ? () => handleDeleteArrayItem(cat, 'providerProfile', 'serviceCategories') : undefined} sx={{ bgcolor: 'white', border: '1px solid #34d399', color: '#065f46', fontWeight: 600, borderRadius: 2 }} />
                      ))}
                      {(!user.providerProfile?.serviceCategories?.length && !editMode.skills) && <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>No categories added.</Typography>}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                     {editMode.skills ? (
                       <TextField fullWidth label="Availability" select value={formData.providerProfile.availability} onChange={(e) => handleNestedChange('providerProfile', 'availability', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}>
                          <MenuItem value="Flexible">Flexible</MenuItem>
                          <MenuItem value="Weekends Only">Weekends Only</MenuItem>
                          <MenuItem value="Evenings">Evenings</MenuItem>
                          <MenuItem value="Full-Time">Full-Time</MenuItem>
                       </TextField>
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#047857', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Availability</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#064e3b' }}>{user.providerProfile?.availability || 'Not specified'}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     {editMode.skills ? (
                       <TextField fullWidth type="number" label="Service Radius (km)" value={formData.providerProfile.serviceRadius || ''} onChange={(e) => handleNestedChange('providerProfile', 'serviceRadius', Number(e.target.value))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#047857', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service Radius</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#064e3b' }}>{user.providerProfile?.serviceRadius ? `${user.providerProfile.serviceRadius} km` : 'Not specified'}</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            {/* Seeker Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WorkIcon sx={{ color: '#4f46e5' }} />
                <Typography variant="h6" fontWeight="800" sx={{ color: '#4f46e5' }}>Seeker Profile</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>Settings for when you are hiring others.</Typography>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(99, 102, 241, 0.2)', bgcolor: '#eef2ff' }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" sx={{ color: '#4338ca', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 1 }}>Request Categories</Typography>
                    {editMode.skills && (
                      <TextField 
                        fullWidth size="small" placeholder="Add requested category (Press Enter)" value={jobTypeInput} 
                        onChange={(e) => setJobTypeInput(e.target.value)} 
                        onKeyDown={(e) => handleAddArrayItem(e, 'seekerProfile', jobTypeInput, setJobTypeInput, 'requestCategories')} 
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                      />
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(editMode.skills ? formData.seekerProfile.requestCategories : user.seekerProfile?.requestCategories)?.map((cat: string, index: number) => (
                        <Chip key={index} label={cat} onDelete={editMode.skills ? () => handleDeleteArrayItem(cat, 'seekerProfile', 'requestCategories') : undefined} sx={{ bgcolor: 'white', border: '1px solid #6366f1', color: '#4338ca', fontWeight: 600, borderRadius: 2 }} />
                      ))}
                      {(!user.seekerProfile?.requestCategories?.length && !editMode.skills) && <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>No request categories added.</Typography>}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                     {editMode.skills ? (
                       <TextField fullWidth label="Default Location" value={formData.seekerProfile.defaultLocation || ''} onChange={(e) => handleNestedChange('seekerProfile', 'defaultLocation', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#4338ca', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Default Location</Typography>
                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#312e81' }}>{user.seekerProfile?.defaultLocation || 'Not specified'}</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </CustomTabPanel>

          {/* Portfolio Tab */}
          <CustomTabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a' }}>Portfolio</Typography>
              {!editMode.portfolio ? (
                <IconButton onClick={() => handleEditToggle('portfolio')} sx={{ color: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.1)', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' } }}>
                  <EditIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('portfolio')} sx={{ borderRadius: 2, fontWeight: 700 }}>Cancel</Button>
                  <Button variant="contained" size="small" onClick={() => handleSubmit('portfolio')} disabled={saving} sx={{ borderRadius: 2, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>Save</Button>
                </Box>
              )}
            </Box>
            
            {editMode.portfolio && (
              <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px dashed #6366f1', bgcolor: '#f8fafc' }}>
                <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#4f46e5', mb: 2 }}>Add New Item</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField fullWidth label="Title" value={portfolioInput.title} onChange={(e) => setPortfolioInput({ ...portfolioInput, title: e.target.value })} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField fullWidth label="Link" value={portfolioInput.link} onChange={(e) => setPortfolioInput({ ...portfolioInput, link: e.target.value })} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <Button variant="contained" onClick={handleAddPortfolio} fullWidth sx={{ height: '100%', borderRadius: 2, fontWeight: 700, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}>Add</Button>
                  </Grid>
                  <Grid size={12}>
                     <TextField fullWidth label="Description" value={portfolioInput.description} onChange={(e) => setPortfolioInput({ ...portfolioInput, description: e.target.value })} size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                  </Grid>
                </Grid>
              </Paper>
            )}

            <Grid container spacing={3}>
              {(editMode.portfolio ? formData.portfolio : user.portfolio)?.map((item: any, index: number) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', position: 'relative', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.06)' } }}>
                    {editMode.portfolio && (
                      <IconButton size="small" color="error" onClick={() => handleDeletePortfolio(index)} sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(2ef, 68, 68, 0.1)' }}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', display: 'flex' }}>
                        <WorkIcon fontSize="small" />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="800">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0f172a' }}>
                          {item.title}
                        </a>
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>{item.description}</Typography>
                  </Paper>
                </Grid>
              ))}
              {(!user.portfolio?.length && !editMode.portfolio) && <Typography color="text.secondary" sx={{ ml: 2, mt: 1, fontStyle: 'italic' }}>No portfolio items added.</Typography>}
            </Grid>
          </CustomTabPanel>

          {/* Contact & Social Tab */}
          <CustomTabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a' }}>Contact Information</Typography>
                {!editMode.social ? (
                  <IconButton onClick={() => handleEditToggle('social')} sx={{ color: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.1)', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' } }}>
                    <EditIcon />
                  </IconButton>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('social')} sx={{ borderRadius: 2, fontWeight: 700 }}>Cancel</Button>
                    <Button variant="contained" size="small" onClick={() => handleSubmit('social')} disabled={saving} sx={{ borderRadius: 2, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>Save</Button>
                  </Box>
                )}
              </Box>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#f8fafc' }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     {editMode.social ? (
                        <TextField fullWidth label="Email" name="email" value={formData.email} disabled helperText="Email cannot be changed" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' } }} />
                     ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', display: 'flex' }}>
                            <EmailIcon />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</Typography>
                            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.email}</Typography>
                          </Box>
                        </Box>
                     )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     {editMode.social ? (
                        <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="1234567890" inputProps={{ inputMode: 'numeric', maxLength: 10 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                     ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex' }}>
                            <PhoneIcon />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</Typography>
                            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b' }}>{user.phone || 'Not specified'}</Typography>
                          </Box>
                        </Box>
                     )}
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a', mb: 3 }}>Social Profiles</Typography>
               {editMode.social ? (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField fullWidth label="LinkedIn URL" value={formData.socialLinks.linkedin} onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField fullWidth label="GitHub URL" value={formData.socialLinks.github} onChange={(e) => handleNestedChange('socialLinks', 'github', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField fullWidth label="Website URL" value={formData.socialLinks.website} onChange={(e) => handleNestedChange('socialLinks', 'website', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }} />
                    </Grid>
                  </Grid>
               ) : (
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    {user.socialLinks?.linkedin && (
                      <IconButton href={user.socialLinks.linkedin} target="_blank" sx={{ color: '#0a66c2', bgcolor: 'rgba(10, 102, 194, 0.1)', p: 2, borderRadius: 3, '&:hover': { bgcolor: 'rgba(10, 102, 194, 0.2)' } }}>
                        <LinkedInIcon fontSize="large" />
                      </IconButton>
                    )}
                    {user.socialLinks?.github && (
                      <IconButton href={user.socialLinks.github} target="_blank" sx={{ color: '#24292e', bgcolor: 'rgba(36, 41, 46, 0.1)', p: 2, borderRadius: 3, '&:hover': { bgcolor: 'rgba(36, 41, 46, 0.2)' } }}>
                        <GitHubIcon fontSize="large" />
                      </IconButton>
                    )}
                    {user.socialLinks?.website && (
                      <IconButton href={user.socialLinks.website} target="_blank" sx={{ color: '#4f46e5', bgcolor: 'rgba(79, 70, 229, 0.1)', p: 2, borderRadius: 3, '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.2)' } }}>
                        <LanguageIcon fontSize="large" />
                      </IconButton>
                    )}
                    {(!user.socialLinks?.linkedin && !user.socialLinks?.github && !user.socialLinks?.website) && (
                      <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>No social profiles linked.</Typography>
                    )}
                  </Box>
               )}
            </Box>
          </CustomTabPanel>

          {/* Security Tab */}
          <CustomTabPanel value={tabValue} index={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a' }}>Security Settings</Typography>
              {!editMode.security ? (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditToggle('security')} sx={{ borderRadius: 2, fontWeight: 700, borderColor: '#6366f1', color: '#6366f1' }}>
                  Change Password
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('security')} sx={{ borderRadius: 2, fontWeight: 700 }}>Cancel</Button>
                  <Button variant="contained" size="small" onClick={() => handleSubmit('security')} disabled={saving} sx={{ borderRadius: 2, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>Save</Button>
                </Box>
              )}
            </Box>

            <Paper elevation={0} sx={{ maxWidth: 600, p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#f8fafc' }}>
              {editMode.security ? (
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      To change your password, enter your current password and the new password below.
                    </Alert>
                  </Grid>
                  <Grid size={12}>
                    <TextField 
                      fullWidth 
                      type="password" 
                      label="Current Password" 
                      value={passwordData.currentPassword} 
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField 
                      fullWidth 
                      type="password" 
                      label="New Password" 
                      value={passwordData.newPassword} 
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField 
                      fullWidth 
                      type="password" 
                      label="Confirm New Password" 
                      value={passwordData.confirmPassword} 
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex' }}>
                    <LockIcon />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#0f172a' }}>Password is secure.</Typography>
                </Box>
              )}
            </Paper>
          </CustomTabPanel>

          {/* My Activity Tab */}
          <CustomTabPanel value={tabValue} index={5}>
            <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a', mb: 4 }}>My Activity</Typography>
            
            {/* Seeker Section */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4f46e5', mb: 2 }}>
                    <WorkIcon /> Posted Jobs (Seeker)
                </Typography>
                
                {postedJobs.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed #e2e8f0', bgcolor: '#f8fafc' }}>
                      <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>You haven't posted any jobs yet.</Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {postedJobs.map((job) => (
                            <Grid size={{ xs: 12, md: 6 }} key={job._id}>
                                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(79, 70, 229, 0.1)', bgcolor: '#fff', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.08)' } }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="800" component={Link} to={`/jobs/${job._id}`} sx={{ textDecoration: 'none', color: '#1e293b', '&:hover': { color: '#4f46e5' } }}>
                                                {job.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5, fontWeight: 600 }}>
                                                Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                                            </Typography>
                                        </Box>
                                        <Chip 
                                            label={job.status.toUpperCase()} 
                                            size="small" 
                                            sx={{ fontWeight: 800, borderRadius: 2, bgcolor: job.status === 'open' ? 'rgba(16, 185, 129, 0.1)' : job.status === 'completed' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(148, 163, 184, 0.1)', color: job.status === 'open' ? '#059669' : job.status === 'completed' ? '#4f46e5' : '#64748b' }}
                                        />
                                    </Box>
                                    <Box mt={2} display="flex" gap={1.5}>
                                        <Chip label={`${job.negotiations?.length || 0} Offers`} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700 }} />
                                        <Chip label={`$${job.originalPay}`} size="small" sx={{ bgcolor: 'rgba(5, 150, 105, 0.1)', color: '#059669', fontWeight: 800 }} icon={<AttachMoneyIcon sx={{ color: '#059669 !important' }} />} />
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Provider Section */}
            <Box>
                <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#059669', mb: 2 }}>
                    <WorkIcon /> Work & Offers (Provider)
                </Typography>
                
                <Box sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(16, 185, 129, 0.1)', bgcolor: '#f0fdf4', mb: 4 }}>
                  <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#047857', mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Offers</Typography>
                  {myOffers.length === 0 ? (
                      <Typography sx={{ color: '#065f46', fontStyle: 'italic', fontSize: '0.9rem' }}>No active offers sent.</Typography>
                  ) : (
                      <Grid container spacing={2}>
                          {myOffers.map((offer) => (
                              <Grid size={{ xs: 12, md: 6 }} key={offer._id}>
                                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                      <Typography variant="subtitle1" fontWeight="800" component={Link} to={`/jobs/${offer.job?._id}`} sx={{ textDecoration: 'none', color: '#1e293b', '&:hover': { color: '#059669' } }}>
                                          {offer.job?.title || 'Unknown Job'}
                                      </Typography>
                                      <Box display="flex" justifyContent="space-between" mt={2} alignItems="center">
                                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Offered: <span style={{ color: '#059669', fontWeight: 800, fontSize: '1.1rem' }}>${offer.amount}</span></Typography>
                                          <Chip 
                                              label={offer.status.toUpperCase()} 
                                              size="small" 
                                              sx={{ fontWeight: 800, borderRadius: 2, bgcolor: offer.status === 'accepted' ? 'rgba(16, 185, 129, 0.1)' : offer.status === 'rejected' ? 'rgba(2ef, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: offer.status === 'accepted' ? '#059669' : offer.status === 'rejected' ? '#dc2626' : '#d97706' }}
                                          />
                                      </Box>
                                  </Paper>
                              </Grid>
                          ))}
                      </Grid>
                  )}
                </Box>

                <Box sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#f8fafc' }}>
                  <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#475569', mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Work History</Typography>
                  {workedJobs.length === 0 ? (
                      <Typography sx={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem' }}>No completed jobs yet.</Typography>
                  ) : (
                      <Grid container spacing={2}>
                          {workedJobs.map((job) => (
                              <Grid size={{ xs: 12, md: 6 }} key={job._id}>
                                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                      <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#1e293b' }}>{job.title}</Typography>
                                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5, fontWeight: 600 }}>Completed on {format(new Date(job.updatedAt), 'MMM d, yyyy')}</Typography>
                                      <Chip label="Completed" size="small" sx={{ mt: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 800, borderRadius: 2 }} />
                                  </Paper>
                              </Grid>
                          ))}
                      </Grid>
                  )}
                </Box>
            </Box>
          </CustomTabPanel>

          {/* Reviews Tab */}
          <CustomTabPanel value={tabValue} index={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
               <Typography variant="h5" fontWeight="800" sx={{ color: '#0f172a' }}>Reviews Received</Typography>
               <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                   <Chip label={`Seeker Rating: ${Number(user.seekerRating || 0).toFixed(1)} ★`} sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', fontWeight: 800, borderRadius: 2 }} />
                   <Chip label={`Provider Rating: ${Number(user.providerRating || 0).toFixed(1)} ★`} sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 800, borderRadius: 2 }} />
               </Box>
            </Box>


            {reviews.length === 0 ? (
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed #e2e8f0', bgcolor: '#f8fafc' }}>
                    <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>No reviews yet.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    {/* Seeker Reviews Section */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid rgba(79, 70, 229, 0.2)', borderRadius: 3, bgcolor: '#eef2ff' }}>
                             <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4338ca' }}>
                                     <WorkIcon /> Reviews as Seeker
                                 </Typography>
                                 <Chip label={`${reviews.filter(r => r.job?.seekerId === user._id).length}`} size="small" sx={{ bgcolor: '#6366f1', color: 'white', fontWeight: 800 }} />
                             </Box>
                             
                             <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(99, 102, 241, 0.3)', borderRadius: 10 } }}>
                                 {reviews.filter(r => r.job?.seekerId === user._id).length === 0 ? (
                                     <Box py={4} textAlign="center">
                                         <Typography sx={{ color: '#4338ca', fontStyle: 'italic', fontSize: '0.95rem' }}>No reviews received as Seeker.</Typography>
                                     </Box>
                                 ) : (
                                     <Box display="flex" flexDirection="column" gap={2}>
                                        {reviews.filter(r => r.job?.seekerId === user._id).map((review) => (
                                            <Paper key={review._id} elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                                {/* Review Content */}
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                    <Box display="flex" gap={2}>
                                                        <Avatar src={review.reviewer.avatar} sx={{ width: 40, height: 40, bgcolor: '#4f46e5' }}>{review.reviewer.name.charAt(0)}</Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1e293b' }}>{review.reviewer.name}</Typography>
                                                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                                                                <Rating value={review.rating} readOnly size="small" sx={{ color: '#f59e0b' }} />
                                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{format(new Date(review.createdAt), 'MMM d, yyyy')}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2" sx={{ mt: 2, mb: 1, color: '#475569', lineHeight: 1.6, fontStyle: 'italic' }}>"{review.comment}"</Typography>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b', fontWeight: 700, mt: 1 }}>Job: <span style={{ color: '#4f46e5' }}>{review.job?.title}</span></Typography>
                                                
                                                {/* Reply Logic */}
                                                {review.response ? (
                                                    <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: '#f8fafc', display: 'flex', gap: 1.5, borderLeft: '3px solid #6366f1', borderRadius: '0 12px 12px 0' }}>
                                                        <ReplyIcon sx={{ color: '#6366f1' }} fontSize="small" />
                                                        <Box>
                                                            <Typography variant="caption" fontWeight="800" sx={{ color: '#475569', display: 'block', mb: 0.5 }}>Your Reply</Typography>
                                                            <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '0.9rem' }}>{review.response.message}</Typography>
                                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, mt: 0.5, display: 'block' }}>{format(new Date(review.response.createdAt), 'MMM d, yyyy')}</Typography>
                                                        </Box>
                                                    </Paper>
                                                ) : (
                                                    <Box mt={2}>
                                                        <TextField 
                                                            fullWidth 
                                                            size="small" 
                                                            placeholder="Write a reply..." 
                                                            value={replyInput[review._id] || ''}
                                                            onChange={(e) => setReplyInput({ ...replyInput, [review._id]: e.target.value })}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc', pr: 0.5 } }}
                                                            InputProps={{
                                                                sx: { fontSize: '0.9rem' },
                                                                endAdornment: (
                                                                    <Button 
                                                                        size="small" 
                                                                        variant="contained"
                                                                        onClick={() => handleReplySubmit(review._id)}
                                                                        disabled={!replyInput[review._id]}
                                                                        sx={{ minWidth: 60, borderRadius: 1.5, fontWeight: 700, mr: 0.5, bgcolor: '#6366f1' }}
                                                                    >
                                                                        Reply
                                                                    </Button>
                                                                )
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Paper>
                                        ))}
                                     </Box>
                                 )}
                             </Box>
                        </Paper>
                    </Grid>

                    {/* Provider Reviews Section */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 3, bgcolor: '#f0fdf4' }}>
                             <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#047857' }}>
                                     <WorkIcon /> Reviews as Provider
                                 </Typography>
                                 <Chip label={`${reviews.filter(r => r.job?.providerId === user._id).length}`} size="small" sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 800 }} />
                             </Box>

                             <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(16, 185, 129, 0.3)', borderRadius: 10 } }}>
                                 {reviews.filter(r => r.job?.providerId === user._id).length === 0 ? (
                                     <Box py={4} textAlign="center">
                                         <Typography sx={{ color: '#047857', fontStyle: 'italic', fontSize: '0.95rem' }}>No reviews received as Provider.</Typography>
                                     </Box>
                                 ) : (
                                     <Box display="flex" flexDirection="column" gap={2}>
                                        {reviews.filter(r => r.job?.providerId === user._id).map((review) => (
                                            <Paper key={review._id} elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                                {/* Review Content */}
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                    <Box display="flex" gap={2}>
                                                        <Avatar src={review.reviewer.avatar} sx={{ width: 40, height: 40, bgcolor: '#10b981' }}>{review.reviewer.name.charAt(0)}</Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#1e293b' }}>{review.reviewer.name}</Typography>
                                                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                                                                <Rating value={review.rating} readOnly size="small" sx={{ color: '#f59e0b' }} />
                                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{format(new Date(review.createdAt), 'MMM d, yyyy')}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2" sx={{ mt: 2, mb: 1, color: '#475569', lineHeight: 1.6, fontStyle: 'italic' }}>"{review.comment}"</Typography>
                                                <Typography variant="caption" display="block" sx={{ color: '#64748b', fontWeight: 700, mt: 1 }}>Job: <span style={{ color: '#059669' }}>{review.job?.title}</span></Typography>
                                                
                                                {/* Reply Logic */}
                                                {review.response ? (
                                                    <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: '#f8fafc', display: 'flex', gap: 1.5, borderLeft: '3px solid #10b981', borderRadius: '0 12px 12px 0' }}>
                                                        <ReplyIcon sx={{ color: '#10b981' }} fontSize="small" />
                                                        <Box>
                                                            <Typography variant="caption" fontWeight="800" sx={{ color: '#475569', display: 'block', mb: 0.5 }}>Your Reply</Typography>
                                                            <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '0.9rem' }}>{review.response.message}</Typography>
                                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, mt: 0.5, display: 'block' }}>{format(new Date(review.response.createdAt), 'MMM d, yyyy')}</Typography>
                                                        </Box>
                                                    </Paper>
                                                ) : (
                                                    <Box mt={2}>
                                                        <TextField 
                                                            fullWidth 
                                                            size="small" 
                                                            placeholder="Write a reply..." 
                                                            value={replyInput[review._id] || ''}
                                                            onChange={(e) => setReplyInput({ ...replyInput, [review._id]: e.target.value })}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc', pr: 0.5 } }}
                                                            InputProps={{
                                                                sx: { fontSize: '0.9rem' },
                                                                endAdornment: (
                                                                    <Button 
                                                                        size="small"
                                                                        variant="contained" 
                                                                        onClick={() => handleReplySubmit(review._id)}
                                                                        disabled={!replyInput[review._id]}
                                                                        sx={{ minWidth: 60, borderRadius: 1.5, fontWeight: 700, mr: 0.5, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                                                                    >
                                                                        Reply
                                                                    </Button>
                                                                )
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Paper>
                                        ))}
                                     </Box>
                                 )}
                             </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

          </CustomTabPanel>
        </Paper>
    </Container>
  );
};

export default Profile;
