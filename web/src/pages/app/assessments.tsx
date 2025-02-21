import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdAssignment, MdSearch, MdHistory, MdPlayArrow } from "react-icons/md";
import { useGetAssessmentsQuery } from "../../store/api/assessmentApi";
import { formatDate } from "../../utils/date";

const AssessmentCard = ({
  assessment,
  navigate,
}: {
  assessment: any;
  navigate: any;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-medium text-gray-800 text-lg">
          {assessment.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{assessment.subject}</p>
      </div>
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${
          assessment.difficulty === "Easy"
            ? "bg-green-100 text-green-700"
            : assessment.difficulty === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {assessment.difficulty}
      </span>
    </div>

    <div className="mt-4 flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MdAssignment className="text-primary" />
        <span>{assessment.questions.length} Questions</span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t">
      <div className="text-sm text-gray-600 mb-4">
        {assessment.lastAttempt ? (
          <div className="space-y-1">
            <p>Last attempt: {formatDate(assessment.lastAttempt)}</p>
            <p className="font-medium text-primary">
              Score: {assessment.score?.toFixed(1)}%
            </p>
          </div>
        ) : (
          "Not attempted yet"
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/app/assessment/${assessment._id}/sessions`)}
          className="flex-1 px-4 py-2.5 text-sm font-medium bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <MdHistory className="text-lg" />
          Sessions
        </button>
        <button
          onClick={() => navigate(`/app/assessment/start/${assessment._id}`)}
          className="flex-1 px-4 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <MdPlayArrow className="text-lg" />
          Practice
        </button>
      </div>
    </div>
  </div>
);

const Assessments = () => {
  const { data: assessments, isLoading } = useGetAssessmentsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredAssessments = assessments?.filter(
    (assessment) =>
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Assessments</h1>
          <Link
            to="/app/assessment/upload"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Upload Document
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
        </div>

        {/* Assessment List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments?.map((assessment) => (
            <AssessmentCard
              key={assessment._id}
              assessment={assessment}
              navigate={navigate}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAssessments?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No assessments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;
