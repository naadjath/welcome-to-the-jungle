import { useState } from "react";
import "./style.css";
import ApplicationForm from "./ApplicationForm";

const JobDetail = () => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  const handleApplyClick = () => {
    setIsApplicationFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsApplicationFormOpen(false);
  };

  return (
    <>
      <ApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={handleCloseForm}
        jobTitle="Stage - Développeur(se) Full Stack"
        companyName="TECHNOVIA"
      />
      <header className="wtj-header">
        <div className="container header-inner">
          <div className="logo">Welcome to the Jungle</div>
          <nav className="main-nav">
            <a href="#jobs">Trouver un job</a>
            <a href="#companies">Trouver une entreprise</a>
            <a href="#media">Média</a>
          </nav>
          <div className="header-search">
            <input 
              type="text" 
              placeholder="Cherchez un job, une entrepris..." 
              className="header-search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="header-actions">
            <a href="#applications" className="link-ghost">Candidatures</a>
            <a href="#opportunities" className="link-ghost">Opportunités</a>
            <a href="#login" className="link-ghost">Mon espace</a>
          </div>
        </div>
      </header>

      <main className="job-detail-page">
        <div className="container job-detail-container">
          <div className="job-detail-main">
            {/* Header du job */}
            <div className="job-header">
              <a href="#back" className="back-link">
                ← Retour
              </a>
              <div className="job-title-section">
                <div className="job-title-row">
                  <h1 className="job-title">Stage - Développeur(se) Full Stack</h1>
                  <div className="job-badges-inline">
                    <span className="job-badge">Stage</span>
                    <span className="job-badge">Salaire: &ge; 1,3K € par mois</span>
                    <span className="job-badge">Télétravail fréquent</span>
                  </div>
                </div>
                <div className="job-actions-top">
                  <button className="btn btn-primary btn-apply" onClick={handleApplyClick}>Postuler</button>
                  <button className="btn btn-outline btn-save">
                    <span className="save-icon">🔖</span> Sauvegarder
                  </button>
                </div>
              </div>
            </div>

            {/* Section Le poste */}
            <section className="job-section">
              <h2 className="section-title">
                <span className="yellow-underline">Le poste</span>
              </h2>
              
              <div className="job-content">
                <h3 className="subsection-title">Descriptif du poste</h3>
                <p>
                  Tu cherches un stage stimulant où tu pourras coder, apprendre et avoir un vrai impact ? 
                  Chez notre entreprise, on t'intègre au cœur de l'équipe tech pour bosser sur des sujets 
                  concrets et innovants. Ensemble, on définira ton projet principal, en fonction de tes 
                  envies et de nos besoins. Voici quelques défis techniques possibles :
                </p>
                <ul className="checklist">
                  <li>
                    <span className="check-icon">✓</span>
                    Développer et améliorer des interfaces utilisateur modernes avec React.js
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Créer et maintenir des APIs robustes avec Symfony pour le back-end
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Mettre en place un système de journalisation pour aider les admins à mieux gérer les logs
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Optimiser les performances front-end et back-end pour une meilleure expérience utilisateur
                  </li>
                </ul>

                <h3 className="subsection-title">Ton rôle ?</h3>
                <p>
                  En tant que développeur(se) Full Stack en stage, tu seras impliqué(e) dans toutes les 
                  phases de développement : de la conception à la mise en production. Tu travailleras en 
                  étroite collaboration avec l'équipe pour créer des solutions innovantes et performantes.
                </p>
              </div>
            </section>

            {/* Section Profil recherché */}
            <section className="job-section">
              <h2 className="section-title">
                <span className="yellow-underline">Profil recherché</span>
              </h2>
              
              <div className="job-content">
                <h3 className="subsection-title">Les bases indispensables</h3>
                <ul className="requirements-list blue-dots">
                  <li>Bonne maîtrise de React.js pour le développement front-end</li>
                  <li>Expérience avec Symfony pour le développement back-end</li>
                  <li>Confort avec la modélisation de données et les bases SQL</li>
                  <li>Esprit d'initiative, autonomie et envie d'apprendre</li>
                  <li>Bonne communication et esprit d'équipe</li>
                  <li>Bon niveau d'anglais technique (docs, code, échanges)</li>
                </ul>

                <h3 className="subsection-title">Les + qui font la différence</h3>
                <ul className="requirements-list orange-stars">
                  <li>Connaissance de React Hooks, Context API et Redux</li>
                  <li>Expérience avec Git, GitLab, intégration continue, code reviews</li>
                  <li>Bases solides en algorithmes et optimisation</li>
                  <li>Passion pour les technologies innovantes et le développement web moderne</li>
                </ul>
              </div>
            </section>

            {/* Section Déroulement des entretiens */}
            <section className="job-section">
              <h2 className="section-title">
                <span className="yellow-underline">Déroulement des entretiens</span>
              </h2>
              
              <div className="interview-process">
                <div className="interview-step">
                  <div className="step-icon">📞</div>
                  <div className="step-content">
                    <h3 className="step-title">Premier contact: entretien visio (30 min)</h3>
                    <ul>
                      <li>Un échange rapide et efficace pour mieux se connaître.</li>
                      <li>On te présente le poste, tu nous parles de toi (sans pression, promis).</li>
                      <li>Objectif: voir si on matche sur les bases avant d'aller plus loin !</li>
                    </ul>
                  </div>
                </div>

                <div className="interview-step">
                  <div className="step-icon">🔧</div>
                  <div className="step-content">
                    <h3 className="step-title">Cas pratiques - place à l'action !</h3>
                    <ul>
                      <li>
                        Un défi technique pour évaluer tes compétences (rien d'insurmontable, 
                        on ne cherche pas un super-héros... enfin, pas officiellement 😜).
                      </li>
                      <li>À faire à ton rythme, dans un délai défini.</li>
                    </ul>
                  </div>
                </div>

                <div className="interview-step">
                  <div className="step-icon">🤝</div>
                  <div className="step-content">
                    <h3 className="step-title">Rencontre avec la team Tech & les managers (visio ou sur place)</h3>
                    <p>Un moment pour échanger avec l'équipe et voir si l'ambiance te correspond.</p>
                  </div>
                </div>

                <div className="interview-step">
                  <div className="step-icon">✅</div>
                  <div className="step-content">
                    <h3 className="step-title">Le verdict final !</h3>
                    <ul>
                      <li>Si tout roule, on te fait une offre et l'aventure commence! 🚀</li>
                      <li>
                        Sinon, on te donne un retour constructif (parce qu'on aime le respect 
                        et la transparence).
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Questions */}
            <section className="job-section">
              <h2 className="section-title">QUESTIONS ET RÉPONSES SUR L'OFFRE</h2>
              <div className="faq-list">
                <div className="faq-item">
                  <div className="faq-question">
                    L'envoi d'un CV est-il obligatoire pour postuler à cette offre ?
                    <span className="faq-arrow">→</span>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    Le télétravail est-il possible pour ce poste ?
                    <span className="faq-arrow">→</span>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    Quel est le type de contrat pour ce poste ?
                    <span className="faq-arrow">→</span>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    Une lettre de motivation est-elle obligatoire pour postuler à cette offre ?
                    <span className="faq-arrow">→</span>
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">
                    Quelle est la date de début du contrat?
                    <span className="faq-arrow">→</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Envie d'en savoir plus */}
            <section className="job-section">
              <h2 className="section-title">
                <span className="yellow-underline">Envie d'en savoir plus ?</span>
              </h2>
              <div className="team-profiles">
                <div className="team-profile-card">
                  <div className="profile-image">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" 
                      alt="Marie"
                    />
                    <div className="play-overlay">▶</div>
                  </div>
                  <div className="profile-info">
                    <p className="profile-text">Rencontrez Marie, Chief Marketing Officer (CMO) & Chief of Staff (CoS)</p>
                  </div>
                </div>
                <div className="team-profile-card">
                  <div className="profile-image">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" 
                      alt="Pouya"
                    />
                    <div className="play-overlay">▶</div>
                  </div>
                  <div className="profile-info">
                    <p className="profile-text">Rencontrez Pouya, Responsable d'Offre Entreprise PORTFOLIO</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Final */}
            <section className="job-section cta-section">
              <h2 className="cta-title">Cette offre vous tente ?</h2>
              <div className="cta-buttons">
                <button className="btn btn-primary btn-large" onClick={handleApplyClick}>Postuler</button>
                <button className="btn btn-outline btn-large">
                  <span>💾</span> Sauvegarder
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="job-sidebar">
            {/* Company Card */}
            <div className="company-sidebar-card">
              <div className="company-logo-sidebar">
                <div className="logo-square">C</div>
                <span className="company-name-sidebar">TECHNOVIA</span>
              </div>
              <div className="company-info-sidebar">
                <p>Logiciels, SaaS / Cloud Services</p>
                <p>46 collaborateurs</p>
                <p>Créée en 2017</p>
                <p>Âge moyen: 31 ans</p>
                <p>78% · 22%</p>
              </div>
              <div className="company-links-sidebar">
                <a href="#site" className="company-link">
                  Voir le site <span>↗</span>
                </a>
                <a href="#offers" className="company-link">
                  Voir toutes les offres <span className="badge-yellow">4</span>
                </a>
              </div>
            </div>

            {/* Qui sont-ils */}
            <div className="company-description">
              <h3 className="sidebar-title">Qui sont-ils?</h3>
              <p>
                Technovia propose une solution SaaS innovante permettant de développer des applications 
                web modernes et performantes. Notre équipe passionnée travaille avec les dernières 
                technologies pour offrir la meilleure expérience utilisateur.
              </p>
              <a href="#more" className="see-more-link">Voir plus</a>
            </div>

            {/* Avantages */}
            <div className="benefits-section">
              <h3 className="sidebar-title">Les avantages salariés</h3>
              <ul className="benefits-list">
                <li>Entre 2-3 jours de télétravail</li>
                <li>Restaurant d'entreprise / Cuisine pour les collaborateurs</li>
                <li>Prime de parrainage</li>
                <li>Indemnité télétravail</li>
                <li>Afterworks, Team lunches, etc.</li>
                <li>Parking vélo</li>
              </ul>
              <a href="#all-benefits" className="see-more-link">
                Voir tous les avantages <span className="badge-yellow">9</span>
              </a>
            </div>

            {/* Le lieu de travail */}
            <div className="workplace-section">
              <h3 className="sidebar-title">Le lieu de travail</h3>
              <p>Paris, Île-de-France</p>
            </div>

            {/* Card jaune info */}
            <div className="info-card-yellow">
              <div className="info-card-icon">☕</div>
              <h3 className="info-card-title">Besoin de plus d'infos ?</h3>
              <p className="info-card-text">
                Vie d'entreprise, ambiance, réalisations... On a encore plein de choses à vous dire !
              </p>
              <button className="btn btn-dark">Découvrir →</button>
            </div>

            {/* Social */}
            <div className="social-section">
              <h3 className="social-title">ILS SONT SOCIABLES</h3>
              <div className="social-icons">
                <a href="#linkedin" className="social-icon">in</a>
                <a href="#twitter" className="social-icon">X</a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <div className="logo">Welcome to the Jungle</div>
            <div className="social-footer">
              <a href="#facebook">f</a>
              <a href="#twitter">X</a>
              <a href="#linkedin">in</a>
              <a href="#instagram">ig</a>
            </div>
          </div>

          <div className="footer-columns">
            <div className="footer-column">
              <h4>À propos</h4>
              <ul>
                <li><a href="#concept">Concept</a></li>
                <li><a href="#about">Qui sommes-nous ?</a></li>
                <li><a href="#jobs">Offres d'emploi</a></li>
                <li><a href="#internships">Offres de stage</a></li>
                <li><a href="#help">Centre d'aide</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Nous rencontrer</h4>
              <ul>
                <li><a href="#human-after-all">Human After All</a></li>
                <li><a href="#press">Presse</a></li>
                <li><a href="#jobs">Jobs</a></li>
                <li><a href="#pricing">Tarifs</a></li>
                <li><a href="#support">Besoin d'aide ?</a></li>
                <li><a href="#assistance">Assistance entreprise</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>La newsletter qui fait le taf</h4>
              <p>
                Une fois par semaine, des histoires, des jobs et des conseils dans votre boite mail.
              </p>
              <form className="newsletter">
                <input
                  type="email"
                  placeholder="Email"
                  aria-label="Votre adresse e-mail"
                />
                <button type="submit" className="btn btn-primary">
                  Je m'abonne
                </button>
              </form>
              <p className="newsletter-note">
                Vous pouvez vous désabonner à tout moment. On n'est pas susceptibles, promis. 
                Pour en savoir plus sur notre politique de protection des données, cliquez-ici.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <div className="footer-solutions">
              <span className="globe-icon">🌐</span>
              <span>Welcome Solutions</span>
            </div>
            <div className="footer-employer-links">
              <a href="#employers">Employeurs</a>
              <a href="#employer-space">Mon espace employeur</a>
            </div>
            <div className="footer-links">
              <a href="#legal">Mentions légales</a>
              <a href="#cgu">CGU</a>
              <a href="#privacy">Politique de confidentialité</a>
              <a href="#charters">Chartes Welcome to the Jungle</a>
              <a href="#cookies">Politique cookies</a>
              <a href="#cookie-manage">Gestion des cookies</a>
            </div>
            <div className="footer-locale">
              <span>🇫🇷</span>
              <span>France (FR)</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default JobDetail;

