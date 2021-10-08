import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Calendar from "../UserCalendar"

export default function ManagerDashboard(props) {

  return (
    <div className="dashboard">
      
      <Calendar />

    </div>
  );
}
