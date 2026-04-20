import React, { useState, useEffect } from 'react';
import type { MotifKind, Phase, SavedProgress } from '../types';
import { getLessons } from '../data/lessons';
import { loadProgress, saveProgress, clearProgress } from '../utils/persistence';
import { Motif } from './Motif';
import { Progress } from './Progress';

interface IslandProps {
  motif: MotifKind;
  accent: string;
  lessonId?: number;
  onComplete?: () => void;
  onLessonSelect?: (id: number) => void;
  language?: 'en' | 'da';
}

const TRANSLATIONS = {
  da: {
    check_in: "Dine svar er gemt, tag en pause når du vil",
    lesson: "Lektion",
    intro_headline_1: "Giv dig selv et øjeblik.",
    intro_headline_2: "Vend tilbage til det, du ved.",
    intro_body: "blide spørgsmål for at minde dig om den praksis, der allerede lever i dig. Der er ingen point, kun opmærksomhed.",
    begin: "Begynd",
    continue: "Fortsæt",
    begin_anew: "Start forfra",
    see_practice: "Se din praksis",
    clarity_all: "Alle {n} mødt med klarhed",
    clarity_some: "{s} ud af {n} mødt med klarhed",
    suggested_practice: "Dagens foreslåede praksis",
    reflect_again: "Reflektér igen",
    back: "Tilbage",
    reflection_headline: "Hvordan har du det i kroppen lige nu?",
    reflection_options: [
      { label: "Rigtig godt", quote: "»At vove er at tabe fodfæste for en kort stund. Ikke at vove er at tabe sig selv.« — Søren Kierkegaard", color: "var(--accent)" },
      { label: "Godt", quote: "»Menneske først og kristen så, kun det er livets orden.« — N.F.S. Grundtvig", color: "var(--accent-deep)" },
      { label: "Neutralt", quote: "»Husk at elske, mens du gør det. Husk at leve, mens du tør det.« — Piet Hein", color: "var(--ink-mute)" },
      { label: "Lidt anspændt", quote: "»Det er i modgangen, man finder sin styrke.« — Grundtvigsk livsvisdom", color: "var(--amber)" },
      { label: "Urolig eller tynget", quote: "»Angest er frihedens svimmelhed.« — Søren Kierkegaard", color: "var(--ink-soft)" }
    ],
    reflection_ready: "KLAR",
    reflection_explainer: "Tag dig tid til at lade citatet synke ind. Mærk din krop et øjeblik. Tryk på »KLAR«, når du føler dig parat til at begynde quizzen.",
    next_up: "Næste lektion",
    journey_completed: "Gennemført",
    journey_current: "Aktuel",
    journey_locked: "Låst"
  },
  en: {
    check_in: "A quiet check-in",
    lesson: "Lesson",
    intro_headline_1: "Take a moment.",
    intro_headline_2: "Return to what you know.",
    intro_body: "gentle questions to remind you of the practice already living inside you. There is no score, only noticing.",
    begin: "Begin",
    continue: "Continue",
    begin_anew: "Begin anew",
    see_practice: "See your practice",
    clarity_all: "All {n} met with clarity",
    clarity_some: "{s} of {n} met with clarity",
    suggested_practice: "Today's suggested practice",
    reflect_again: "Reflect again",
    back: "Back",
    reflection_headline: "How is your body feeling right now?",
    reflection_options: [
      { label: "Very good", quote: "“To dare is to lose one's footing for a moment. Not to dare is to lose oneself.” — Søren Kierkegaard", color: "var(--accent)" },
      { label: "Good", quote: "“Human first, and then whatever else comes after.” — N.F.S. Grundtvig", color: "var(--accent-deep)" },
      { label: "Neutral", quote: "“Remember to love while you do it. Remember to live while you dare it.” — Piet Hein", color: "var(--ink-mute)" },
      { label: "A bit tense", quote: "“It is in the adversity that one finds their strength.” — Danish life wisdom", color: "var(--amber)" },
      { label: "Restless or heavy", quote: "“Anxiety is the dizziness of freedom.” — Søren Kierkegaard", color: "var(--ink-soft)" }
    ],
    reflection_ready: "READY",
    reflection_explainer: "Take a moment to let the quote sink in. Feel your body. Press »READY« when you feel prepared to begin the quiz.",
    next_up: "Next lesson",
    journey_completed: "Completed",
    journey_current: "Current",
    journey_locked: "Locked"
  }
};

