import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Button } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { TextField } from "@material-ui/core";
import { getHTMLDate } from "../../utils";
import { makeStyles } from "@material-ui/core";
import { SignalCellularNull } from "@material-ui/icons";
import DateRangeIcon from "@material-ui/icons/DateRange";

const useStyles = makeStyles({
  root: {
    fontSize: 1,
    width: 220,
    margin: "6px 0px",
  },
  popup: {
    padding: 10,
  },
  filter: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
});

export function StatsTimeFilter({ handler, filterValue, budgetValue }) {
  console.log(budgetValue);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState("All time");

  const handleManualInput = ({ target }) => {
    const value = target.value === "" ? null : new Date(target.value).getTime();
    handler(target.name, value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = ({ target }) => {
    if (target.value === "All time") {
      handler("startDate", null);
      handler("lastDate", null);
      handleClose();
    }

    if (target.value === "Current budget") {
      handler("startDate", budgetValue.firstDate);
      handler("lastDate", budgetValue.lastDate);
      handleClose();
    }

    setValue(target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  return (
    <div className={classes.filter}>
      <Tooltip title="Filter list">
        <div>
          <Button onClick={handleClick}>
            <DateRangeIcon />
            {`: ${value}`}
          </Button>
        </div>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
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
              value="All time"
              control={<Radio checked={value === "All time"} />}
              label="All time"
            />
            <FormControlLabel
              disabled={budgetValue === null}
              value="Current budget"
              control={<Radio checked={value === "Current budget"} />}
              label="Current budget"
            />
            <FormControlLabel
              value="Manual"
              control={<Radio checked={value === "Manual"} />}
              label="Manual"
            />
          </RadioGroup>

          {value === "Manual" && (
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
}
