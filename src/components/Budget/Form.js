import React, { useState, useEffect } from "react";
import { getHTMLDate } from "../../utils";
import { addBudget } from "../../data/firebase";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: 20,
  },
}));

const Form = ({ value, isOpen, close }) => {
  const classes = useStyles();
  const initialValue = { firstDate: Date.now(), lastDate: Date.now() };
  const [budget, setBudget] = useState(value || initialValue);

  useEffect(() => {
    setBudget(value || initialValue);
  }, [isOpen]);

  const handleInput = ({ target }) => {
    setBudget((budget) => ({
      ...budget,
      [target.name]: new Date(target.value).getTime(),
    }));
  };

  const remove = () => {
    addBudget(null);
    close();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addBudget(budget);
    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} transitionDuration={{ exit: 0 }}>
      <form>
        <DialogTitle>Budget</DialogTitle>

        <DialogContent>
          <TextField
            className={classes.input}
            label="First Date"
            name="firstDate"
            type="datetime-local"
            value={getHTMLDate(budget.firstDate)}
            onChange={handleInput}
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Last Date"
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

          <Button onClick={close} color="secondary">
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
