'use client'
import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const RECIPES_API_KEY = process.env.NEXT_PUBLIC_RECIPES_API_KEY;
const RECIPES_API_ENDPOINT = 'https://api.spoonacular.com/recipes/complexSearch';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${RECIPES_API_ENDPOINT}?apiKey=${RECIPES_API_KEY}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box width="100vw" height="100vh" p={4} display="flex" flexDirection="column" alignItems="center">
      <Button variant="contained" onClick={() => router.push('/')} sx={{ mb: 4 }}>
        Back to Home
      </Button>
      <Typography variant="h2" mb={4}>
        Recipes
      </Typography>
      <Stack spacing={4} width="100%" maxWidth="800px">
        {recipes.map((recipe) => (
          <Box
            key={recipe.id}
            p={2}
            border="1px solid #000"
            borderRadius={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h4">{recipe.title}</Typography>
            {recipe.image && <img src={recipe.image} alt={recipe.title} width="100%" />}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Recipes;
