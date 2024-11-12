import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Card, CardContent } from '@mui/material';
import { CircularEcononomyType } from '../types/circular-allocation';
import CompostIcon from '@mui/icons-material/Recycling';
import BiogasIcon from '@mui/icons-material/LocalGasStation';
import UpcyclingIcon from '@mui/icons-material/Autorenew';
import { motion } from 'framer-motion';

interface DonationOption {
  id: CircularEcononomyType;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  color: string;
}

const donationOptions: DonationOption[] = [
  {
    id: 'COMPOSTING',
    title: 'Composting Programs',
    description: 'Support programs that transform food waste into valuable fertilizer for agriculture.',
    image: '/images/composting.jpg',
    icon: <CompostIcon sx={{ fontSize: 40 }} />,
    color: '#4CAF50',
  },
  {
    id: 'BIOGAS_GENERATION',
    title: 'Biogas Generation',
    description: 'Contribute to projects that convert organic waste into clean, renewable biogas energy.',
    image: '/images/biogas.jpg',
    icon: <BiogasIcon sx={{ fontSize: 40 }} />,
    color: '#2196F3',
  },
  {
    id: 'FOOD_UPCYCLING',
    title: 'Food Upcycling',
    description: 'Help initiatives that transform surplus food into new products, reducing food waste.',
    image: '/images/upcycling.jpg',
    icon: <UpcyclingIcon sx={{ fontSize: 40 }} />,
    color: '#FF9800',
  },
];

const CircularEconomyDonation: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<CircularEcononomyType | null>(null);

  const handleDonation = (optionId: CircularEcononomyType) => {
    setSelectedOption(optionId);
    // Here you'll implement the donation logic
  };

  return (
    <Box sx={{ py: 8, px: 2, bgcolor: '#ffffff' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: '#1A237E',
            mb: 2 
          }}
        >
          Support Circular Economy Initiatives
        </Typography>
        <Typography 
          variant="h5" 
          align="center" 
          sx={{ 
            color: 'text.secondary',
            mb: 8,
            maxWidth: '800px',
            mx: 'auto' 
          }}
        >
          Choose a cause to support sustainable food practices and help reduce waste
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {donationOptions.map((option) => (
            <Grid item xs={12} sm={6} md={4} key={option.id}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: 240,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(180deg, transparent 60%, ${option.color}22 100%)`,
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        backgroundImage: `url(${option.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'white',
                        borderRadius: '50%',
                        p: 1,
                        color: option.color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      {option.icon}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', color: option.color }}>
                      {option.title}
                    </Typography>
                    <Typography sx={{ mb: 3, color: 'text.secondary' }}>
                      {option.description}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 'auto',
                        bgcolor: option.color,
                        '&:hover': {
                          bgcolor: `${option.color}dd`,
                        },
                        borderRadius: 2,
                        py: 1.5,
                      }}
                      onClick={() => handleDonation(option.id)}
                    >
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default CircularEconomyDonation;