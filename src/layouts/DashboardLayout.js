import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
import { Box } from "@mui/material";

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />
      <Sidebar />

      <Box component="main" sx={{ marginLeft: 240, marginTop: 8, p: 3, width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;