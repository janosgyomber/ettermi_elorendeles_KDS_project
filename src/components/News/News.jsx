import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import styles from './News.module.css';

import coffeeImage from '../../assets/coffee.png';
// We reuse the existing images to fill the news board
import friesImage from '../../assets/fries.png';

const newsItems = [
  {
    id: 1,
    title: 'Hűsítő Újdonság: Mr.Mon Iced Coffee',
    category: 'ÚJDONSÁG',
    image: coffeeImage,
    date: 'Október 12.',
  },
  {
    id: 2,
    title: 'Visszatért a Spicy Cheese Loaded Fries!',
    category: 'LIMITÁLT AJÁNLAT',
    image: friesImage,
    date: 'Október 05.',
  }
];

const News = () => {
  return (
    <Box className={styles.newsSection}>
      <Container maxWidth="lg">
        <Box className={styles.header}>
          <Typography variant="h2" className={styles.title}>
            Aktuális <span className={styles.highlight}>Hírek</span> és Ajánlatok
          </Typography>
          <Button endIcon={<ArrowForwardIcon />} className={styles.viewAllBtn}>
            Összes hír
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {newsItems.map((news) => (
            <Grid item xs={12} md={6} key={news.id}>
              <Card className={styles.newsCard} elevation={0}>
                <Box className={styles.imageOverlay}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={news.image}
                    alt={news.title}
                    className={styles.cardImage}
                  />
                  <Box className={styles.categoryBadge}>{news.category}</Box>
                </Box>
                <CardContent className={styles.cardContent}>
                  <Typography variant="caption" className={styles.newsDate}>
                    {news.date}
                  </Typography>
                  <Typography variant="h5" className={styles.newsTitle}>
                    {news.title}
                  </Typography>
                  <Button variant="text" color="secondary" className={styles.readMoreBtn} endIcon={<ArrowForwardIcon />}>
                    Tovább olvasom
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default News;
