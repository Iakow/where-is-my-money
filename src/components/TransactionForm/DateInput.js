/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement } from '../../framework/element';
import { getHTMLDate } from '../../utils';

export default function DateInput({ value, handler }) {
  return (
    <input
      name="date"
      type="datetime-local"
      placeholder="date"
      value={getHTMLDate(value)}
      onInput={e => {
        handler(e.target.name, new Date(e.target.value).getTime());
      }}
    />
  );
}
