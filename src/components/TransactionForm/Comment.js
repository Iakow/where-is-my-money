import React, { useState } from 'react';
import styles from '../../style';

export default function Comment({ value, handler }) {
  const [text, setText] = useState(value);

  const handle = ({ target }) => {
    setText(target.value);
  };

  const upData = () => {
    handler('comment', text);
  };

  return (
    <textarea
      className={styles['transaction-form_textarea']}
      type="textarea"
      placeholder="comment"
      name="comment"
      value={text}
      onChange={handle}
      onBlur={upData}
    />
  );
}
