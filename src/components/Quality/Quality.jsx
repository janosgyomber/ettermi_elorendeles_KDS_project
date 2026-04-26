import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { CheckCircleOutlined as CheckCircleOutlineIcon } from '@mui/icons-material';
import styles from './Quality.module.css';
import ingredientsImg from '../../assets/ingredients.png';

const Quality = () => {
  return (
    <Box className={styles.qualitySection}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" flexDirection="row-reverse">
          <Grid item xs={12} md={6}>
            <Box className={styles.imageContainer}>
              <img src={ingredientsImg} alt="Fresh ingredients" className={styles.qualityImage} />
              <Box className={styles.imageBadge}>
                <Typography variant="h6" className={styles.badgeText}>100%</Typography>
                <Typography variant="caption">Hazai Hús</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={styles.textContent}>
              <Typography variant="h2" className={styles.title}>
                Nincs Kompromisszum a <br/>
                <span className={styles.highlight}>Minőségben</span>
              </Typography>
              <Typography variant="body1" className={styles.description}>
                Minden burgerünk 100% prémium minőségű marhahúsból készül, tartósítószerek 
                és mesterséges adalékanyagok nélkül. A zöldségeket helyi termelőktől szerezzük be, 
                így garantáljuk a valódi, friss ízeket minden harapásnál.
              </Typography>
              
              <ul className={styles.featureList}>
                <li><CheckCircleOutlineIcon className={styles.checkIcon} /> Frissen sütött kézműves buci</li>
                <li><CheckCircleOutlineIcon className={styles.checkIcon} /> Helyi, friss zöldségek</li>
                <li><CheckCircleOutlineIcon className={styles.checkIcon} /> Titkos, házi készítésű szószok</li>
              </ul>

              <Button variant="outlined" className={styles.learnMoreBtn}>
                Tudj meg többet az alapanyagokról
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Quality;
