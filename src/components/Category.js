/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

export default function Category({ value, categories, moneyWay }) {
  const handler = e => {
    document.querySelector('#categories').innerHTML = categories[e.target.value]
      .map((category, i) => `<option value=${i}>${category}</option>`)
      .join('');
  };

  return (
    <>
      <div onchange={handler}>
        <label>
          <input type="radio" name="moneyWay" value="income" checked={moneyWay == 'income'} />
          income
        </label>

        <label>
          <input type="radio" name="moneyWay" value="outcome" checked={moneyWay == 'outcome'} />
          outcome
        </label>
      </div>

      <br />

      <select name="category" id="categories">
        {categories[moneyWay].map((category, i) =>
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
