import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAssessmentsQuery,
  useDeleteAssessmentMutation,
} from "../../store/api/adminApi";
import { useGetAdminStatsQuery } from "../../store/api/dashboardApi";
import {
  MdAdd,
  MdAssignment,
  MdPeople,
  MdQuiz,
  MdDelete,
} from "react-icons/md";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: assessments, isLoading: loadingAssessments } =
    useGetAssessmentsQuery();
  const { data: stats, isLoading: loadingStats } = useGetAdminStatsQuery();
  const [deleteAssessment] = useDeleteAssessmentMutation();
  const user = useSelector(selectUser);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      try {
        await deleteAssessment(id).unwrap();
      } catch (error) {
        console.error("Failed to delete the assessment:", error);
      }
    }
  };

  if (loadingAssessments || loadingStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      {/* Welcome Message */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="mt-2 text-gray-600">
          Here you can manage assessments, view statistics, and oversee user
          activity.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-blue-500 p-4 rounded-lg text-white">
            <MdAssignment className="text-2xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Total Assessments
            </h3>
            <p className="text-2xl font-semibold text-gray-900">
              {stats?.totalAssessments || 0}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-green-500 p-4 rounded-lg text-white">
            <MdQuiz className="text-2xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Total Questions
            </h3>
            <p className="text-2xl font-semibold text-gray-900">
              {stats?.totalQuestions || 0}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-purple-500 p-4 rounded-lg text-white">
            <MdPeople className="text-2xl" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {stats?.totalUsers || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Assessments Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Assessments
            </h2>
            <button
              onClick={() => navigate("/admin/create-assessment")}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <MdAdd />
              <span>Create New</span>
            </button>
          </div>
        </div>

        {loadingAssessments ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessments?.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assessment.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {assessment.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {assessment.questions.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(assessment.createdAt), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDelete(assessment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
