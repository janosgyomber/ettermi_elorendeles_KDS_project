import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardMedia, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { LocalMallOutlined as LocalMallOutlinedIcon } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { useCart } from '../contexts/CartContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import friesImage from '../assets/fries.png';
import burgerImage from '../assets/hero_burger.png';

const FullMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
    <Box sx={{ py: 8, backgroundColor: '#f5f5f5', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 800 }}>
          Teljes <span style={{ color: '#E90000' }}>Étlap</span>
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              960: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            style={{ paddingBottom: '50px', paddingLeft: '10px', paddingRight: '10px' }}
          >
            {menuItems.map((item) => (
              <SwiperSlide key={item.productId || item.id} style={{ height: 'auto' }}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.name.toLowerCase().includes('burger') ? burgerImage : friesImage}
                      alt={item.name}
                      sx={{ objectFit: 'contain', width: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 700 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px', mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#E90000', fontWeight: 800 }}>
                      {item.price} Ft
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      startIcon={<LocalMallOutlinedIcon />}
                      disabled={!item.available}
                      onClick={() => addToCart(item, 1)}
                      sx={{ 
                        backgroundColor: item.available ? '#FBBC04' : '#ccc', 
                        color: '#121212',
                        '&:hover': {
                          backgroundColor: item.available ? '#e5aa00' : '#ccc'
                        }
                      }}
                    >
                      {item.available ? 'Kosárba' : 'Elfogyott'}
                    </Button>
                  </CardActions>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </Box>
  );
};

export default FullMenu;
