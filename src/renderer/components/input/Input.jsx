import { Input as AntdInput } from 'antd';
import React from 'react';
import './styles.css';

const Input = ({ label, value, onChange, error }) => {
  const errorProps = error ? { status: 'error' } : {};
  return (
    <div>
      <p className="input-label">{label}</p>
      <AntdInput
        size="large"
        placeholder="Test Type"
        value={value}
        onChange={onChange}
        {...errorProps}
        // status="error"
      />
      {error ? <sup style={{ color: 'red' }}>{error}</sup> : null}
    </div>
  );
};

export default Input;
