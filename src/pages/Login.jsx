import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (username && password) {
      try {
        const userData = await login(username, password);
        if (userData.role === 'ADMIN') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } catch (err) {
        setErrorMsg('Hibás felhasználónév vagy jelszó!');
      }
    }
  };

  return (
    <Box className={styles.loginPage}>
      <Container maxWidth="xs" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={3} className={styles.loginCard}>
          <Box className={styles.header}>
            <IconButton onClick={() => navigate(-1)} className={styles.backButton}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" className={styles.title}>
              Bejelentkezés
            </Typography>
          </Box>
          <Typography variant="body2" className={styles.subtitle} sx={{ mb: errorMsg ? 1 : 3 }}>
            Lépj be az adminisztrációs felületre
          </Typography>

          {errorMsg && (
            <Typography color="error" variant="body2" sx={{ pl: '52px', mb: 2, fontWeight: 500 }}>
              {errorMsg}
            </Typography>
          )}

          <form onSubmit={handleLogin} className={styles.formContainer}>
            <TextField
              fullWidth
              label="Felhasználónév"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Jelszó"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="kikapcsolas"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              className={styles.submitButton}
              disabled={!username || !password}
            >
              Belépés
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
