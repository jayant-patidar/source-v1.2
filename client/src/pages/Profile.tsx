import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Avatar, TextField, Button, Grid, Chip, MenuItem, Alert, CircularProgress, IconButton, Divider, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
  const [isEditing, setIsEditing] = useState(false);

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
    socialLinks: {
      linkedin: '',
      github: '',
      website: ''
    }
  });
  const [skillInput, setSkillInput] = useState('');

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
        socialLinks: {
          linkedin: data.socialLinks?.linkedin || '',
          github: data.socialLinks?.github || '',
          website: data.socialLinks?.website || ''
        }
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, { withCredentials: true });
      const updatedUser = { ...authUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
              {!isEditing ? (
                <Button 
                  variant="contained" 
                  startIcon={<EditIcon />} 
                  onClick={() => setIsEditing(true)}
                  sx={{ borderRadius: 5, textTransform: 'none', px: 3 }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                   <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<CancelIcon />} 
                    onClick={() => setIsEditing(false)}
                    sx={{ borderRadius: 5, textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />} 
                    onClick={handleSubmit}
                    disabled={saving}
                    sx={{ borderRadius: 5, textTransform: 'none' }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              )}
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
            <Tab label="Contact & Social" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box component={isEditing ? 'form' : 'div'}>
          {success && <Alert severity="success" sx={{ m: 3 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>}

          {/* Personal Info Tab */}
          <CustomTabPanel value={tabValue} index={0}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>About</Typography>
            {isEditing ? (
              <TextField fullWidth multiline rows={4} label="About Me" name="about" value={formData.about} onChange={handleChange} sx={{ mb: 3 }} />
            ) : (
              <Typography variant="body1" color="text.secondary" paragraph>{user.about || 'No bio provided.'}</Typography>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Details</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {isEditing ? (
                   <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} />
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1">{user.name}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                 {isEditing ? (
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
            <Typography variant="h6" fontWeight="bold" gutterBottom>Skills</Typography>
             {isEditing && (
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
              {(isEditing ? formData.skills : user.skills)?.map((skill: string, index: number) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  onDelete={isEditing ? () => handleDeleteSkill(skill) : undefined} 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
              {(!user.skills?.length && !isEditing) && <Typography color="text.secondary">No skills added.</Typography>}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Job Preferences</Typography>
            <Grid container spacing={3}>
               <Grid size={{ xs: 12, sm: 6 }}>
                 {isEditing ? (
                    <TextField fullWidth label="Min Pay ($/hr)" type="number" value={formData.preferences.minPay} onChange={(e) => handleNestedChange('preferences', 'minPay', e.target.value)} />
                 ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Minimum Pay</Typography>
                      <Typography variant="body1">{user.preferences?.minPay ? `$${user.preferences.minPay}/hr` : 'Not specified'}</Typography>
                    </Box>
                 )}
               </Grid>
               <Grid size={{ xs: 12, sm: 6 }}>
                 {isEditing ? (
                    <TextField fullWidth label="Preferred Location" value={formData.preferences.location} onChange={(e) => handleNestedChange('preferences', 'location', e.target.value)} />
                 ) : (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Preferred Location</Typography>
                      <Typography variant="body1">{user.preferences?.location || 'Not specified'}</Typography>
                    </Box>
                 )}
               </Grid>
               <Grid size={{ xs: 12, sm: 6 }}>
                 {isEditing ? (
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

          {/* Contact & Social Tab */}
          <CustomTabPanel value={tabValue} index={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Contact Information</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                 {isEditing ? (
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
                 {isEditing ? (
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
                 {isEditing ? (
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
             {isEditing ? (
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
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
