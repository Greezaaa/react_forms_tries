import React from "react";

function TextArea({ value, onChange, type = "text", required }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      type={type}
      required={required}
    />
  );
}

export default TextArea;