import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, TextField, Typography, Grid, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password should be of minimum 6 characters length').required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError, showToast]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values);
        showToast('Login Successful!', 'success');
        navigate('/');
      } catch (err) {
        // Error handled in store
      }
    },
  });

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc', p: { xs: 2, md: 3 } }}>
      <Grid container sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', borderRadius: 4, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
        
        {/* Left Side: Visuals & Values */}
        <Grid size={{ xs: 12, md: 5, lg: 6 }} sx={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
          color: 'white', 
          p: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Decorative Orbs */}
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <Box sx={{ mb: 'auto', position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AutoAwesomeIcon sx={{ color: '#818cf8', fontSize: 28 }} />
              <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: '-0.5px' }}>Source</Typography>
            </Box>
            
            <Typography variant="h4" fontWeight="900" sx={{ mb: 1, lineHeight: 1.1, letterSpacing: '-1px' }}>
              For the People, <br/>
              <span style={{ color: '#818cf8' }}>By the People.</span>
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3, fontWeight: 400, maxWidth: 400, lineHeight: 1.3 }}>
              Get things done affordably, or help out to earn money. A true win-win community ecosystem.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ bgcolor: 'rgba(99,102,241,0.1)', p: 1.5, borderRadius: 2, height: 'fit-content' }}>
                  <AutoAwesomeIcon sx={{ color: '#818cf8' }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 0 }}>Get Things Done</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Can't do it yourself? Find reliable locals to handle your tasks without breaking the bank.</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(16,185,129,0.1)', p: 1.5, borderRadius: 2, height: 'fit-content' }}>
                  <AccountBalanceWalletIcon sx={{ color: '#34d399' }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 0 }}>Earn Extra Cash</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Use your skills to help others and easily make some extra money on your own schedule.</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(244,114,182,0.1)', p: 1.5, borderRadius: 2, height: 'fit-content' }}>
                  <HandshakeIcon sx={{ color: '#f472b6' }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 0 }}>Community Powered</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>People asking people. Both sides benefit, creating real value in a trusted neighborhood.</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* Glassmorphism Badge */}
          <Box sx={{ mt: 3, p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-flex', alignItems: 'center', gap: 2, alignSelf: 'flex-start' }}>
             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Our Mission</Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>Built for the Community</Typography>
             </Box>
          </Box>
        </Grid>

        {/* Right Side: Login Form */}
        <Grid size={{ xs: 12, md: 7, lg: 6 }} sx={{ p: { xs: 3, sm: 4, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <Box sx={{ maxWidth: 450, width: '100%', mx: 'auto' }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="900" sx={{ color: '#0f172a', mb: 1, letterSpacing: '-0.5px' }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Login to access your Source dashboard
              </Typography>
            </Box>
            
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' } }
                  }}
                />
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' } }
                  }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                  <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    Forgot password?
                  </Typography>
                </Box>

                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={isLoading}
                  sx={{ 
                    mt: 1, 
                    py: 1.8, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 15px 35px -5px rgba(99, 102, 241, 0.5)',
                      transform: 'translateY(-2px)'
                    },
                    '&.Mui-disabled': {
                      background: '#e2e8f0',
                      color: '#94a3b8',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                </Button>
                
                <Box textAlign="center" sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 700 }}>
                      Create one now
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
