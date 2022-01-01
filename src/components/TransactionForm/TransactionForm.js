import React, { useEffect, useState, useContext } from "react";
import { UserDataContext } from "../../contexts/UserDataContext";
import AmountInput from "./AmountInput";
import DateInput from "./DateInput";
import TagsInput from "./TagsInput";
import MoneyWaySwitch from "./MoneyWaySwitch";
import CategorySelect from "./CategorySelect";
import CommentInput from "./CommentInput";
import { editTransaction, addNewTransaction } from "../../data/firebase";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { removeTransaction } from "../../data/firebase";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(3),
      /* width: '25ch', */
    },
    "& .MuiTypography-root": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
}));

export function TransactionForm({ isOpen, onClose, currentTransactionID }) {
  const userData = useContext(UserDataContext);
  const classes = useStyles();

  const [alertOpen, setAlertOpen] = useState(false);

  /* Нужны ли мне тут  initialFormValue, или же инпуты должны справляться с пустыми значениями?*/
  const initialFormValue = {
    date: Date.now(),
    sum: 0,
    category: "",
    tags: [], // как-то тупо. Почему не null?
    comment: "",
  };

  const transaction = userData.transactions
    ? userData.transactions[currentTransactionID]
    : initialFormValue;

  const categories = userData.categories;

  const [data, setData] = useState(
    currentTransactionID ? { ...transaction } : { ...initialFormValue }
  );

  const [isIncome, setIsIncome] = useState(
    transaction ? (transaction.sum > 0 ? true : false) : false
  );

  const [error, setError] = useState({ sum: false, category: false });

  useEffect(() => {
    // ???
    if (currentTransactionID) {
      setData({ ...transaction });
      setIsIncome(transaction.sum > 0 ? true : false);
    }
  }, [isOpen]);

  const handleInput = (name, value) => {
    setData((data) => {
      const newData = { ...data };

      if (name == "sum") value = isIncome === true ? +value : -value;
      newData[name] = value;
      return newData;
    });
  };

  const toggleMoneyWay = () => {
    // странно, что это отдельно от остальных полей
    setIsIncome((isIncome) => !isIncome);

    setData((data) => {
      const newData = { ...data };

      newData.sum *= -1;
      newData.category = ""; // ????????????
      return newData;
    });
  };

  const cancel = () => {
    setData(initialFormValue); //TODO: тогда зачем мне это при открытии делать
    // и вообще, какое должно быть состояние у формы когда она закрыта? Что значит очисить форму?
    setIsIncome(false);
    setError({ sum: false, category: false });
    onClose();
  };

  const del = () => {
    setAlertOpen(true);
  };

  const confirm = () => {
    removeTransaction(currentTransactionID);
    setAlertOpen(false);
    cancel();
  };

  const add = (e) => {
    e.preventDefault();

    //TODO: вынести валидацию в функцию
    if (data.sum === 0) {
      setError((oldError) => ({ ...oldError, sum: true }));
      return;
    } else {
      setError((oldError) => ({ ...oldError, sum: false })); // Зачем эта ветка? Чтобы сбросить старый стейт?
    }

    if (data.category === "") {
      setError((oldError) => ({ ...oldError, category: true }));
      return;
    } else {
      setError((oldError) => ({ ...oldError, category: false }));
    }

    if (currentTransactionID) {
      editTransaction(currentTransactionID, data);
    } else {
      addNewTransaction(data);
    }

    cancel();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={cancel} transitionDuration={{ exit: 0 }}>
        <form className={classes.root}>
          <DialogTitle className={classes.title}>
            {currentTransactionID ? "Edit transaction" : "Add new transaction"}
            {currentTransactionID && (
              <IconButton
                aria-label="filter list"
                onClick={del}
                fontSize="large"
              >
                <DeleteForeverIcon color="secondary" />
              </IconButton>
            )}
          </DialogTitle>

          <DialogContent>
            {/* <DialogContentText>Всякая хрень</DialogContentText> */}

            <MoneyWaySwitch
              handleInput={toggleMoneyWay}
              value={isIncome}
              label={isIncome ? "income" : "outcome"}
            />
            <AmountInput
              handleInput={handleInput}
              value={data.sum}
              error={error.sum}
            />
            <DateInput handleInput={handleInput} value={data.date} />
            <CategorySelect
              error={error.category}
              value={data.category}
              handleInput={handleInput}
              categories={categories[isIncome ? "income" : "outcome"]}
            />
            <TagsInput
              value={data.tags || []}
              handleInput={handleInput}
              userTags={userData.tags}
            />
            <CommentInput value={data.comment} handleInput={handleInput} />
          </DialogContent>

          <DialogActions>
            <Button onClick={cancel} color="secondary">
              Close
            </Button>
            <Button onClick={add} color="primary" type="submit">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={alertOpen}
        onClose={() => {
          setAlertOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <ErrorOutlineOutlinedIcon />
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAlertOpen(false);
            }}
            color="primary"
          >
            No
          </Button>
          <Button onClick={confirm} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
