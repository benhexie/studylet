import React, { useMemo, useState } from "react";
import CustomInput from "../../components/CustomInput";
import { FiSearch } from "react-icons/fi";
import { TiSortAlphabetically } from "react-icons/ti";
import { Link } from "react-router-dom";

const AssessmentItem = ({
  id,
  title,
  numberOfQuestions,
}: {
  id: string;
  title: string;
  numberOfQuestions: number;
}) => {
  return (
    <Link
      to={`/assessment/practice/${id}`}
      className={`p-4 rounded-md bg-white flex items-center justify-between max-w-3xl border-b border-gray-200 hover:bg-primary hover:text-white transition-colors gap-4`}
    >
      <p className="font-medium text-base line-clamp-2">{title}</p>
      <p className="text-gray-400">{numberOfQuestions} questions</p>
    </Link>
  );
};

const Assessments = () => {
  const [filterText, setFilterText] = useState("");
  const filteredAssessments = useMemo(
    () =>
      assessments.filter((assessment) =>
        new RegExp(filterText, "ig").test(assessment.title.trim())
      ),
    [assessments, filterText]
  );

  return (
    <div className="flex flex-col gap-8">
      <CustomInput
        placeholder="Search by assessment title"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        containerStyle="max-w-lg"
        leftIcon={(style) => <FiSearch className={style} />}
        rightIcon={(style) => <TiSortAlphabetically className={style} />}
      />
      <div className="flex flex-col gap-1">
        {filteredAssessments.map((assessment, index) => (
          <AssessmentItem
            key={assessment._id}
            id={assessment._id}
            title={assessment.title}
            numberOfQuestions={assessment.questions.length}
          />
        ))}
      </div>
    </div>
  );
};

export default Assessments;

const assessments = [
  {
    _id: "1",
    title: "Curriculum and Instructional Design",
    questions: ["", "", ""],
  },
  {
    _id: "2",
    title: "Human Resource Management",
    questions: ["", "", "", ""],
  },
  {
    _id: "3",
    title: "Industrial Biotechnology",
    questions: ["", "", "", "", "", ""],
  },
];
