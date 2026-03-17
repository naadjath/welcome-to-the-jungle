import { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import AdminDashboard from "./AdminDashboard";
import "./style.css";

const jobOffer = {
  title: "Stage Developpement Web",
  company: "Canedis - Paris",
};

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="main-page">
      <a
        href="https://www.welcometothejungle.com/fr"
        target="_blank"
        rel="noopener noreferrer"
        className="logo-link"
      >
        Welcome to the Jungle
      </a>

      <div className="job-offer">
        <h1>{jobOffer.title}</h1>
        <p>{jobOffer.company}</p>
        <button onClick={() => setIsFormOpen(true)}>
          Postuler à cette offre
        </button>
      </div>

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        jobTitle={jobOffer.title}
        companyName={jobOffer.company}
      />
    </div>
  );
}

export default App;
