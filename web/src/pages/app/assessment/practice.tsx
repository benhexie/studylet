import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BsClockHistory } from "react-icons/bs";
import { IoCheckmarkCircle } from "react-icons/io5";
import {
  useGetQuestionsQuery,
  useSubmitPracticeMutation,
} from "../../../store/api/assessmentApi";
import { toast } from "react-toastify";

interface Question {
  id: string;
  text: string;
  options: string[];
  explanation?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const Practice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const timeLimit = location.state?.timeLimit || 30; // default 30 minutes
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // convert to seconds
  const {
    data: questions = [],
    isLoading,
    error,
  } = useGetQuestionsQuery(id || "");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitPractice] = useSubmitPracticeMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load questions</p>
      </div>
    );
  }

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] ?? null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] ?? null);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      const confirmed = window.confirm(
        "You have unanswered questions. Are you sure you want to submit?"
      );
      if (!confirmed) return;
    }

    setIsSubmitting(true);
    try {
      const timeSpent = formatTime(timeLimit * 60 - timeLeft);
      const result = await submitPractice({
        assessmentId: id || "",
        answers,
        timeSpent,
      }).unwrap();

      toast.success("Assessment submitted successfully");
      navigate(`/app/assessment/results/${result._id}`, { replace: true });
    } catch (error) {
      toast.error("Failed to submit assessment");
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
          <div
            className={`flex items-center gap-2 ${
              timeLeft < 60 ? "text-red-500" : "text-primary"
            }`}
          >
            <BsClockHistory />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-6">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-4
                  ${
                    selectedAnswer === index
                      ? "border-primary bg-blue-50 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${
                    selectedAnswer === index
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswer === index && (
                    <IoCheckmarkCircle className="text-primary text-lg" />
                  )}
                </div>
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg border-2 border-gray-200 
              ${
                currentQuestionIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-primary hover:text-primary"
              } transition-colors`}
          >
            Previous
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg bg-primary text-white font-medium 
                ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/90"
                } 
                transition-colors`}
            >
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`px-6 py-3 rounded-lg bg-primary text-white 
                ${
                  selectedAnswer === null
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/90"
                }
                transition-colors`}
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
