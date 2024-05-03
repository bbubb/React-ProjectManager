import Sidebar from "./Sidebar";
import Project from "./Project";

function Dashboard() {
  return (
    <main className="h-screen my-8 flex md:gap-8 rounded-md">
      <Sidebar />
      <div className="w-3/4 max-w-4x1 bg-stone-100 rounded-md md:p-8 py-8 flex flex-col">
        <Project />
      </div>
    </main>
  );
}

export default Dashboard;
