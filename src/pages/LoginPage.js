import React from "react";
import { Container, Box, Paper } from "@mui/material";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;