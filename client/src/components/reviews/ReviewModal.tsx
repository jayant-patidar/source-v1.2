import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Rating, TextField, Typography, Box } from '@mui/material';

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    revieweeName: string;
    submitting: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, onSubmit, revieweeName, submitting }) => {
    const [rating, setRating] = useState<number | null>(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (rating && comment) {
            onSubmit(rating, comment);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Rate {revieweeName}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={3} py={2}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography component="legend">How was your experience?</Typography>
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            size="large"
                            precision={0.5}
                        />
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Share your feedback"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={`Write a review for ${revieweeName}...`}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={!rating || !comment || submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewModal;
