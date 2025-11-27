import React, { useState } from "react";
import { TextField, Button, Box, Typography, InputAdornment } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (isSignUp) {
          await createUserWithEmailAndPassword(auth, email, password);
          navigate("/dashboard");
        } else {
          await signInWithEmailAndPassword(auth, email, password);
          navigate("/dashboard");
        }
      } catch (error) {
        alert(error.message);
      }
    };
  
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" mb={2}>
          {isSignUp ? "Sign Up" : "Login"}
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "300px" }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
        </form>
        <Button onClick={() => setIsSignUp(!isSignUp)} sx={{ mt: 2 }}>
          {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
        </Button>
      </Box>
    );
  };
  
  export default LoginForm;
