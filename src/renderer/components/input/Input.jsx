import { Input as AntdInput } from 'antd';
import React from 'react';
import './styles.css';

const Input = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
}) => {
  const errorProps = error ? { status: 'error' } : {};
  return (
    <div>
      <p className="input-label">{label}</p>
      <AntdInput
        size="large"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...errorProps}
      />
      {error ? <sup style={{ color: 'red' }}>{error}</sup> : null}
    </div>
  );
};

export default Input;
