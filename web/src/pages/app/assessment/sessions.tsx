import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPracticeSessionsQuery, useGetAssessmentQuery } from "../../../store/api/assessmentApi";
import { format } from "date-fns";
import { MdArrowBack, MdPlayArrow, MdAccessTime, MdScore } from "react-icons/md";

const PracticeSessions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sessions, isLoading: sessionsLoading } = useGetPracticeSessionsQuery(id!);
  const { data: assessment, isLoading: assessmentLoading } = useGetAssessmentQuery(id!);

  if (sessionsLoading || assessmentLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
          title="Back"
        >
          <MdArrowBack className="text-2xl" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">{assessment?.title}</h1>
          <p className="text-gray-500 mt-1">{assessment?.subject}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Practice History</h2>
            <button
              onClick={() => navigate(`/app/assessment/start/${id}`)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <MdPlayArrow />
              Start New Practice
            </button>
          </div>

          <div className="space-y-4">
            {sessions?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No practice sessions yet
              </div>
            ) : (
              sessions?.map((session) => (
                <div
                  key={session._id}
                  onClick={() => navigate(`/app/assessment/results/${session._id}`)}
                  className="border border-gray-100 rounded-lg p-5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MdScore className="text-lg text-primary" />
                          <span className="font-medium">
                            Score: {session.score}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MdAccessTime className="text-lg text-primary" />
                          <span>Time: {session.timeSpent}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Completed: {format(new Date(session.completedAt), "PPp")}
                      </p>
                    </div>
                    <div className="text-gray-400">→</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSessions; 