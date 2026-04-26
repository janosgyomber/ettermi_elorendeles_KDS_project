import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography,
  Divider, IconButton, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as OrdersIcon,
  RestaurantMenu as MenuItemsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import DashboardOrders from '../components/DashboardOrders/DashboardOrders';
import DashboardMenu from '../components/DashboardMenu/DashboardMenu';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Rendelések');

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Logout: kitakarítja az auth állapotot, majd átirányít a login-ra
  const handleLogout = () => {
    if (!window.confirm("Biztosan ki akarsz jelentkezni?")) return;
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { text: 'Rendelések', icon: <OrdersIcon />, color: 'primary' },
    { text: 'Étlap kezelés', icon: <MenuItemsIcon />, color: 'primary' }
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight={800} noWrap>
          KDS ADMIN
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={activeTab === item.text}
              onClick={() => {
                setActiveTab(item.text);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: activeTab === item.text ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: activeTab === item.text ? 700 : 400 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Kijelentkezés" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Navbar a mobil nézethez */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
          borderBottom: '1px solid #eee',
          backgroundColor: 'white',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight={700}>
            {activeTab}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Oldalsáv (Responsive Drawer) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #eee' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Tartalmi rész */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f9f9f9',
          overflowX: 'hidden'
        }}
      >
        <Toolbar /> {/* Ez tolja le a tartalmat az AppBar alól */}
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, sm: 1 } }}>
          {/* Itt váltogathatod a tartalmat az activeTab alapján */}
          {activeTab === 'Rendelések' && (
            <DashboardOrders />
          )}
          {activeTab === 'Étlap kezelés' && (
            <DashboardMenu />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;