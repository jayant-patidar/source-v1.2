import { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Typography, Container, Paper, Stepper, Step, StepLabel, 
  MenuItem, Select, InputLabel, FormControl, Chip, Autocomplete} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];
const STEPS = ['Account Info', 'Location', 'Role Profiles (Optional)', 'Personalize (Optional)'];

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
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 4, mt: 5, mb: 5, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="700" color="primary">
          Join the Community
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5, mt: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* STEP 1: ACCOUNT INFO */}
        {activeStep === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Provider Setup (If you want to offer services)</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>What kind of work can you do? What are your skills?</Typography>
              
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
                sx={{ mb: 2 }}
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
                sx={{ mb: 2 }}
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

            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Seeker Setup (If you want to hire people)</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>What kind of help do you usually need?</Typography>
              
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

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
            Back
          </Button>
          
          <Box>
            <Link to="/login" style={{ textDecoration: 'none', color: '#2563eb', marginRight: '20px', fontSize: '14px', fontWeight: 500 }}>
              Already have an account? Login
            </Link>
            
            {activeStep === STEPS.length - 1 ? (
              <Button onClick={handleSubmit} variant="contained" disabled={isLoading} sx={{ bgcolor: 'black' }}>
                {isLoading ? 'Creating...' : 'Complete Registration'}
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained" sx={{ bgcolor: 'black' }}>
                Next Step
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
