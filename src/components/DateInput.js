/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

export default function DateInput({ value }) {
  return <input name="date" type="datetime-local" placeholder="date" value={value} />;
}
