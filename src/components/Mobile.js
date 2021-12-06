import { Routes, Route, Link } from "react-router-dom";
import { Budget } from "./Budget/Budget";
import { Stats } from "./Stats/Stats";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { makeStyles } from "@material-ui/core";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  addButton: {
    fontSize: "4rem",
    color: "#40D1FF",
    boxShadow: theme.shadows[14],
    borderRadius: "50%",
  },
  stickyButton: {
    [theme.breakpoints.down("xs")]: {
      position: "absolute",
      bottom: 44,
      right: 24,
      zIndex: 1299,
    },
  },
  statsBtn: {
    fontSize: "2rem",
    color: "#40D1FF",
    boxShadow: theme.shadows[5],
    borderRadius: "50%",
    height: 32,
  },
}));

export function Mobile({ userData, openTransactionForm }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Budget userData={userData} type="mobile" />

              <Link to="/stats" className={classes.statsBtn}>
                <DonutLargeIcon
                  fontSize="large"
                  classes={{ fontSizeLarge: classes.statsBtn }}
                />
              </Link>

              <IconButton onClick={() => openTransactionForm()}>
                <AddCircleIcon
                  fontSize="large"
                  classes={{ fontSizeLarge: classes.addButton }}
                />
              </IconButton>
            </>
          }
        />

        <Route
          path="/stats"
          element={
            <>
              <Stats
                userData={userData}
                openTransactionForm={openTransactionForm}
              />
              <IconButton
                className={classes.stickyButton}
                onClick={() => openTransactionForm()}
              >
                <AddCircleIcon
                  fontSize="large"
                  classes={{ fontSizeLarge: classes.addButton }}
                />
              </IconButton>

              <Link to="/">Main</Link>
            </>
          }
        />
      </Routes>
    </div>
  );
}
