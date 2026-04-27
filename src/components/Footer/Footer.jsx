import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Facebook as FacebookIcon, Instagram as InstagramIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import styles from './Footer.module.css';
import logo from '../../assets/logo.jpg';

const Footer = () => {
  return (
    <Box className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4} className={styles.footerGrid}>
          <Grid item xs={12} md={4}>
            <Box className={styles.brandInfo}>
              <img src={logo} alt="Mr.Mon Logo" className={styles.footerLogo} />
              <Typography variant="body2" className={styles.aboutText}>
                A legfinomabb streetfood a városban. Friss alapanyagok, titkos receptek, 
                gyors kiszolgálás. Fedezd fel a Mon élményt!
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Információk
            </Typography>
            <ul className={styles.linkList}>
              <li><a href="#">Rólunk</a></li>
              <li><a href="#">Karrier</a></li>
              <li><a href="#">Éttermeink</a></li>
            </ul>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Segítség
            </Typography>
            <ul className={styles.linkList}>
              <li><a href="#">GYIK</a></li>
              <li><a href="#">Kapcsolat</a></li>
              <li><a href="#">Allergének</a></li>
            </ul>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Kövess minket
            </Typography>
            <Box className={styles.socialIcons}>
              <IconButton className={styles.iconBtn}><FacebookIcon /></IconButton>
              <IconButton className={styles.iconBtn}><InstagramIcon /></IconButton>
              <IconButton className={styles.iconBtn}><TwitterIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box className={styles.bottomBar}>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} Mr.Mon's Streetfood. Minden jog fenntartva.
          </Typography>
          <Box className={styles.legalLinks}>
            <a href="#">Adatkezelési tájékoztató</a>
            <a href="#">ÁSZF</a>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
