import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import { Menu, TextField } from '@material-ui/core';
import { TextFields } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { Paper } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { addNewTag } from '../../data/firebase';

const useStyles = makeStyles({
  container: {
    display: 'flex',
  },
  paper: {
    margin: 10,
    padding: 10,
    display: 'flex',
  },
  addTag: {
    marginLeft: 16,
  },
});

export default function TagsInput({ value, handleInput, userTags }) {
  /* Кажется, я понял. Это неконтролируемый компонент. Если сделать контролируемым, должно получится. Сперва обрабатыаем велью. А по onClose уже отправляем. Правда, есть проблемка с фокусом какая-то... блять. Но возможно это из-за сетСтейта*/

  const classes = useStyles();
  const [nativeValue, setNativeValue] = useState([...value]);
  const [textValue, setTextValue] = useState('');

  const userTagKeys = Object.keys(userTags);

  const handleChange = ({ target }) => {
    if (target.value.some(item => item === 'addTag')) {
      setNativeValue(oldValue => oldValue.filter(tag => tag !== 'addTag'));
      return;
    }

    setNativeValue(target.value);
    // handleInput(target.name, target.value);
  };

  const selectProps = {
    multiple: true,
    onClose: () => handleInput('tags', nativeValue),
    renderValue: () =>
      nativeValue
        .filter(tagKey => Boolean(userTags[tagKey]))
        .map(tagKey => `#${userTags[tagKey]}`)
        .join(', '),
    MenuProps: { getContentAnchorEl: null },
  };

  return (
    <div className={classes.container}>
      <TextField
        select
        fullWidth
        label="Tags"
        variant="outlined"
        name="tags"
        value={nativeValue}
        SelectProps={selectProps}
        onChange={handleChange}
      >
        {userTagKeys.map((tagKey, i) => (
          <MenuItem value={tagKey} key={tagKey}>
            <Checkbox checked={nativeValue.indexOf(tagKey) > -1} />
            <ListItemText primary={userTags[tagKey]} />
          </MenuItem>
        ))}

        <div className={classes.addTag} value="addTag">
          <TextField
            value={textValue}
            placeholder="You can add new tag"
            variant="outlined"
            onChange={({ target }) => {
              setTextValue(target.value);
            }}
            onKeyDown={e => {
              e.stopPropagation();
            }}
          />

          <IconButton
            onClick={() => {
              if (textValue) {
                addNewTag(textValue);
                setTextValue('');
              }
            }}
          >
            <Add />
          </IconButton>
        </div>
      </TextField>
    </div>
  );
}
