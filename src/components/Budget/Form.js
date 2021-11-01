import React, { useState } from 'react';
import { getHTMLDate } from '../../utils';
import { addBudget } from '../../data/firebase';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Paper,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  budgetBtn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '150px',
    width: '150px',
  },
  chart: {
    height: '400px',
    width: '400px',
  },
  outerChart: {
    height: '400px',
    width: '400px',
    position: 'absolute',
    top: 0,
  },
}));

/* приходится следить, чтобы велью всегда было не null */
const Form = ({ value, isOpen, close }) => {
  const classes = useStyles();
  const initialValue = { firstDate: 0, lastDate: Date.now() };

  const [budget, setBudget] = useState(value || initialValue);

  const remove = () => {
    addBudget(null);
    cancel();
  };

  const handleInput = ({ target }) => {
    setBudget(budget => {
      const newBudget = { ...budget };
      newBudget[target.name] = new Date(target.value).getTime();
      return newBudget;
    });
  };

  const cancel = () => {
    close();
    setBudget(value || initialValue);
    // сбросить стейт
  };

  const onSubmit = e => {
    e.preventDefault();
    addBudget({ ...budget });
    cancel();
  };

  return (
    <Dialog open={isOpen} onClose={cancel} transitionDuration={{ exit: 0 }}>
      <form>
        <DialogTitle>title</DialogTitle>

        <DialogContent>
          <TextField
            label="Date"
            name="firstDate"
            type="datetime-local"
            value={getHTMLDate(budget.firstDate)}
            onChange={handleInput}
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Date"
            name="lastDate"
            type="datetime-local"
            value={getHTMLDate(budget.lastDate)}
            onChange={handleInput}
            fullWidth
            variant="outlined"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={remove} color="secondary">
            Remove
          </Button>

          <Button onClick={cancel} color="secondary">
            Close
          </Button>

          <Button onClick={onSubmit} color="primary" type="submit">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Form;
