import React, {useState} from 'react';

export default function Comment({ value, handler }) {
  const [text, setText] = useState(value);

  const handle = ({target})=> {
    setText(target.value)
  }

  const upData = () => {
    handler('comment', text)
  }

  return (
    <input
      type="text"
      placeholder="comment"
      name="comment"
      value={text}
      onChange={handle}
      onBlur={upData}
    />
  );
}
