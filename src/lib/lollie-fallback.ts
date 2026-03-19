function normalize(text: string) {
  return text.toLowerCase();
}

function trimUserText(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

export function buildLollieFallbackReply(userText: string) {
  const trimmed = trimUserText(userText);
  const lower = normalize(trimmed);

  if (!trimmed) {
    return "I’m here with you. Pick one tiny next step, and we’ll do it together.";
  }

  if (/(dinner|meal|lunch|breakfast|food|eat)/.test(lower)) {
    return "Tiny food plan: pick the easiest option with protein, add one comfort side, and call that a win. Fed is better than perfect.";
  }

  if (/(overwhelmed|anxious|stressed|panic|too much|spiral|rough|bad day|sad|tired)/.test(lower)) {
    return "Pause with me for ten seconds. Do one tiny rescue task, drink some water, and let the rest be smaller than your brain is making it feel.";
  }

  if (/(task|plan|todo|clean|reset|organize|work)/.test(lower)) {
    return "Let’s shrink it: pick the first visible step, do it for five minutes, then reassess. Momentum counts more than intensity.";
  }

  if (/(water|drink|hydration)/.test(lower)) {
    return "Hydration check approved. One drink now, one drink nearby, and you’re already doing better than zero.";
  }

  return `I heard you: "${trimmed}". My best no-cloud answer is to keep it gentle, pick one useful next step, and let that be enough for this moment.`;
}
