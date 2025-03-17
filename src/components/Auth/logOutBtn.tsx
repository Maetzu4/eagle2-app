"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  text: string;
}

const LogOutBtn: React.FC<Props> = ({ text: texto }) => {
  const route = useRouter();

  const handleLogOut = () => {
    route.push("logout");
  };

  return (
    <Button onClick={handleLogOut} variant="destructive">
      {texto}
    </Button>
  );
};

export default LogOutBtn;
