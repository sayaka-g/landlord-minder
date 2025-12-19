import React, { useState } from "react";
import { TextField, Button, Box, Typography, InputAdornment } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (isSignUp) {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);

          const user = userCredential.user;

          await setDoc(doc(db, "users", user.uid), {
            name,
            email: user.email,
            role: "landlord",
            createdAt: serverTimestamp(),
          });

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
          {isSignUp && (
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
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
                  <EmailIcon />
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
                  <LockIcon />
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
