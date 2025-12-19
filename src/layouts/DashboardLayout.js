import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;
const topbarHeight = 64;

const DashboardLayout = () => {
  return (
    <Box sx={{ display: "flex", backgroundColor: "#f5f5f5"}}>
      <Topbar />
      <Sidebar />

      <Box 
        component="main" 
        sx={{ 
            flexGrow: 1,
            p: 3,
            mt: `${topbarHeight}px`,
            ml: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
            minHeight: `calc(100vh - ${topbarHeight}px)`
        }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;