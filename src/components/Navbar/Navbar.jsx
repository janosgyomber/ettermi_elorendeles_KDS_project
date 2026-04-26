import React from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, IconButton, Badge } from '@mui/material';
import { Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import CartDrawer from '../Cart/CartDrawer';
import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';

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
            <Button className={styles.navLink}>Éttermeink</Button>
            <Button className={styles.navLink}>Rólunk</Button>
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
