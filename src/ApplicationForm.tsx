import { useState } from "react";
import { apiCall } from "./apiHelper";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
}

const ApplicationForm = ({
  isOpen,
  onClose,
  jobTitle,
  companyName,
}: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    motivation: "",
    experience: "",
    skills: "",
    availability: "",
    questions: "",
    cv: null as File | null,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier que c'est un PDF ou DOC
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Veuillez charger un CV en format PDF ou Word");
        return;
      }
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Le fichier ne doit pas dépasser 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        cv: file,
      }));
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.motivation ||
      !formData.cv
    ) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer un FormData pour envoyer le fichier
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("motivation", formData.motivation);
      submitData.append("experience", formData.experience);
      submitData.append("skills", formData.skills);
      submitData.append("availability", formData.availability);
      submitData.append("questions", formData.questions);
      submitData.append("jobTitle", jobTitle);
      submitData.append("companyName", companyName);
      if (formData.cv) {
        submitData.append("cv", formData.cv);
      }

      // Appeler votre backend
      const response = await apiCall("/api/applications/submit", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la candidature");
      }

      const data = await response.json();

      // Afficher le message de succès
      setSubmitSuccess(true);

      // Réinitialiser le formulaire
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        motivation: "",
        experience: "",
        skills: "",
        availability: "",
        questions: "",
        cv: null,
      });

      // Fermer le formulaire après 3 secondes
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content application-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Postuler à cette offre</h2>
          <p className="modal-subtitle">
            {jobTitle} chez {companyName}
          </p>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Fermer le formulaire"
          >
            ✕
          </button>
        </div>

        {submitSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Candidature envoyée avec succès !</h3>
            <p>
              Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
            </p>
            <p className="success-text">
              L'équipe de {companyName} examinera votre candidature et vous 
              recontactera si elle correspond à leurs besoins.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="application-form">
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            {/* Informations personnelles */}
            <fieldset className="form-section">
              <legend className="section-legend">Informations personnelles</legend>

              <div className="form-group">
                <label htmlFor="fullName">
                  Nom complet <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Jean Dupont"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jean@example.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Téléphone <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 6 XX XX XX XX"
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </fieldset>

            {/* Questions sur le poste */}
            <fieldset className="form-section">
              <legend className="section-legend">Questions sur le poste</legend>

              <div className="form-group">
                <label htmlFor="motivation">
                  Pourquoi postulez-vous pour ce stage ? <span className="required">*</span>
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder="Expliquez votre motivation et ce qui vous attire dans ce stage..."
                  className="form-textarea"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience">
                  Décrivez vos expériences en développement web
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Projets personnels, stages précédents, travaux académiques..."
                  className="form-textarea"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">
                  Quelles sont vos compétences techniques principales ?
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="React, TypeScript, Symfony, SQL, Git, etc."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="availability">
                  Quelle est votre disponibilité ?
                </label>
                <input
                  type="text"
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="ex: À partir du 1er septembre 2024"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="questions">
                  Avez-vous des questions pour l'équipe ?
                </label>
                <textarea
                  id="questions"
                  name="questions"
                  value={formData.questions}
                  onChange={handleInputChange}
                  placeholder="Questions sur le poste, l'équipe, le projet..."
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </fieldset>

            {/* CV */}
            <fieldset className="form-section">
              <legend className="section-legend">Votre CV</legend>

              <div className="form-group">
                <label htmlFor="cv" className="file-upload-label">
                  <span className="required">*</span> Charger votre CV
                </label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="file-input"
                    required
                  />
                  <div 
                    className="file-upload-area"
                    onClick={() => document.getElementById("cv")?.click()}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="file-icon">📄</div>
                    <p className="file-text">
                      {formData.cv ? (
                        <>
                          <strong>✓ Fichier sélectionné:</strong> {formData.cv.name}
                        </>
                      ) : (
                        <>
                          <strong>Cliquez ou déposez</strong> votre CV
                          <br />
                          (PDF ou Word, max 5MB)
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Boutons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;
