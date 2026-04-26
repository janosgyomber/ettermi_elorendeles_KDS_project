import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Select, MenuItem, FormControl, Button, Divider,
  Stack, useMediaQuery, useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const DashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 1. Rendelések lekérése
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': token }
      });
      if (response.ok) {
        const data = await response.json();
        // Rendezzük idő szerint csökkenőbe (legfrissebb elől)
        setOrders(data.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)));
      }
    } catch (error) {
      console.error("Hiba a rendelések lekérésekor:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Státusz frissítése
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PATCH',
        headers: { 'Authorization': token }
      });
      if (response.ok) {
        fetchOrders(); // Táblázat frissítése
      }
    } catch (error) {
      alert("Hiba történt a státusz frissítésekor!");
    }
  };

  // 3. Rendelés törlése
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Biztosan törlöd ezt a rendelést?")) return;
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      alert("Hiba a törlés során!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'error';
      case 'IN_PROGRESS': return 'warning';
      case 'DONE': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (timeStamp) => {
    const d = new Date(timeStamp);
    if (isMobile) {
      // Mobilon rövidebb formátum
      return d.toLocaleString('hu-HU', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return d.toLocaleString('hu-HU');
  };

  return (
    <Box>
      {/* Header - mobilon stackelve */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        mb={3}
      >
        <Typography variant="h5" fontWeight={700}>Rendelések kezelése</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          variant="outlined"
          fullWidth={isMobile}
        >
          Frissítés
        </Button>
      </Stack>

      {orders.map((order) => (
        <Accordion
          key={order.orderId}
          sx={{ mb: 2, borderRadius: 1, '&:before': { display: 'none' } }}
          elevation={2}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                overflow: 'hidden',
                my: { xs: 1, sm: 1.5 }
              }
            }}
          >
            {/* Reszponzív summary tartalom */}
            <Box sx={{ width: '100%', minWidth: 0 }}>
              {/* Mobil nézet - 2 soros layout */}
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  flexDirection: 'column',
                  gap: 0.5,
                  width: '100%'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    #{order.orderId} · Asztal {order.tableNumb}
                  </Typography>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ flexShrink: 0 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(order.timeStamp)}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {order.fullPrice} Ft
                  </Typography>
                </Box>
              </Box>

              {/* Desktop / tablet nézet - egysoros layout */}
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  width: '100%',
                  alignItems: 'center',
                  gap: { sm: 2, md: 4 }
                }}
              >
                <Typography sx={{ fontWeight: 800, minWidth: 80 }}>#{order.orderId}</Typography>
                <Typography sx={{ minWidth: 100 }}>Asztal: {order.tableNumb}</Typography>
                <Typography sx={{ minWidth: 140, display: { xs: 'none', md: 'block' } }}>
                  {formatDate(order.timeStamp)}
                </Typography>
                <Typography sx={{ fontWeight: 700, minWidth: 100 }}>{order.fullPrice} Ft</Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                </Box>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 } }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Rendelt tételek:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Termék</TableCell>
                    <TableCell align="right">Db</TableCell>
                    <TableCell
                      align="right"
                      sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                    >
                      Egységár
                    </TableCell>
                    <TableCell align="right">Összesen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems && order.orderItems.map((item) => (
                    <TableRow key={item.orderItemId}>
                      <TableCell sx={{ wordBreak: 'break-word' }}>
                        {item.product?.name || "Ismeretlen termék"}
                      </TableCell>
                      <TableCell align="right">{item.quantity} db</TableCell>
                      <TableCell
                        align="right"
                        sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        {item.product?.price} Ft
                      </TableCell>
                      <TableCell align="right">
                        {item.quantity * (item.product?.price || 0)} Ft
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Vezérlők - mobilon stackelve */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={2}
            >
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                <Typography variant="caption">Státusz módosítása:</Typography>
                <Select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                  fullWidth
                >
                  <MenuItem value="NEW">ÚJ</MenuItem>
                  <MenuItem value="IN_PROGRESS">FOLYAMATBAN</MenuItem>
                  <MenuItem value="DONE">KÉSZ / FIZETVE</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteOrder(order.orderId)}
                  aria-label="Rendelés törlése"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default DashboardOrders;