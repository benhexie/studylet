import React, { ChangeEventHandler, ReactNode } from "react";

const CustomInput = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  autoComplete,
  containerStyle = "",
  leftIcon,
  rightIcon,
}: {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  type?: string;
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  containerStyle?: string;
  leftIcon?: (style: string) => ReactNode;
  rightIcon?: (style: string) => ReactNode;
}) => {
  return (
    <div className={`w-full ${containerStyle}`}>
      {label && (
        <div className="flex gap-1">
          <p className="">{label}</p>
          {required && <span className="text-red-500 font-semibold">*</span>}
        </div>
      )}
      <div className="bg-white border border-gray-300 rounded-lg px-4 flex items-center gap-4">
        {leftIcon && leftIcon("text-gray-500 text-xl")}
        <input
          className="w-full h-10 outline-none"
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        {rightIcon && rightIcon("text-gray-500 text-xl")}
      </div>
    </div>
  );
};

export default CustomInput;
