import { useEffect, useState } from "react";
import TechnicalForm from "./TechnicalForm";
import { apiCall } from "./apiHelper";

const TechnicalFormPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const applicationId = searchParams.get("appId");
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !applicationId) {
        setErrorMessage("Lien invalide ou expiré");
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiCall("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, applicationId }),
        });

        if (!response.ok) {
          throw new Error("Token invalide ou expiré");
        }

        setIsValid(true);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Erreur lors de la vérification"
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, applicationId]);

  if (isLoading) {
    return (
      <div className="technical-form-container">
        <div className="loading-spinner">
          <h2>Vérification en cours...</h2>
          <p>Veuillez patienter quelques secondes.</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="technical-form-container">
        <div className="error-page">
          <h2>❌ Lien Invalide</h2>
          <p>{errorMessage}</p>
          <p style={{ marginTop: "20px", color: "#666" }}>
            Veuillez vérifier le lien reçu par email ou recommencer votre candidature.
          </p>
          <a href="/" className="back-link">
            Retourner à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (!token || !applicationId) {
    return (
      <div className="technical-form-container">
        <div className="error-page">
          <h2>❌ Données Manquantes</h2>
          <p>Les paramètres requis sont manquants.</p>
          <a href="/" className="back-link">
            Retourner à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return <TechnicalForm token={token} applicationId={applicationId} />;
};

export default TechnicalFormPage;
