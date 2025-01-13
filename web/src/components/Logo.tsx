import React from "react";
import { Link } from "react-router-dom";

const Logo = ({
  to = "/",
  className = "",
}: {
  to?: string;
  className?: string;
}) => {
  return (
    <Link to={to}>
      <h1 className={"text-xl font-bold" + " " + className}>STUDYLET</h1>
    </Link>
  );
};

export default Logo;
