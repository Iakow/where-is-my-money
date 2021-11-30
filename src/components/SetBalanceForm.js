import React from "react";
import { email, setBalance } from "../data/firebase";

import styles from "../style.css";

export function SetBalanceForm() {
  const handleBalance = (e) => {
    e.preventDefault();
    setBalance(+e.target.sum.value);
  };

  return (
    <form className={styles.initialForm} onSubmit={handleBalance}>
      <p className={styles["initialForm_auth-message"]}>Wellcome {email}!</p>
      <p className={styles["initialForm_input-message"]}>
        Now, set your current balance please
      </p>
      <input
        className={styles["initialForm_input"]}
        type="number"
        placeholder="sum"
        autoFocus
        name="sum"
        min="1"
        required
      />
      <input
        className={styles["initialForm_submit"]}
        type="submit"
        value="Send"
      />
    </form>
  );
}
