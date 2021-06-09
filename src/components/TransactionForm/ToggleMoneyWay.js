import React from 'react';

export default function ToggleMoneyWay({ value, handler }) {
  return (
    <div
      onChange={({ target }) => {
        handler(target.value === 'income' ? true : false);
      }}
    >
      <label>
        <input type="radio" name="moneyWay" value="income" defaultChecked={value === true} />
        income
      </label>

      <label>
        <input type="radio" name="moneyWay" value="outcome" defaultChecked={value === false} />
        outcome
      </label>
    </div>
  );
}
