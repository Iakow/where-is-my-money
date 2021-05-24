/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';
import { useEffect, useState } from '../framework/hooks';

export default function Category({ value, categories, moneyWay }) {
  const [moneyWayState, setMoneyWayState] = useState(moneyWay);

  return (
    <>
      <div
        onchange={({ target }) => {
          setMoneyWayState(target.value);
        }}
      >
        <label>
          <input type="radio" name="moneyWay" value="income" checked={moneyWayState == 'income'} />
          income
        </label>

        <label>
          <input
            type="radio"
            name="moneyWay"
            value="outcome"
            checked={moneyWayState == 'outcome'}
          />
          outcome
        </label>
      </div>

      <br />

      <select name="category" id="categories">
        {categories[moneyWayState].map((category, i) =>
          value == i ? (
            <option selected value={i}>
              {category}
            </option>
          ) : (
            <option value={i}>{category}</option>
          ),
        )}
      </select>
    </>
  );
}
