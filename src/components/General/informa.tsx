//@/components/General/loaging.tsx
import React from "react";
import LogOutBtn from "../Auth/logOutBtn";
interface InformaProps {
  text: string;
  btntxt: string;
  log: boolean;
}
export const Informa: React.FC<InformaProps> = ({ text, log, btntxt }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cyan-50">{text}</h1>
      </div>
      {log && (
        <div>
          <LogOutBtn text={btntxt} />
        </div>
      )}
    </div>
  );
};
