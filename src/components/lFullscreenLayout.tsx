import { Outlet } from "react-router-dom";
export default function LFullscreenLayout() {
  return (
    <main className="h-dvh bg-background">
      {" "}
      <Outlet />{" "}
    </main>
  );
}
