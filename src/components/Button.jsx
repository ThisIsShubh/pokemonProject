import React from 'react';
import './button.css';

function Button({
  label = "Click Me",
  onClick = () => {},
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`btn ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default Button;
