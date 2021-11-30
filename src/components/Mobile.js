import { Routes, Route, Link } from "react-router-dom";
import { Budget } from "./Budget/Budget";
import { Stats } from "./Stats/Stats";

export function Mobile({userData, openTransactionForm}) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Link to="/stats">Stats</Link>
            <Budget userData={userData} type="mobile" />
          </>
        }
      />
      <Route
        path="/stats"
        element={
          <>
            <Link to="/">Main</Link>
            <Stats
              userData={userData}
              openTransactionForm={openTransactionForm}
            />
          </>
        }
      />
    </Routes>
  );
}
