import React from 'react';
import { Link } from 'react-router-dom';
import { IoBarChartSharp, IoCalendarOutline } from 'react-icons/io5';
import { BsClockHistory, BsQuestionCircle } from 'react-icons/bs';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetStatisticsQuery } from "../../store/api/statisticsApi";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PracticeSession {
  id: string;
  title: string;
  date: string;
  score: number;
  timeSpent: string;
  questionsAnswered: number;
  totalQuestions: number;
}

const StatCard = ({
  title,
  value,
  icon,
  bgColor = "bg-white",
  textColor = "text-primary",
  subtextColor = "text-gray-600"
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  subtextColor?: string;
}) => (
  <div className={`${bgColor} rounded-xl shadow-sm p-6 flex flex-col gap-4`}>
    <div className="flex items-center justify-between">
      <p className={`text-4xl font-semibold ${textColor}`}>{value}</p>
      <div className={`${textColor} text-2xl`}>{icon}</div>
    </div>
    <p className={subtextColor}>{title}</p>
  </div>
);

const Stats = () => {
  const { data: stats, isLoading } = useGetStatisticsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = {
    labels: stats?.recentActivity
      .map(activity => new Date(activity.date).toLocaleDateString())
      .reverse(),
    datasets: [
      {
        label: 'Assessment Scores',
        data: stats?.recentActivity
          .map(activity => activity.score)
          .reverse(),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Performance Statistics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Completed Assessments</h3>
          <p className="text-3xl font-semibold text-primary">
            {stats?.completedAssessments || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Average Score</h3>
          <p className="text-3xl font-semibold text-primary">
            {stats?.averageScore.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Study Hours</h3>
          <p className="text-3xl font-semibold text-primary">
            {stats?.studyHours}h
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-6">Score History</h3>
        <div className="h-[400px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: value => `${value}%`,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `Score: ${context.parsed.y}%`,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {stats?.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800">{activity.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-primary font-medium">
                <Link to={`/app/assessment/${activity.id}/results`}>View Results</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats; 