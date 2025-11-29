import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HomeIcon from '@mui/icons-material/Home';

const Topbar = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ justifyContent: "space-between", px: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                    variant="h6" 
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                Landlord Minder
                </Typography>
            </Box>
            <Box>
                <Tooltip title="Open settings">
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                </Tooltip>
            </Box>
        </Toolbar>
    </AppBar>
  );
};

export default Topbar;
