import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { TextField } from '@material-ui/core';
import { getHTMLDate } from '../../utils';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    border: '1px solid red',
    fontSize: 2,
  },
});
const variants = ['None', 'Current budget', 'This month', 'Last month', 'Manual'];

const TimeFilter = ({ handler, filterValue, budgetValue }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState('None'); // здесь велью - это велью селекта. А filterValue это что за тип?

  const upFilterState = ({ target }) => {
    handler(target.name, new Date(target.value).getTime());
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const upPureValue = ({ target }) => {
    if (target.value === 'None') {
      handler('startDate', 0);
      handler('lastDate', Date.now());
    }

    if (target.value === 'Current budget') {
      handler('startDate', budgetValue.firstDate);
      handler('lastDate', budgetValue.lastDate);
    }
    setValue(target.value);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  const Manual = (
    <>
      <TextField
        /*  classes={{ root: classes.root }} */
        name="startDate"
        type="datetime-local"
        value={getHTMLDate(filterValue.startDate)}
        onChange={upFilterState}
        size="small"
        /* variant="outlined" */
      />
      <span>{'  -  '}</span>

      <TextField
        name="lastDate"
        type="datetime-local"
        value={getHTMLDate(filterValue.lastDate)}
        size="small"
        onChange={upFilterState}
        /*  variant="outlined" */
      />
    </>
  );

  return (
    <>
      <Tooltip title="Filter list">
        <div>
          <span onClick={handleClick}>{value}</span>
          <span>{value === 'Manual' ? Manual : null}</span>
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
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Filter by money way</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="filterMoneyway"
              value={value}
              onChange={upPureValue}
            >
              <FormControlLabel
                value="None"
                control={<Radio checked={value === 'None'} />}
                label="None"
              />
              <FormControlLabel
                value="Current budget"
                control={<Radio checked={value === 'Current budget'} />}
                label="Current budget"
              />
              {/* <FormControlLabel
                value="This month"
                control={<Radio checked={value === 'This month'} />}
                label="This month"
              />
              <FormControlLabel
                value="Last month"
                control={<Radio checked={value === 'Last month'} />}
                label="Last month"
              /> */}
              <FormControlLabel
                value="Manual"
                control={<Radio checked={value === 'Manual'} />}
                label="Manual"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </Popover>
    </>
  );
};

export default TimeFilter;
