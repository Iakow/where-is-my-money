/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement } from '../../framework/element';

export default function ToggleMoneyWay({ value, handler }) {
  return (
    <div
      onchange={({ target }) => {
        handler(target.value === 'income' ? true : false);
      }}
    >
      <label>
        <input type="radio" name="moneyWay" value="income" checked={value === true} />
        income
      </label>

      <label>
        <input type="radio" name="moneyWay" value="outcome" checked={value === false} />
        outcome
      </label>
    </div>
  );
}