const NUMBER_WORDS = {
  en: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
  da: ['', 'et', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni', 'ti']
};

export const Island: React.FC<IslandProps> = ({ motif, lessonId = 1, onComplete, onLessonSelect, language = 'da' }) => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [savedProgress, setSavedProgress] = useState<SavedProgress | null>(() => loadProgress());
  const [selectedReflection, setSelectedReflection] = useState<typeof TRANSLATIONS['da']['reflection_options'][0] | null>(null);

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.da;
  const numberWord = (n: number) => NUMBER_WORDS[language][n] ?? String(n);
  const pad2 = (n: number) => String(n).padStart(2, '0');

  const lessons = getLessons(language);
  const currentLesson = lessons.find(l => l.id === lessonId) ?? lessons[0];
  const questions = currentLesson.questions;
  const practice = currentLesson.practice;
  const totalQuestions = questions.length;

  const q = questions[qIdx];

  useEffect(() => {
    if (phase === "intro") return;
    saveProgress({ lesson: lessonId, phase, qIdx, score, picked, revealed });
  }, [phase, qIdx, score, picked, revealed, lessonId]);

  // Reset phase when lessonId changes
  useEffect(() => {
    setPhase("intro");
    setQIdx(0);
    setPicked(null);
    setRevealed(false);
    setScore(0);
    setFadeKey(k => k + 1);
    setSelectedReflection(null);
  }, [lessonId]);

  const swapPhase = (mutate: () => void) => {
    setFadeState("out");
    setTimeout(() => {
      mutate();
      setFadeKey(k => k + 1);
      setFadeState("in");
    }, 420);
  };

  const begin = () => {
    clearProgress();
    setSavedProgress(null);

    const lastReflection = localStorage.getItem('last_reflection_ts');
    const now = Date.now();
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;

    if (lastReflection && (now - parseInt(lastReflection) < TWELVE_HOURS)) {
      swapPhase(() => {
        setPhase("question");
        setQIdx(0); setPicked(null); setRevealed(false); setScore(0);
      });
    } else {
      swapPhase(() => {
        setPhase("reflection");
        setQIdx(0); setPicked(null); setRevealed(false); setScore(0); setSelectedReflection(null);
      });
    }
  };

  const selectReflection = (option: typeof TRANSLATIONS['da']['reflection_options'][0]) => {
    setSelectedReflection(option);
    setFadeKey(k => k + 1);
  };

  const startQuiz = () => {
    localStorage.setItem('last_reflection_ts', Date.now().toString());
    swapPhase(() => {
      setPhase("question");
    });
  };

  const continueQuiz = () => {
    if (!savedProgress) return;
    swapPhase(() => {
      setPhase(savedProgress.phase);
      setQIdx(savedProgress.qIdx);
      setScore(savedProgress.score);
      setPicked(savedProgress.picked);
      setRevealed(savedProgress.revealed);
    });
  };

  const beginAnew = () => {
    clearProgress();
    setSavedProgress(null);
    swapPhase(() => {
      setPhase("intro");
      setQIdx(0); setPicked(null); setRevealed(false); setScore(0);
    });
  };

  const pick = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    if (q.options[i].correct) setScore(s => s + 1);
    setTimeout(() => setRevealed(true), 420);
  };

  const next = () => {
    swapPhase(() => {
      if (qIdx + 1 >= totalQuestions) {
        setPhase("result");
        // Mark as completed in a simple way
        const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
        if (!completed.includes(lessonId)) {
          localStorage.setItem('completed_lessons', JSON.stringify([...completed, lessonId]));
        }
      } else {
        setQIdx(i => i + 1);
        setPicked(null); setRevealed(false);
      }
    });
  };

  const back = () => {
    swapPhase(() => {
      if (qIdx === 0) {
        setPhase("reflection");
      } else {
        setQIdx(i => i - 1);
        setPicked(null); setRevealed(false);
      }
    });
  };

  const backFromReflection = () => {
    if (selectedReflection) {
      setSelectedReflection(null);
      setFadeKey(k => k + 1);
    } else {
      swapPhase(() => {
        setPhase("intro");
      });
    }
  };

  const restart = () => {
    swapPhase(() => {
      setPhase("intro");
      setQIdx(0); setPicked(null); setRevealed(false); setScore(0);
    });
  };

  const handleContinue = () => {
    if (onComplete) {
      swapPhase(() => onComplete());
    }
  };

  const correctIdx = q ? q.options.findIndex(o => o.correct) : -1;
  const hasResumable = savedProgress !== null && savedProgress.phase !== "intro" && savedProgress.lesson === lessonId;
  const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
  const nextLesson = lessons.find(l => l.id === lessonId + 1);

  const flourishClass = phase === "question" ? "flourish dimmed" : "flourish";

  return (
    <div className="island" role="region" aria-label="Meditation reflection quiz">
      <div className={flourishClass + " tl"}>{currentLesson.topic}</div>
      <div className={flourishClass + " br"}>{pad2(currentLesson.id)} / {pad2(lessons.length)}</div>

      <div key={fadeKey} className={`fade-wrap ${fadeState === "out" ? "fade-exit" : "fade-active"}`}>

        {phase === "intro" && (
          <div style={{ textAlign: "center" }}>
            <div className="journey-map">
              {lessons.map(l => {
                const isCompleted = completedLessons.includes(l.id);
                const isCurrent = l.id === lessonId;
                let status = isCompleted ? "completed" : (isCurrent ? "current" : "");
                
                return (
                  <div key={l.id} className={`journey-dot ${status}`} 
                       title={t.lesson + " " + l.id}
                       onClick={() => onLessonSelect?.(l.id)}>
                    {isCurrent && <div className="dot-pulse" />}
                  </div>
                );
              })}
            </div>
            <div className="breathe-wrap"><Motif kind={motif} size={120} /></div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              <span className="lesson-eyebrow">
                {t.lesson}<span className="lesson-num">{lessonId}</span>
              </span>
            </div>
            <h2 className="q-serif h-intro" style={{ margin: "0 0 18px", textWrap: "balance" }}>
              {t.intro_headline_1}<br />
              <span style={{ fontStyle: "italic", color: "var(--accent-deep)" }}>{t.intro_headline_2}</span>
            </h2>
            <p className="body-soft" style={{ margin: "0 auto 34px", maxWidth: 420 }}>
              {numberWord(totalQuestions).replace(/^./, c => c.toUpperCase())} {t.intro_body}
            </p>
            {hasResumable ? (
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="pill" onClick={continueQuiz}>{t.continue}</button>
                <button className="pill ghost" onClick={beginAnew}>{t.begin_anew}</button>
              </div>
            ) : (
              <button className="pill" onClick={begin}>{t.begin}</button>
            )}
          </div>
        )}

        {phase === "reflection" && (
          <div style={{ textAlign: "center" }}>
            <div className="breathe-wrap" style={{ marginBottom: 30 }}><Motif kind={motif} size={80} /></div>
            
            {!selectedReflection ? (
              <>
                <h3 className="q-serif" style={{ marginBottom: 24, fontSize: "22px" }}>{t.reflection_headline}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 280, margin: "0 auto" }}>
                  {t.reflection_options.map((opt, i) => (
                    <button key={i} className="answer" onClick={() => selectReflection(opt)}>
                      <span className="dot" style={{ background: opt.color, opacity: 1 }} />
                      <span style={{ flex: 1 }}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div key="quote-view" className="fade-active" style={{ animation: "none" }}>
                <div className="quote-container" style={{ borderLeftColor: selectedReflection.color }}>
                  <p className="q-serif" style={{ fontSize: "21px", fontStyle: "italic", lineHeight: "1.6", margin: 0 }}>
                    {selectedReflection.quote}
                  </p>
                </div>
                <p className="body-soft" style={{ fontSize: "14.5px", marginBottom: 36, maxWidth: "360px", margin: "0 auto 36px" }}>
                  {t.reflection_explainer}
                </p>
                <button className="pill" style={{ padding: "18px 64px", fontSize: "16px" }} onClick={startQuiz}>{t.reflection_ready}</button>
              </div>
            )}

            <div style={{ marginTop: 32 }}>
              <button className="pill ghost" onClick={backFromReflection}>{t.back}</button>
            </div>
          </div>
        )}

        {phase === "question" && q && (
          <div>
            <Progress total={totalQuestions} current={qIdx} />
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
              <Motif kind={motif} size={64} small />
            </div>
            <div className="eyebrow" style={{ textAlign: "center", marginBottom: 14 }}>{q.eyebrow}</div>
            <h3 className="q-serif h-question" style={{ textAlign: "center", margin: "0 0 8px", textWrap: "balance" }}>
              {q.prompt}
            </h3>

            <div className="answers">
              {q.options.map((opt, i) => {
                let cls = "answer";
                if (picked !== null) {
                  if (i === picked && opt.correct) cls += " selected-correct";
                  else if (i === picked && !opt.correct) cls += " selected-wrong";
                  else if (revealed && i === correctIdx && picked !== correctIdx) cls += " reveal-correct";
                }
                return (
                  <button key={i} className={cls} disabled={picked !== null} onClick={() => pick(i)}>
                    <span className="dot" />
                    <span style={{ flex: 1 }}>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className="microcopy fade-active" style={{ animation: "none" }}>
                {q.gentle}
              </div>
            )}

            {revealed && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 26, gap: 10 }}>
                <button className="pill ghost" onClick={back}>{t.back}</button>
                <button className="pill" onClick={next}>
                  {qIdx + 1 >= totalQuestions ? t.see_practice : t.continue}
                </button>
              </div>
            )}
            {!revealed && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
                <button className="pill ghost" onClick={back}>{t.back}</button>
              </div>
            )}
          </div>
        )}

        {phase === "result" && (
          <div className="result-stack">
            <div className="eyebrow" style={{ marginBottom: 10, fontSize: "14px", fontWeight: "600" }}>
              {score === totalQuestions
                ? t.clarity_all.replace("{n}", numberWord(totalQuestions))
                : t.clarity_some.replace("{n}", numberWord(totalQuestions)).replace("{s}", String(score))}
            </div>
            <div className="result-big-breathe"><Motif kind={motif} size={160} /></div>
            <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>{t.suggested_practice}</div>
            <h3 className="q-serif h-result result-practice-name">
              {practice.name.split(" ").slice(0, -2).join(" ")} <span className="result-practice-italic">{practice.name.split(" ").slice(-2).join(" ")}</span>
            </h3>
            <div className="result-meta" style={{ marginBottom: "20px" }}>
              <span>{practice.duration}</span>
              <span className="sep" />
              <span>{practice.italic}</span>
            </div>

            {nextLesson && (
              <div className="next-preview" 
                   style={{ marginBottom: 24, padding: "24px 20px", background: "rgba(0,0,0,0.025)", borderRadius: 20, textAlign: "left", cursor: "pointer", border: "1px solid transparent" }}
                   onClick={() => onLessonSelect?.(nextLesson.id)}>
                <div className="eyebrow" style={{ marginBottom: 8, fontSize: "10px" }}>{t.next_up}</div>
                <div style={{ fontWeight: "600", fontSize: "16px", color: "var(--ink)", marginBottom: 16 }}>{nextLesson.topic}</div>
                <button className="pill" style={{ padding: "12px 24px", fontSize: "13px", width: "100%", background: "var(--accent-soft)", color: "var(--accent-deep)", boxShadow: "none" }}>
                  {language === 'da' ? 'Fortsæt til næste lektion' : 'Continue to next lesson'} →
                </button>
              </div>
            )}

            <div className="result-actions">
              <button className="pill" onClick={handleContinue}>{t.continue}</button>
              <button className="pill ghost" onClick={restart}>{t.reflect_again}</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
