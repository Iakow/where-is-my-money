import { email, setBalance } from "../data/firebase";

import {
  Container,
  makeStyles,
  Paper,
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
    },
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  header: {
    marginTop: 6,
    marginBottom: 50,
    textAlign: "center",
    color: "#40d1ff",
  },
  description: {
    textAlign: "center",
    marginTop: 0,
    marginBottom: 6,
  },
}));

export function SetBalanceForm() {
  const classes = useStyles();

  const handleBalance = (e) => {
    e.preventDefault();
    setBalance(+e.target.sum.value);
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Paper className={classes.paper}>
        <h2 className={classes.header}>Wellcome {email}!</h2>
        <h4 className={classes.description}>
          Now, set your current balance please
        </h4>

        <form onSubmit={handleBalance}>
          <TextField
            autoFocus
            placeholder="just a number"
            margin="dense"
            fullWidth
            variant="outlined"
            size="small"
            type="number"
            name="sum"
            min="1"
            required
          />

          <div className={classes.buttonGroup}>
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="secondary"
            >
              Set ballance
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}
