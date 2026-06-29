import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, TextField, Typography, Container, MenuItem, Paper, FormControlLabel, Switch, Autocomplete, Chip, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  pay: yup.number().required('Pay is required').positive(),
  type: yup.string().required('Job Type is required'),
  category: yup.string().required('Category is required'),
  generalLocation: yup.string().required('General Location is required'),
  exactLocation: yup.string().required('Exact Location is required'),
  jobDate: yup.date().required('Job Date is required'),
  jobTime: yup.string().required('Job Time is required'),
  expirationDate: yup.date().required('Expiration Date is required'),
  expirationTime: yup.string().required('Expiration Time is required'),
  requirements: yup.array().of(yup.string()),
});

const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob, isLoading } = useJobStore();
  const { showToast } = useToastStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      showToast('Please login to seek a service', 'warning');
      navigate('/login');
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      pay: '',
      type: 'fixed',
      category: '',
      generalLocation: '',
      exactLocation: '',
      jobDate: '',
      jobTime: '',
      expirationDate: '',
      expirationTime: '',
      isNegotiable: false,
      visibility: true,
      tags: '',
      requirements: [] as string[],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          title: values.title,
          description: values.description,
          pay: Number(values.pay),
          type: values.type,
          category: values.category,
          location: {
            general: values.generalLocation,
            exact: values.exactLocation
          },
          generalLocation: values.generalLocation,
          exactLocation: values.exactLocation,
          jobDate: values.jobDate,
          jobTime: values.jobTime,
          expirationDate: `${values.expirationDate}T${values.expirationTime}`,
          isNegotiable: values.isNegotiable,
          visibility: values.visibility,
          tags: values.tags, // Controller handles string splitting
          requirements: values.requirements,
        };
        // console.log('Submitting Job Payload:', payload);
        await createJob(payload);
        showToast('Job Posted Successfully!', 'success');
        navigate('/');
      } catch (err) {
        showToast('Failed to post job. Please try again.', 'error');
      }
    },
  });

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Post a Job
          </Typography>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Job Title"
            margin="normal"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            margin="normal"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              id="pay"
              name="pay"
              label="Pay Amount"
              type="number"
              margin="normal"
              value={formik.values.pay}
              onChange={formik.handleChange}
              error={formik.touched.pay && Boolean(formik.errors.pay)}
              helperText={formik.touched.pay && formik.errors.pay}
            />
            <TextField
              fullWidth
              select
              id="type"
              name="type"
              label="Job Type"
              margin="normal"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
            >
              <MenuItem value="fixed">Fixed</MenuItem>
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="negotiable">Negotiable</MenuItem>
            </TextField>
          </Box>
          <TextField
            fullWidth
            id="category"
            name="category"
            label="Category (e.g. Cleaning, Moving)"
            margin="normal"
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                fullWidth
                id="generalLocation"
                name="generalLocation"
                label="General Location (City/Area)"
                margin="normal"
                value={formik.values.generalLocation}
                onChange={formik.handleChange}
                error={formik.touched.generalLocation && Boolean(formik.errors.generalLocation)}
                helperText={formik.touched.generalLocation && formik.errors.generalLocation}
            />
            <TextField
                fullWidth
                id="exactLocation"
                name="exactLocation"
                label="Exact Location (Address)"
                margin="normal"
                value={formik.values.exactLocation}
                onChange={formik.handleChange}
                error={formik.touched.exactLocation && Boolean(formik.errors.exactLocation)}
                helperText={formik.touched.exactLocation && formik.errors.exactLocation}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                fullWidth
                id="jobDate"
                name="jobDate"
                label="Job Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formik.values.jobDate}
                onChange={formik.handleChange}
                error={formik.touched.jobDate && Boolean(formik.errors.jobDate)}
                helperText={formik.touched.jobDate && formik.errors.jobDate}
            />
            <TextField
                fullWidth
                id="jobTime"
                name="jobTime"
                label="Job Time"
                type="time"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formik.values.jobTime}
                onChange={formik.handleChange}
                error={formik.touched.jobTime && Boolean(formik.errors.jobTime)}
                helperText={formik.touched.jobTime && formik.errors.jobTime}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                fullWidth
                id="expirationDate"
                name="expirationDate"
                label="Expiration Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formik.values.expirationDate}
                onChange={formik.handleChange}
                error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                helperText={formik.touched.expirationDate && formik.errors.expirationDate}
            />
            <TextField
                fullWidth
                id="expirationTime"
                name="expirationTime"
                label="Expiration Time"
                type="time"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={formik.values.expirationTime}
                onChange={formik.handleChange}
                error={formik.touched.expirationTime && Boolean(formik.errors.expirationTime)}
                helperText={formik.touched.expirationTime && formik.errors.expirationTime}
            />
          </Box>

            <TextField
                fullWidth
                id="tags"
                name="tags"
                label="Tags (comma separated)"
                margin="normal"
                value={formik.values.tags}
                onChange={formik.handleChange}
                placeholder="e.g. urgent, weekend, heavy-lifting"
            />

            <Autocomplete
                multiple
                freeSolo
                id="requirements"
                options={[]}
                value={formik.values.requirements}
                onChange={(_, newValue) => {
                    formik.setFieldValue('requirements', newValue);
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Requirements"
                        placeholder="Type and press Enter"
                        margin="normal"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                    />
                )}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
                <FormControlLabel
                    control={
                    <Switch
                        checked={formik.values.isNegotiable}
                        onChange={formik.handleChange}
                        name="isNegotiable"
                    />
                    }
                    label="Negotiable Pay"
                />
                <FormControlLabel
                    control={
                    <Switch
                        checked={formik.values.visibility}
                        onChange={formik.handleChange}
                        name="visibility"
                    />
                    }
                    label="Public Visibility"
                />
            </Box>

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            size="large"
            sx={{ mt: 3, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post Job'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateJob;
