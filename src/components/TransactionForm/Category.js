/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';

export default function Category({ value, categories }) {
  return (
    <select name="category" id="categories">
      {categories.map((category, i) =>
        value == i ? (
          <option selected value={i}>
            {category}
          </option>
        ) : (
          <option value={i}>{category}</option>
        ),
      )}
    </select>
  );
}
