'use client';

// import { auth, provider } from '@/firebase/config';
import { auth, provider } from '../../firebase/config';

import { signInWithPopup } from 'firebase/auth';
import { Button, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';



export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography variant="h4" mb={4}>Welcome to KaryaKart</Typography>
      <Button variant="contained" onClick={handleLogin}>
        Sign in with Google
      </Button>
    </Box>
  );
}
