import React, { useEffect, useState } from 'react';

import AmountInput from './AmountInput';
import DateInput from './DateInput';
import MoneyWaySwitch from './MoneyWaySwitch';
import CategorySelect from './CategorySelect';
import CommentInput from './CommentInput';

import { editTransaction, addNewTransaction } from '../../data/firebase';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(2),
      /* width: '25ch', */
    },
  },
}));

export default function TransactionForm({ isOpen, onClose, currentTransactionID, userData }) {
  const classes = useStyles();

  const initialFormValue = {
    date: Date.now(),
    sum: 0,
    category: '',
    comment: '',
  };
  const transaction = userData.transactions
    ? userData.transactions[currentTransactionID]
    : initialFormValue;
  const categories = userData.categories;

  const [data, setData] = useState(
    currentTransactionID ? { ...transaction } : { ...initialFormValue },
  );

  const [isIncome, setIsIncome] = useState(
    transaction ? (transaction.sum > 0 ? true : false) : false,
  );

  useEffect(() => {
    if (currentTransactionID) {
      setData({ ...transaction });
      setIsIncome(transaction.sum > 0 ? true : false);
    }
  }, [isOpen]);

  const handleInput = (name, value) => {
    setData(data => {
      const newData = { ...data };
      if (name == 'sum') value = isIncome === true ? +value : -value;
      newData[name] = value;
      console.log(newData);
      return newData;
    });
  };

  const toggleMoneyWay = () => {
    setIsIncome(isIncome => !isIncome);

    setData(data => {
      const newData = { ...data };
      newData.sum *= -1;
      newData.category = '';
      console.log(newData);
      return newData;
    });
  };

  const cancel = () => {
    setData(initialFormValue); //TODO: тогда зачем мне это при открытии делать
    // и вообще, какое должно быть состояние у формы когда она закрыта? Что значит очисить форму?
    setIsIncome(false);
    onClose();
  };

  const add = e => {
    e.preventDefault();

    if (currentTransactionID) {
      editTransaction(currentTransactionID, data);
    } else {
      addNewTransaction(data);
    }

    cancel();
  };

  return (
    <Dialog open={isOpen} onClose={cancel}>
      <form className={classes.root}>
        <DialogTitle>{transaction ? 'Edit transaction' : 'Add new transaction'}</DialogTitle>

        <DialogContent>
          <DialogContentText>Всякая хуйня</DialogContentText>

          <AmountInput handleInput={handleInput} value={data.sum} />
          <DateInput handleInput={handleInput} value={data.date} />
          <MoneyWaySwitch
            handleInput={toggleMoneyWay}
            value={isIncome}
            label={isIncome ? 'income' : 'outcome'}
          />
          <CategorySelect
            value={data.category}
            handleInput={handleInput}
            categories={categories[isIncome ? 'income' : 'outcome']}
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
  );
}
