import { useState } from "react";
import { apiCall } from "./apiHelper";

interface TechnicalFormProps {
  token: string;
  applicationId: string;
}

const TechnicalForm = ({ token, applicationId }: TechnicalFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    technicalQuestion1: "",
    technicalQuestion2: "",
    technicalQuestion3: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.technicalQuestion1
    ) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Veuillez entrer une adresse email valide");
      return;
    }

    // Validation password length
    if (formData.password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiCall("/api/technical-form/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          applicationId,
          email: formData.email,
          password: formData.password,
          technicalQuestion1: formData.technicalQuestion1,
          technicalQuestion2: formData.technicalQuestion2,
          technicalQuestion3: formData.technicalQuestion3,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du formulaire");
      }

      // Afficher le message de succès
      setSubmitSuccess(true);

      // Réinitialiser le formulaire
      setFormData({
        email: "",
        password: "",
        technicalQuestion1: "",
        technicalQuestion2: "",
        technicalQuestion3: "",
      });

      // Rediriger après 3 secondes
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="technical-form-container">
        <div className="success-message-full">
          <h2>✓ Formulaire Technique Reçu</h2>
          <p>
            Merci ! Votre formulaire technique a bien été soumis.
          </p>
          <p>Nous vous contacterons dans les prochains jours.</p>
          <p style={{ fontSize: "14px", color: "#999", marginTop: "20px" }}>
            Redirection en cours...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="technical-form-container">
      <div className="technical-form-card">
        <div className="form-header">
          <h2>Formulaire Technique</h2>
          <p>Merci d'avoir commencé votre candidature. Complétez ce formulaire pour continuer.</p>
        </div>

        <form onSubmit={handleSubmit} className="technical-form">
          {errorMessage && (
            <div className="error-message">
              <strong>⚠️ Erreur :</strong> {errorMessage}
            </div>
          )}

          <div className="form-section">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="votre.email@example.com"
              required
            />
          </div>

          <div className="form-section">
            <label>
              Mot de passe <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Minimum 6 caractères"
              required
            />
            <small style={{ color: "#666", marginTop: "4px" }}>
              Le mot de passe doit contenir au moins 6 caractères
            </small>
          </div>

          <div className="form-section">
            <label>
              Avez-vous de l'expérience avec les technologies web modernes ? <span className="required">*</span>
            </label>
            <textarea
              name="technicalQuestion1"
              value={formData.technicalQuestion1}
              onChange={handleInputChange}
              placeholder="Décrivez votre expérience..."
              rows={4}
              required
            ></textarea>
          </div>

          <div className="form-section">
            <label>Quels langages de programmation maîtrisez-vous ?</label>
            <textarea
              name="technicalQuestion2"
              value={formData.technicalQuestion2}
              onChange={handleInputChange}
              placeholder="Listez les langages et technologies..."
              rows={4}
            ></textarea>
          </div>

          <div className="form-section">
            <label>Avez-vous des projets personnels ou contributions open-source ?</label>
            <textarea
              name="technicalQuestion3"
              value={formData.technicalQuestion3}
              onChange={handleInputChange}
              placeholder="Décrivez vos projets ou contributions..."
              rows={4}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "Envoi en cours..." : "Soumettre le formulaire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TechnicalForm;
