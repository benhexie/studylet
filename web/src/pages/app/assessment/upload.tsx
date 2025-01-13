import React from "react";
import { FiUpload } from "react-icons/fi";

const Upload = () => {
  return (
    <div className="max-w-3xl w-full flex flex-col p-4 items-center justify-center">
      <div className="flex flex-col gap-4 max-w-xl w-full">
        <p className="font-medium text-lg text-gray-600 mb-4 w-fit text-center">
          Generate questions from PDF
        </p>
        <label className="w-full flex flex-col gap-2">
          <p className="">Title of Assessment</p>
          <input
            type="text"
            className="h-12 p-2 w-full border border-gray-200 rounded-md outline-none focus:border-2"
            placeholder="Ex: Industrial Mathematics"
          />
        </label>
        <label className="p-4 border border-gray-200 bg-white rounded-lg cursor-pointer relative hover:border-2">
          <input
            type="file"
            accept=".pdf"
            name=""
            id=""
            className="absolute hidden"
          />
          <div className="h-20 border-2 border-gray-400 border-dashed p-4 rounded-lg flex items-center justify-center gap-2 text-gray-600">
            <p className="font-medium">Upload PDF</p>
            <FiUpload />
          </div>
        </label>
        <button className="p-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          Upload document
        </button>
      </div>
    </div>
  );
};

export default Upload;
