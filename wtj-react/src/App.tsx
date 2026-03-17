import { useState } from "react";
import ApplicationForm from "./ApplicationForm"; // ton formulaire existant
import AdminDashboard from "./AdminDashboard";
import "./style.css";

const jobOffer = {
  title: "Stage Développement Web",
  company: "Votre Entreprise",
};

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return
  
  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }(
    <div className="main-page">
      {/* Logo ou texte cliquable vers Welcome to the Jungle */}
      {/* Remplace le texte par une image si tu as le logo */}
      <a
        href="https://www.welcometothejungle.com/fr"
        target="_blank"
        rel="noopener noreferrer"
        className="logo-link"
      >
        {/* Texte temporaire */}
        Welcome to the Jungle
        {/* Pour remplacer par une image, décommente la ligne ci-dessous et mets le fichier logo.png dans public/ */}
        {/*
        <img
          src="/logo.png"
          alt="Welcome to the Jungle"
          className="logo"
        />
        */}
      </a>

      {/* Offre de stage */}
      <div className="job-offer">
        <h1>{jobOffer.title}</h1>
        <p>{jobOffer.company}</p>
        <button onClick={() => setIsFormOpen(true)}>
          Postuler à cette offre
        </button>
      </div>

      {/* Formulaire modal */}
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