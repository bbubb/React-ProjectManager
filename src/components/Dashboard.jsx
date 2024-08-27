import Project from "./Project";
import Sidebar from "./Sidebar";

function Dashboard() {
  return (
    <main className="h-screen my-8 flex md:gap-8 rounded-lg">
      <Sidebar />
      <div className="w-3/4 max-w-4x1 bg-stone-100 rounded-lg md:p-8 py-8 flex flex-col">
        <Project />
      </div>
    </main>
  );
}

export default Dashboard;
