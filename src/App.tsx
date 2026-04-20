import { useState, useEffect } from 'react';
import type { Tweaks, AccentId, MotifKind } from './types';
import { HostPage } from './components/HostPage';
import { Island } from './components/Island';

const TWEAK_DEFAULTS: Tweaks = {
  accent: "sage",
  motif: "lotus",
  dusk: false,
  transition: 1000,
  view: "host",
  language: "da"
};

const TRANSLATIONS = {
  en: {
    tweaks_title: "Tweaks",
    language_label: "Language",
    accent_label: "Accent",
    motif_label: "Breathing motif",
    dusk_label: "Dusk palette",
    transition_label: "Transition",
    view_host: "In page",
    view_standalone: "Island only",
    on: "on",
    off: "off"
  },
  da: {
    tweaks_title: "Indstillinger",
    language_label: "Sprog",
    accent_label: "Accent",
    motif_label: "Vejrtræknings-motiv",
    dusk_label: "Aften-palet",
    transition_label: "Overgang",
    view_host: "I siden",
    view_standalone: "Kun øen",
    on: "til",
    off: "fra"
  }
};

function App() {
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [editMode] = useState(true); // Default to true for this refactor
  const [lesson, setLesson] = useState(1);

  const t = TRANSLATIONS[tweaks.language];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', `var(--${tweaks.accent})`);
    root.style.setProperty('--accent-deep', `var(--${tweaks.accent}-deep)`);
    root.style.setProperty('--accent-soft', `var(--${tweaks.accent}-soft)`);
    root.style.setProperty('--t', `${tweaks.transition}ms`);
    if (tweaks.dusk) root.classList.add('dusk'); else root.classList.remove('dusk');
  }, [tweaks]);

  function setKey<K extends keyof Tweaks>(key: K, value: Tweaks[K]) {
    setTweaks(prev => ({ ...prev, [key]: value }));
  }

  const handleNextLesson = () => {
    setLesson(prev => (prev < 3 ? prev + 1 : 1));
  };

  return (
    <>
      <div className="chrome">
        <div className="chrome-label">Island · preview</div>
        <div className="chrome-toggle">
          <button className={tweaks.view === "host" ? "on" : ""} onClick={() => setKey("view", "host")}>{t.view_host}</button>
          <button className={tweaks.view === "standalone" ? "on" : ""} onClick={() => setKey("view", "standalone")}>{t.view_standalone}</button>
        </div>
      </div>

      {tweaks.view === "host" ? (
        <div className="mode-host">
          <HostPage language={tweaks.language}>
            <Island 
              motif={tweaks.motif} 
              accent={tweaks.accent} 
              lessonId={lesson} 
              onComplete={handleNextLesson} 
              onLessonSelect={setLesson}
              language={tweaks.language} 
            />
          </HostPage>
        </div>
      ) : (
        <div className="mode-standalone">
          <Island 
            motif={tweaks.motif} 
            accent={tweaks.accent} 
            lessonId={lesson} 
            onComplete={handleNextLesson} 
            onLessonSelect={setLesson}
            language={tweaks.language} 
          />
        </div>
      )}

      {editMode && !tweaksOpen && (
        <button className="tweaks-toggle" onClick={() => setTweaksOpen(true)}>◐ {t.tweaks_title}</button>
      )}
      
      {editMode && tweaksOpen && (
        <div className="tweaks">
          <h4>
            {t.tweaks_title}
            <button className="tweaks-close" onClick={() => setTweaksOpen(false)} aria-label="Close">×</button>
          </h4>

          <div className="row">
            <div className="label">{t.language_label}</div>
            <div className="chips">
              <button className={"chip " + (tweaks.language === "da" ? "on" : "")} onClick={() => setKey("language", "da")}>Dansk</button>
              <button className={"chip " + (tweaks.language === "en" ? "on" : "")} onClick={() => setKey("language", "en")}>English</button>
            </div>
          </div>

          <div className="row">
            <div className="label">{t.accent_label}</div>
            <div className="swatches">
              {[
                { id: "sage" as AccentId, c: "#8AA17A" },
                { id: "lavender" as AccentId, c: "#A8A0C5" },
                { id: "dawn" as AccentId, c: "#8FA4BE" },
              ].map(s => (
                <div key={s.id} className={"sw " + (tweaks.accent === s.id ? "on" : "")}
                     style={{ background: s.c }} onClick={() => setKey("accent", s.id)} title={s.id} />
              ))}
            </div>
          </div>

          <div className="row">
            <div className="label">{t.motif_label}</div>
            <div className="chips">
              {(["orb", "rings", "wave", "lotus"] as MotifKind[]).map(k => (
                <button key={k} className={"chip " + (tweaks.motif === k ? "on" : "")} onClick={() => setKey("motif", k)}>{k}</button>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="switch">
              <span>{t.dusk_label}</span>
              <button className={"chip " + (tweaks.dusk ? "on" : "")} onClick={() => setKey("dusk", !tweaks.dusk)}>
                {tweaks.dusk ? t.on : t.off}
              </button>
            </div>
          </div>

          <div className="row">
            <div className="label">{t.transition_label} · <span className="range-val">{tweaks.transition}ms</span></div>
            <input type="range" min="200" max="1200" step="50"
              value={tweaks.transition}
              onChange={(e) => setKey("transition", parseInt(e.target.value))} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
