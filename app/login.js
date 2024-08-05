// SignIn.jsx
'use client';
import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure the path is correct
import { Box, TextField, Button, Typography, CssBaseline } from '@mui/material';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log(result.user);
      sessionStorage.setItem('user', true);
      router.push('/'); // Ensure this path matches your main page
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <Box 
      sx={{ 
        background: 'url("https://i.pinimg.com/564x/06/fe/04/06fe04a34a036bf5cbc5b8820f72ecdd.jpg") no-repeat center center fixed', 
        backgroundSize: 'cover', 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute', 
        top: 0,
        left: 0
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 1,
          boxShadow: 3,
          width: '100%',
          maxWidth: 400,
          zIndex: 1, 
          position: 'relative'
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Sign In
        </Typography>
        <Box
          component="form"
          sx={{ mt: 1 }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={(e) => {
              e.preventDefault();
              // Handle email/password sign-in if needed
            }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={handleGoogleSignIn}
          >
            Sign In with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;

