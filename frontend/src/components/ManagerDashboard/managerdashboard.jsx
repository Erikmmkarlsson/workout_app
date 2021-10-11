import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Calendar from "../ManagerCalender"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CallToActionIcon from '@mui/icons-material/CallToAction';
export default function ManagerDashboard(props) {

  return (
    <div className="dashboard">
       <Calendar />
    </div>
  );
}
