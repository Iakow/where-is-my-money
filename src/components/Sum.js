/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

export default function Sum({ value }) {
  return <input type="number" placeholder="sum" name="sum" min="1" value={value} required />;
}
