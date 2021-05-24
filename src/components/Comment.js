/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

export default function Comment({ value }) {
  return <input type="text" placeholder="comment" name="comment" value={value} />;
}
