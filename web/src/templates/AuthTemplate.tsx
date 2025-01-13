import React, { ReactNode } from "react";

const AuthTemplate = ({
  title,
  children,
  ctaButtonText,
  onClickCTAButton,
  redirectText,
}: {
  title: string;
  children?: ReactNode;
  ctaButtonText: string;
  onClickCTAButton?: () => Promise<void>;
  redirectText: (textStyle: string, linkStyle: string) => ReactNode;
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col items-center">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm">Start practising for your upcoming exams</p>
      </div>
      {children}
      <button
        onClick={onClickCTAButton}
        className="p-4 w-full bg-primary text-white rounded-lg"
      >
        {ctaButtonText}
      </button>
      {redirectText("w-fit self-center", "font-medium text-blue-600")}
    </div>
  );
};

export default AuthTemplate;
