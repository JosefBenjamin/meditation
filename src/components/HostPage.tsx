import type { ReactNode } from "react";

interface HostPageProps {
  children: ReactNode;
  language?: "en" | "da";
}

const TRANSLATIONS = {
  en: {
    nav_practices: "Practices",
    nav_teachers: "Teachers",
    nav_courses: "Courses",
    nav_journal: "Journal",
    hero_h1: "The practice you've been learning ",
    hero_em: "is already with you.",
    check_in: "A quiet check–in",
    footer_quote:
      "“The bell does not make the silence. It only reminds us it was already here.”",
    footer_year: "2026",
    footer_community: "a small meditation community",
  },
  da: {
    nav_practices: "Øvelser",
    nav_teachers: "Lærere",
    nav_courses: "Kurser",
    nav_journal: "Journal",
    hero_h1: "Den praksis, du har lært, ",
    hero_em: "er allerede med dig.",
    check_in: "Genopfrisk hvad du har lært",
    footer_quote:
      "“Livet er ikke et problem, der skal løses, men en virkelighed, der skal opleves.”",
    footer_year: "2026",
    footer_community: "et lille meditationsfællesskab",
  },
};

export const HostPage: React.FC<HostPageProps> = ({
  children,
  language = "en",
}) => {
  const t = TRANSLATIONS[language];
  return (
    <>
      <nav className="host-nav">
        <div className="brand"></div>
        <div className="links">
          <span>{t.nav_practices}</span>
          <span>{t.nav_teachers}</span>
          <span>{t.nav_courses}</span>
          <span>{t.nav_journal}</span>
        </div>
      </nav>
      <section className="host-hero">
        <h1>
          {t.hero_h1}
          <em>{t.hero_em}</em>
        </h1>
      </section>
      <div className="host-divider">
        <div className="line" />
        <div className="lbl">{t.check_in}</div>
        <div className="line" />
      </div>
      <div className="host-island-frame">{children}</div>
      <div className="host-footer-lead">
        <p>{t.footer_quote}</p>
      </div>
      <footer className="host-footer">
        <span>{t.footer_year}</span>
        <span>{t.footer_community}</span>
      </footer>
    </>
  );
};
