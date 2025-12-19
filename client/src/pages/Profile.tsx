import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Paper, Avatar, TextField, Button, Grid, Chip, MenuItem, Alert, CircularProgress, IconButton, Divider, Tabs, Tab } from '@mui/material';
import axios from 'axios';
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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReplyIcon from '@mui/icons-material/Reply';
import { Rating } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
    address: '',
    DOB: '',
    about: '',
    availability: '',
    skills: [],
    preferences: {
      jobTypes: [],
      categories: [],
      minPay: '',
      location: ''
    },
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
      const { data } = await axios.get('http://localhost:5000/api/users/profile', { withCredentials: true });
      setProfileData(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        DOB: data.DOB ? format(new Date(data.DOB), 'yyyy-MM-dd') : '',
        about: data.about || '',
        availability: data.availability || '',
        skills: data.skills || [],
        preferences: {
          jobTypes: data.preferences?.jobTypes || [],
          categories: data.preferences?.categories || [],
          minPay: data.preferences?.minPay || '',
          location: data.preferences?.location || ''
        },
        portfolio: data.portfolio || [],
        socialLinks: {
          linkedin: data.socialLinks?.linkedin || '',
          github: data.socialLinks?.github || '',
          website: data.socialLinks?.website || ''
        }
      });

      // Fetch Activity Data
      const postedRes = await axios.get('http://localhost:5000/api/jobs/posted', { withCredentials: true });
      setPostedJobs(postedRes.data);

      const offersRes = await axios.get('http://localhost:5000/api/negotiations/my-offers', { withCredentials: true });
      setMyOffers(offersRes.data);

      const workedRes = await axios.get('http://localhost:5000/api/jobs/worked', { withCredentials: true });
      setWorkedJobs(workedRes.data);

      const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/${data._id}`, { withCredentials: true });
      setReviews(reviewsRes.data);

    } catch (err: any) {
      setError('Failed to load profile data');
      console.error(err);
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

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((skill: string) => skill !== skillToDelete) });
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

      const { data } = await axios.put('http://localhost:5000/api/users/profile', payload, { withCredentials: true });
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
          console.log(`[DEBUG] handleReplySubmit: Submitting reply for review ${reviewId}, message: ${message}`);
          const { data } = await axios.post(`http://localhost:5000/api/reviews/${reviewId}/reply`, { message }, { withCredentials: true });
          console.log(`[DEBUG] handleReplySubmit success, data:`, data);

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
            height: 200, 
            background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
            position: 'relative'
          }}
        />
        
        {/* Profile Content */}
        <Box sx={{ px: 4, pb: 4, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: -8, mb: 2 }}>
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
              <Box sx={{ ml: 3, mb: 2, mt: 6 }}>
                <Typography variant="h4" fontWeight="bold">{user.name}</Typography>
                <Typography variant="h6" color="text.secondary">{user.about?.split('.')[0] || 'No headline'}</Typography>
                
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              {/* Global edit buttons removed */}
            </Box>
          </Box>

          {/* Ratings */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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

            <Typography variant="h6" fontWeight="bold" gutterBottom>Details</Typography>
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
          </CustomTabPanel>

          {/* Skills & Preferences Tab */}
          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Skills</Typography>
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

             {editMode.skills && (
                <TextField 
                  fullWidth 
                  label="Add a skill (Press Enter)" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)} 
                  onKeyDown={handleAddSkill} 
                  helperText="Press Enter to add"
                  sx={{ mb: 2 }}
                />
             )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {(editMode.skills ? formData.skills : user.skills)?.map((skill: string, index: number) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  onDelete={editMode.skills ? () => handleDeleteSkill(skill) : undefined} 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
              {(!user.skills?.length && !editMode.skills) && <Typography color="text.secondary">No skills added.</Typography>}
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>Job Types</Typography>
             {editMode.skills && (
                <TextField 
                  fullWidth 
                  label="Add job type (e.g. Full-time, Remote) - Press Enter" 
                  value={jobTypeInput} 
                  onChange={(e) => setJobTypeInput(e.target.value)} 
                  onKeyDown={(e) => handleAddArrayItem(e, 'preferences', jobTypeInput, setJobTypeInput, 'jobTypes')} 
                  helperText="Press Enter to add"
                  sx={{ mb: 2 }}
                />
             )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {(editMode.skills ? formData.preferences.jobTypes : user.preferences?.jobTypes)?.map((type: string, index: number) => (
                <Chip 
                  key={index} 
                  label={type} 
                  onDelete={editMode.skills ? () => handleDeleteArrayItem(type, 'preferences', 'jobTypes') : undefined} 
                  color="info" 
                  variant="outlined" 
                />
              ))}
              {(!user.preferences?.jobTypes?.length && !editMode.skills) && <Typography color="text.secondary">No job types specified.</Typography>}
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom>Categories</Typography>
             {editMode.skills && (
                <TextField 
                  fullWidth 
                  label="Add category (e.g. Engineering, Design) - Press Enter" 
                  value={categoryInput} 
                  onChange={(e) => setCategoryInput(e.target.value)} 
                  onKeyDown={(e) => handleAddArrayItem(e, 'preferences', categoryInput, setCategoryInput, 'categories')} 
                  helperText="Press Enter to add"
                  sx={{ mb: 2 }}
                />
             )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {(editMode.skills ? formData.preferences.categories : user.preferences?.categories)?.map((cat: string, index: number) => (
                <Chip 
                  key={index} 
                  label={cat} 
                  onDelete={editMode.skills ? () => handleDeleteArrayItem(cat, 'preferences', 'categories') : undefined} 
                  color="success" 
                  variant="outlined" 
                />
              ))}
              {(!user.preferences?.categories?.length && !editMode.skills) && <Typography color="text.secondary">No categories specified.</Typography>}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Job Preferences</Typography>
            <Grid container spacing={3}>
               <Grid size={{ xs: 12, sm: 6 }}>
                 {editMode.skills ? (
                    <TextField fullWidth label="Min Pay ($/hr)" type="number" value={formData.preferences.minPay} onChange={(e) => handleNestedChange('preferences', 'minPay', e.target.value)} />
                 ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Minimum Pay</Typography>
                      <Typography variant="body1">{user.preferences?.minPay ? `$${user.preferences.minPay}/hr` : 'Not specified'}</Typography>
                    </Box>
                 )}
               </Grid>
               <Grid size={{ xs: 12, sm: 6 }}>
                 {editMode.skills ? (
                    <TextField fullWidth label="Preferred Location" value={formData.preferences.location} onChange={(e) => handleNestedChange('preferences', 'location', e.target.value)} />
                 ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Preferred Location</Typography>
                      <Typography variant="body1">{user.preferences?.location || 'Not specified'}</Typography>
                    </Box>
                 )}
               </Grid>
               <Grid size={{ xs: 12, sm: 6 }}>
                 {editMode.skills ? (
                   <TextField fullWidth label="Availability" name="availability" select value={formData.availability} onChange={handleChange}>
                      <MenuItem value="Full-time">Full-time</MenuItem>
                      <MenuItem value="Part-time">Part-time</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                      <MenuItem value="Freelance">Freelance</MenuItem>
                   </TextField>
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Availability</Typography>
                    <Typography variant="body1">{user.availability || 'Not specified'}</Typography>
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
               <Grid size={12}>
                 {editMode.social ? (
                    <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} />
                 ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocationOnIcon color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                        <Typography variant="body1">{user.address || 'Not specified'}</Typography>
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
