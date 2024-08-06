'use client';
import { useState, useEffect } from 'react';
import { firestore, auth, provider } from './firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { getDocs, collection, query, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
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

  const getRecipeRecommendations = async (inventoryItems) => {
    const prompt = `Given the following ingredients: ${inventoryItems.join(', ')}. Suggest some healthy recipes.`;

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt }
        ],
      }, {
        headers: {
          "Authorization": `Bearer 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`, // Replace YOUR_ACTUAL_API_KEY with your actual API key
          "Content-Type": "application/json"
        }
      });

      if (response.data) {
        const recipes = response.data.choices[0].message.content.trim().split('\n');
        setRecommendedRecipes(recipes);
      } else {
        console.error('Failed to get recipe recommendations');
      }
    } catch (error) {
      console.error('Error getting recipe recommendations:', error);
    }
  };

  const handleGetRecipes = async () => {
    const inventoryItems = pantry.map(item => item.name);
    await getRecipeRecommendations(inventoryItems);
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
      sx={{ background: 'url("https://png.pngtree.com/background/20230614/original/pngtree-an-illustration-of-a-pantry-with-pots-and-dishes-picture-image_3491498.jpg")',
        backgroundSize : 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        height: '100vh',
        width: '100vw',
        
       }}
    >
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={handleSignIn}>
          Sign In with Google
        </Button>
        <Button variant="contained" onClick={handleSignUp}>
          Sign Up
        </Button>
      </Stack>
      <div>
        <Button variant="contained" onClick={handleGetRecipes}>
          Get Recipes
        </Button>
        {recommendedRecipes.length > 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            border="1px solid #000"
            width="100%"
            padding={2}
            flexWrap="wrap"
            maxWidth="1200px"
            maxHeight="150px"
            bgcolor="#f2c175"
            color="#d83924"
            p={2}
            borderRadius={1}
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: "column",
              height: 900,
              overflowY: "scroll",
              overflowX: "scroll",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <Typography variant="h6" mb={2}>Recommended Recipes:</Typography>
            <Stack spacing={1}>
              {recommendedRecipes.map((recipe, index) => (
                <Typography key={index} variant="body1">
                  {recipe}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}
      </div>
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
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, mt: 4, width: '400px' }}>
        <Button variant="contained" onClick={handleOpen}>
          Add Item
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            bgcolor: 'white', 
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
            },
            flex: 1
          }}
        />
      </Stack>
      <Box border="1px solid #000" width="800px" maxHeight="500px" bgcolor="" mt={4} sx={{ overflowY: 'auto' }}>
        <Box
          width="100%"
          height="40px"
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
          <Typography variant="h4" sx={{ fontSize: '1.5rem' }}>Inventory Items</Typography>
        </Box>
        <Stack width="100%" spacing={2} sx={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
          {filteredPantry.length > 0 ? (
            filteredPantry.map(({ name, quantity }) => (
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
                  <Button 
                    variant="contained" 
                    sx={{
                      backgroundColor: '#ffdf95', 
                      color: '#7b320f', 
                      '&:hover': {
                        backgroundColor: 'darkgreen',
                        fontSize: '1.5rem'
                      },
                    }}
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>
                  <Button 
                    variant="contained" 
                    sx={{
                      backgroundColor: '#ffdf95', 
                      color: '#7b320f', 
                      '&:hover': {
                        backgroundColor: 'darkgreen',
                        fontSize: '1.5rem' 
                      },
                    }} 
                    onClick={() => removeItem(name)}
                  >
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

