import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  Autocomplete,
  Chip
} from '@mui/material';

interface EditJobDialogProps {
  open: boolean;
  onClose: () => void;
  job: any; // Using any for simplicity, but ideally should be the Job interface
  onSave: (jobId: string, updatedData: any) => Promise<void>;
}

const EditJobDialog: React.FC<EditJobDialogProps> = ({ open, onClose, job, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: { general: '', exact: '' },
    category: '',
    tags: [] as string[],
    requirements: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: {
            general: job.location?.general || '',
            exact: job.location?.exact || ''
        },
        category: job.category || '',
        tags: job.tags || [],
        requirements: job.requirements || []
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev as any)[parent],
                [child]: value
            }
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSave(job._id, formData);
      onClose();
    } catch (error) {
      console.error('Failed to update job', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Job</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                label="General Location"
                name="location.general"
                value={formData.location.general}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Exact Location"
                name="location.exact"
                value={formData.location.exact}
                onChange={handleChange}
                fullWidth
            />
          </Box>
          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formData.tags}
            onChange={(_, newValue) => {
                setFormData(prev => ({ ...prev, tags: newValue }));
            }}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags"
              />
            )}
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formData.requirements}
            onChange={(_, newValue) => {
                setFormData(prev => ({ ...prev, requirements: newValue }));
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
                placeholder="Add requirements (e.g. Truck, Shovel)"
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditJobDialog;
