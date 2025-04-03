import { user } from "@/types/interfaces";
import React from "react";

interface AdminProps {
  user: user;
}
export const Admin: React.FC<AdminProps> = ({ user }) => {
  return <div>Admin{user.name}</div>;
};
