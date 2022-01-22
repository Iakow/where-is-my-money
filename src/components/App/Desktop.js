import { useContext } from "react";
import { Container, makeStyles } from "@material-ui/core";
import { Header } from "../Header";
import { Stats } from "../Stats/Stats";
import { AddButton } from "../AddButton";
import { UserDataContext } from "../../contexts/UserDataContext";

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
  message:{
    textAlign: "center"
  }
}));

export function Desktop({ openTransactionForm }) {
  const classes = useStyles();
  
  const userData = useContext(UserDataContext);
  const noTransactions = !Boolean(Object.keys(userData.transactions).length);

  return (
    <>
      <Header />
      <Container maxWidth="lg" className={classes.container}>
        <AddButton
          className={classes.addButton}
          handler={openTransactionForm}
        />

        {noTransactions ? (
          <p className={classes.message}>You haven't added any transactions yet</p>
        ) : (
          <Stats openTransactionForm={openTransactionForm} />
        )}
      </Container>
    </>
  );
}
