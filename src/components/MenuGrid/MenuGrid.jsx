import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardMedia, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { LocalMallOutlined as LocalMallOutlinedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import styles from './MenuGrid.module.css';

import burger1 from '../../assets/burger1.jpg';
import burger2 from '../../assets/burger2.jpg';
import burger3 from '../../assets/burger3.jpg';
import burger4 from '../../assets/burger4.jpg';
import burger5 from '../../assets/burger5.jpg';
import burger6 from '../../assets/burger6.jpg';
import burger7 from '../../assets/burger7.jpg';
import burger8 from '../../assets/burger8.jpg';
import burger9 from '../../assets/burger9.jpg';
import burger10 from '../../assets/burger10.jpg';
import sandwich from '../../assets/sandwich.jpg';

const burgers = [
  burger1,
  burger2,
  burger3,
  burger4,
  burger5,
  burger6,
  burger7,
  burger8,
  burger9,
  burger10
]

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
          <Box
            className={styles.gridContainer}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
              },
              gap: 4,
            }}
          >
            {menuItems.slice(0, 8).map((item) => (
              <Card
                key={item.productId || item.id}
                className={styles.menuCard}
                elevation={2}
              >
                <Box className={styles.imageWrapper}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.name.toLowerCase().includes('burger') ? burgers[Math.floor(Math.random() * burgers.length)] : sandwich}
                    alt={item.name}
                    className={styles.cardImage}
                  />
                </Box>

                <CardContent className={styles.cardContent} sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    className={styles.itemTitle}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3.2em',
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className={styles.itemDesc}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Typography variant="h6" className={styles.itemPrice} sx={{ mt: 2 }}>
                    {item.price} Ft
                  </Typography>
                </CardContent>

                <CardActions className={styles.cardActions} sx={{ p: 2, pt: 0 }}>
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
            ))}
          </Box>
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