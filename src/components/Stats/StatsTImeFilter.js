import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { TextField } from '@material-ui/core';
import { getHTMLDate } from '../../utils';
import { makeStyles } from '@material-ui/styles';
import { SignalCellularNull } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {
    fontSize: 1,
    width: 220,
    margin: '6px 0px',
  },
  popup: {
    padding: 10,
  },
  filter: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#80808024',
    padding: 15,
  },
});

const TimeFilter = ({ handler, filterValue, budgetValue }) => {
  console.log(filterValue);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState('None');

  const handleManualInput = ({ target }) => {
    handler(target.name, new Date(target.value).getTime());
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = ({ target }) => {
    if (target.value === 'None') {
      handler('startDate', null);
      handler('lastDate', null);
      handleClose();
    }

    if (target.value === 'Current budget') {
      handler('startDate', budgetValue.firstDate);
      handler('lastDate', budgetValue.lastDate);
      handleClose();
    }

    setValue(target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  return (
    <div className={classes.filter}>
      <Tooltip title="Filter list">
        <div>
          <Button onClick={handleClick}>{`Time Filter: ${value}`}</Button>
        </div>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <FormControl component="fieldset" className={classes.popup}>
          {/* <FormLabel component="legend">Filter by money way</FormLabel> */}
          <RadioGroup
            aria-label="gender"
            name="filterMoneyway"
            value={value}
            onChange={handleSelect}
          >
            <FormControlLabel
              value="None"
              control={<Radio checked={value === 'None'} />}
              label="None"
            />
            <FormControlLabel
              disabled={budgetValue === null}
              value="Current budget"
              control={<Radio checked={value === 'Current budget'} />}
              label="Current budget"
            />
            <FormControlLabel
              value="Manual"
              control={<Radio checked={value === 'Manual'} />}
              label="Manual"
            />
          </RadioGroup>

          {value === 'Manual' && (
            <>
              <TextField
                classes={{ root: classes.root }}
                name="startDate"
                type="datetime-local"
                value={getHTMLDate(filterValue.startDate)}
                onChange={handleManualInput}
                size="small"
                variant="outlined"
              />
              <TextField
                classes={{ root: classes.root }}
                name="lastDate"
                type="datetime-local"
                value={getHTMLDate(filterValue.lastDate)}
                onChange={handleManualInput}
                size="small"
                variant="outlined"
              />
            </>
          )}
        </FormControl>
      </Popover>
    </div>
  );
};

export default TimeFilter;
