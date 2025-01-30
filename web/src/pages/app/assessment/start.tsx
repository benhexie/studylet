import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAssessmentQuery } from '../../../store/api/assessmentApi';
import { BsClockHistory } from 'react-icons/bs';
import { MdAssignment } from 'react-icons/md';

const getDefaultTime = (questionCount: number) => Math.ceil(questionCount * 0.5); // 30 seconds per question in minutes

const Start = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: assessment, isLoading } = useGetAssessmentQuery(id || '');
  const [timeLimit, setTimeLimit] = useState<number>(0);

  // Update timeLimit when assessment data is loaded
  useEffect(() => {
    if (assessment) {
      setTimeLimit(getDefaultTime(assessment.questions.length));
    }
  }, [assessment]);

  const handleStartPractice = () => {
    navigate(`/app/assessment/practice/${id}`, { 
      state: { timeLimit } 
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">{assessment?.title}</h1>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-gray-600">
            <MdAssignment className="text-xl" />
            <span>{assessment?.questions.length} Questions</span>
          </div>
          
          <div className="flex items-center gap-4">
            <BsClockHistory className="text-xl text-gray-600" />
            <div className="flex items-center gap-2">
              <input
                placeholder='10'
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value)))}
                className="w-20 px-3 py-2 border border-gray-200 rounded-lg"
                min="1"
              />
              <span className="text-gray-600">minutes</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
            <p>Instructions:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Read each question carefully</li>
              <li>Select the best answer from the options provided</li>
              <li>You can review and change your answers before submission</li>
              <li>Submit your answers before the time runs out</li>
            </ul>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={() => navigate('/app/assessments')}
              className="px-6 py-3 rounded-lg border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartPractice}
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Start Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
