import React from 'react';
import { FiBook, FiClock, FiTarget, FiTrendingUp } from 'react-icons/fi';

const Features = () => {
  return (
    <div id="features" className="min-h-screen py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Why Choose Studylet?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience a revolutionary way to prepare for your exams with our cutting-edge features
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="p-8 rounded-xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const features = [
  {
    icon: <FiBook className="text-2xl text-primary" />,
    title: "Smart Document Analysis",
    description: "Upload your study materials and let our AI generate relevant practice questions instantly."
  },
  {
    icon: <FiTarget className="text-2xl text-primary" />,
    title: "Personalized Learning",
    description: "Get customized practice sessions based on your performance and learning patterns."
  },
  {
    icon: <FiClock className="text-2xl text-primary" />,
    title: "Time-Efficient",
    description: "Save hours of preparation time with our automated question generation system."
  },
  {
    icon: <FiTrendingUp className="text-2xl text-primary" />,
    title: "Progress Tracking",
    description: "Monitor your improvement with detailed analytics and performance insights."
  }
];

export default Features;