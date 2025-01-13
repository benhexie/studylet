import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirects = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, []);
  return <></>;
};

export default Redirects;
