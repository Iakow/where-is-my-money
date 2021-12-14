import { Routes, Route, Link } from "react-router-dom";

import { Budget } from "./Budget/Budget";
import { Stats } from "./Stats/Stats";

import { makeStyles, Fab } from "@material-ui/core";
import BarChartIcon from "@material-ui/icons/BarChart";
import { AddButton } from "./AddButton";

const useStyles = makeStyles((theme) => ({
  mobileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
    width: "100%",
  },
  bottomButton: {
    marginBottom: 30,
  },
  stickyButton: {
    position: "absolute",
    bottom: 44,
    right: 24,
    zIndex: 1299,
  },
  statsBtn: {
    color: "#40D1FF",
    boxShadow: theme.shadows[5],
    borderRadius: "50%",
    padding: 6,
    height: 40,
    width: 40,
  },
}));

export function Mobile({ userData, openTransactionForm }) {
  const classes = useStyles();

  return (
    <div className={classes.mobileContainer}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Budget userData={userData} type="mobile" />

              <Link to="/stats">
                <BarChartIcon
                  fontSize="large"
                  classes={{ fontSizeLarge: classes.statsBtn }}
                />
              </Link>

              <AddButton
                handler={openTransactionForm}
                className={classes.bottomButton}
              />
            </>
          }
        />

        <Route
          path="/stats"
          element={
            <>
              <Stats
                type="mobile"
                userData={userData}
                openTransactionForm={openTransactionForm}
              />

              <AddButton
                handler={openTransactionForm}
                className={classes.stickyButton}
              />
            </>
          }
        />
      </Routes>
    </div>
  );
}
