import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";

export default function Filters({ value, handleFilter }) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Filter by money way</FormLabel>
      <RadioGroup
        row
        name="filterMoneyway"
        value={value.filterMoneyway}
        onChange={({ target }) => {
          handleFilter({ [target.name]: +target.value });
        }}
      >
        <FormControlLabel
          value="0"
          control={<Radio checked={value.filterMoneyway === 0} />}
          label="All"
        />
        <FormControlLabel
          value="1"
          control={<Radio checked={value.filterMoneyway === 1} />}
          label="Income"
        />
        <FormControlLabel
          value="-1"
          control={<Radio checked={value.filterMoneyway === -1} />}
          label="Outcome"
        />
      </RadioGroup>
    </FormControl>
  );
}
