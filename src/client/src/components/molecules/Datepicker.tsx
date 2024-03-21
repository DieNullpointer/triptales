import React, { useState } from "react";
import DatepickerI from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker";

const Datepicker: React.FC<{ single?: boolean, className?: string }> = ({ single = false, className = "" }) => {
  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  return (
    <DatepickerI
      value={value}
      onChange={handleValueChange}
      primaryColor="emerald"
      inputClassName="w-full rounded-md border border-gray-400/80 p-2 pl-3"
      placeholder={`${!single ? "Startdate ~ Enddate" : "Date"}`}
      showShortcuts={true}
      asSingle={single}
      displayFormat="DD.MM.YYYY"
    />
  );
};
export default Datepicker;
