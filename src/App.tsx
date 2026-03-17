import "./style.css";
import { useEffect, useState } from "react";
import JobDetail from "./JobDetail";
import TechnicalFormPage from "./TechnicalFormPage";
import AdminDashboard from "./AdminDashboard";

const App = () => {
  const [currentPage, setCurrentPage] = useState<"job" | "technical-form" | "admin">("job");

  useEffect(() => {
    // Vérifier si nous sommes sur la page du formulaire technique ou admin
    const path = window.location.pathname;
    const search = window.location.search;

    if (path.includes("admin") || search.includes("admin")) {
      setCurrentPage("admin");
    } else if (path.includes("technical-form") || search.includes("token")) {
      setCurrentPage("technical-form");
    } else {
      setCurrentPage("job");
    }
  }, []);

  if (currentPage === "admin") {
    return <AdminDashboard />;
  }

  return currentPage === "technical-form" ? (
    <TechnicalFormPage />
  ) : (
    <JobDetail />
  );
};

// Ancienne page d'accueil commentée pour référence
const AppOld = () => {
  return (
    <>
      <header className="wtj-header">
        <div className="container header-inner">
          <div className="logo">Welcome to the Jungle</div>
          <nav className="main-nav">
            <a href="#jobs">Trouver un job</a>
            <a href="#companies">Trouver une entreprise</a>
            <a href="#media">Média</a>
          </nav>
          <div className="header-actions">
            <a href="#employers" className="link-ghost">
              Employeurs
            </a>
            <a href="#applications" className="link-ghost">
              Candidatures
            </a>
            <a href="#opportunities" className="link-ghost">
              Opportunités
            </a>
            <a href="#login" className="link-ghost">
              Se connecter
            </a>
            <a href="#jobs" className="btn btn-small">
              Trouver un job
            </a>
          </div>
          <button className="burger" aria-label="Ouvrir le menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-content">
              <p className="eyebrow">Find your people</p>
              <h1>
                Plus de jobs vous attendent,
                <br />
                trouvez celui fait pour vous.
              </h1>
              <p className="hero-subtitle">
                Arrêtez de scroller des offres impersonnelles. Découvrez des
                entreprises qui vous ressemblent et trouvez la bonne équipe.
              </p>

              <HeroSearch />

              <div className="popular-searches">
                <span className="label">Recherches populaires</span>
                <div className="tags">
                  {[
                    "communication",
                    "marketing",
                    "graphiste",
                    "data",
                    "product manager",
                    "développeur",
                  ].map((label) => (
                    <Tag key={label} label={label} />
                  ))}
                </div>
              </div>
            </div>

            <div className="hero-side">
              <div className="hero-card">
                <p className="hero-tagline">
                  Au travail, derrière chaque réussite collective, quelqu&apos;un
                  a trouvé la bonne équipe.
                </p>
                <p className="hero-tagline-strong">
                  Trouvez la vôtre sur Welcome to the Jungle.
                </p>
                <div className="hero-actions">
                  <a href="#jobs" className="btn btn-primary">
                    Trouver un job
                  </a>
                  <a href="#opportunities" className="btn btn-outline">
                    Recevoir des opportunités
                  </a>
                </div>
                <p className="hero-note">
                  Votre profil intéresse des entreprises. Indiquez-leur votre
                  disponibilité.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ENTREPRISES */}
        <section id="companies" className="section companies">
          <div className="container">
            <header className="section-header">
              <h2>Explorez les entreprises</h2>
              <p>
                Découvrez leur histoire, rencontrez leurs équipes, comprenez
                leur culture.
              </p>
            </header>

            <div className="pill-row">
              {[
                "À découvrir",
                "Fintech",
                "Economie collaborative",
                "Energie",
                "Média",
                "Association",
                "Mode",
              ].map((label, index) => (
                <button
                  key={label}
                  className={`pill ${index === 0 ? "pill-active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="cards-grid">
              <CompanyCard
                badge="10 offres"
                name="HARTMANN France"
                category="Pharmaceutique / Biotechnologique, Santé"
                text="Fondé en 1818, HARTMANN est l'un des leaders européens de dispositifs médicaux et produits d'hygiène, avec plus de 10 000 collaborateurs dans 36 pays."
                meta="Châtenois, Clermont-Ferrand, Lille, Nantes, Nice, Perpignan…"
              />
              <CompanyCard
                badge="14 offres"
                name="Motul"
                category="Automobile"
                text="Pionnier des lubrifiants haute performance, partenaire incontournable des plus grandes compétitions automobiles et motos."
                meta="Aubervilliers, Vaires-sur-Marne"
              />
              <CompanyCard
                badge="24 offres"
                name="Ardian"
                category="Finance"
                text="Société d'investissement internationale, Ardian gère ou conseille plus de 190 milliards de dollars d’actifs."
                meta="Paris, Londres, New York, Singapour, Tokyo…"
              />
              <CompanyCard
                badge="41 offres"
                name="ASI"
                category="IT / Digital, Intelligence artificielle / Machine Learning"
                text="Cabinet d'expertises numériques, au service de l’impact : des services digitaux utiles, simples et responsables."
                meta="Saint-Herblain"
              />
            </div>

            <div className="section-cta">
              <a href="#companies" className="btn btn-outline">
                Explorer les entreprises
              </a>
            </div>
          </div>
        </section>

        {/* LOGOS ENTREPRISES MISE EN AVANT */}
        <section className="section brands">
          <div className="container brands-inner">
            <p className="brands-title">Ils recrutent sur Welcome to the Jungle</p>
            <div className="brands-logos">
              <span>Nespresso</span>
              <span>Back Market</span>
              <span>BNP Paribas</span>
              <span>Doctolib</span>
              <span>EDF</span>
              <span>PayFit</span>
              <span>Safran</span>
              <span>Vinci Energies</span>
            </div>
          </div>
        </section>

        {/* JOBS / PARCOURS CANDIDAT */}
        <section id="jobs" className="section steps">
          <div className="container">
            <header className="section-header">
              <h2>Trouvez un job</h2>
              <p>
                Vous avez le pouvoir d&apos;écrire votre histoire. Find your
                people !
              </p>
            </header>

            <div className="steps-grid">
              <article className="step-card">
                <h3>Entrez dans les coulisses</h3>
                <p>
                  Consultez seulement les offres qui répondent à vos besoins
                  grâce à des filtres avancés. Découvrez les valeurs, les locaux
                  et vos futurs collègues.
                </p>
                <a href="#jobs" className="link-arrow">
                  Trouver un job
                </a>
              </article>

              <article id="opportunities" className="step-card">
                <h3>Laissez les jobs venir à vous</h3>
                <p>
                  Créez gratuitement votre profil, indiquez votre disponibilité
                  et laissez les entreprises vous contacter directement.
                </p>
                <a href="#opportunities" className="link-arrow">
                  Recevoir des opportunités
                </a>
              </article>

              <article className="step-card">
                <h3>Gagnez en efficacité</h3>
                <p>
                  Centralisez toutes vos candidatures, activez des alertes
                  personnalisées et soyez le premier ou la première à postuler.
                </p>
                <a href="#dashboard" className="link-arrow">
                  Suivre mes candidatures
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* MEDIA */}
        <section id="media" className="section media">
          <div className="container media-grid">
            <div>
              <header className="section-header left">
                <h2>Repensez le monde du travail grâce à notre média</h2>
                <p>
                  Articles, conseils, vidéos, témoignages : découvrez tous nos
                  contenus pour vous épanouir au quotidien.
                </p>
              </header>

              <article className="article-highlight">
                <p className="article-label">Dernier article</p>
                <h3>Reprendre sa vie pro en main : le mode d&apos;emploi</h3>
                <p className="article-meta">17 février 2026</p>
                <p>
                  Vous avez envie de changer de travail mais vous ne savez plus
                  ce qui est fait pour vous ? Bienvenue dans le club “Je me sens
                  perdu·e dans ma vie pro”.
                </p>
                <a href="#media" className="link-arrow">
                  Continuer de lire
                </a>
              </article>
            </div>

            <div className="article-list">
              <h4>Les plus lus</h4>
              <ul>
                <li>
                  <span>Reprendre sa vie pro en main : le mode d&apos;emploi</span>
                  <span className="article-meta">17 février 2026</span>
                </li>
                <li>
                  <span>
                    Nespresso France : quand la marque employeur a du corps et
                    de l&apos;arôme
                  </span>
                  <span className="article-meta">7 octobre 2025</span>
                </li>
                <li>
                  <span>
                    La bonne résolution 2026 ? Redevenir sa priorité n°1
                  </span>
                  <span className="article-meta">8 janvier 2026</span>
                </li>
                <li>
                  <span>5 peurs au travail et comment les surmonter</span>
                  <span className="article-meta">29 octobre 2025</span>
                </li>
                <li>
                  <span>
                    Le futur du recrutement sera T-shaped ou ne sera pas
                  </span>
                  <span className="article-meta">19 novembre 2025</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <div className="logo">Welcome to the Jungle</div>
            <p>
              La plateforme pour trouver l&apos;entreprise qui vous correspond
              et repenser votre vie professionnelle.
            </p>
          </div>

          <div className="footer-columns">
            <div className="footer-column">
              <h4>À propos</h4>
              <ul>
                <li>
                  <a href="#concept">Concept</a>
                </li>
                <li>
                  <a href="#about">Qui sommes-nous ?</a>
                </li>
                <li>
                  <a href="#jobs">Offres d&apos;emploi</a>
                </li>
                <li>
                  <a href="#internships">Offres de stage</a>
                </li>
                <li>
                  <a href="#help">Centre d&apos;aide</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Nous rencontrer</h4>
              <ul>
                <li>
                  <a href="#human-after-all">Human After All</a>
                </li>
                <li>
                  <a href="#press">Presse</a>
                </li>
                <li>
                  <a href="#jobs">Jobs</a>
                </li>
                <li>
                  <a href="#pricing">Tarifs</a>
                </li>
                <li>
                  <a href="#support">Besoin d&apos;aide ?</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>La newsletter qui fait le taf</h4>
              <p>
                Une fois par semaine, des histoires, des jobs et des conseils
                dans votre boîte mail.
              </p>
              <form
                className="newsletter"
                onSubmit={(event) => {
                  event.preventDefault();
                  alert(
                    "Inscription à la newsletter simulée. Sur le vrai site, votre adresse serait enregistrée."
                  );
                }}
              >
                <input
                  type="email"
                  placeholder="Votre adresse e-mail"
                  aria-label="Votre adresse e-mail"
                />
                <button type="submit" className="btn btn-primary">
                  Je m&apos;abonne
                </button>
              </form>
              <p className="newsletter-note">
                Vous pouvez vous désabonner à tout moment. On n&apos;est pas
                susceptibles, promis.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <div className="footer-links">
              <a href="#legal">Mentions légales</a>
              <a href="#cgu">CGU</a>
              <a href="#privacy">Politique de confidentialité</a>
              <a href="#charters">Chartes Welcome to the Jungle</a>
              <a href="#cookies">Politique cookies</a>
            </div>
            <div className="footer-locale">
              <span>France (FR)</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

const HeroSearch = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const keyword = (formData.get("keyword") as string) || "tout type de poste";
    const location =
      (formData.get("location") as string) || "toutes localisations";

    alert(
      `Recherche simulée pour : "${keyword}" à "${location}".\n\nSur le vrai site, cette recherche lancerait l'affichage des offres correspondantes.`
    );
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="search-keyword">Job, mot-clé…</label>
        <input
          id="search-keyword"
          name="keyword"
          type="text"
          placeholder="Ex : développeur, marketing, data…"
        />
      </div>
      <div className="field">
        <label htmlFor="search-location">Où ?</label>
        <input
          id="search-location"
          name="location"
          type="text"
          placeholder="Ville, région, télétravail…"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Trouver un job
      </button>
    </form>
  );
};

type TagProps = {
  label: string;
};

const Tag = ({ label }: TagProps) => {
  const handleClick = () => {
    const input = document.getElementById(
      "search-keyword"
    ) as HTMLInputElement | null;
    if (input) {
      input.value = label;
      input.focus();
    }
  };

  return (
    <button type="button" className="tag" onClick={handleClick}>
      {label}
    </button>
  );
};

type CompanyCardProps = {
  badge: string;
  name: string;
  category: string;
  text: string;
  meta: string;
};

const CompanyCard = ({
  badge,
  name,
  category,
  text,
  meta,
}: CompanyCardProps) => (
  <article className="company-card">
    <div className="company-badge">{badge}</div>
    <h3>{name}</h3>
    <p className="company-category">{category}</p>
    <p className="company-text">{text}</p>
    <p className="company-meta">{meta}</p>
  </article>
);

export default App;
export { AppOld };


