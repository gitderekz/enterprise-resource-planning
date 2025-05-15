'use client';
import React from 'react';
import { Calendar as CalendarPrimitive } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const Calendar = ({ className, ...props }) => {
  return (
    <div className={className}>
      <CalendarPrimitive
        {...props}
      />
    </div>
  );
};

export { Calendar };