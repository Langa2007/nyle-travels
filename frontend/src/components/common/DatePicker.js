'use client';

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DatePicker(props) {
  const { className, calendarClassName, ...rest } = props;
  return (
    <ReactDatePicker
      {...rest}
      className={className}
      calendarClassName={calendarClassName}
      popperPlacement={props.popperPlacement || 'bottom-start'}
    />
  );
}
