/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

export default function Sum({ value, handler }) {
  return (
    <input
      type="number"
      placeholder="sum"
      autofocus
      name="sum"
      min="1"
      value={value}
      required
      onChange={e => {
        handler(e.target.name, e.target.value);
      }}
    />
  );
}
