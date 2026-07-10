import { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Typography, Stepper, Step, StepLabel, 
  MenuItem, Select, InputLabel, FormControl, Chip, Autocomplete, Grid,
  IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];
const STEPS = ['Account Info', 'Location', 'Role Profiles', 'Personalize'];

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useToastStore();

  const [activeStep, setActiveStep] = useState(0);
  
  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    name: '', email: '', password: '', confirmPassword: '', DOB: '', phone: '',
    // Step 2
    address: { unit: '', street: '', city: '', province: '', postalCode: '', county: '' },
    // Step 3
    providerProfile: { skills: [] as string[], serviceCategories: [] as string[], availability: '' },
    seekerProfile: { requestCategories: [] as string[] },
    // Step 4
    about: '', socialLinks: { linkedin: '', website: '' }, avatar: ''
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError, showToast]);

  const validateStep = (step: number) => {
    const newErrors: any = {};
    let isValid = true;

    if (step === 0) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password || formData.password.length < 6) newErrors.password = 'Password (min 6 chars) is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
      if (!formData.DOB) newErrors.DOB = 'DOB is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }

    if (step === 1) {
      if (!formData.address.street) newErrors.street = 'Street is required';
      if (!formData.address.city) newErrors.city = 'City is required';
      if (!formData.address.province) newErrors.province = 'Province is required';
      if (!formData.address.postalCode) newErrors.postalCode = 'Postal Code is required';
    }

    if (Object.keys(newErrors).length > 0) {
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    } else {
      showToast('Please fix the errors before proceeding', 'error');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      // Clean up empty optional arrays/objects before sending
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        DOB: formData.DOB,
        phone: formData.phone,
        address: formData.address,
        ...(formData.providerProfile.skills.length > 0 || formData.providerProfile.serviceCategories.length > 0 || formData.providerProfile.availability 
            ? { providerProfile: formData.providerProfile } : {}),
        ...(formData.seekerProfile.requestCategories.length > 0 ? { seekerProfile: formData.seekerProfile } : {}),
        ...(formData.about ? { about: formData.about } : {}),
        ...(formData.avatar ? { avatar: formData.avatar } : {}),
        ...(formData.socialLinks.linkedin || formData.socialLinks.website ? { socialLinks: formData.socialLinks } : {}),
      };

      await register(payload);
      showToast('Registration Successful!', 'success');
      navigate('/');
    } catch (err) {
      // Error handled in store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc', p: { xs: 2, md: 3 } }}>
      <Grid container sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', borderRadius: 4, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
        
        {/* Left Side: Visuals & Values */}
        <Grid size={{ xs: 12, md: 4, lg: 5 }} sx={{ 
          background: 'linear-gradient(135deg, #020617 0%, #312e81 100%)', 
          color: 'white', 
          p: { xs: 4, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Decorative Orbs */}
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <Box sx={{ mb: 'auto', position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AutoAwesomeIcon sx={{ color: '#818cf8', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>Source</Typography>
            </Box>
            
            <Typography variant="h3" fontWeight="900" sx={{ mb: 1, lineHeight: 1.1, letterSpacing: '-1px' }}>
              For the People, <br/>
              <span style={{ color: '#818cf8' }}>By the People.</span>
            </Typography>
            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 4, fontWeight: 400, maxWidth: 400, lineHeight: 1.3, fontSize: '1.1rem' }}>
              Get things done affordably, or help out to earn money. A true win-win community ecosystem.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ bgcolor: 'rgba(99,102,241,0.1)', p: 1.5, borderRadius: 2, height: 'fit-content' }}>
                  <TrendingUpIcon sx={{ color: '#818cf8' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>Get Things Done</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Can't do it yourself? Find reliable locals to handle your tasks without breaking the bank.</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(16,185,129,0.1)', p: 1.5, borderRadius: 2, height: 'fit-content' }}>
                  <SchoolIcon sx={{ color: '#34d399' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>Earn Extra Cash</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Use your skills to help others and easily make some extra money on your own schedule.</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(244,114,182,0.1)', p: 1.5, borderRadius: 2, height: 'fit-content' }}>
                  <MilitaryTechIcon sx={{ color: '#f472b6' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>Community Powered</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>People asking people. Both sides benefit, creating real value in a trusted neighborhood.</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Registration Form */}
        <Grid size={{ xs: 12, md: 8, lg: 7 }} sx={{ p: { xs: 3, sm: 4, md: 5 }, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {activeStep > 0 && (
                <IconButton onClick={handleBack} sx={{ color: '#64748b' }} size="small">
                  <ArrowBackIcon />
                </IconButton>
              )}
              <Typography variant="h5" fontWeight="900" sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
                Join the Community
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ color: '#64748b', display: { xs: 'none', sm: 'block' } }}>
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 700 }}>
                Login
              </Link>
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {STEPS.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconProps={{ 
                    sx: { 
                      color: activeStep >= index ? '#6366f1 !important' : '#e2e8f0 !important',
                      '& text': { fill: activeStep >= index ? 'white' : '#64748b', fontWeight: 700 }
                    } 
                  }}
                >
                  <Typography variant="caption" fontWeight="700" sx={{ color: activeStep >= index ? '#334155' : '#94a3b8' }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* STEP 1: ACCOUNT INFO */}
            {activeStep === 0 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField fullWidth name="name" label="Full Name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} />
                <TextField fullWidth name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                <TextField fullWidth name="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} />
                <TextField fullWidth name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} />
                <TextField fullWidth name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} />
                <TextField fullWidth name="DOB" label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} value={formData.DOB} onChange={handleChange} error={!!errors.DOB} helperText={errors.DOB} />
              </Box>
            )}

            {/* STEP 2: LOCATION */}
            {activeStep === 1 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <TextField fullWidth name="unit" label="Unit / Apt (Optional)" value={formData.address.unit} onChange={handleAddressChange as any} />
                <TextField fullWidth name="street" label="Street Address" value={formData.address.street} onChange={handleAddressChange as any} error={!!errors.street} helperText={errors.street} />
                <TextField fullWidth name="city" label="City" value={formData.address.city} onChange={handleAddressChange as any} error={!!errors.city} helperText={errors.city} />
                <FormControl fullWidth error={!!errors.province}>
                  <InputLabel>Province</InputLabel>
                  <Select name="province" value={formData.address.province} label="Province" onChange={handleAddressChange as any}>
                    {PROVINCES.map(prov => <MenuItem key={prov} value={prov}>{prov}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField fullWidth name="postalCode" label="Postal Code" value={formData.address.postalCode} onChange={handleAddressChange as any} error={!!errors.postalCode} helperText={errors.postalCode} />
                <TextField fullWidth name="county" label="County (Optional)" value={formData.address.county} onChange={handleAddressChange as any} />
              </Box>
            )}

            {/* STEP 3: ROLE PROFILES */}
            {activeStep === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#0f172a', mb: 0.5 }}>Provider Setup</Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>Optional: What kind of work can you do? What are your skills?</Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={['Plumbing', 'Cleaning', 'Tutoring', 'Web Design', 'Landscaping']}
                      value={formData.providerProfile.serviceCategories}
                      onChange={(_, newValue) => setFormData(p => ({ ...p, providerProfile: { ...p.providerProfile, serviceCategories: newValue } }))}
                      renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return <Chip variant="outlined" label={option} key={key} {...tagProps} />;
                        })
                      }
                      renderInput={(params) => <TextField {...params} label="Service Categories (e.g. Cleaning)" />}
                    />
                    <Autocomplete
                      multiple
                      freeSolo
                      options={['JavaScript', 'Carpentry', 'Customer Service']}
                      value={formData.providerProfile.skills}
                      onChange={(_, newValue) => setFormData(p => ({ ...p, providerProfile: { ...p.providerProfile, skills: newValue } }))}
                      renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return <Chip variant="outlined" label={option} key={key} {...tagProps} />;
                        })
                      }
                      renderInput={(params) => <TextField {...params} label="Skills (e.g. React, Carpentry)" />}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Availability</InputLabel>
                      <Select
                        value={formData.providerProfile.availability}
                        label="Availability"
                        onChange={(e) => setFormData(p => ({ ...p, providerProfile: { ...p.providerProfile, availability: e.target.value as string } }))}
                      >
                        <MenuItem value="Flexible">Flexible</MenuItem>
                        <MenuItem value="Weekends Only">Weekends Only</MenuItem>
                        <MenuItem value="Evenings">Evenings</MenuItem>
                        <MenuItem value="Full-Time">Full-Time</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#0f172a', mb: 0.5 }}>Seeker Setup</Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>Optional: What kind of help do you usually need?</Typography>
                  
                  <Autocomplete
                    multiple
                    freeSolo
                    options={['Home Repair', 'Delivery', 'Tech Support']}
                    value={formData.seekerProfile.requestCategories}
                    onChange={(_, newValue) => setFormData(p => ({ ...p, seekerProfile: { ...p.seekerProfile, requestCategories: newValue } }))}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return <Chip variant="outlined" label={option} key={key} {...tagProps} />;
                      })
                    }
                    renderInput={(params) => <TextField {...params} label="Types of jobs you usually post" />}
                  />
                </Box>
              </Box>
            )}

            {/* STEP 4: PERSONALIZE */}
            {activeStep === 3 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#0f172a', mb: -1 }}>Personalize Profile</Typography>
                  <Typography variant="body2" color="text.secondary">Make your profile stand out to build trust in the community.</Typography>
                  
                  <TextField 
                    fullWidth multiline rows={3} name="about" label="Bio / About Me" 
                    placeholder="Hi! I'm a local resident looking to help out and get help with..."
                    value={formData.about} onChange={handleChange} 
                  />
                  
                  <TextField 
                    fullWidth name="avatar" label="Avatar Image URL" 
                    placeholder="https://example.com/my-photo.jpg"
                    value={formData.avatar} onChange={handleChange} 
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    <TextField 
                      fullWidth label="LinkedIn URL" 
                      value={formData.socialLinks.linkedin} 
                      onChange={(e) => setFormData(p => ({ ...p, socialLinks: { ...p.socialLinks, linkedin: e.target.value } }))} 
                    />
                    <TextField 
                      fullWidth label="Personal Website URL" 
                      value={formData.socialLinks.website} 
                      onChange={(e) => setFormData(p => ({ ...p, socialLinks: { ...p.socialLinks, website: e.target.value } }))} 
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {/* Bottom Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pt: 5 }}>
              {activeStep === STEPS.length - 1 ? (
                <Button 
                  onClick={handleSubmit} 
                  variant="contained" 
                  disabled={isLoading} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: 'white', fontWeight: 800, px: 5, py: 1.5, borderRadius: 3,
                    boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                    transition: 'all 0.3s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 35px -5px rgba(99, 102, 241, 0.5)' }
                  }}
                >
                  {isLoading ? 'Creating...' : 'Complete Registration'}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  variant="contained" 
                  sx={{ 
                    background: '#0f172a', color: 'white', fontWeight: 800, px: 5, py: 1.5, borderRadius: 3,
                    transition: 'all 0.3s', '&:hover': { background: '#1e293b', transform: 'translateY(-2px)' }
                  }}
                >
                  Next Step
                </Button>
              )}
            </Box>
            
            <Typography variant="body2" sx={{ color: '#64748b', display: { xs: 'block', sm: 'none' }, mt: 3, textAlign: 'center' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 700 }}>
                Login
              </Link>
            </Typography>
            
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
