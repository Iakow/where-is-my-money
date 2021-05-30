/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';

export default function Comment({ value, handler }) {
  return (
    <input
      type="text"
      placeholder="comment"
      name="comment"
      value={value}
      onChange={e => {
        handler(e.target.name, e.target.value);
      }}
    />
  );
}
