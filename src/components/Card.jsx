import React from "react";
import checklistbomba from "../styles/ChecklistBomba.css";

export default function Card({ children }) {
  return <div className={checklistbomba.card}>{children}</div>;
}
