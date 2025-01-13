import React from "react";
import { FiUpload } from "react-icons/fi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between mt-8">
        <h2 className="text-gray-600 font-semibold text-lg">Your Dashboard</h2>
        <Link
          to={"/assessment/upload"}
          className="px-4 py-2 rounded-md bg-primary text-white flex items-center gap-2"
        >
          <span className="">Upload document</span>
          <FiUpload />
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        <h4>Overall Performance</h4>
        <div className="">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary text-white rounded-md flex flex-col gap-4 p-8 items-center justify-center">
              <p className="text-4xl font-semibold">39%</p>
              <p className="">Accuracy</p>
            </div>
            <div className="bg-white rounded-md flex flex-col gap-4 p-8 justify-center">
              <div className="flex flex-col">
                <p className="text-primary text-xl font-semibold">
                  2 hrs 57 mins
                </p>
                <p className="text-gray-400">Total Practice Time</p>
              </div>
              <div className="flex flex-col">
                <p className="text-primary text-xl font-semibold">1,300</p>
                <p className="text-gray-400">Total Questions Practiced</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-md bg-white">
        <div className="border-b border-400 p-4 flex items-center">
          <p>Recent Practices</p>
        </div>
        {recentPractices.map((practice, index) => (
          <div
            className={`p-4 flex items-center justify-between ${
              index === recentPractices.length - 1
                ? ""
                : "border-b border-gray-200"
            }`}
          >
            <p className="font-semibold text-gray-600">{practice.name}</p>
            <div className="px-4 py-1 border border-green-500 bg-green-50 rounded-full">
              <p className="text-green-500">{practice.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

const recentPractices = [
  { name: "Curriculum and Instructional Design", status: "Completed" },
  { name: "Human Resource Management", status: "Completed" },
  { name: "Industrial Biotechnology", status: "Completed" },
  { name: "Curriculum and Instructional Design", status: "Completed" },
  { name: "Human Resource Management", status: "Completed" },
  { name: "Industrial Biotechnology", status: "Completed" },
];
