import React from "react";
import "./dashboard.css";
import Calendar from "../ManagerCalendar"
export default function ManagerDashboard(props) {

  return (
    <div className="dashboard">
       <Calendar />
    </div>
  );
}
