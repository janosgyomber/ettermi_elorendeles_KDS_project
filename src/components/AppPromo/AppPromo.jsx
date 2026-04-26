import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Apple as AppleIcon, Shop as ShopIcon } from '@mui/icons-material';
import styles from './AppPromo.module.css';
import burgerImage from '../../assets/hero_burger.png';

const AppPromo = () => {
  return (
    <Box className={styles.appPromoSection}>
      <Container maxWidth="lg">
        <Box className={styles.promoWrapper}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <Box className={styles.textContent}>
                <Typography variant="h3" className={styles.title}>
                  Rendelj gyorsabban a <br />
                  <span className={styles.highlight}>Mr.Mon</span> applikációval!
                </Typography>
                <Typography variant="body1" className={styles.subtitle}>
                  Töltsd le az alkalmazásunkat az extra kedvezményekért, 
                  gyűjts pontokat minden vásárlás után, és kerüld el a sorban állást!
                </Typography>
                <Box className={styles.badges}>
                  <Button 
                    startIcon={<AppleIcon />} 
                    className={styles.storeBtn}
                    variant="contained"
                  >
                    <Box style={{textAlign: 'left', lineHeight: 1}}>
                      <small style={{fontSize: '10px'}}>Download on the</small><br />
                      <strong>App Store</strong>
                    </Box>
                  </Button>
                  <Button 
                    startIcon={<ShopIcon />} 
                    className={styles.storeBtn}
                    variant="contained"
                  >
                    <Box style={{textAlign: 'left', lineHeight: 1}}>
                      <small style={{fontSize: '10px'}}>GET IT ON</small><br />
                      <strong>Google Play</strong>
                    </Box>
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} className={styles.imageContainer}>
              {/* Using burger image as placeholder for phone if we dont have phone mockup */}
              <div className={styles.phoneMockup}>
                 <img src={burgerImage} alt="App mockup" className={styles.mockupImage}/>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AppPromo;
