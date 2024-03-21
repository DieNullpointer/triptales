import React, { useState } from "react";
import DatepickerI from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker";

export interface Props {
  single?: boolean;
  className?: string;
  value: DateValueType;
  onChange: (newValue: DateValueType) => void;
}

const Datepicker: React.FC<Props> = ({ single = false, className = "", value, onChange }) => {

  return (
    <DatepickerI
      value={value}
      onChange={onChange}
      primaryColor="emerald"
      inputClassName="w-full rounded-md border border-gray-400/80 p-2 pl-3"
      placeholder={`${!single ? "Startdate - Enddate" : "Date"}`}
      showShortcuts={true}
      asSingle={single}
      displayFormat="DD.MM.YYYY"
      separator="-"
    />
  );
};
export default Datepicker;
