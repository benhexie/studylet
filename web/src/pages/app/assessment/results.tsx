import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetResultsQuery } from '../../../store/api/assessmentApi';
import { BsClockHistory } from 'react-icons/bs';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: results, isLoading, error } = useGetResultsQuery(id || '');

  console.log('Results query state:', { results, isLoading, error });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Results error:', error);
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load results: {(error as any)?.data?.message || 'Unknown error'}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">No results found</p>
      </div>
    );
  }

  const { assessment, practiceSession } = results;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">{assessment.title}</h1>
          <p className="text-gray-500">{assessment.subject}</p>
          
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {practiceSession.score.toFixed(1)}%
              </p>
              <p className="text-gray-500">Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {practiceSession.timeSpent}
              </p>
              <p className="text-gray-500">Time Spent</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">
                {assessment.questions.length}
              </p>
              <p className="text-gray-500">Questions</p>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {assessment.questions.map((question, index) => {
            const hasAnswer = index.toString() in practiceSession.answers;
            const userAnswer = hasAnswer ? parseInt(practiceSession.answers[index.toString()]) : undefined;
            const correctAnswerIndex = question.options.indexOf(question.correctAnswer);
            const isCorrect = userAnswer === correctAnswerIndex;

            return (
              <div key={question._id} className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Question {index + 1}
                  </h3>
                  {hasAnswer ? (
                    isCorrect ? (
                      <IoCheckmarkCircle className="text-2xl text-green-500" />
                    ) : (
                      <IoCloseCircle className="text-2xl text-red-500" />
                    )
                  ) : (
                    <span className="text-sm font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                      Not Answered
                    </span>
                  )}
                </div>

                <p className="text-gray-800 mb-6">{question.text}</p>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isUserAnswer = hasAnswer && optionIndex === userAnswer;
                    const isCorrectAnswer = optionIndex === correctAnswerIndex;

                    let optionStyle = 'border-gray-200';
                    if (isUserAnswer && !isCorrect) {
                      optionStyle = 'border-red-500 bg-red-50';
                    }
                    if (isCorrectAnswer) {
                      optionStyle = 'border-green-500 bg-green-50';
                    }

                    return (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-lg border-2 flex items-center justify-between ${optionStyle} ${
                          !hasAnswer ? 'opacity-70' : ''
                        }`}
                      >
                        <span>{option}</span>
                        {isUserAnswer && !isCorrect && (
                          <IoCloseCircle className="text-xl text-red-500" />
                        )}
                        {isCorrectAnswer && (
                          <IoCheckmarkCircle className="text-xl text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {(!hasAnswer || !isCorrect) && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    {!hasAnswer && (
                      <p className="text-sm text-yellow-700 mb-2">
                        <span className="font-medium">Note:</span> This question was not answered.
                      </p>
                    )}
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Explanation:</span> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate('/app/assessments')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results; 