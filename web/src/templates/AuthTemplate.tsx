import React, { ReactNode } from "react";

const AuthTemplate = ({
  title,
  children,
  ctaButtonText,
  onClickCTAButton,
  redirectText,
  isLoading = false,
}: {
  title: string;
  children?: ReactNode;
  ctaButtonText: string;
  onClickCTAButton?: () => Promise<void>;
  redirectText: (textStyle: string, linkStyle: string) => ReactNode;
  isLoading?: boolean;
}) => {
  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onClickCTAButton?.();
      }}
    >
      <div className="w-full flex flex-col items-center">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm">Start practising for your upcoming exams</p>
      </div>
      {children}
      <button
        disabled={isLoading}
        className={`p-4 w-full rounded-lg flex items-center justify-center ${
          isLoading
            ? "bg-primary/70 cursor-not-allowed"
            : "bg-primary hover:bg-primary/90"
        } text-white transition-colors`}
        type="submit"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          ctaButtonText
        )}
      </button>
      {redirectText("w-fit self-center", "font-medium text-blue-600")}
    </form>
  );
};

export default AuthTemplate;
