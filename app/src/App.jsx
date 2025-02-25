import React, { useState, useEffect } from "react";
import Particles from "./components/Particles/Particles";
import { Button, Box, Stack, FormControl, TextField } from "@mui/material";
import Typography from "@mui/joy/Typography";


const styles = {
  container: {
    backgroundImage: "linear-gradient(to bottom right, #7b4397, #dc2430)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  loginForm: {
    maxWidth: 350,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    background: "white",
    padding: 20,
    marginTop: "10%",
    borderRadius: 15,
  },
  footer: {
    height: 100,
    width: "100%",
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  copyright: {
    color: "#fff",
    lineHeight: "10px",
    fontSize: "0.7em",
    marginTop: 50,
    textAlign: "center",
  },
  logo: {
    width: 330,
    height: 192,
  },
  centeredText: {
    textAlign: "center",
    marginTop: 10,
  },
};




function LoginForm() {
  const [password, setPassword] = useState("");


  function setAppPasswordCookieAndReload(password) {
    document.cookie = `app-password=${encodeURIComponent(password.toUpperCase())};path=/;expires=${new Date(Date.now() + 3 * 60 * 60 * 1000).toUTCString()};`;

    setTimeout(() => {
      window.history.pushState({}, "", "/");
      window.location.assign("/");
    }, 100);

  }


  // Handle user pressing Enter, calling our login logic
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        setAppPasswordCookieAndReload(password);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [password]);

  return (
    <div style={styles.loginForm}>
      <img alt="VUKnF Logo" src="/img/vuknflogo.png" style={styles.logo} />

      <Box style={styles.centeredText}>
        <Typography component="h1" fontSize="1.1em" mb="0.25em">
          {import.meta.env.VITE_SYSTEM_NAME?.split('<br/>').map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < import.meta.env.VITE_SYSTEM_NAME.split('<br/>').length - 1 && <br/>}
            </React.Fragment>
          ))}
        </Typography>
      </Box>

      <Stack spacing={2} style={{ marginTop: 10, marginBottom: 60 }}>
        <FormControl size="lg" color="primary">
          <TextField
            variant="standard"
            label="Slaptažodis"
            type="text"
            name="hidden-password"
            autoComplete="off"
            onFocus={(e) => e.target.removeAttribute('readonly')}
            readonly
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </FormControl>
      </Stack>

      <Button
        onClick={() => setAppPasswordCookieAndReload(password)}
        style={{ backgroundColor: "rgb(123, 0, 63)", color: "white" }}
      >
        PRISIJUNGTI
      </Button>
    </div>
  );
}

export default function Login() {
  return (
    <Box style={styles.container}>
      <LoginForm />
      <Particles />
      <Box style={styles.footer}>
        <Box style={styles.copyright}>
          Copyright © | All Rights Reserved | VUKnF
        </Box>
      </Box>
    </Box>
  );
}
