//@/app/not-found.tsx
import LogOutBtn from "@/components/Auth/logOutBtn";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-cyan-50">404</h1>
      </div>
      <div>
        <LogOutBtn text={"Volver al inicio"} />
      </div>
    </div>
  );
}
