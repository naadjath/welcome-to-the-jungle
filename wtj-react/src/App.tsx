import JobDetail from "./JobDetail";
import AdminDashboard from "./AdminDashboard";
import TechnicalFormPage from "./TechnicalFormPage";
import "./style.css";

function App() {
  const path = window.location.pathname;

  if (path === "/admin") {
    return <AdminDashboard />;
  }

  if (path === "/technical-form") {
    return <TechnicalFormPage />;
  }

  return <JobDetail />;
}

export default App;
