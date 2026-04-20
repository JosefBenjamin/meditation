import groundingMd from '../../quiz_grounding_and_presence.md?raw';
import impermanenceMd from '../../quiz_impermanence_and_letting_go.md?raw';
import compassionMd from '../../quiz_compassion_and_metta.md?raw';

import groundingMdDa from '../../quiz_grounding_and_presence_da.md?raw';
import impermanenceMdDa from '../../quiz_impermanence_and_letting_go_da.md?raw';
import compassionMdDa from '../../quiz_compassion_and_metta_da.md?raw';

import type { Lesson, Question, Practice } from '../types';

function parseMarkdown(md: string, id: number, topic: string, practice: Practice): Lesson {
  const questions: Question[] = [];
  
  // Basic parser for the specific format
  const questionBlocks = md.split(/\*\*Q\d+/).slice(1);
  
  for (const block of questionBlocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Header line: · Eyebrow** — *Prompt?*
    const headerLine = lines[0];
    const eyebrowMatch = headerLine.match(/·\s*(.*?)\*\*\s*[–—\-]\s*\*(.*?)\*/);
    if (!eyebrowMatch) continue;
    
    const eyebrow = eyebrowMatch[1].trim();
    const prompt = eyebrowMatch[2].trim();
    
    const options = [];
    let gentle = '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('- ✓')) {
        options.push({ text: line.replace('- ✓', '').trim(), correct: true });
      } else if (line.startsWith('- ·')) {
        options.push({ text: line.replace('- ·', '').trim(), correct: false });
      } else if (line.startsWith('- *Gentle*:') || line.startsWith('- *Mild*:')) {
        gentle = line.replace(/-\s*\*.*\*:|\*.*\*/, '').trim();
      }
    }
    
    questions.push({
      eyebrow,
      prompt,
      options,
      gentle
    });
  }
  
  return {
    id,
    topic,
    practice,
    questions
  };
}

const practices: Record<number, Practice> = {
  1: {
    name: "Returning to the Breath",
    italic: "a grounding practice",
    duration: "8 minutes",
    teacher: "with Amara",
    description: "A quiet sit that meets the mind where it is. No effort to change anything - only the gentle, repeated noticing that is at the heart of every tradition you've studied.",
  },
  2: {
    name: "Watching the Tide",
    italic: "a letting-go practice",
    duration: "10 minutes",
    teacher: "with Joren",
    description: "A guided sit on the rising and falling of all things. We rest at the shoreline of experience and watch each sensation, thought, and feeling arrive and dissolve in its own time.",
  },
  3: {
    name: "A Soft Hand for the Heart",
    italic: "a metta practice",
    duration: "12 minutes",
    teacher: "with Tova",
    description: "A guided loving-kindness sit that begins with the self and slowly widens outward. We plant phrases of warmth like seeds, trusting that the watering itself is the practice, whether or not we feel the bloom today.",
  }
};

const practicesDa: Record<number, Practice> = {
  1: {
    name: "At Vende Tilbage til Åndedrættet",
    italic: "en jordforbindende praksis",
    duration: "8 minutter",
    teacher: "med Amara",
    description: "En stille meditation, der møder sindet, hvor det er. Ingen anstrengelse for at ændre noget - kun den blide, gentagne bemærken, der er kernen i enhver tradition, du har studeret.",
  },
  2: {
    name: "At Betragte Tidevandet",
    italic: "en praksis i at give slip",
    duration: "10 minutter",
    teacher: "med Joren",
    description: "En guidet meditation om alle tings opståen og forsvinden. Vi hviler ved oplevelsens kyst og betragter hver fornemmelse, tanke og følelse ankomme og opløses i sin egen tid.",
  },
  3: {
    name: "En Blød Hånd for Hjertet",
    italic: "en metta-praksis",
    duration: "12 minutter",
    teacher: "med Tova",
    description: "En guidet meditation i kærlig-venlighed, der begynder med en selv og langsomt udvider sig udad. Vi planter sætninger af varme som frø i tillid til, at vandingen i sig selv er praksissen, uanset om vi mærker blomstringen i dag.",
  }
};

export const LESSONS_EN: Lesson[] = [
  parseMarkdown(groundingMd, 1, "Grounding and Presence", practices[1]),
  parseMarkdown(impermanenceMd, 2, "Impermanence and Letting Go", practices[2]),
  parseMarkdown(compassionMd, 3, "Compassion and Loving-Kindness", practices[3]),
];

export const LESSONS_DA: Lesson[] = [
  parseMarkdown(groundingMdDa, 1, "Jordforbindelse og Nærvær", practicesDa[1]),
  parseMarkdown(impermanenceMdDa, 2, "Forgængelighed og at Give Slip", practicesDa[2]),
  parseMarkdown(compassionMdDa, 3, "Medfølelse og Kærlig-Venlighed", practicesDa[3]),
];

export const getLessons = (language: 'en' | 'da'): Lesson[] => {
  return language === 'da' ? LESSONS_DA : LESSONS_EN;
};
