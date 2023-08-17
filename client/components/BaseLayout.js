// pages passes the currentUser to Baselayout and it  passes to the header
import React from "react";
import Header from "./header";

export default function BaseLayout({ children, currentUser }) {
  return (
    <div className="container-fluid">
      <Header currentUser={currentUser} />
      {children}
    </div>
  );
}
