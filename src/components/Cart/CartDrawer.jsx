import React, { useState } from 'react';
import { 
  Drawer, Box, Typography, IconButton, Button, Divider, 
  List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, TextField 
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { token } = useAuth();
  const [tableNumb, setTableNumb] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Csoportosítás kategóriák szerint
  const groupedCart = cart.reduce((acc, item) => {
    // Ellenőrizzük, hogy van-e kategória név, különben 'Egyéb'
    const categoryName = item.product.category?.name || 'Egyéb';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    try {
      // Rendelés létrehozása (POST /api/orders)
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': token } : {})
        },
        body: JSON.stringify({
          status: 'NEW',
          tableNumb: parseInt(tableNumb) || 1,
          fullPrice: getCartTotal()
        })
      });

      if (!orderResponse.ok) throw new Error('Hiba a rendelésnél.');
      const order = await orderResponse.json();

      // Tételek hozzáadása (ciklusban POST /api/order-items)
      for (const item of cart) {
        await fetch('/api/order-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {})
          },
          body: JSON.stringify({
            quantity: item.quantity,
            comment: '',
            itemStatus: 'NEW',
            product: { productId: item.product.productId || item.product.id },
            order: { orderId: order.orderId }
          })
        });
      }

      alert('Rendelés leadva sikeresen!');
      clearCart();
      setIsCartOpen(false);
    } catch (err) {
      console.error(err);
      alert('Hiba történt. Ellenőrizd a backendet vagy a jogosultságokat!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer anchor="right" open={isCartOpen} onClose={() => setIsCartOpen(false)}>
      <Box sx={{ width: 350, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCartIcon color="primary" />
            <Typography variant="h6" fontWeight={800}>Kosaram</Typography>
          </Box>
          <IconButton onClick={() => setIsCartOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Content - Itt vannak az Accordion-ok */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 2 }}>
          {cart.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>A kosár üres.</Typography>
          ) : (
            Object.keys(groupedCart).map((category, index) => (
              <Accordion key={category} defaultExpanded elevation={0} sx={{ border: '1px solid #eee', mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={700}>
                    {category} ({groupedCart[category].length} féle)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <List disablePadding>
                    {groupedCart[category].map((item) => {
                      const pId = item.product.productId || item.product.id;
                      return (
                        <ListItem key={pId} divider>
                          <ListItemText 
                            primary={<Typography variant="subtitle2" fontWeight={600}>{item.product.name}</Typography>}
                            secondary={`${item.product.price} Ft / db`}
                          />
                          <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", gap:"1" }}>
                            <IconButton size="small" onClick={() => updateQuantity(pId, item.quantity - 1)}>
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography fontWeight={600}>{item.quantity}</Typography>
                            <IconButton size="small" onClick={() => updateQuantity(pId, item.quantity + 1)}>
                              <AddIcon fontSize="small" />
                            </IconButton>
                            {/* Törlés gomb javítva ikonnal */}
                            <IconButton size="small" color="error" onClick={() => removeFromCart(pId)}>
                               <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>

        {/* Footer */}
        {cart.length > 0 && (
          <Box sx={{ pt: 2, borderTop: '1px solid #eee' }}>
            <TextField 
              fullWidth size="small" label="Asztalszám" 
              value={tableNumb} onChange={(e) => setTableNumb(e.target.value)} 
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Végösszeg:</Typography>
              <Typography variant="h6" color="primary" fontWeight={800}>{getCartTotal()} Ft</Typography>
            </Box>
            <Button 
              fullWidth variant="contained" size="large" 
              onClick={handleCheckout} disabled={isSubmitting}
            >
              {isSubmitting ? 'Leadás...' : 'Rendelés leadása'}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
