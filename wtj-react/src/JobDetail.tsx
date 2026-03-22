import { useState } from "react";
import "./style.css";
import ApplicationForm from "./ApplicationForm";

const JobDetail = () => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "L'envoi d'un CV est-il obligatoire pour postuler à cette offre ?",
      a: "Pour postuler à cette offre, l'envoi de votre CV est obligatoire.",
    },
    {
      q: "Le télétravail est-il possible pour ce poste ?",
      a: "Ce poste est possible en télétravail fréquent (2-3 jours par semaine).",
    },
    {
      q: "Quel est le type de contrat pour ce poste ?",
      a: "Le contrat pour ce poste est de type Stage.",
    },
    {
      q: "Une lettre de motivation est-elle obligatoire pour postuler à cette offre ?",
      a: "La lettre de motivation est optionnelle pour postuler à cette offre.",
    },
    {
      q: "Quelle est la date de début du contrat ?",
      a: "Le contrat pour cette offre de job démarre en septembre 2025.",
    },
  ];

  return (
    <>
      <ApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        jobTitle="Stage – Développeur(se) Full Stack"
        companyName="TECHNOVIA"
      />

      {/* ===================== HEADER BLANC ===================== */}
      <header className="wtj-header">
        <div className="header-inner">

          {/* Logo WTJ — vrai logo depuis CDN */}
          <a href="#" className="wtj-logo">
            <img
              className="wtj-logo-img"
              src="https://cdn.welcometothejungle.com/wttj-front/production/assets/wttj-2-eP7x9gkY.svg"
              alt="Welcome to the Jungle"
            />
          </a>

          <nav className="main-nav">
            <a href="#jobs">Trouver un job</a>
            <a href="#companies">Trouver une entreprise</a>
            <a href="#media">Média</a>
          </nav>

          <div className="header-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cherchez un job, une entreprise..."
              className="header-search-input"
            />
          </div>

          {/* Icônes 💼 Candidatures + 🔥 Opportunités + Mon espace */}
          <div className="header-actions">
            <a href="#applications" className="h-action-link">
              <span className="h-action-icon">💼</span>
              <span className="h-action-label">Candidatures</span>
            </a>
            <a href="#opportunities" className="h-action-link">
              <span className="h-action-icon">🔥</span>
              <span className="h-action-label">Opportunités</span>
            </a>
            <span className="h-mon-espace">
              <div className="h-avatar">N</div>
              Mon espace ▾
            </span>
          </div>
        </div>
      </header>

      {/* ===================== PAGE ===================== */}
      <main className="job-detail-page">
        <div className="container job-detail-container">

          {/* ============ COLONNE PRINCIPALE ============ */}
          <div className="job-detail-main">

            <a href="#back" className="back-link">‹ Retour</a>

            {/* Carte titre du job */}
            <div className="job-header">
              <div className="company-row">
                <div className="co-logo-sm">T</div>
                <span className="co-name-sm">TECHNOVIA</span>
              </div>

              <h1 className="job-title">Stage – Développeur(se) Full Stack</h1>

              <div className="job-badges-inline">
                <span className="job-badge">📋 Stage (4 à 6 mois)</span>
                <span className="job-badge">📍 Paris</span>
                <span className="job-badge">🏠 Télétravail fréquent</span>
                <span className="job-badge">💶 ≥ 1 300 € / mois</span>
                <span className="job-badge">🗓 Début : Septembre 2025</span>
                <span className="job-badge">🎓 Bac +3 / +5</span>
              </div>

              <div className="job-action-row">
                <button className="btn-apply" onClick={() => setIsApplicationFormOpen(true)}>
                  Postuler
                </button>
                <button className="btn-outline btn-save">
                  🔖 Sauvegarder
                </button>
                <div className="job-meta">
                  <span className="job-meta-item">📅 hier</span>
                  <button className="btn-share">Partager ↗</button>
                </div>
              </div>
            </div>

            {/* ── Le poste ── */}
            <section className="job-section">
              <h2 className="section-title">Le poste</h2>
              <div className="job-content">
                <div>
                  <p className="subsection-title">Descriptif du poste</p>
                  <p>
                    Tu cherches un stage stimulant où tu pourras coder, apprendre et avoir un vrai
                    impact ? Chez nous, tu rejoins le cœur de l'équipe tech pour bosser sur des
                    sujets concrets et innovants. On définira ensemble ton projet principal :
                  </p>
                </div>
                <ul className="checklist">
                  <li><span className="check-icon">✓</span>Développer et améliorer des interfaces utilisateur modernes avec React.js</li>
                  <li><span className="check-icon">✓</span>Créer et maintenir des APIs robustes avec Symfony pour le back-end</li>
                  <li><span className="check-icon">✓</span>Mettre en place un système de journalisation pour aider les admins à gérer les logs</li>
                  <li><span className="check-icon">✓</span>Optimiser les performances front-end et back-end pour une meilleure expérience utilisateur</li>
                </ul>
                <div>
                  <p className="subsection-title">Ton rôle ?</p>
                  <p>
                    En tant que développeur(se) Full Stack en stage, tu seras impliqué(e) dans
                    toutes les phases de développement, de la conception à la mise en production.
                  </p>
                </div>
              </div>
            </section>

            {/* ── Profil ── */}
            <section className="job-section">
              <h2 className="section-title">Profil recherché</h2>
              <div className="job-content">
                <div>
                  <p className="subsection-title">Les bases indispensables</p>
                  <ul className="requirements-list blue-dots">
                    <li>Bonne maîtrise de React.js pour le développement front-end</li>
                    <li>Expérience avec Symfony pour le développement back-end</li>
                    <li>Confort avec la modélisation de données et les bases SQL</li>
                    <li>Esprit d'initiative, autonomie et envie d'apprendre</li>
                    <li>Bonne communication et esprit d'équipe</li>
                    <li>Bon niveau d'anglais technique</li>
                  </ul>
                </div>
                <div>
                  <p className="subsection-title">Les + qui font la différence</p>
                  <ul className="requirements-list orange-stars">
                    <li>Connaissance de React Hooks, Context API et Redux</li>
                    <li>Expérience avec Git, GitLab, intégration continue, code reviews</li>
                    <li>Bases solides en algorithmes et optimisation</li>
                    <li>Passion pour les technologies innovantes et le développement web moderne</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ── Entretiens ── */}
            <section className="job-section">
              <h2 className="section-title">Déroulement des entretiens</h2>
              <div className="interview-process">
                <div className="interview-step">
                  <div className="step-icon">📞</div>
                  <div className="step-content">
                    <p className="step-title">Premier contact – entretien visio (30 min)</p>
                    <ul>
                      <li>Un échange rapide et efficace pour mieux se connaître.</li>
                      <li>On te présente le poste, tu nous parles de toi (sans pression).</li>
                      <li>Objectif : voir si on matche sur les bases avant d'aller plus loin !</li>
                    </ul>
                  </div>
                </div>
                <div className="interview-step">
                  <div className="step-icon">🔧</div>
                  <div className="step-content">
                    <p className="step-title">Cas pratique – place à l'action !</p>
                    <ul>
                      <li>Un défi technique pour évaluer tes compétences 😜</li>
                      <li>À faire à ton rythme, dans un délai défini.</li>
                    </ul>
                  </div>
                </div>
                <div className="interview-step">
                  <div className="step-icon">🤝</div>
                  <div className="step-content">
                    <p className="step-title">Rencontre avec la team Tech & les managers</p>
                    <p>Un moment pour échanger avec l'équipe. En visio ou sur place !</p>
                  </div>
                </div>
                <div className="interview-step">
                  <div className="step-icon">✅</div>
                  <div className="step-content">
                    <p className="step-title">Le verdict final !</p>
                    <ul>
                      <li>Si tout roule, on te fait une offre et l'aventure commence ! 🚀</li>
                      <li>Sinon, on te donne un retour constructif.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Équipe ── */}
            <section className="job-section">
              <h2 className="section-title">Envie d'en savoir plus ?</h2>
              <div className="team-profiles">
                <div className="team-profile-card">
                  <div className="profile-image">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=faces" alt="Marie" />
                    <div className="play-overlay">▶</div>
                  </div>
                  <p className="profile-text">Marie · CMO &amp; Chief of Staff</p>
                </div>
                <div className="team-profile-card">
                  <div className="profile-image">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=faces" alt="Pouya" />
                    <div className="play-overlay">▶</div>
                  </div>
                  <p className="profile-text">Pouya · Responsable Offre Entreprise</p>
                </div>
                <div className="team-profile-card">
                  <div className="profile-image">
                    <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=faces" alt="Léa" />
                    <div className="play-overlay">▶</div>
                  </div>
                  <p className="profile-text">Léa · Lead Developer Full Stack</p>
                </div>
              </div>
            </section>

            {/* ── FAQ — avec réponses dépliables comme WTJ ── */}
            <section className="job-section">
              <h2 className="section-title">Questions &amp; réponses sur l'offre</h2>
              <div className="faq-list">
                {faqs.map((faq, i) => (
                  <div className="faq-item" key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div className="faq-question">
                      {faq.q}
                      <span className="faq-arrow" style={{ transform: openFaq === i ? 'rotate(90deg)' : undefined }}>→</span>
                    </div>
                    {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="job-section cta-section">
              <p className="cta-title">Cette offre vous tente ?</p>
              <div className="cta-buttons">
                <button className="btn-apply btn-large" onClick={() => setIsApplicationFormOpen(true)}>
                  Postuler
                </button>
                <button className="btn-outline btn-large">🔖 Sauvegarder</button>
              </div>
            </section>
          </div>

          {/* ============ SIDEBAR ============ */}
          <aside className="job-sidebar">

            {/* Grille 2x2 photos + carte jaune — structure exacte WTJ */}
            <div className="company-visual-block">
              <div className="company-photos-grid">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
                  alt="Bureaux TECHNOVIA"
                />
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
                  alt="Équipe TECHNOVIA"
                />
                <img
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop"
                  alt="Team TECHNOVIA"
                />
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop"
                  alt="Open space TECHNOVIA"
                />
              </div>
              <div className="discover-card">
                <h3>Découvrez l'entreprise</h3>
                <p>Explorez la vitrine de l'entreprise ou suivez-la pour savoir si elle vous correspond vraiment !</p>
                <div className="discover-btns">
                  <button className="btn-dark">Explorer l'entreprise →</button>
                  <button className="btn-yellow-sm">Suivre</button>
                </div>
              </div>
            </div>

            {/* Ils sont sociables */}
            <div className="scard">
              <p className="social-title">Ils sont sociables</p>
              <div className="social-icons">
                <a href="#linkedin" className="social-icon">in</a>
                <a href="#twitter" className="social-icon">𝕏</a>
              </div>
            </div>

            {/* L'entreprise */}
            <div className="scard">
              <p className="sidebar-title">L'entreprise</p>
              <div className="co-top">
                <div className="co-logo-sq">T</div>
                <span className="co-name-main">TECHNOVIA</span>
              </div>
              <div className="co-info-list">
                <p>💻 Logiciels, SaaS / Cloud Services</p>
                <p>👥 46 collaborateurs</p>
                <p>🗓 Créée en 2017</p>
                <p>🎂 Âge moyen : 31 ans</p>
              </div>
              <div className="co-links">
                <a href="#site" className="co-link">Voir le site <span>↗</span></a>
                <a href="#offers" className="co-link">Voir toutes les offres <span className="badge-y">4</span></a>
              </div>
            </div>

            {/* Qui sont-ils */}
            <div className="scard">
              <p className="sidebar-title">Qui sont-ils ?</p>
              <div className="s-desc">
                <p>Technovia propose une solution SaaS innovante permettant de développer des applications web modernes et performantes. Notre équipe passionnée travaille avec les dernières technologies pour offrir la meilleure expérience utilisateur.</p>
              </div>
              <a href="#more" className="see-more">Voir plus →</a>
            </div>

            {/* Avantages */}
            <div className="scard">
              <p className="sidebar-title">Les avantages salariés</p>
              <ul className="benefits-list">
                <li>Entre 2-3 jours de télétravail</li>
                <li>Restaurant d'entreprise / Cuisine</li>
                <li>Prime de parrainage</li>
                <li>Indemnité télétravail</li>
                <li>Afterworks, Team lunches…</li>
                <li>Parking vélo</li>
              </ul>
              <a href="#benefits" className="see-more">
                Voir tous les avantages <span className="badge-y" style={{ marginLeft: 4 }}>9</span>
              </a>
            </div>

          </aside>
        </div>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="wtj-logo">
              <img
                className="wtj-logo-img"
                src="https://cdn.welcometothejungle.com/wttj-front/production/assets/wttj-2-eP7x9gkY.svg"
                alt="WTJ"
              />
            </a>
            <div className="social-footer">
              <a href="#">f</a><a href="#">𝕏</a><a href="#">in</a><a href="#">ig</a>
            </div>
          </div>
          <div className="footer-columns">
            <div className="footer-column">
              <h4>À propos</h4>
              <ul>
                <li><a href="#">Concept</a></li>
                <li><a href="#">Qui sommes-nous ?</a></li>
                <li><a href="#">Offres d'emploi</a></li>
                <li><a href="#">Offres de stage</a></li>
                <li><a href="#">Centre d'aide</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Nous rencontrer</h4>
              <ul>
                <li><a href="#">Human After All</a></li>
                <li><a href="#">Presse</a></li>
                <li><a href="#">Jobs</a></li>
                <li><a href="#">Tarifs</a></li>
                <li><a href="#">Besoin d'aide ?</a></li>
                <li><a href="#">Assistance entreprise</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>La newsletter qui fait le taf</h4>
              <p>Une fois par semaine, des histoires, des jobs et des conseils dans votre boite mail.</p>
              <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email" />
                <button type="submit" className="btn-primary">Je m'abonne</button>
              </form>
              <p className="newsletter-note">
                Vous pouvez vous désabonner à tout moment. On n'est pas susceptibles, promis.
              </p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <div className="footer-solutions">🌐 Welcome Solutions</div>
            <div className="footer-employer-links">
              <a href="#">Employeurs</a>
              <a href="#">Mon espace employeur</a>
            </div>
            <div className="footer-links">
              <a href="#">Mentions légales</a>
              <a href="#">CGU</a>
              <a href="#">Politique de confidentialité</a>
              <a href="#">Chartes Welcome to the Jungle</a>
              <a href="#">Politique cookies</a>
              <a href="#">Gestion des cookies</a>
            </div>
            <div className="footer-locale">🇫🇷 France (FR)</div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default JobDetail;
