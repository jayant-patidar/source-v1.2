import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Grid, CircularProgress, Autocomplete, Chip, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useGigStore } from '../store/gigStore';
import { getGigById } from '../services/gig.service';

const validationSchema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Title should be under 100 characters'),
  description: yup.string().required('Description is required').min(20, 'Description should be at least 20 characters'),
  category: yup.string().required('Category is required'),
  price: yup.number().required('Price is required').min(1, 'Price must be greater than 0'),
  tags: yup.array().of(yup.string()),
  expirationDate: yup.date().min(new Date(new Date().setHours(0,0,0,0)), 'Expiration date cannot be in the past').nullable(),
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
  const { createGig, updateGig } = useGigStore();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditMode = Boolean(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      price: '',
      tags: [] as string[],
      expirationDate: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = {
          title: values.title,
          description: values.description,
          category: values.category,
          price: Number(values.price),
          tags: values.tags,
          expirationDate: values.expirationDate || undefined,
        };

        if (isEditMode && id) {
          await updateGig(id, payload);
          showToast('Gig updated successfully!', 'success');
        } else {
          await createGig(payload);
          showToast('Gig created successfully!', 'success');
        }
        navigate('/activity');
      } catch (error: any) {
        showToast(error.message || `Failed to ${isEditMode ? 'update' : 'create'} gig`, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!user) {
      showToast('Please login to post a Gig', 'error');
      navigate('/login');
    }
  }, [user, navigate, showToast]);

  useEffect(() => {
    const fetchGig = async () => {
      if (isEditMode && id) {
        try {
          const gigData = await getGigById(id);
          if (gigData.providerId._id !== user?._id && gigData.providerId !== user?._id) {
             showToast('Not authorized to edit this gig', 'error');
             navigate('/activity');
             return;
          }
          formik.setValues({
            title: gigData.title || '',
            description: gigData.description || '',
            category: gigData.category || '',
            price: gigData.price ? String(gigData.price) : '',
            tags: gigData.tags || [],
            expirationDate: gigData.expirationDate ? new Date(gigData.expirationDate).toISOString().split('T')[0] : '',
          });
        } catch (error) {
          showToast('Failed to load gig data', 'error');
          navigate('/activity');
        } finally {
          setInitialLoading(false);
        }
      }
    };
    fetchGig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, id, user, navigate, showToast]);

  if (!user) return null;
  
  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #eee' }}>
        <Box display="flex" alignItems="center" mb={1}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1, ml: -1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            {isEditMode ? 'Edit Gig' : 'Create a New Gig'}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {isEditMode ? 'Update your service offering details below.' : 'Offer a pre-packaged service for a fixed price.'}
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
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="expirationDate"
                name="expirationDate"
                label="Expiration Date (Optional)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.expirationDate}
                onChange={formik.handleChange}
                error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                helperText={(formik.touched.expirationDate && formik.errors.expirationDate) || "If set, the gig will hide from the public feed after this date."}
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
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Save Changes' : 'Publish Gig')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateGig;
