//@/components/General/loaging.tsx
import React from "react";
interface LoadingProps {
  text: string;
}
export const Loading: React.FC<LoadingProps> = ({ text }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cyan-50">{text}</h1>
      </div>
    </div>
  );
};
