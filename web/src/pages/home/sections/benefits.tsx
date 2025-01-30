import React from 'react';

const Benefits = () => {
  return (
    <div id="benefits" className="min-h-screen py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Transform Your Study Experience</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover how Studylet can revolutionize your exam preparation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <img 
          src="https://placehold.co/600x400/e6e6e6/1a1a1a?text=Transform+Learning"
          alt="Benefits illustration" 
          className="rounded-lg shadow-xl hover:scale-105 transition-transform duration-500"
        />
        
        <div className="space-y-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">{index + 1}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const benefits = [
  {
    title: "Better Retention",
    description: "Our spaced repetition system ensures you remember what you learn for longer periods."
  },
  {
    title: "Confidence Boost",
    description: "Regular practice with real exam-like questions builds your confidence for the actual exam."
  },
  {
    title: "Time Management",
    description: "Learn to manage your time effectively with our timed practice sessions."
  },
  {
    title: "Comprehensive Coverage",
    description: "Ensure you cover all important topics with our intelligent content analysis."
  }
];

export default Benefits;