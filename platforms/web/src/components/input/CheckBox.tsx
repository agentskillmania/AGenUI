import React, { useState } from 'react';
import { Checkbox } from 'antd';
import type { AGenUIComponentProps } from '../types';

export const CheckBox: React.FC<AGenUIComponentProps> = ({ properties, onSyncState }) => {
  const { checked, disabled, indeterminate, style } = properties;
  const [localChecked, setLocalChecked] = useState(!!checked);

  const handleChange = (e: { target: { checked: boolean } }) => {
    setLocalChecked(e.target.checked);
    onSyncState?.({ checked: e.target.checked });
  };

  return (
    <Checkbox
      checked={localChecked}
      disabled={disabled as boolean}
      indeterminate={indeterminate as boolean}
      style={style as React.CSSProperties}
      onChange={handleChange}
    />
  );
};
