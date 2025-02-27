import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Logout, Home } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../Assets/logo.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: "linear-gradient(135deg, #e0e0e0, #f5f5f5)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderBottom: "4px solid #42a5f5",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Home Icon */}
        <IconButton color="primary" onClick={() => navigate('/')}>
          <Home sx={{ fontSize: 30 }} />
        </IconButton>

        {/* Logo */}
        <img 
          src={logo} 
          alt="Logo" 
          style={{ height: 40, marginLeft: 20, filter: "drop-shadow(2px 2px 5px rgba(0,0,0,0.2))" }} 
        />

        <Box sx={{ display: "flex", gap: 5, alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
          {[
            { label: "Code Conversion", path: "/codeconverter" },
            { label: "Code Summarization", path: "/summarizer" },
            { label: "Code Documentation", path: "/docstring" }
          ].map((item) => (
            <Typography
              key={item.path}
              variant="h6"
              component="div"
              sx={{
                fontWeight: "500",
                fontFamily: "'Poppins', sans-serif",
                color: "#333",
                cursor: "pointer",
                borderBottom: isActive(item.path) ? "3px solid #42a5f5" : "none",
                paddingBottom: "5px", 
                transition: "border-bottom 0.3s ease"
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Typography>
          ))}
        </Box>

        <IconButton color="error">
          <Logout sx={{ fontSize: 28 }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
