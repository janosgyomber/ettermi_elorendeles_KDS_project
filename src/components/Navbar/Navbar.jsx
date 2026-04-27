import React from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, IconButton, Badge } from '@mui/material';
import { Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import CartDrawer from '../Cart/CartDrawer';
import styles from './Navbar.module.css';
import logo from '../../assets/logo.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const { getCartCount, setIsCartOpen } = useCart();

  return (
    <AppBar position="sticky" className={styles.appbar} elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters className={styles.toolbar}>
          {/* Logo */}
          <Box className={styles.logoContainer} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Mr.Mon's Streetfood" className={styles.logoImage} />
            <Typography variant="h5" component="div" className={styles.brandName}>
              Mr.Mon's
            </Typography>
          </Box>

          {/* Desktop Links */}
          <Box className={styles.linksContainer}>
            <Button className={styles.navLink} onClick={() => navigate('/menu')}>Étlap</Button>
            <Button className={styles.navLink} onClick={() => navigate('/#ajanlatok')}>Ajánlatok</Button>
            <Button className={styles.navLink} onClick={() => window.open('https://www.google.com/maps/dir//Mr.+Mon%E2%80%99s+streetfood,+%C3%9Ajfeh%C3%A9rt%C3%B3,+M%C3%A1rt%C3%ADrok+u.+10,+4244/@47.9816506,21.7192701,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x4747676aa3feaa75:0x75680c1182b6d65!2m2!1d21.6842735!2d47.8015174?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D', '_blank')}>Éttermeink</Button>
            <Button className={styles.navLink} onClick={() => window.open('https://share.google/QbZYRL06PRGv4myi1', '_blank')}>Rólunk</Button>
          </Box>

          {/* Action Buttons */}
          <Box className={styles.actionContainer}>
            <Badge badgeContent={getCartCount()} color="error">
              <Button 
                variant="contained" 
                color="secondary" 
                className={styles.orderButton}
                onClick={() => setIsCartOpen(true)}
              >
                Rendelés
              </Button>
            </Badge>
            
            {user ? (
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={logout} 
                sx={{ ml: 2, display: { xs: 'none', sm: 'flex' }, borderColor: '#333', color: '#333' }}
                startIcon={<PersonIcon />}
              >
                Kijelentkezés
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={() => navigate('/login')} 
                sx={{ ml: 2, display: { xs: 'none', sm: 'flex' }, borderColor: '#333', color: '#333' }}
                startIcon={<PersonIcon />}
              >
                Bejelentkezés
              </Button>
            )}

            <IconButton className={styles.mobileMenuBtn} edge="end" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      
      {/* Kosár Oldalsáv */}
      <CartDrawer />
    </AppBar>
  );
};

export default Navbar;
