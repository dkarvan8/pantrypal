import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';

const Recipes = () => {
  const router = useRouter();
  const { recipes } = router.query;

  // Convert the recipes string back into an array
  const recipesArray = recipes ? JSON.parse(recipes) : [];

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={2}
      sx={{ background: 'url("https://example.com/your-background-image.jpg") no-repeat center center fixed', backgroundSize: 'cover' }}
    >
      <Typography variant="h4" mb={2}>Recommended Recipes</Typography>
      <Box width="80%" maxWidth="600px">
        {recipesArray.length > 0 ? (
          recipesArray.map((recipe, index) => (
            <Typography key={index} variant="h6" mb={1}>
              {recipe}
            </Typography>
          ))
        ) : (
          <Typography variant="h6">No recipes found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Recipes;

