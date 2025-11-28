import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 4, px: 2, mt: 'auto', backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Source. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
