import React from "react";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="pt-20">{children}</main>
    </div>
  );
};

export default Layout;
