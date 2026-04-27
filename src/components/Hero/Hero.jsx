import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import styles from './Hero.module.css';
import heroBurger from '../../assets/hero_burger.jpg';

const Hero = () => {
  return (
    <Box className={styles.heroSection}>
      <Container maxWidth="lg" className={styles.heroContainer}>
        <Box className={styles.textContent}>
          <Typography variant="h1" className={styles.title}>
            Fedezd fel <br />
            <span className={styles.highlight}>Mr.Mon</span> ízvilágát!
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            A legújabb prémium utcai ételélmény, amely elhozza számodra a város legjavát. 
            Szaftos burgerek, ropogós sültkrumplik és fergeteges hangulat vár.
          </Typography>
          <Box className={styles.buttonGroup}>
            <Button 
              variant="contained" 
              color="primary" 
              className={styles.ctaButton}
              endIcon={<ArrowForwardIcon />}
            >
              Étlap Még Több
            </Button>
          </Box>
        </Box>
        <Box className={styles.imageContent}>
          <div className={styles.imageGlow}></div>
          <img src={heroBurger} alt="Mouth-watering double cheeseburger" className={styles.heroImage} />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
