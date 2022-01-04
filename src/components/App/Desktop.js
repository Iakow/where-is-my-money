import { Container, makeStyles } from "@material-ui/core";
import { Header } from "../Header";
import { Stats } from "../Stats/Stats";
import { AddButton } from "../AddButton";

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: "absolute",
    top: -30,
    right: 40,
    zIndex: 10,
  },
  container: {
    position: "relative",
  },
}));

export function Desktop({ openTransactionForm }) {
  const classes = useStyles();
  return (
    <>
      <Header />
      <Container maxWidth="lg" className={classes.container}>
        <AddButton
          className={classes.addButton}
          handler={openTransactionForm}
        />

        <Stats openTransactionForm={openTransactionForm} />
      </Container>
    </>
  );
}
