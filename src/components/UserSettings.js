import React, { useState, useContext } from "react";
import { Tabs, Tab, Button } from "@material-ui/core";
import { UserDataContext } from "../contexts/UserDataContext";

import { addNewTag, email } from "../data/firebase";

import { signout } from "../data/firebase";
import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { IconButton } from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
import { TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { editTag, removeTag } from "../data/firebase";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  content: {
    display: "flex",
    flexDirection: "row",
    minWidth: 500,
    minHeight: 400,
    padding: 0,
    [theme.breakpoints.down("xs")]: {
      minWidth: "80vw",
    },
  },
  title: {
    padding: "8px 54px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#1f1f1f",
  },

  tabContent: {
    padding: "8px 20px",
  },
  tabs: {
    backgroundColor: "#2d2d2d",
  },
  tab: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 5,
  },
  labelIcon: {
    minHeight: "initial",
  },
  listItem: {
    width: 200,
  },
}));

export function UserSettings({ open, onClose }) {
  const userData = useContext(UserDataContext);
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true });
  const tags = userData.tags;
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [editableTag, setEditableTag] = useState("");
  const [newTag, setNewTag] = useState("");

  const onTabChange = (e, value) => {
    setTab(value);
  };

  const onTagFocus = (e) => {
    setEditableTag(e.target.value);
  };

  const onTagBlur = ({ target }) => {
    setEditableTag("");

    if (target.value === editableTag) return;

    const id = target.id.split("tag-")[1];
    editTag(id, target.value);
  };

  const onTagDelete = ({ currentTarget }) => {
    const id = currentTarget.id.split("tag-delete-")[1];
    removeTag(id);
  };

  const onInputNewTag = ({ target }) => {
    setNewTag(target.value);
  };

  const onAddNewTag = () => {
    addNewTag(newTag);
    setNewTag("");
  };

  const tagsList = (
    <List>
      {Object.entries(tags)
        .sort()
        .map(([id, value]) => (
          <ListItem className={classes.listItem} key={`tag-${id}`}>
            <TextField
              id={`tag-${id}`}
              onFocus={onTagFocus}
              defaultValue={value}
              onBlur={onTagBlur}
            />

            <ListItemSecondaryAction>
              <IconButton
                id={`tag-delete-${id}`}
                onClick={onTagDelete}
                edge="end"
              >
                <DeleteOutline />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}

      <ListItem className={classes.listItem}>
        <TextField
          onFocus={onTagFocus}
          value={newTag}
          onChange={onInputNewTag}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={onAddNewTag}>
            <Add />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <DialogTitle classes={{ root: classes.title }} disableTypography>
        User Settings
      </DialogTitle>
      <DialogContent classes={{ root: classes.content }}>
        <Tabs
          className={classes.tabs}
          value={tab}
          orientation="vertical"
          onChange={onTabChange}
          TabIndicatorProps={{
            style: {
              display: "none",
            },
          }}
        >
          <Tab
            classes={{ wrapper: classes.tab, labelIcon: classes.labelIcon }}
            icon={<AccountCircleIcon />}
            label={!isXS && "My account"}
          />
          <Tab
            classes={{ wrapper: classes.tab, labelIcon: classes.labelIcon }}
            icon={<LocalOfferIcon />}
            label={!isXS && "My tags"}
          />
        </Tabs>

        <div className={classes.tabContent}>
          {tab === 0 && (
            <>
              <h4>{email} </h4>
              <Button size="small" variant="outlined" onClick={signout}>
                Sign out
              </Button>
            </>
          )}
          {tab === 1 && tagsList}
        </div>
      </DialogContent>
    </Dialog>
  );
}
