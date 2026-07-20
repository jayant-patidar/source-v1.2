import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Grid, CircularProgress, Autocomplete, Chip, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useGigStore } from '../store/gigStore';

const validationSchema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Title should be under 100 characters'),
  description: yup.string().required('Description is required').min(20, 'Description should be at least 20 characters'),
  category: yup.string().required('Category is required'),
  price: yup.number().required('Price is required').min(1, 'Price must be greater than 0'),
  tags: yup.array().of(yup.string()),
});

const categories = [
  'Development', 'Design', 'Marketing', 'Writing', 
  'Home Services', 'Cleaning', 'Handyman', 'Other'
];

const predefinedTags = [
  'React', 'Node.js', 'UI/UX', 'Logo', 'SEO', 'Plumbing', 'Electrical', 'Assembly', 'Moving'
];

const CreateGig = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const { createGig } = useGigStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      showToast('Please login to post a Gig', 'error');
      navigate('/login');
    }
  }, [user, navigate, showToast]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      price: '',
      tags: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await createGig({
          title: values.title,
          description: values.description,
          category: values.category,
          price: Number(values.price),
          tags: values.tags,
        });
        showToast('Gig created successfully!', 'success');
        navigate('/activity'); // Navigate to Activity where they can see "My Gigs"
      } catch (error: any) {
        showToast(error.message || 'Failed to create gig', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #eee' }}>
        <Box display="flex" alignItems="center" mb={1}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1, ml: -1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Create a New Gig
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Offer a pre-packaged service for a fixed price.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Gig Title"
                placeholder="e.g. I will design a modern logo"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                placeholder="Describe exactly what is included in this gig..."
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                id="category"
                options={categories}
                value={formik.values.category}
                onChange={(e, value) => formik.setFieldValue('category', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    error={formik.touched.category && Boolean(formik.errors.category)}
                    helperText={formik.touched.category && formik.errors.category}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Fixed Price ($)"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Autocomplete
                multiple
                id="tags"
                options={predefinedTags}
                freeSolo
                value={formik.values.tags}
                onChange={(e, value) => formik.setFieldValue('tags', value)}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags (Optional)"
                    placeholder="Add tags"
                    helperText="Press enter to add custom tags"
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Publish Gig'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateGig;
