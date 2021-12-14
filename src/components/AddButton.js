import { makeStyles, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: "#40D1FF",
    boxShadow: theme.shadows[14],
    "&:hover": {
      backgroundColor: "#2db2dc",
    },
  },
}));

export function AddButton({ className = "", handler }) {
  const classes = useStyles();

  return (
    <Fab
      className={`${classes.addButton} ${className}`}
      onClick={() => handler()}
    >
      <AddIcon />
    </Fab>
  );
}
