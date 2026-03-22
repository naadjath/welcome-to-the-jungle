import JobDetail from "./JobDetail";
import AdminDashboard from "./AdminDashboard";
import "./style.css";

function App() {
  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  return <JobDetail />;
}

export default App;