import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, Divider, Stack, useMediaQuery, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Chip,
  FormControlLabel, Checkbox
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const DashboardMenu = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Dialog states
  const [categoryDialog, setCategoryDialog] = useState({ open: false, data: null });
  const [productDialog, setProductDialog] = useState({ open: false, data: null, categoryId: null });

  // ----- LEKÉRÉSEK -----
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', {
        headers: { 'Authorization': token }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Hiba a kategóriák lekérésekor:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: { 'Authorization': token }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Hiba a termékek lekérésekor:", error);
    }
  };

  const refreshAll = () => {
    fetchCategories();
    fetchProducts();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // ----- KATEGÓRIA CRUD -----
  const handleSaveCategory = async (categoryData) => {
    try {
      const isEdit = !!categoryData.categoryId;
      const url = isEdit ? `/api/categories/${categoryData.categoryId}` : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });

      if (response.ok) {
        setCategoryDialog({ open: false, data: null });
        refreshAll();
      } else {
        const errorText = await response.text();
        console.error('Kategória mentési hiba:', response.status, errorText);
        alert(`Hiba a kategória mentésekor! (${response.status})\n${errorText}`);
      }
    } catch (error) {
      console.error('Hálózati hiba:', error);
      alert("Hiba történt a mentés során!");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Biztosan törlöd ezt a kategóriát? A benne lévő termékek is érintettek lehetnek!")) return;
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });
      if (response.ok) {
        refreshAll();
      } else {
        alert("Hiba a törlés során!");
      }
    } catch (error) {
      alert("Hiba a törlés során!");
    }
  };

  // ----- TERMÉK CRUD -----
  const handleSaveProduct = async (productData) => {
    try {
      const isEdit = !!productData.productId;
      const url = isEdit ? `/api/products/${productData.productId}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      // A backend (Spring + JPA) általában beágyazott category objektumot vár, nem csak ID-t
      const body = {
        ...(isEdit && { productId: productData.productId }),
        name: productData.name,
        price: productData.price,
        description: productData.description,
        available: productData.available,
        category: { categoryId: productData.categoryId }
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setProductDialog({ open: false, data: null, categoryId: null });
        fetchProducts();
      } else {
        const errorText = await response.text();
        console.error('Termék mentési hiba:', response.status, errorText);
        alert(`Hiba a termék mentésekor! (${response.status})\n${errorText}`);
      }
    } catch (error) {
      console.error('Hálózati hiba:', error);
      alert("Hiba történt a mentés során!");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Biztosan törlöd ezt a terméket?")) return;
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      alert("Hiba a törlés során!");
    }
  };

  // Termékek szűrése kategória szerint - rugalmas mező-egyezés
  const getProductsByCategory = (categoryId) => {
    return products.filter(p =>
      p.category?.categoryId === categoryId || p.categoryId === categoryId
    );
  };

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        mb={3}
      >
        <Typography variant="h5" fontWeight={700}>Étlap kezelése</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setCategoryDialog({ open: true, data: null })}
            variant="contained"
            fullWidth={isMobile}
          >
            Új kategória
          </Button>
          <Button
            startIcon={<RefreshIcon />}
            onClick={refreshAll}
            variant="outlined"
            fullWidth={isMobile}
          >
            Frissítés
          </Button>
        </Stack>
      </Stack>

      {categories.length === 0 && (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Még nincs kategória. Hozz létre egyet az "Új kategória" gombbal!
          </Typography>
        </Paper>
      )}

      {categories.map((category) => {
        const categoryProducts = getProductsByCategory(category.categoryId);
        return (
          <Accordion
            key={category.categoryId}
            sx={{ mb: 2, borderRadius: 1, '&:before': { display: 'none' } }}
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  overflow: 'hidden',
                  my: { xs: 1, sm: 1.5 },
                  alignItems: 'center'
                }
              }}
            >
              <Box sx={{
                width: '100%',
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 }
              }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    flexGrow: 1,
                    fontSize: { xs: '0.95rem', sm: '1.05rem' }
                  }}
                  noWrap
                >
                  {category.name}
                </Typography>
                <Chip
                  label={`${categoryProducts.length} termék`}
                  size="small"
                  color={categoryProducts.length > 0 ? 'primary' : 'default'}
                  variant={categoryProducts.length > 0 ? 'filled' : 'outlined'}
                  sx={{ flexShrink: 0 }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 } }}>
              <Divider sx={{ mb: 2 }} />

              {/* Kategória vezérlők */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                mb={2}
                flexWrap="wrap"
                useFlexGap
              >
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setProductDialog({
                    open: true,
                    data: null,
                    categoryId: category.categoryId
                  })}
                  variant="contained"
                  size="small"
                >
                  Új termék
                </Button>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setCategoryDialog({ open: true, data: category })}
                  variant="outlined"
                  size="small"
                >
                  Kategória szerkesztése
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteCategory(category.categoryId)}
                  variant="outlined"
                  color="error"
                  size="small"
                >
                  Kategória törlése
                </Button>
              </Stack>

              {categoryProducts.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={3}>
                  Még nincs termék ebben a kategóriában.
                </Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Termék</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          Leírás
                        </TableCell>
                        <TableCell align="right">Ár</TableCell>
                        <TableCell align="right">Műveletek</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoryProducts.map((product) => (
                        <TableRow key={product.productId} hover>
                          <TableCell sx={{ wordBreak: 'break-word', fontWeight: 600 }}>
                            {product.name}
                            {product.available === false && (
                              <Chip
                                label="Nem elérhető"
                                size="small"
                                color="default"
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                            {/* Mobilon a leírás itt jelenjen meg kicsiben */}
                            {product.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: { xs: 'block', md: 'none' },
                                  fontWeight: 400,
                                  mt: 0.5
                                }}
                              >
                                {product.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{
                            display: { xs: 'none', md: 'table-cell' },
                            wordBreak: 'break-word',
                            color: 'text.secondary'
                          }}>
                            {product.description || '—'}
                          </TableCell>
                          <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                            {product.price} Ft
                          </TableCell>
                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setProductDialog({
                                open: true,
                                data: product,
                                categoryId: category.categoryId
                              })}
                              aria-label="Termék szerkesztése"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteProduct(product.productId)}
                              aria-label="Termék törlése"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Dialógusok */}
      <CategoryDialog
        open={categoryDialog.open}
        category={categoryDialog.data}
        onClose={() => setCategoryDialog({ open: false, data: null })}
        onSave={handleSaveCategory}
      />

      <ProductDialog
        open={productDialog.open}
        product={productDialog.data}
        defaultCategoryId={productDialog.categoryId}
        categories={categories}
        onClose={() => setProductDialog({ open: false, data: null, categoryId: null })}
        onSave={handleSaveProduct}
      />
    </Box>
  );
};

// ============================================================
// KATEGÓRIA DIALÓGUS (új / szerkesztés)
// ============================================================
const CategoryDialog = ({ open, category, onClose, onSave }) => {
  const [name, setName] = useState('');
  const isEdit = !!category;

  useEffect(() => {
    if (open) {
      setName(category?.name || '');
    }
  }, [open, category]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("A kategória neve nem lehet üres!");
      return;
    }
    onSave({
      ...(isEdit && { categoryId: category.categoryId }),
      name: name.trim()
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Kategória szerkesztése' : 'Új kategória'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Kategória neve"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Mégse</Button>
        <Button onClick={handleSubmit} variant="contained">Mentés</Button>
      </DialogActions>
    </Dialog>
  );
};

// ============================================================
// TERMÉK DIALÓGUS (új / szerkesztés)
// ============================================================
const ProductDialog = ({ open, product, defaultCategoryId, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    available: true,
    categoryId: ''
  });
  const isEdit = !!product;

  useEffect(() => {
    if (open) {
      setFormData({
        name: product?.name || '',
        price: product?.price?.toString() || '',
        description: product?.description || '',
        available: product?.available ?? true,
        categoryId:
          product?.category?.categoryId ||
          product?.categoryId ||
          defaultCategoryId ||
          ''
      });
    }
  }, [open, product, defaultCategoryId]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("A termék neve nem lehet üres!");
      return;
    }
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      alert("Adj meg egy érvényes árat!");
      return;
    }
    if (!formData.categoryId) {
      alert("Válassz kategóriát!");
      return;
    }

    onSave({
      ...(isEdit && { productId: product.productId }),
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      available: formData.available,
      categoryId: formData.categoryId
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Termék szerkesztése' : 'Új termék'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Termék neve"
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
          />
          <TextField
            label="Ár (Ft)"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange('price')}
            inputProps={{ min: 0, step: 1 }}
          />
          <TextField
            label="Leírás (opcionális)"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
          />
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Kategória</InputLabel>
            <Select
              labelId="category-select-label"
              value={formData.categoryId}
              label="Kategória"
              onChange={handleChange('categoryId')}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.available}
                onChange={(e) => setFormData((prev) => ({ ...prev, available: e.target.checked }))}
              />
            }
            label="Elérhető (rendelhető)"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Mégse</Button>
        <Button onClick={handleSubmit} variant="contained">Mentés</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardMenu;