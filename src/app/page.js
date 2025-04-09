'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Box textAlign="center">
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Welcome to KaryaKart
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={4}>
          Your Personal Task Manager. Stay Organized. Stay Ahead.
        </Typography>
        <Button variant="contained" size="large" onClick={handleGetStarted}>
          Get Started
        </Button>
      </Box>
    </Container>
  );
}
