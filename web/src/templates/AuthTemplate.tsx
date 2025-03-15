import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { FaArrowLeft } from "react-icons/fa6";

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
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        {/* Left side - Form */}
        <div className="w-full max-w-xl space-y-10 px-8 py-12 sm:px-12">
          <div className="relative">
            <Link
              to="/"
              className="group absolute -top-16 left-0 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-all rounded-lg hover:bg-white hover:shadow-sm"
            >
              <FaArrowLeft className="text-sm transition-transform group-hover:-translate-x-0.5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <Logo className="mx-auto h-12 w-auto" />
          </div>
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              onClickCTAButton?.();
            }}
          >
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h2>
              <p className="text-base text-gray-600">
                Start practising for your upcoming exams
              </p>
            </div>

            <div className="space-y-6">
              {children}

              <button
                disabled={isLoading}
                className={`
                w-full py-4 px-6 rounded-xl font-semibold text-white text-base
                transform transition-all duration-200 shadow-sm
                ${
                  isLoading
                    ? "bg-primary/70 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                }
              `}
                type="submit"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  ctaButtonText
                )}
              </button>

              <div className="text-center">
                {redirectText(
                  "text-sm text-gray-600",
                  "font-medium text-primary hover:text-primary/90 transition-colors"
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block flex-1 relative bg-primary/5 h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent mix-blend-overlay" />
          <img
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1546&q=80"
            alt="Students studying"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-center text-white backdrop-blur-sm bg-black/30 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">
                Unlock Your Learning Potential
              </h3>
              <p className="text-lg font-medium">
                Join thousands of students who are already improving their exam
                performance with Studylet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTemplate;
