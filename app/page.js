'use client';
import { useState, useEffect } from 'react';
import { firestore, auth, provider } from './firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { getDocs, collection, query, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setPantry(pantryList);
    console.log(pantryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updatePantry();
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      router.push('/'); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = () => {
    router.push('/sign-up'); 
  };

  const handleGenerateRecipes = () => {
    router.push('/recipes'); 
  };

  
  const filteredPantry = pantry.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={2}
      sx={{ background: 'url("https://png.pngtree.com/background/20230614/original/pngtree-an-illustration-of-a-pantry-with-pots-and-dishes-picture-image_3491498.jpg") no-repeat center center fixed', backgroundSize: 'cover' }}
    >
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={handleSignIn}>
          Sign In with Google
        </Button>
        <Button variant="contained"  onClick={handleSignUp}>
          Sign Up
        </Button>
        <Button variant="contained" onClick={handleGenerateRecipes}>
          Generate Recipes
        </Button>
      </Stack>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%,-50%)"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h2">Add Item</Typography>
          <Stack width="100%" direction="row">
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ 
          mb: 2, 
          mx: 2, 
          bgcolor: 'white', 
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
          },
        }}
      />
      <Box border="1px solid #000" width="800px" maxHeight="400px" bgcolor="">
        <Box
          width="100%"
          height="60px"
          display="flex"
          bgcolor="#f75533"
          alignItems="center"
          justifyContent="center"
          borderRadius={2}
          position="sticky"
          top="0"
          zIndex="100"
          mb={2}
        >
          <Typography variant="h4"  sx={{ fontSize: '1.5rem' }}>Inventory Items</Typography>
        </Box>
        <Stack width="100%" spacing={2} sx={{ height: 'calc(100% - 60px)' , overflowY: 'auto' }}>
          {filteredPantry.length > 0 ? (
            filteredPantry.map(({ name, quantity } ) => (
              <Box
                key={name}
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#7b320f"
                padding={2}
                borderRadius={2}
              >
                <Typography variant="h6" color="#ffdf95" textAlign="center" width="40%" sx={{ fontSize: '1.5rem' }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="#ffdf95" textAlign="center" width="20%" sx={{ fontSize: '1.5rem' }}>
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2} width="40%">
                  <Button variant="contained" sx={{
    backgroundColor: '#ffdf95', 
    color: '#7b320f', 
    '&:hover': {
      backgroundColor: 'darkgreen',
      fontSize: '1.5rem'},
  }}onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button variant="contained" sx={{
    backgroundColor: '#ffdf95', 
    color: '#7b320f', 
    '&:hover': {
      backgroundColor: 'darkgreen',fontSize: '1.5rem' 
    },
  }} onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          ) : (
            <Typography variant="h6" color="error" textAlign="center">
              Item not found
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}