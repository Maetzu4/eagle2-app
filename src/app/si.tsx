"use client"

import MiData from "@/components/midata";
import { Button } from "@/components/ui/button"
import { useState } from "react";

export default function Home() {

  const [isDivVisible, setIsDivVisible] = useState(false);

  const handleClick = () => {
    if (isDivVisible) {
      setIsDivVisible(false);
    } else {
      setIsDivVisible(true);
  }};

  return (
    <main className="flex-col p-20">
      <h1 className="text-3xl py-8">
        Usuarios Eagle
      </h1>
      <Button onClick={handleClick}>Ver Usuarios</Button>
      {isDivVisible && (
        <div className="mt-8 p-4 bg-blue-100 border border-blue-400 rounded">
          <p className="text-blue-700">¡Este es un div dinámico!</p>
          <MiData/>
        </div>
      )}
    </main>
  );
}