import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Paper, Avatar, TextField, Button, Grid, Chip, MenuItem, Alert, CircularProgress, IconButton, Divider, Tabs, Tab } from '@mui/material';
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        {/* Cover Photo */}
        <Box 
          sx={{ 
            height: 250, 
            background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
            position: 'relative'
          }}
        />
        
        {/* Profile Content */}
        <Box sx={{ px: 4, pb: 4, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: -8, mb: 2 }}>
              <Avatar 
                src={user.avatar} 
                alt={user.name}
                sx={{ 
                  width: 160, 
                  height: 160, 
                  border: '5px solid white', 
                  bgcolor: 'primary.main', 
                  fontSize: '4rem',
                  boxShadow: 3
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ ml: 3, mb: 2, mt: 8 }}>
                <Typography variant="h4" fontWeight="bold">{user.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{user.about?.split('.')[0] || 'No headline'}</Typography>
                
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              {/* Global edit buttons removed */}
            </Box>
          </Box>

          {/* Ratings */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
             <TrustBadge score={user.trustScore} isVerified={user.isVerified} />
             <Chip 
                label={`Seeker: ${user.seekerRating !== undefined ? Number(user.seekerRating).toFixed(1) : 'N/A'} ★`} 
                color="primary" 
                variant="outlined" 
                size="small"
              />
              <Chip 
                label={`Provider: ${user.providerRating !== undefined ? Number(user.providerRating).toFixed(1) : 'N/A'} ★`} 
                color="secondary" 
                variant="outlined" 
                size="small"
              />
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Personal Info" {...a11yProps(0)} />
            <Tab label="Skills & Preferences" {...a11yProps(1)} />
            <Tab label="Portfolio" {...a11yProps(2)} />
            <Tab label="Contact & Social" {...a11yProps(3)} />
            <Tab label="Security" {...a11yProps(4)} />
            <Tab label="My Activity" {...a11yProps(5)} />
            <Tab label="Reviews" {...a11yProps(6)} />
          </Tabs>

          {success && <Alert severity="success" sx={{ m: 3 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>}

          {/* Personal Info Tab */}
          <CustomTabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">About</Typography>
              {!editMode.personal ? (
                <IconButton onClick={() => handleEditToggle('personal')} color="primary">
                  <EditIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('personal')}>Cancel</Button>
                  <Button variant="contained" size="small" onClick={() => handleSubmit('personal')} disabled={saving}>Save</Button>
                </Box>
              )}
            </Box>

            {editMode.personal ? (
              <TextField fullWidth multiline rows={4} label="About Me" name="about" value={formData.about} onChange={handleChange} sx={{ mb: 3 }} />
            ) : (
              <Typography variant="body1" color="text.secondary" paragraph>{user.about || 'No bio provided.'}</Typography>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Details</Typography>
              {!user.isVerified && (
                <Button variant="outlined" color="success" size="small" onClick={handleSimulateVerify}>
                  Verify Identity (Simulation)
                </Button>
              )}
            </Box>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {editMode.personal ? (
                   <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1">{user.name}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                 {editMode.personal ? (
                   <TextField fullWidth label="Date of Birth" name="DOB" type="date" InputLabelProps={{ shrink: true }} value={formData.DOB} onChange={handleChange} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1">{user.DOB ? format(new Date(user.DOB), 'MMMM d, yyyy') : 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Location</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {editMode.personal ? (
                  <TextField fullWidth label="Street" value={formData.address.street} onChange={(e) => handleNestedChange('address', 'street', e.target.value)} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Street</Typography>
                    <Typography variant="body1">{user.address?.street || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                {editMode.personal ? (
                  <TextField fullWidth label="Unit/Apt" value={formData.address.unit} onChange={(e) => handleNestedChange('address', 'unit', e.target.value)} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Unit/Apt</Typography>
                    <Typography variant="body1">{user.address?.unit || '-'}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                {editMode.personal ? (
                  <TextField fullWidth label="City" value={formData.address.city} onChange={(e) => handleNestedChange('address', 'city', e.target.value)} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">City</Typography>
                    <Typography variant="body1">{user.address?.city || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {editMode.personal ? (
                  <TextField fullWidth select label="Province" value={formData.address.province} onChange={(e) => handleNestedChange('address', 'province', e.target.value)}>
                    {['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].map(prov => (
                       <MenuItem key={prov} value={prov}>{prov}</MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Province</Typography>
                    <Typography variant="body1">{user.address?.province || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {editMode.personal ? (
                  <TextField fullWidth label="Postal Code" value={formData.address.postalCode} onChange={(e) => handleNestedChange('address', 'postalCode', e.target.value)} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Postal Code</Typography>
                    <Typography variant="body1">{user.address?.postalCode || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                {editMode.personal ? (
                  <TextField fullWidth label="County" value={formData.address.county} onChange={(e) => handleNestedChange('address', 'county', e.target.value)} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">County</Typography>
                    <Typography variant="body1">{user.address?.county || '-'}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* Skills & Preferences Tab */}
          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Role Profiles</Typography>
              {!editMode.skills ? (
                <IconButton onClick={() => handleEditToggle('skills')} color="primary">
                  <EditIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('skills')}>Cancel</Button>
                  <Button variant="contained" size="small" onClick={() => handleSubmit('skills')} disabled={saving}>Save</Button>
                </Box>
              )}
            </Box>

            {/* Provider Section */}
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary" sx={{ mt: 3 }}>Provider Profile</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>Settings for when you are offering services.</Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Skills</Typography>
                {editMode.skills && (
                  <TextField 
                    fullWidth size="small" label="Add a skill (Press Enter)" value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)} 
                    onKeyDown={(e) => handleAddArrayItem(e, 'providerProfile', skillInput, setSkillInput, 'skills')} 
                    sx={{ mb: 1 }}
                  />
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(editMode.skills ? formData.providerProfile.skills : user.providerProfile?.skills)?.map((skill: string, index: number) => (
                    <Chip key={index} label={skill} onDelete={editMode.skills ? () => handleDeleteArrayItem(skill, 'providerProfile', 'skills') : undefined} color="primary" variant="outlined" />
                  ))}
                  {(!user.providerProfile?.skills?.length && !editMode.skills) && <Typography color="text.secondary">No skills added.</Typography>}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Service Categories</Typography>
                {editMode.skills && (
                  <TextField 
                    fullWidth size="small" label="Add category (Press Enter)" value={categoryInput} 
                    onChange={(e) => setCategoryInput(e.target.value)} 
                    onKeyDown={(e) => handleAddArrayItem(e, 'providerProfile', categoryInput, setCategoryInput, 'serviceCategories')} 
                    sx={{ mb: 1 }}
                  />
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(editMode.skills ? formData.providerProfile.serviceCategories : user.providerProfile?.serviceCategories)?.map((cat: string, index: number) => (
                    <Chip key={index} label={cat} onDelete={editMode.skills ? () => handleDeleteArrayItem(cat, 'providerProfile', 'serviceCategories') : undefined} color="secondary" variant="outlined" />
                  ))}
                  {(!user.providerProfile?.serviceCategories?.length && !editMode.skills) && <Typography color="text.secondary">No categories added.</Typography>}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                 {editMode.skills ? (
                   <TextField fullWidth label="Availability" select value={formData.providerProfile.availability} onChange={(e) => handleNestedChange('providerProfile', 'availability', e.target.value)}>
                      <MenuItem value="Flexible">Flexible</MenuItem>
                      <MenuItem value="Weekends Only">Weekends Only</MenuItem>
                      <MenuItem value="Evenings">Evenings</MenuItem>
                      <MenuItem value="Full-Time">Full-Time</MenuItem>
                   </TextField>
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Availability</Typography>
                    <Typography variant="body1">{user.providerProfile?.availability || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                 {editMode.skills ? (
                   <TextField fullWidth type="number" label="Service Radius (km)" value={formData.providerProfile.serviceRadius || ''} onChange={(e) => handleNestedChange('providerProfile', 'serviceRadius', Number(e.target.value))} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Service Radius</Typography>
                    <Typography variant="body1">{user.providerProfile?.serviceRadius ? `${user.providerProfile.serviceRadius} km` : 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Seeker Section */}
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">Seeker Profile</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>Settings for when you are hiring others.</Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Request Categories</Typography>
                {editMode.skills && (
                  <TextField 
                    fullWidth size="small" label="Add requested category (Press Enter)" value={jobTypeInput} 
                    onChange={(e) => setJobTypeInput(e.target.value)} 
                    onKeyDown={(e) => handleAddArrayItem(e, 'seekerProfile', jobTypeInput, setJobTypeInput, 'requestCategories')} 
                    sx={{ mb: 1 }}
                  />
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(editMode.skills ? formData.seekerProfile.requestCategories : user.seekerProfile?.requestCategories)?.map((cat: string, index: number) => (
                    <Chip key={index} label={cat} onDelete={editMode.skills ? () => handleDeleteArrayItem(cat, 'seekerProfile', 'requestCategories') : undefined} color="info" variant="outlined" />
                  ))}
                  {(!user.seekerProfile?.requestCategories?.length && !editMode.skills) && <Typography color="text.secondary">No request categories added.</Typography>}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                 {editMode.skills ? (
                   <TextField fullWidth label="Default Location" value={formData.seekerProfile.defaultLocation || ''} onChange={(e) => handleNestedChange('seekerProfile', 'defaultLocation', e.target.value)} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Default Location</Typography>
                    <Typography variant="body1">{user.seekerProfile?.defaultLocation || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* Portfolio Tab */}
          <CustomTabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Portfolio</Typography>
              {!editMode.portfolio ? (
                <IconButton onClick={() => handleEditToggle('portfolio')} color="primary">
                  <EditIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('portfolio')}>Cancel</Button>
                  <Button variant="contained" size="small" onClick={() => handleSubmit('portfolio')} disabled={saving}>Save</Button>
                </Box>
              )}
            </Box>
            
            {editMode.portfolio && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>Add New Item</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField fullWidth label="Title" value={portfolioInput.title} onChange={(e) => setPortfolioInput({ ...portfolioInput, title: e.target.value })} size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField fullWidth label="Link" value={portfolioInput.link} onChange={(e) => setPortfolioInput({ ...portfolioInput, link: e.target.value })} size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <Button variant="contained" onClick={handleAddPortfolio} fullWidth sx={{ height: '100%' }}>Add</Button>
                  </Grid>
                  <Grid size={12}>
                     <TextField fullWidth label="Description" value={portfolioInput.description} onChange={(e) => setPortfolioInput({ ...portfolioInput, description: e.target.value })} size="small" />
                  </Grid>
                </Grid>
              </Paper>
            )}

            <Grid container spacing={2}>
              {(editMode.portfolio ? formData.portfolio : user.portfolio)?.map((item: any, index: number) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Paper elevation={2} sx={{ p: 2, position: 'relative' }}>
                    {editMode.portfolio && (
                      <IconButton size="small" color="error" onClick={() => handleDeletePortfolio(index)} sx={{ position: 'absolute', top: 5, right: 5 }}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <WorkIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                          {item.title}
                        </a>
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                  </Paper>
                </Grid>
              ))}
              {(!user.portfolio?.length && !editMode.portfolio) && <Typography color="text.secondary">No portfolio items added.</Typography>}
            </Grid>
          </CustomTabPanel>

          {/* Contact & Social Tab */}
          <CustomTabPanel value={tabValue} index={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Contact Information</Typography>
              {!editMode.social ? (
                <IconButton onClick={() => handleEditToggle('social')} color="primary">
                  <EditIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('social')}>Cancel</Button>
                  <Button variant="contained" size="small" onClick={() => handleSubmit('social')} disabled={saving}>Save</Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                 {editMode.social ? (
                    <TextField fullWidth label="Email" name="email" value={formData.email} disabled helperText="Email cannot be changed" />
                 ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <EmailIcon color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{user.email}</Typography>
                      </Box>
                    </Box>
                 )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                 {editMode.social ? (
                    <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                 ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PhoneIcon color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{user.phone || 'Not specified'}</Typography>
                      </Box>
                    </Box>
                 )}
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Social Profiles</Typography>
             {editMode.social ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField fullWidth label="LinkedIn URL" value={formData.socialLinks.linkedin} onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField fullWidth label="GitHub URL" value={formData.socialLinks.github} onChange={(e) => handleNestedChange('socialLinks', 'github', e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField fullWidth label="Website URL" value={formData.socialLinks.website} onChange={(e) => handleNestedChange('socialLinks', 'website', e.target.value)} />
                  </Grid>
                </Grid>
             ) : (
                <Box sx={{ display: 'flex', gap: 3 }}>
                  {user.socialLinks?.linkedin && (
                    <IconButton href={user.socialLinks.linkedin} target="_blank" color="primary" size="large">
                      <LinkedInIcon fontSize="large" />
                    </IconButton>
                  )}
                  {user.socialLinks?.github && (
                    <IconButton href={user.socialLinks.github} target="_blank" sx={{ color: '#333' }} size="large">
                      <GitHubIcon fontSize="large" />
                    </IconButton>
                  )}
                  {user.socialLinks?.website && (
                    <IconButton href={user.socialLinks.website} target="_blank" color="secondary" size="large">
                      <LanguageIcon fontSize="large" />
                    </IconButton>
                  )}
                  {(!user.socialLinks?.linkedin && !user.socialLinks?.github && !user.socialLinks?.website) && (
                    <Typography color="text.secondary">No social profiles linked.</Typography>
                  )}
                </Box>
             )}
          </CustomTabPanel>

          {/* Security Tab */}
          <CustomTabPanel value={tabValue} index={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Security Settings</Typography>
              {!editMode.security ? (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditToggle('security')}>
                  Change Password
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleEditToggle('security')}>Cancel</Button>
                  <Button variant="contained" size="small" onClick={() => handleSubmit('security')} disabled={saving}>Save</Button>
                </Box>
              )}
            </Box>

            <Box sx={{ maxWidth: 600, mt: 3 }}>
              {editMode.security ? (
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Alert severity="info" sx={{ mb: 2 }}>
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
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField 
                      fullWidth 
                      type="password" 
                      label="New Password" 
                      value={passwordData.newPassword} 
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField 
                      fullWidth 
                      type="password" 
                      label="Confirm New Password" 
                      value={passwordData.confirmPassword} 
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                  <LockIcon />
                  <Typography>Password is secure. Click "Change Password" to update it.</Typography>
                </Box>
              )}
            </Box>
          </CustomTabPanel>

          {/* My Activity Tab */}
          <CustomTabPanel value={tabValue} index={5}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>My Activity</Typography>
            
            {/* Seeker Section */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon /> Posted Jobs (Seeker)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {postedJobs.length === 0 ? (
                    <Typography color="text.secondary">You haven't posted any jobs yet.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {postedJobs.map((job) => (
                            <Grid size={{ xs: 12, md: 6 }} key={job._id}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold" component={Link} to={`/jobs/${job._id}`} sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}>
                                                {job.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                                            </Typography>
                                        </Box>
                                        <Chip 
                                            label={job.status.toUpperCase()} 
                                            size="small" 
                                            color={job.status === 'open' ? 'success' : job.status === 'completed' ? 'primary' : 'default'} 
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>
                                    <Box mt={1} display="flex" gap={1}>
                                        <Chip label={`${job.negotiations?.length || 0} Offers`} size="small" variant="outlined" />
                                        <Chip label={`$${job.originalPay}`} size="small" variant="outlined" icon={<AttachMoneyIcon />} />
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Provider Section */}
            <Box>
                <Typography variant="h6" fontWeight="bold" color="secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon /> Work & Offers (Provider)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Active Offers</Typography>
                {myOffers.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mb: 3 }}>No active offers sent.</Typography>
                ) : (
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {myOffers.map((offer) => (
                            <Grid size={{ xs: 12, md: 6 }} key={offer._id}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f9fafb' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" component={Link} to={`/jobs/${offer.job?._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                        {offer.job?.title || 'Unknown Job'}
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" mt={1}>
                                        <Typography variant="body2">Offered: <b>${offer.amount}</b></Typography>
                                        <Chip 
                                            label={offer.status.toUpperCase()} 
                                            size="small" 
                                            color={offer.status === 'accepted' ? 'success' : offer.status === 'rejected' ? 'error' : 'warning'} 
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Work History</Typography>
                {workedJobs.length === 0 ? (
                    <Typography color="text.secondary">No completed jobs yet.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {workedJobs.map((job) => (
                            <Grid size={{ xs: 12, md: 6 }} key={job._id}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: 'success.main' }}>
                                    <Typography variant="subtitle1" fontWeight="bold">{job.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">Completed on {format(new Date(job.updatedAt), 'MMM d, yyyy')}</Typography>
                                    <Chip label="Completed" color="success" size="small" sx={{ mt: 1 }} />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
          </CustomTabPanel>

          {/* Reviews Tab */}
          <CustomTabPanel value={tabValue} index={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
               <Typography variant="h5" fontWeight="bold">Reviews Received</Typography>
               <Box>
                   <Typography variant="caption" color="text.secondary">Seeker Rating: <strong>{Number(user.seekerRating || 0).toFixed(1)}</strong></Typography>
                   <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>Provider Rating: <strong>{Number(user.providerRating || 0).toFixed(1)}</strong></Typography>
               </Box>
            </Box>


            {reviews.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No reviews yet.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {/* Seeker Reviews Section */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper elevation={0} sx={{ p: 2, height: '100%', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                             <Box sx={{ p: 1, borderBottom: '1px solid #eee', mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                     <WorkIcon /> Reviews as Seeker
                                 </Typography>
                                 <Chip label={`${reviews.filter(r => r.job?.seekerId === user._id).length}`} size="small" />
                             </Box>
                             
                             <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
                                 {reviews.filter(r => r.job?.seekerId === user._id).length === 0 ? (
                                     <Box py={4} textAlign="center">
                                         <Typography color="text.secondary">No reviews received as Seeker.</Typography>
                                     </Box>
                                 ) : (
                                     <Box display="flex" flexDirection="column" gap={2}>
                                        {reviews.filter(r => r.job?.seekerId === user._id).map((review) => (
                                            <Paper key={review._id} variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                                {/* Review Content */}
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                    <Box display="flex" gap={1.5}>
                                                        <Avatar src={review.reviewer.avatar} sx={{ width: 32, height: 32 }}>{review.reviewer.name.charAt(0)}</Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight="bold">{review.reviewer.name}</Typography>
                                                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                                                <Rating value={review.rating} readOnly size="small" />
                                                                <Typography variant="caption" color="text.secondary">{format(new Date(review.createdAt), 'MMM d, yyyy')}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2" sx={{ mt: 1, mb: 1, fontStyle: 'italic' }}>"{review.comment}"</Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">Job: {review.job?.title}</Typography>
                                                
                                                {/* Reply Logic */}
                                                {review.response ? (
                                                    <Paper variant="outlined" sx={{ p: 1.5, mt: 1, bgcolor: '#ffffff', display: 'flex', gap: 1.5, borderLeft: '3px solid #1976d2' }}>
                                                        <ReplyIcon color="primary" fontSize="small" />
                                                        <Box>
                                                            <Typography variant="caption" fontWeight="bold" display="block">Your Reply</Typography>
                                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{review.response.message}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{format(new Date(review.response.createdAt), 'MMM d, yyyy')}</Typography>
                                                        </Box>
                                                    </Paper>
                                                ) : (
                                                    <Box mt={1.5}>
                                                        <TextField 
                                                            fullWidth 
                                                            size="small" 
                                                            placeholder="Msg..." 
                                                            value={replyInput[review._id] || ''}
                                                            onChange={(e) => setReplyInput({ ...replyInput, [review._id]: e.target.value })}
                                                            InputProps={{
                                                                sx: { fontSize: '0.85rem' },
                                                                endAdornment: (
                                                                    <Button 
                                                                        size="small" 
                                                                        onClick={() => handleReplySubmit(review._id)}
                                                                        disabled={!replyInput[review._id]}
                                                                        sx={{ minWidth: 60, p: 0 }}
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
                        <Paper elevation={0} sx={{ p: 2, height: '100%', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                             <Box sx={{ p: 1, borderBottom: '1px solid #eee', mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
                                     <WorkIcon /> Reviews as Provider
                                 </Typography>
                                 <Chip label={`${reviews.filter(r => r.job?.providerId === user._id).length}`} size="small" />
                             </Box>

                             <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
                                 {reviews.filter(r => r.job?.providerId === user._id).length === 0 ? (
                                     <Box py={4} textAlign="center">
                                         <Typography color="text.secondary">No reviews received as Provider.</Typography>
                                     </Box>
                                 ) : (
                                     <Box display="flex" flexDirection="column" gap={2}>
                                        {reviews.filter(r => r.job?.providerId === user._id).map((review) => (
                                            <Paper key={review._id} variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                                                {/* Review Content */}
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                    <Box display="flex" gap={1.5}>
                                                        <Avatar src={review.reviewer.avatar} sx={{ width: 32, height: 32 }}>{review.reviewer.name.charAt(0)}</Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight="bold">{review.reviewer.name}</Typography>
                                                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                                                <Rating value={review.rating} readOnly size="small" />
                                                                <Typography variant="caption" color="text.secondary">{format(new Date(review.createdAt), 'MMM d, yyyy')}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2" sx={{ mt: 1, mb: 1, fontStyle: 'italic' }}>"{review.comment}"</Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">Job: {review.job?.title}</Typography>
                                                
                                                {/* Reply Logic */}
                                                {review.response ? (
                                                    <Paper variant="outlined" sx={{ p: 1.5, mt: 1, bgcolor: '#ffffff', display: 'flex', gap: 1.5, borderLeft: '3px solid #1976d2' }}>
                                                        <ReplyIcon color="primary" fontSize="small" />
                                                        <Box>
                                                            <Typography variant="caption" fontWeight="bold" display="block">Your Reply</Typography>
                                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{review.response.message}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{format(new Date(review.response.createdAt), 'MMM d, yyyy')}</Typography>
                                                        </Box>
                                                    </Paper>
                                                ) : (
                                                    <Box mt={1.5}>
                                                        <TextField 
                                                            fullWidth 
                                                            size="small" 
                                                            placeholder="Msg..." 
                                                            value={replyInput[review._id] || ''}
                                                            onChange={(e) => setReplyInput({ ...replyInput, [review._id]: e.target.value })}
                                                            InputProps={{
                                                                sx: { fontSize: '0.85rem' },
                                                                endAdornment: (
                                                                    <Button 
                                                                        size="small" 
                                                                        onClick={() => handleReplySubmit(review._id)}
                                                                        disabled={!replyInput[review._id]}
                                                                        sx={{ minWidth: 60, p: 0 }}
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
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
