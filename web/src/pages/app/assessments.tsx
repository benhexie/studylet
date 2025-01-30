import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdAssignment, MdSearch } from 'react-icons/md';
import { useGetAssessmentsQuery } from '../../store/api/assessmentApi';
import { formatDate } from '../../utils/date';

const Assessments = () => {
  const { data: assessments, isLoading } = useGetAssessmentsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssessments = assessments?.filter(assessment => 
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
            <div
              key={assessment._id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{assessment.title}</h3>
                  <p className="text-sm text-gray-500">{assessment.subject}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  assessment.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  assessment.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {assessment.difficulty}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MdAssignment />
                  <span>{assessment.questions.length} Questions</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {assessment.lastAttempt ? (
                    <>
                      Last attempt: {formatDate(assessment.lastAttempt)}
                      <br />
                      Score: {assessment.score?.toFixed(1)}%
                    </>
                  ) : (
                    'Not attempted'
                  )}
                </div>

                {assessment.lastAttempt ? (
                  <Link
                    to={`/app/assessment/${assessment._id}/results`}
                    className="px-4 py-2 text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors"
                  >
                    View Results
                  </Link>
                ) : (
                  <Link
                    to={`/app/assessment/start/${assessment._id}`}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    Start Practice
                  </Link>
                )}
              </div>
            </div>
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
