
import { Snackbar, Alert } from '@mui/material';
import { useToastStore } from '../store/toastStore';

const GlobalToast = () => {
  const { open, message, severity, hideToast } = useToastStore();

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideToast();
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        variant="filled" 
        sx={{ width: '100%', borderRadius: 2, fontWeight: 'medium', boxShadow: 3 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalToast;
