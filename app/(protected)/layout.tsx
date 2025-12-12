import React from "react";
import ClientProtected from "./ClientProtected";
import Nav from "../component/Nav";
import SideBar from "../component/SideBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProtected>
      <div className="min-h-screen flex linear-gradient-to-br from-slate-100 to-slate-200">
        <Nav />
        <SideBar />
        <div className="flex-1 p-6">{children}</div>
      </div>
    </ClientProtected>
  );
}
