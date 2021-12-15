import { makeStyles, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useState, useContext } from "react";
import { TransactionForm } from "./TransactionForm/TransactionForm";
import { UserDataContext } from "./UserDataContext";


const useStyles = makeStyles((theme) => ({
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: "#40D1FF",
    boxShadow: theme.shadows[14],
    "&:hover": {
      backgroundColor: "#2db2dc",
    },
  },
}));

export function AddButton({ className = "", handler }) {
  const classes = useStyles();
  const userData = useContext(UserDataContext);

  /* const [transactionForm, setTransactionForm] = useState({
    isOpen: false,
    transactionID: null,
  });

  const openTransactionForm = (id) => {
    setTransactionForm({ isOpen: true, transactionID: id });
  };

  const closeForm = () => {
    setTransactionForm({ isOpen: false, transactionID: null });
  }; */

  return (
    <>
      <Fab
        className={`${classes.addButton} ${className}`}
        onClick={() => handler()}
      >
        <AddIcon />
      </Fab>

     {/*  <TransactionForm
        isOpen={transactionForm.isOpen}
        onClose={closeForm}
        userData={userData}
        currentTransactionID={transactionForm.transactionID}
      /> */}
    </>
  );
}
