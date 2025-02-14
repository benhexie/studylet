import React from "react";
import { useGetDashboardStatsQuery } from "../../store/api/dashboardApi";
import { Link } from "react-router-dom";
import { FaChartBar, FaBook, FaCheckCircle } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import { useGetCurrentUserQuery } from "../../store/api/authApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();
  const user = useSelector(selectUser);
  const { data: currentUser } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your learning progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatsCard
          title="Completed Assessments"
          value={stats?.completedAssessments || 0}
          icon={<FaCheckCircle />}
          color="bg-green-500"
        />
        <StatsCard
          title="Average Score"
          value={`${(stats?.averageScore || 0).toFixed(1)}%`}
          icon={<FaChartBar />}
          color="bg-blue-500"
        />
        <StatsCard
          title="Total Subjects"
          value={stats?.subjectPerformance?.length || 0}
          icon={<FaBook />}
          color="bg-purple-500"
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
          Performance by Subject
        </h2>
        <div className="h-[300px] md:h-[400px]">
          <Line
            data={{
              labels: stats?.subjectPerformance?.map((p) => p.subject) || [],
              datasets: [
                {
                  label: "Average Score",
                  data:
                    stats?.subjectPerformance?.map((p) => p.averageScore) || [],
                  borderColor: "rgb(59, 130, 246)",
                  backgroundColor: "rgba(59, 130, 246, 0.5)",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Recent Activity
          </h2>
          <Link
            to="/app/stats"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {stats?.recentSessions?.map((session) => (
            <div
              key={session.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="mb-2 md:mb-0">
                <h3 className="font-medium text-gray-800">
                  {session.assessmentTitle}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(session.completedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-medium">
                  Score: {session.score.toFixed(1)}%
                </span>
                <Link
                  to={`/app/assessment/${session.id}/results`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-white p-4 md:p-6 rounded-lg shadow flex items-center gap-4">
    <div className={`${color} text-white p-3 rounded-lg`}>{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-xl md:text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
