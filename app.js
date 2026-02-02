const moodEl = document.getElementById("mood");
const tagEl = document.getElementById("tag");
const langEl = document.getElementById("lang");
const instrumentalEl = document.getElementById("instrumental");
const animeEl = document.getElementById("anime");
const lyricsEl = document.getElementById("lyrics");

const phraseEl = document.getElementById("phrase");
const resultsEl = document.getElementById("results");

const moodWords = {
  sad: ["melancholic", "heartbreak", "soft", "emotional"],
  calm: ["calm", "peaceful", "relaxing", "serene"],
  focus: ["focus", "study", "deep work", "concentration"],
  hype: ["hype", "energy", "workout", "high intensity"],
  nostalgic: ["nostalgic", "throwback", "bittersweet", "memories"],
  romantic: ["romantic", "love", "slow", "warm"],
  angry: ["angry", "intense", "rage", "hard"],
  cozy: ["cozy", "warm", "rainy day", "soft"]
};

const tagWords = {
  piano: ["piano", "solo piano"],
  orchestral: ["orchestral", "cinematic"],
  lofi: ["lofi", "lo-fi beats"],
  acoustic: ["acoustic", "unplugged"],
  ambient: ["ambient", "soundscape"],
  synthwave: ["synthwave", "retro electronic"],
  jazz: ["jazz", "smooth jazz"],
  strings: ["strings", "violin"]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPhrase() {
  const mood = moodEl.value;
  const tag = tagEl.value;
  const lang = langEl.value;

  const moodWord = pick(moodWords[mood] ?? [mood]);
  const tagWord = pick(tagWords[tag] ?? [tag]);

  const parts = [];
  if (animeEl.checked) parts.push("anime ost");
  parts.push(moodWord, tagWord);

  if (instrumentalEl.checked) parts.push("instrumental");
  if (lyricsEl.checked && !instrumentalEl.checked) parts.push("with lyrics");

  if (lang) {
    if (lang === "instrumental") parts.push("instrumental");
    else parts.push(lang);
  }

  // Make it playlist-friendly
  parts.push("playlist");

  // De-dup simple repeats
  const cleaned = [];
  for (const p of parts) if (!cleaned.includes(p)) cleaned.push(p);

  return cleaned.join(" ");
}

function ytLink(q) {
  const s = encodeURIComponent(q);
  return `https://www.youtube.com/results?search_query=${s}`;
}

function spotifyLink(q) {
  const s = encodeURIComponent(q);
  return `https://open.spotify.com/search/${s}`;
}

function makeCard(title, desc, query) {
  const div = document.createElement("div");
  div.className = "result";
  div.innerHTML = `
    <h3>${title}</h3>
    <p>${desc}</p>
    <div class="links">
      <a href="${ytLink(query)}" target="_blank" rel="noreferrer">YouTube</a>
      <a href="${spotifyLink(query)}" target="_blank" rel="noreferrer">Spotify</a>
    </div>
  `;
  return div;
}

function render() {
  const phrase = buildPhrase();
  phraseEl.textContent = phrase;
  resultsEl.innerHTML = "";

  // Generate a few “angles” so it feels like recommendations.
  const variants = [
    { t: "Best match", d: "Closest to your mood + filters.", q: phrase },
    { t: "More minimal", d: "Cleaner sound / fewer elements.", q: phrase.replace("playlist", "minimal playlist") },
    { t: "Live / extended", d: "Long mixes for staying in the vibe.", q: phrase.replace("playlist", "mix 1 hour") },
    { t: "Hidden gems", d: "Try smaller channels / lesser-known picks.", q: phrase.replace("playlist", "underrated") },
    { t: "Instrument focus", d: "More emphasis on the instrument/style.", q: phrase.replace("playlist", `${tagEl.value} only playlist`) },
    { t: "Mood storytelling", d: "Cinematic / emotional arc.", q: phrase.replace("playlist", "cinematic playlist") }
  ];

  for (const v of variants) {
    resultsEl.appendChild(makeCard(v.t, v.d, v.q));
  }
}

document.getElementById("go").addEventListener("click", render);

document.getElementById("random").addEventListener("click", () => {
  const moods = Object.keys(moodWords);
  const tags = Object.keys(tagWords);
  moodEl.value = moods[Math.floor(Math.random() * moods.length)];
  tagEl.value = tags[Math.floor(Math.random() * tags.length)];
  instrumentalEl.checked = Math.random() < 0.55;
  animeEl.checked = Math.random() < 0.35;
  lyricsEl.checked = !instrumentalEl.checked && Math.random() < 0.4;

  const langs = ["", "japanese", "korean", "bangla", "english", "instrumental"];
  langEl.value = langs[Math.floor(Math.random() * langs.length)];

  render();
});

document.getElementById("copy").addEventListener("click", async () => {
  const text = phraseEl.textContent || "";
  try {
    await navigator.clipboard.writeText(text);
    phraseEl.textContent = `${text} ✓ copied`;
    setTimeout(() => (phraseEl.textContent = text), 900);
  } catch {
    alert("Copy failed. You can manually select the phrase and copy it.");
  }
});

// Initial render so it doesn't look empty
render();
