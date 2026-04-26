import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { LocalMallOutlined as LocalMallOutlinedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import styles from './MenuGrid.module.css';

// Using the generated images (fries mapped to multiple types for demo purposes, and a placeholder)
import friesImage from '../../assets/fries.png';
import burgerImage from '../../assets/hero_burger.png';

const MenuGrid = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Box className={styles.section} id="ajanlatok">
      <Container maxWidth="lg">
        <Typography variant="h2" className={styles.sectionTitle}>
          Legkelendőbb <span className={styles.highlight}>ételeink</span>
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4} className={styles.gridContainer}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.productId || item.id}>
                <Card className={styles.menuCard} elevation={2}>
                  <Box className={styles.imageWrapper}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.name.toLowerCase().includes('burger') ? burgerImage : friesImage}
                      alt={item.name}
                      className={styles.cardImage}
                    />
                  </Box>
                  <CardContent className={styles.cardContent}>
                    <Typography gutterBottom variant="h5" component="div" className={styles.itemTitle}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className={styles.itemDesc}>
                      {item.description}
                    </Typography>
                    <Typography variant="h6" className={styles.itemPrice}>
                      {item.price} Ft
                    </Typography>
                  </CardContent>
                  <CardActions className={styles.cardActions}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      className={styles.addToCartBtn}
                      startIcon={<LocalMallOutlinedIcon />}
                      disabled={!item.available}
                      onClick={() => addToCart(item, 1)}
                    >
                      {item.available ? 'Kosárba' : 'Elfogyott'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        <Box className={styles.viewMoreContainer}>
          <Button variant="outlined" className={styles.viewMoreBtn} onClick={() => navigate('/menu')}>
            Teljes Étlap Megtekintése
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MenuGrid;
