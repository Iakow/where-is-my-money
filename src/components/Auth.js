import React, { useState } from "react";
import { signin, register } from "../data/firebase";
import {
  Container,
  makeStyles,
  Paper,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    padding: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    padding: 20,
    maxWidth: 430,
    [theme.breakpoints.down("xs")]: {
      margin: 20,
    }
  },
  radioFieldset: {
    width: "100%",
  },
  radioGroup: {
    justifyContent: "center",
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  dividerWord: {
    padding: "0 20px",
  },
  header: {
    marginTop: 6,
    marginBottom: 6,
    textAlign: "center",
    color: "#40d1ff",
  },
  description: {
    textAlign: "center",
    marginTop: 0,
    marginBottom: 50,
    color: "#52bfe1",
  },
}));

export function Auth() {
  const classes = useStyles();
  const [authType, setAuthType] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggle = ({ target }) => {
    setAuthType(target.value);
  };

  const signinIn = (e) => {
    e.preventDefault();

    signin(email, password).catch((error) => {
      setPassword("");
      setEmail("");
      alert(error.message);
    });
  };

  const registrate = (e) => {
    e.preventDefault();

    register(email, password).catch((error) => {
      alert(error.message);
    });
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Paper className={classes.paper}>
        <h1 className={classes.header}>Where i$ my money?</h1>
        <p className={classes.description}>
          keep track your incomes and expenses
        </p>

        <form onSubmit={authType === "signin" ? signinIn : registrate}>
          <FormControl component="fieldset" className={classes.radioFieldset}>
            <RadioGroup
              className={classes.radioGroup}
              row
              name="auth"
              value={authType}
              onChange={toggle}
            >
              <FormControlLabel
                value="signin"
                control={<Radio checked={authType === "signin"} />}
                label="Login"
              />
              <FormControlLabel
                value="register"
                control={<Radio checked={authType === "register"} />}
                label="Register"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            margin="dense"
            placeholder="E-mail"
            fullWidth
            variant="outlined"
            size="small"
            type="email"
            name="email"
            value={email}
            onChange={({ target }) => {
              setEmail(target.value);
            }}
            required
          />

          <TextField
            margin="dense"
            placeholder="Password"
            fullWidth
            variant="outlined"
            size="small"
            type="password"
            name="password"
            value={password}
            onChange={({ target }) => {
              setPassword(target.value);
            }}
            required
          />

          <div className={classes.buttonGroup}>
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="secondary"
            >
              {authType === "signin" ? "Login" : "Register Me"}
            </Button>

            <span className={classes.dividerWord}>or</span>

            <Button
              variant="contained"
              className={classes.button}
              onClick={() => {
                signin("demo@kottans.ua", "135790");
              }}
            >
              Try demo
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}
