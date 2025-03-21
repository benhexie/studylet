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
  imageSrc = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
}: {
  title: string;
  children?: ReactNode;
  ctaButtonText: string;
  onClickCTAButton?: () => Promise<void>;
  redirectText: (textStyle: string, linkStyle: string) => ReactNode;
  isLoading?: boolean;
  imageSrc?: string;
}) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-primary/5 h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent mix-blend-overlay" />
          <img
            src={imageSrc}
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

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-xl space-y-8 px-4 py-8 sm:px-8 sm:py-12 md:space-y-10">
            <div className="relative">
              <Link
                to="/"
                className="group absolute -top-12 sm:-top-16 left-0 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-all rounded-lg hover:bg-white hover:shadow-sm"
              >
                <FaArrowLeft className="text-sm transition-transform group-hover:-translate-x-0.5" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <Logo className="mx-auto h-10 sm:h-12 w-auto" />
            </div>

            <form
              className="space-y-6 sm:space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                onClickCTAButton?.();
              }}
            >
              <div className="text-center space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  {title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Start practising for your upcoming exams
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {children}

                <button
                  disabled={isLoading}
                  className={`
                    w-full py-3 sm:py-4 px-6 rounded-xl font-semibold text-white text-sm sm:text-base
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
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    ctaButtonText
                  )}
                </button>

                <div className="text-center">
                  {redirectText(
                    "text-xs sm:text-sm text-gray-600",
                    "font-medium text-primary hover:text-primary/90 transition-colors"
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTemplate;
