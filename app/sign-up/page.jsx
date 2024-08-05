'use client';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; // Adjust the path as needed
import { Box, TextField, Button, Typography, CssBaseline, Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (res) {
        console.log({ res });
        sessionStorage.setItem('user', true);
        setEmail('');
        setPassword('');
        router.push('/'); // Redirect to the main page after successful sign up
      }
    } catch (e) {
      console.error(e);
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
          Sign Up
        </Typography>
        <Box
          component="form"
          sx={{ mt: 1 }}
          onSubmit={handleSignUp}
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
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error.message}
            </Typography>
          )}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <MuiLink 
              href="/" // Update this to your actual sign-in page path
              variant="body2" 
              onClick={(e) => {
                e.preventDefault();
                router.push('/'); // Redirect to sign-in page
              }}
              sx={{ cursor: 'pointer', color: 'primary.main' }}
            >
              Sign In
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;


