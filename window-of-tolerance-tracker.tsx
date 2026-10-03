import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sun,
  Sunrise,
  Sunset,
  Calendar,
  Activity,
  TrendingUp,
  Brain,
  Wind,
  Info,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Heart,
  Zap,
  Moon,
  Trash2,
  Play,
  Pause,
  Sliders,
  PieChart,
  HelpCircle,
  FileText,
  Clock,
  Feather,
  Smile,
  Globe
} from 'lucide-react';


// Zone Types: 'hyper' | 'optimal' | 'hypo'
const ZONES = {
  HYPER: {
    id: 'hyper',
    nameEn: 'Hyperarousal Zone',
    nameLt: 'Hiper-sujaudinimo zona',
    range: [8, 9, 10],
    color: 'amber',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
    cardBg: 'from-amber-500/10 to-red-500/10 border-amber-500/30',
    barColor: 'bg-gradient-to-r from-amber-500 to-red-500',
    activeBtn: 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105 ring-2 ring-red-400',
    sympathetic: 'Sympathetic Nervous System (Fight / Flight)',
    sympatheticLt: 'Simpatinė nervų sistema (Kova / Bėgimas)',
    descEn: 'Agitation, anxiety, anger, overwhelm, racing thoughts, panic, hyper-vigilance.',
    descLt: 'Jaudulys, nerimas, pyktis, perdegimas, skriejančios mintys, panika, padidėjęs budrumas.',
    somaticEn: 'Racing heart, tight chest, shallow breathing, clenched jaw, restlessness.',
    somaticLt: 'Dažnas širdies plakimas, užspausta krūtinė, paviršinis kvėpavimas, sučiupti žandikauliai.',
    copingEn: 'Down-regulate: Prolonged exhales, 4-7-8 breathing, heavy weight pressure, cool water on face.',
    copingLt: 'Lėtinimas: Ilgesni iškvėpimai, 4-7-8 kvėpavimas, svoris ant krūtinės, šaltas vanduo ant veido.'
  },
  OPTIMAL: {
    id: 'optimal',
    nameEn: 'Optimal Tolerance Zone',
    nameLt: 'Tolerancijos langas (Optimali zona)',
    range: [4, 5, 6, 7],
    color: 'emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    cardBg: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30',
    barColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    activeBtn: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400',
    sympathetic: 'Ventral Vagal Social Engagement System',
    sympatheticLt: 'Ventralinė klajoklio nervo sistema (Sauga ir ryšys)',
    descEn: 'Calm, grounded, flexible, connected, present, capable of processing emotions smoothly.',
    descLt: 'Ramybė, įsižeminimas, lankstumas, buvimas čia ir dabar, gebėjimas sklandžiai valdyti emocijas.',
    somaticEn: 'Relaxed shoulders, steady deep breathing, open posture, soft facial expression.',
    somaticLt: 'Atsipalaidavę pečiai, tolygus gilus kvėpavimas, atvira laikysena, švelni veido išraiška.',
    copingEn: 'Maintain & Nourish: Creative expression, mindful movement, connection, gratitude logging.',
    copingLt: 'Palaikymas: Kūrybiškumas, dėmesingas judėjimas, bendravimas, dėkingumo dienoraštis.'
  },
  HYPO: {
    id: 'hypo',
    nameEn: 'Hypoarousal Zone',
    nameLt: 'Hipo-sujaudinimo zona',
    range: [1, 2, 3],
    color: 'indigo',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700',
    cardBg: 'from-indigo-500/10 to-blue-500/10 border-indigo-500/30',
    barColor: 'bg-gradient-to-r from-indigo-500 to-blue-600',
    activeBtn: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105 ring-2 ring-indigo-400',
    sympathetic: 'Dorsal Vagal Shutdown (Freeze / Collapse)',
    sympatheticLt: 'Dorsalinė klajoklio nervo sistema (Sustingimas / Išsekimas)',
    descEn: 'Numbness, exhaustion, depression, brain fog, dissociation, feeling empty or disconnected.',
    descLt: 'Otrpimas, išsekimas, smegenų rūkas, disociacija, tuštumos ar atsiribojimo jausmas.',
    somaticEn: 'Heavy limbs, sluggish movements, low energy, cold hands, slow heart rate.',
    somaticLt: 'Sunkios rankos ir kojos, lėti judesiai, šaltos rankos, silpnas energijos lygis.',
    copingEn: 'Up-regulate gently: Light stretching, sensory activation (snack/scent), rhythmic movement.',
    copingLt: 'Švelnus žadinimas: Lengvi tempimai, pojūčių aktyvinimas (kvapas, skonis), ritmo judesiai.'
  }
};

const EMOTION_TAGS = [
  { id: 'anxious', labelEn: 'Anxious', labelLt: 'Nervingas(-a)', zone: 'hyper' },
  { id: 'restless', labelEn: 'Restless', labelLt: 'Neramus(-a)', zone: 'hyper' },
  { id: 'overwhelmed', labelEn: 'Overwhelmed', labelLt: 'Pervargęs(-usi)', zone: 'hyper' },
  { id: 'frustrated', labelEn: 'Frustrated', labelLt: 'Suirzęs(-usi)', zone: 'hyper' },
  { id: 'panicked', labelEn: 'Panicked', labelLt: 'Apimtas(-a) panikos', zone: 'hyper' },
  { id: 'calm', labelEn: 'Calm', labelLt: 'Ramus(-i)', zone: 'optimal' },
  { id: 'focused', labelEn: 'Focused', labelLt: 'Susikaupęs(-usi)', zone: 'optimal' },
  { id: 'grounded', labelEn: 'Grounded', labelLt: 'Įsižeminęs(-usi)', zone: 'optimal' },
  { id: 'grateful', labelEn: 'Grateful', labelLt: 'Dėkingas(-a)', zone: 'optimal' },
  { id: 'connected', labelEn: 'Connected', labelLt: 'Jaučiantis ryšį', zone: 'optimal' },
  { id: 'numb', labelEn: 'Numb', labelLt: 'Nutirpęs(-usi)', zone: 'hypo' },
  { id: 'exhausted', labelEn: 'Exhausted', labelLt: 'Išsekęs(-usi)', zone: 'hypo' },
  { id: 'sad', labelEn: 'Low / Sad', labelLt: 'Nuliūdęs(-usi)', zone: 'hypo' },
  { id: 'disconnected', labelEn: 'Disconnected', labelLt: 'Atsiribojęs(-usi)', zone: 'hypo' },
  { id: 'brainfog', labelEn: 'Brain Fog', labelLt: 'Smegenų rūkas', zone: 'hypo' }
];

const SOMATIC_TAGS = [
  { id: 'tight_chest', labelEn: 'Tight Chest', labelLt: 'Spaudimas krūtinėje' },
  { id: 'racing_heart', labelEn: 'Racing Heart', labelLt: 'Greitas širdies plakimas' },
  { id: 'clenched_jaw', labelEn: 'Clenched Jaw', labelLt: 'Sučiaupti žandikauliai' },
  { id: 'shallow_breath', labelEn: 'Shallow Breathing', labelLt: 'Paviršinis kvėpavimas' },
  { id: 'relaxed_body', labelEn: 'Relaxed Muscles', labelLt: 'Atsipalaidavę raumenys' },
  { id: 'steady_breath', labelEn: 'Steady Breath', labelLt: 'Tolygus kvėpavimas' },
  { id: 'warmth', labelEn: 'Warmth in Core', labelLt: 'Šiluma kūne' },
  { id: 'heavy_limbs', labelEn: 'Heavy Limbs', labelLt: 'Sunkios galūnės' },
  { id: 'cold_hands', labelEn: 'Cold Hands/Feet', labelLt: 'Šaltos rankos / pėdos' },
  { id: 'stomach_knot', labelEn: 'Stomach Knots', labelLt: 'Gėlimas pilve' },
  { id: 'headache', labelEn: 'Head Pressure', labelLt: 'Spaudimas galvoje' }
];

const TIME_SLOTS = [
  {
    id: 'morning',
    labelEn: 'Morning',
    labelLt: 'Rytas',
    timeEn: '06:00 - 11:59',
    icon: Sunrise,
    startHour: 6,
    endHour: 12
  },
  {
    id: 'midday',
    labelEn: 'Midday',
    labelLt: 'Diena',
    timeEn: '12:00 - 17:59',
    icon: Sun,
    startHour: 12,
    endHour: 18
  },
  {
    id: 'evening',
    labelEn: 'Evening',
    labelLt: 'Vakaras',
    timeEn: '18:00 - 23:59',
    icon: Sunset,
    startHour: 18,
    endHour: 24
  }
];

function getZoneForLevel(level) {
  if (level >= 8) return ZONES.HYPER;
  if (level >= 4) return ZONES.OPTIMAL;
  return ZONES.HYPO;
}

function getCurrentTimeSlotId() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'midday';
  return 'evening';
}

function formatDateISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr, lang = 'en') {
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  
  const todayStr = formatDateISO(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateISO(yesterday);

  if (dateStr === todayStr) {
    return lang === 'lt' ? 'Šiandien' : 'Today';
  } else if (dateStr === yesterdayStr) {
    return lang === 'lt' ? 'Vakar' : 'Yesterday';
  }

  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-US', options);
}

function generateSampleData() {
  const data = {};
  const today = new Date();
  
  const sampleEmotions = {
    hyper: ['anxious', 'restless', 'overwhelmed', 'frustrated'],
    optimal: ['calm', 'focused', 'grounded', 'grateful', 'connected'],
    hypo: ['numb', 'exhausted', 'sad', 'brainfog', 'disconnected']
  };

  const sampleSomatics = {
    hyper: ['tight_chest', 'racing_heart', 'shallow_breath'],
    optimal: ['relaxed_body', 'steady_breath', 'warmth'],
    hypo: ['heavy_limbs', 'cold_hands', 'stomach_knot']
  };

  const sampleNotes = [
    'Busy morning meeting with tight deadlines.',
    'Enjoyed a peaceful walk in the park during lunch break.',
    'Late night scrolling made me feel tired and heavy.',
    'Practiced 5-4-3-2-1 grounding after feeling overwhelmed.',
    'Felt very productive and connected with colleagues.',
    'Slept poorly, feeling low energy and brain fog.',
    'Great yoga session, felt grounded and centered.'
  ];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateISO(d);
    data[dateStr] = {};

    TIME_SLOTS.forEach((slot, slotIdx) => {
      // Create plausible variation: morning usually optimal/hypo, midday optimal/hyper, evening mixed
      let level;
      const rand = Math.random();
      if (i === 0 && slotIdx > TIME_SLOTS.findIndex(s => s.id === getCurrentTimeSlotId())) {
        // Skip future slots for today
        return;
      }

      if (rand > 0.35) {
        // Optimal
        level = Math.floor(Math.random() * 4) + 4; // 4-7
      } else if (rand > 0.18) {
        // Hyper
        level = Math.floor(Math.random() * 3) + 8; // 8-10
      } else {
        // Hypo
        level = Math.floor(Math.random() * 3) + 1; // 1-3
      }

      const zoneKey = level >= 8 ? 'hyper' : level >= 4 ? 'optimal' : 'hypo';
      const pickedEmotions = [sampleEmotions[zoneKey][Math.floor(Math.random() * sampleEmotions[zoneKey].length)]];
      const pickedSomatics = [sampleSomatics[zoneKey][Math.floor(Math.random() * sampleSomatics[zoneKey].length)]];

      data[dateStr][slot.id] = {
        level,
        emotions: pickedEmotions,
        somatics: pickedSomatics,
        note: sampleNotes[Math.floor(Math.random() * sampleNotes.length)],
        timestamp: new Date(d.getFullYear(), d.getMonth(), d.getDate(), slot.startHour + 2).toISOString()
      };
    });
  }
  return data;
}

export default function WindowOfToleranceApp() {
  const [lang, setLang] = useState('en'); // 'en' | 'lt'
  const [activeTab, setActiveTab] = useState('log'); // 'log' | 'analytics' | 'grounding' | 'guide'
  
  // Storage state
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('wot_daily_logs_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading localStorage logs', e);
    }
    return {};
  });

  // Selected date & slot state
  const [selectedDate, setSelectedDate] = useState(() => formatDateISO(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(() => getCurrentTimeSlotId());

  // Form State
  const [level, setLevel] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedSomatics, setSelectedSomatics] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync Form State when selectedDate or selectedSlot changes
  useEffect(() => {
    const dayEntry = logs[selectedDate]?.[selectedSlot];
    if (dayEntry) {
      setLevel(dayEntry.level || 5);
      setSelectedEmotions(dayEntry.emotions || []);
      setSelectedSomatics(dayEntry.somatics || []);
      setNoteText(dayEntry.note || '');
    } else {
      // Default initial states for fresh entry
      setLevel(5);
      setSelectedEmotions([]);
      setSelectedSomatics([]);
      setNoteText('');
    }
  }, [selectedDate, selectedSlot, logs]);

  // Save to LocalStorage on logs state update
  useEffect(() => {
    try {
      localStorage.setItem('wot_daily_logs_v1', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [logs]);

  const handleSaveEntry = () => {
    const entryData = {
      level,
      emotions: selectedEmotions,
      somatics: selectedSomatics,
      note: noteText,
      timestamp: new Date().toISOString()
    };

    setLogs(prev => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [selectedSlot]: entryData
      }
    }));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2200);
  };

  const handleDeleteSlotEntry = (slotId) => {
    setLogs(prev => {
      const updatedDate = { ...(prev[selectedDate] || {}) };
      delete updatedDate[slotId];
      if (Object.keys(updatedDate).length === 0) {
        const newLogs = { ...prev };
        delete newLogs[selectedDate];
        return newLogs;
      }
      return {
        ...prev,
        [selectedDate]: updatedDate
      };
    });
  };

  const handleToggleEmotion = (id) => {
    setSelectedEmotions(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleToggleSomatic = (id) => {
    setSelectedSomatics(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleDateChange = (offset) => {
    const cur = new Date(selectedDate + 'T00:00:00');
    cur.setDate(cur.getDate() + offset);
    setSelectedDate(formatDateISO(cur));
  };

  const handleLoadSampleData = () => {
    const samples = generateSampleData();
    setLogs(samples);
  };

  const handleClearData = () => {
    if (window.confirm(lang === 'lt' ? 'Ar tikrai norite ištrinti visus duomenis?' : 'Are you sure you want to clear all log history?')) {
      setLogs({});
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `window-of-tolerance-data-${selectedDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (typeof parsed === 'object') {
          setLogs(parsed);
          alert(lang === 'lt' ? 'Duomenys sėkmingai įkelti!' : 'Data successfully imported!');
        }
      } catch (err) {
        alert(lang === 'lt' ? 'Neteisingas JSON failas.' : 'Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const currentZone = getZoneForLevel(level);

  const analyticsData = useMemo(() => {
    let totalEntries = 0;
    let hyperCount = 0;
    let optimalCount = 0;
    let hypoCount = 0;
    const emotionFreq = {};

    // Get last 14 days dates array
    const last14Days = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last14Days.push(formatDateISO(d));
    }

    const timeline = last14Days.map(dateStr => {
      const daySlots = logs[dateStr] || {};
      return {
        dateStr,
        displayDate: formatDisplayDate(dateStr, lang),
        morning: daySlots.morning || null,
        midday: daySlots.midday || null,
        evening: daySlots.evening || null
      };
    });

    Object.values(logs).forEach(day => {
      Object.values(day).forEach(entry => {
        if (!entry || typeof entry.level !== 'number') return;
        totalEntries++;
        if (entry.level >= 8) hyperCount++;
        else if (entry.level >= 4) optimalCount++;
        else hypoCount++;

        if (Array.isArray(entry.emotions)) {
          entry.emotions.forEach(eId => {
            emotionFreq[eId] = (emotionFreq[eId] || 0) + 1;
          });
        }
      });
    });

    const optimalPct = totalEntries ? Math.round((optimalCount / totalEntries) * 100) : 0;
    const hyperPct = totalEntries ? Math.round((hyperCount / totalEntries) * 100) : 0;
    const hypoPct = totalEntries ? Math.round((hypoCount / totalEntries) * 100) : 0;

    return {
      totalEntries,
      optimalPct,
      hyperPct,
      hypoPct,
      timeline,
      emotionFreq
    };
  }, [logs, lang]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 font-sans pb-16">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Psychological Framework Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 dark:from-teal-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {lang === 'lt' ? 'Tolerancijos Lango Metodas' : 'Window of Tolerance'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {lang === 'lt' ? 'Nervų sistemos būsenos ir emocijų dienoraštis' : 'Nervous System & Emotional State Tracker'}
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('log')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'log'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'lt' ? 'Žurnalas' : 'Daily Logger'}</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PieChart className="w-4 h-4 text-indigo-500" />
              <span>{lang === 'lt' ? 'Analitika' : 'Analytics'}</span>
            </button>

            <button
              onClick={() => setActiveTab('grounding')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'grounding'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wind className="w-4 h-4 text-teal-500" />
              <span>{lang === 'lt' ? 'Įsižeminimas' : 'Grounding'}</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'guide'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Info className="w-4 h-4 text-amber-500" />
              <span>{lang === 'lt' ? 'Gidas' : 'Guide'}</span>
            </button>
          </div>

          {/* Action Bar (Language Switch & Data Tools) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(l => (l === 'en' ? 'lt' : 'en'))}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              title="Toggle Language / Keisti kalbą"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{lang === 'en' ? 'LT' : 'EN'}</span>
            </button>

            <button
              onClick={handleLoadSampleData}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition"
              title="Populate test data for testing analytics"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'lt' ? 'Pavyzdiniai duomenys' : 'Sample Data'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER CONTENT */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">

        {/* TAB 1: DAILY LOGGER & INTERACTIVE SCALE */}
        {activeTab === 'log' && (
          <div className="space-y-6">

            {/* DATE & SLOT NAVIGATION BAR */}
            {}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Date Controls */}
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <button
                  onClick={() => handleDateChange(-1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                    className="bg-transparent font-semibold text-sm sm:text-base focus:outline-none dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-600 pl-2">
                    {formatDisplayDate(selectedDate, lang)}
                  </span>
                </div>

                <button
                  onClick={() => handleDateChange(1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                  title="Next Day"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {selectedDate !== formatDateISO(new Date()) && (
                  <button
                    onClick={() => setSelectedDate(formatDateISO(new Date()))}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition"
                  >
                    {lang === 'lt' ? 'Grįžti į šiandien' : 'Today'}
                  </button>
                )}
              </div>

              {/* Time Slots Selection */}
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const Icon = slot.icon;
                  const isSelected = selectedSlot === slot.id;
                  const isCurrentSystemSlot = selectedDate === formatDateISO(new Date()) && getCurrentTimeSlotId() === slot.id;
                  const hasSavedData = !!logs[selectedDate]?.[slot.id];
                  const slotEntry = logs[selectedDate]?.[slot.id];
                  const slotZone = slotEntry ? getZoneForLevel(slotEntry.level) : null;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {/* Active Indicator Badge */}
                      {isCurrentSystemSlot && (
                        <span className="absolute -top-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white shadow-xs">
                          {lang === 'lt' ? 'Dabar' : 'Now'}
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-700 dark:text-slate-300'}`}>
                          {lang === 'lt' ? slot.labelLt : slot.labelEn}
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {slot.timeEn}
                      </span>

                      {/* Logged status indicator */}
                      {hasSavedData ? (
                        <div className="mt-1.5 flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${
                            slotZone?.id === 'hyper' ? 'bg-amber-500' : slotZone?.id === 'optimal' ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`} />
                          <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                            Lvl {slotEntry.level}
                          </span>
                        </div>
                      ) : (
                        <span className="mt-1.5 text-[10px] text-slate-400 italic">
                          {lang === 'lt' ? 'Tuščia' : 'Empty'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* INTERACTIVE WINDOW OF TOLERANCE LIKERT SCALE */}
            {}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'lt' ? 'Tolerancijos Lango Skaalė (1 - 10)' : 'Window of Tolerance Scale (1 - 10)'}
                    </h2>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${currentZone.badgeBg}`}>
                      {lang === 'lt' ? currentZone.nameLt : currentZone.nameEn}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'lt'
                      ? 'Pasirinkite skaičių nuo 1 iki 10, atitinkantį jūsų emocinį ir kūno sujaudinimo lygį.'
                      : 'Select a score representing your current nervous system arousal level.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {lang === 'lt' ? 'Šio laiko slotas:' : 'Selected Slot:'}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    {TIME_SLOTS.find(s => s.id === selectedSlot)?.[lang === 'lt' ? 'labelLt' : 'labelEn']}
                  </span>
                </div>
              </div>

              {/* Likert Scale Buttons 1-10 */}
              <div>
                <div className="grid grid-cols-10 gap-1.5 sm:gap-2.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const btnZone = getZoneForLevel(num);
                    const isSelected = level === num;
                    
                    let bgStyle = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700";
                    if (isSelected) {
                      bgStyle = btnZone.activeBtn;
                    }

                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setLevel(num)}
                        className={`h-12 sm:h-14 rounded-xl text-base sm:text-lg font-bold transition-all duration-200 flex flex-col items-center justify-center ${bgStyle}`}
                      >
                        <span>{num}</span>
                        <span className="text-[9px] opacity-75 font-medium hidden sm:block">
                          {num <= 3 ? 'Hypo' : num <= 7 ? 'Optimal' : 'Hyper'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Visual Slider */}
                <div className="mt-5 space-y-2">
                  <div className="relative h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex">
                    {/* Zone indicators inside bar */}
                    <div className="w-[30%] bg-indigo-500/70 h-full border-r border-white/20" title="Hypoarousal Zone (1-3)" />
                    <div className="w-[40%] bg-emerald-500/70 h-full border-r border-white/20" title="Optimal Zone (4-7)" />
                    <div className="w-[30%] bg-amber-500/70 h-full" title="Hyperarousal Zone (8-10)" />
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:bg-slate-700"
                  />

                  {/* Range Labels */}
                  <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                    <span className="text-indigo-600 dark:text-indigo-400">1 - 3: Hypoarousal</span>
                    <span className="text-emerald-600 dark:text-emerald-400">4 - 7: Optimal Window</span>
                    <span className="text-amber-600 dark:text-amber-400">8 - 10: Hyperarousal</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Zone Information Card */}
              {}
              <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${currentZone.cardBg} border space-y-3 transition-all`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {currentZone.id === 'hyper' && <Zap className="w-5 h-5 text-amber-600" />}
                    {currentZone.id === 'optimal' && <Shield className="w-5 h-5 text-emerald-600" />}
                    {currentZone.id === 'hypo' && <Moon className="w-5 h-5 text-indigo-600" />}
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {lang === 'lt' ? currentZone.nameLt : currentZone.nameEn}
                    </h3>
                  </div>

                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 italic">
                    {lang === 'lt' ? currentZone.sympatheticLt : currentZone.sympathetic}
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {lang === 'lt' ? currentZone.descLt : currentZone.descEn}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                      {lang === 'lt' ? '🧘‍♂️ Kūno signalai (Somatika):' : '🧘‍♂️ Somatic Signals:'}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {lang === 'lt' ? currentZone.somaticLt : currentZone.somaticEn}
                    </span>
                  </div>

                  <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                      {lang === 'lt' ? '💡 Reguliavimo rekomendacija:' : '💡 Regulation Coping Suggestion:'}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {lang === 'lt' ? currentZone.copingLt : currentZone.copingEn}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* EMOTIONS, SOMATIC TAGS & NOTES FORM */}
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Emotions Tag Selector */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{lang === 'lt' ? 'Emocinė būsena (Žymės)' : 'Emotional Tags'}</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {selectedEmotions.length} {lang === 'lt' ? 'pasirinkta' : 'selected'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {EMOTION_TAGS.map((tag) => {
                    const isSelected = selectedEmotions.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleEmotion(tag.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{lang === 'lt' ? tag.labelLt : tag.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Somatic Tag Selector */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-500" />
                    <span>{lang === 'lt' ? 'Kūno pojūčiai (Somatika)' : 'Physical Sensations'}</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {selectedSomatics.length} {lang === 'lt' ? 'pasirinkta' : 'selected'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {SOMATIC_TAGS.map((tag) => {
                    const isSelected = selectedSomatics.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleSomatic(tag.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{lang === 'lt' ? tag.labelLt : tag.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* NOTES & SAVE ACTION BAR */}
            {}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>{lang === 'lt' ? 'Kontekstas ir Triggeriai (Užrašai)' : 'Notes & Triggers Context'}</span>
              </h3>

              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={
                  lang === 'lt'
                    ? 'Kas lėmė šią būseną? Įvykiai, mintys, aplinka, miego kokybė...'
                    : 'What contributed to this state? Events, sleep quality, triggers, environment...'
                }
                className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEntry}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:from-teal-700 hover:to-emerald-700 active:scale-95 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>{lang === 'lt' ? 'Išsaugoti įrašą' : 'Save Entry'}</span>
                  </button>

                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                      ✓ {lang === 'lt' ? 'Įrašas išsaugotas!' : 'Entry Saved!'}
                    </span>
                  )}
                </div>

                {logs[selectedDate]?.[selectedSlot] && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlotEntry(selectedSlot)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{lang === 'lt' ? 'Ištrinti šį įrašą' : 'Delete Slot'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* DAILY OVERVIEW CARDS FOR ALL 3 SLOTS */}
            {}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>
                  {lang === 'lt' ? 'Dienos laiko slotų apžvalga' : 'Daily Slot Status Summary'} ({formatDisplayDate(selectedDate, lang)})
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIME_SLOTS.map((slot) => {
                  const entry = logs[selectedDate]?.[slot.id];
                  const Icon = slot.icon;
                  const zone = entry ? getZoneForLevel(entry.level) : null;

                  return (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        selectedSlot === slot.id
                          ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-slate-500" />
                          <span className="font-bold text-xs uppercase tracking-wide text-slate-800 dark:text-slate-200">
                            {lang === 'lt' ? slot.labelLt : slot.labelEn}
                          </span>
                        </div>
                        {entry && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${zone?.badgeBg}`}>
                            Lvl {entry.level}
                          </span>
                        )}
                      </div>

                      {entry ? (
                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {lang === 'lt' ? zone?.nameLt : zone?.nameEn}
                          </p>
                          {entry.emotions?.length > 0 && (
                            <p className="truncate">
                              <strong className="text-slate-500">Emotions: </strong>
                              {entry.emotions.map(e => EMOTION_TAGS.find(t => t.id === e)?.[lang === 'lt' ? 'labelLt' : 'labelEn']).join(', ')}
                            </p>
                          )}
                          {entry.note && (
                            <p className="italic text-slate-500 line-clamp-2">
                              "{entry.note}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic py-2">
                          {lang === 'lt' ? 'Įrašo nėra. Spustelėkite norėdami įvesti.' : 'No entry logged. Click to fill.'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: VISUAL ANALYTICS & DASHBOARD */}
        {}
        {activeTab === 'analytics' && (
          <div className="space-y-6">

            {/* KEY METRICS SUMMARY ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {lang === 'lt' ? 'Tolerancijos Lange' : 'Optimal Zone Time'}
                  </span>
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {analyticsData.optimalPct}%
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'lt' ? 'Lygiai 4 - 7' : 'Levels 4 - 7'}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-2xl">
                  <Shield className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {lang === 'lt' ? 'Hiper-sujaudinimas' : 'Hyperarousal'}
                  </span>
                  <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                    {analyticsData.hyperPct}%
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'lt' ? 'Lygiai 8 - 10' : 'Levels 8 - 10'}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-2xl">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {lang === 'lt' ? 'Hipo-sujaudinimas' : 'Hypoarousal'}
                  </span>
                  <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {analyticsData.hypoPct}%
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'lt' ? 'Lygiai 1 - 3' : 'Levels 1 - 3'}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-2xl">
                  <Moon className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {lang === 'lt' ? 'Iš viso įrašų' : 'Total Entries Logged'}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {analyticsData.totalEntries}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'lt' ? 'Registruoti laiko slotai' : 'Recorded slots'}
                  </p>
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* 14-DAY TIMELINE MATRIX VISUALIZATION */}
            {}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {lang === 'lt' ? '14 Dienų Būsenos Dinamika' : '14-Day Zone State Matrix'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'lt' ? 'Rytinis, dieninis ir vakarinis sujaudinimo lygis laike' : 'Morning, Midday and Evening emotional levels mapped over time'}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span>Hypo (1-3)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Optimal (4-7)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Hyper (8-10)</span>
                  </span>
                </div>
              </div>

              {analyticsData.timeline.length > 0 ? (
                <div className="overflow-x-auto pb-2">
                  <div className="min-w-[600px] space-y-2">
                    {analyticsData.timeline.map((dayItem) => (
                      <div
                        key={dayItem.dateStr}
                        onClick={() => {
                          setSelectedDate(dayItem.dateStr);
                          setActiveTab('log');
                        }}
                        className="grid grid-cols-12 items-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div className="col-span-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {dayItem.displayDate}
                        </div>

                        <div className="col-span-9 grid grid-cols-3 gap-2">
                          {['morning', 'midday', 'evening'].map((slotId) => {
                            const entry = dayItem[slotId];
                            const zone = entry ? getZoneForLevel(entry.level) : null;
                            const slotName = TIME_SLOTS.find(s => s.id === slotId)?.[lang === 'lt' ? 'labelLt' : 'labelEn'];

                            return (
                              <div
                                key={slotId}
                                className={`h-9 rounded-lg flex items-center justify-between px-3 text-xs font-bold border transition ${
                                  entry
                                    ? zone?.badgeBg
                                    : 'bg-slate-100 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700 text-slate-400'
                                }`}
                              >
                                <span className="opacity-80 text-[10px] uppercase font-semibold">{slotName}</span>
                                {entry ? (
                                  <span>Lvl {entry.level}</span>
                                ) : (
                                  <span className="font-normal text-[10px] italic">-</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400 py-8">
                  {lang === 'lt' ? 'Nėra pakankamai įrašų statistikai rodyta.' : 'No history available to render timeline matrix.'}
                </p>
              )}
            </div>

            {/* FREQUENT EMOTIONS & DATA IMPORT/EXPORT TOOLS */}
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Emotion Frequency Distribution */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>{lang === 'lt' ? 'Dažniausios Emocinės Būsenos' : 'Most Frequent Emotions'}</span>
                </h3>

                <div className="space-y-2">
                  {Object.entries(analyticsData.emotionFreq).length > 0 ? (
                    Object.entries(analyticsData.emotionFreq)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([tagId, count]) => {
                        const tag = EMOTION_TAGS.find(t => t.id === tagId);
                        if (!tag) return null;
                        const pct = Math.round((count / analyticsData.totalEntries) * 100) || 0;

                        return (
                          <div key={tagId} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-800 dark:text-slate-200">
                                {lang === 'lt' ? tag.labelLt : tag.labelEn}
                              </span>
                              <span className="text-slate-500">{count}x ({pct}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                                style={{ width: `${Math.min(pct * 2, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-xs text-slate-400 italic py-4">
                      {lang === 'lt' ? 'Užregistruokite emocijų žymes logineryje.' : 'Log entries with emotion tags to view frequency distribution.'}
                    </p>
                  )}
                </div>
              </div>

              {/* LocalStorage Data Tools */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    <span>{lang === 'lt' ? 'Duomenų Valdymas ir Atsarginė Kopija' : 'Data Management & Privacy'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'lt'
                      ? 'Visi duomenys saugomi naršyklės LocalStorage privačiai. Galite eksportuoti arba įkelti JSON atsarginę kopiją.'
                      : 'All logs are saved client-side in LocalStorage. Export or import JSON backups for complete privacy.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4">
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                  >
                    <Download className="w-4 h-4 text-teal-600" />
                    <span>{lang === 'lt' ? 'Eksportuoti JSON' : 'Export Backup'}</span>
                  </button>

                  <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>{lang === 'lt' ? 'Importuoti JSON' : 'Import JSON'}</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <button
                    onClick={handleClearData}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'lt' ? 'Išvalyti visus duomenis' : 'Clear All History'}</span>
                  </button>
                  <span className="text-[10px] text-slate-400">Storage key: wot_daily_logs_v1</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: INTERACTIVE GROUNDING TOOLS & BREATH PACER */}
        {}
        {activeTab === 'grounding' && (
          <GroundingToolSection lang={lang} />
        )}

        {/* TAB 4: PSYCHOLOGICAL FRAMEWORK GUIDE */}
        {}
        {activeTab === 'guide' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {lang === 'lt' ? 'Kas yra Tolerancijos Lango Metodas?' : 'What is the Window of Tolerance Framework?'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {lang === 'lt'
                  ? 'Konsepsiją sukūrė dr. Dan Siegel (paskelbta Polyvagal teorijos kontekste).'
                  : 'Developed by Dr. Dan Siegel to describe normal neurological arousal boundaries.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                  <Zap className="w-5 h-5" />
                  <h3>1. Hyperarousal (8 - 10)</h3>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  {lang === 'lt'
                    ? 'Simpatinė nervų sistema per daug suaktyvinta. Būdinga kova arba bėgimas (fight/flight). Pasireiškia nerimu, pykčiu, skriejančiomis mintimis ir panika.'
                    : 'The sympathetic nervous system is overly active (Fight/Flight). Characterized by anxiety, anger, hyper-vigilance, and overwhelm.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                  <Shield className="w-5 h-5" />
                  <h3>2. Optimal Zone (4 - 7)</h3>
                </div>
                <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  {lang === 'lt'
                    ? 'Ventralinė klajoklio nervo šaka veikia optimaliai. Jautiesi saugus, ramus, gebantis mąstyti ir lanksčiai reaguoti į streso veiksnius.'
                    : 'Ventral vagal system is active. You feel safe, calm, emotionally regulated, and resilient to daily life stressors.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold">
                  <Moon className="w-5 h-5" />
                  <h3>3. Hypoarousal (1 - 3)</h3>
                </div>
                <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  {lang === 'lt'
                    ? 'Dorsalinė klajoklio nervo šaka suaktyvina sustingimą (freeze/collapse). Pasireiškia emociniu nutirpimu, smegenų rūku, išsekimu ir atsiribojimu.'
                    : 'Dorsal vagal shutdown (Freeze/Collapse). Characterized by emotional numbness, fatigue, dissociation, and low energy.'}
                </p>
              </div>

            </div>

            {/* Somatic & Regulation Strategies Guidance */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>
                  {lang === 'lt' ? 'Kaip naudotis dienoraščiu kasdieninėje praktikoje?' : 'How to integrate this framework into daily routine?'}
                </span>
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-5 leading-relaxed">
                <li>
                  <strong>{lang === 'lt' ? 'Žymėkite 3 kartus per dieną:' : 'Log 3 times daily:'}</strong> {lang === 'lt' ? 'Rytą, dieną ir vakarą, kad pastebėtumėte savo nervų sistemos svyravimus.' : 'Morning, Midday, and Evening to notice natural autonomic rhythms.'}
                </li>
                <li>
                  <strong>{lang === 'lt' ? 'Jei esate Hiper zonoje:' : 'When in Hyperarousal:'}</strong> {lang === 'lt' ? 'Naudokite ilgesnį iškvėpimą (pvz. 4-7-8 kvėpavimą) ir šaltą vandenį ant veido.' : 'Use prolonged exhales (4-7-8 pattern) and somatic pressure.'}
                </li>
                <li>
                  <strong>{lang === 'lt' ? 'Jei esate Hipo zonoje:' : 'When in Hypoarousal:'}</strong> {lang === 'lt' ? 'Švelniai judinkite kūną, apsižvalgykite aplinkui, atlikite 5-4-3-2-1 juslių pratimą.' : 'Engage sensory inputs, stretch gently, and use energizing breaths.'}
                </li>
              </ul>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}

function GroundingToolSection({ lang }) {
  const [selectedExercise, setSelectedExercise] = useState('box'); // 'box' | '478' | 'energize'
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [timerCount, setTimerCount] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  const timerRef = useRef(null);

  const exercises = {
    box: {
      nameEn: 'Box Breathing (4-4-4-4)',
      nameLt: 'Kvadratinis Kvėpavimas (4-4-4-4)',
      descEn: 'Balances the nervous system and restores focus.',
      descLt: 'Užtikrina nervų sistemos pusiausvyrą ir grąžina dėmesį.',
      phases: [
        { nameEn: 'Inhale', nameLt: 'Įkvėpkite', duration: 4 },
        { nameEn: 'Hold', nameLt: 'Sulaikykite', duration: 4 },
        { nameEn: 'Exhale', nameLt: 'Iškvėpkite', duration: 4 },
        { nameEn: 'Hold', nameLt: 'Sulaikykite', duration: 4 }
      ]
    },
    '478': {
      nameEn: '4-7-8 Relaxing Breath',
      nameLt: '4-7-8 Raminantis Kvėpavimas',
      descEn: 'Rapidly reduces high anxiety and hyperarousal.',
      descLt: 'Greitai mažina nerimą ir perteklinį sujaudinimą.',
      phases: [
        { nameEn: 'Inhale', nameLt: 'Įkvėpkite', duration: 4 },
        { nameEn: 'Hold', nameLt: 'Sulaikykite', duration: 7 },
        { nameEn: 'Exhale', nameLt: 'Lėtai iškvėpkite', duration: 8 }
      ]
    },
    energize: {
      nameEn: 'Energizing Awakening Breath (4-2-4)',
      nameLt: 'Žadinantis Kvėpavimas Hipo Zonoje (4-2-4)',
      descEn: 'Helps lift brain fog and gently awaken from freeze.',
      descLt: 'Padeda išsklaidyti smegenų rūką ir pažadinti kūną.',
      phases: [
        { nameEn: 'Inhale Deeply', nameLt: 'Giliai įkvėpkite', duration: 4 },
        { nameEn: 'Pause', nameLt: 'Pauzė', duration: 2 },
        { nameEn: 'Exhale Rapidly', nameLt: 'Energingai iškvėpkite', duration: 4 }
      ]
    }
  };

  const activeEx = exercises[selectedExercise];

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    let phaseIdx = 0;
    let currentPhase = activeEx.phases[0];
    setPhase(lang === 'lt' ? currentPhase.nameLt : currentPhase.nameEn);
    setTimerCount(currentPhase.duration);

    timerRef.current = setInterval(() => {
      setTimerCount((prev) => {
        if (prev > 1) return prev - 1;

        // Transition to next phase
        phaseIdx = (phaseIdx + 1) % activeEx.phases.length;
        if (phaseIdx === 0) {
          setCycleCount(c => c + 1);
        }
        const nextPhase = activeEx.phases[phaseIdx];
        setPhase(lang === 'lt' ? nextPhase.nameLt : nextPhase.nameEn);
        return nextPhase.duration;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, selectedExercise, lang]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* BREATH PACER CARD */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6 text-center">
        
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
            <Wind className="w-5 h-5 text-teal-500" />
            <span>{activeEx[lang === 'lt' ? 'nameLt' : 'nameEn']}</span>
          </h2>
          <p className="text-xs text-slate-500">{activeEx[lang === 'lt' ? 'descLt' : 'descEn']}</p>
        </div>

        {/* Exercise Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          {Object.keys(exercises).map((key) => (
            <button
              key={key}
              onClick={() => {
                setIsPlaying(false);
                setSelectedExercise(key);
                setCycleCount(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedExercise === key
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {exercises[key][lang === 'lt' ? 'nameLt' : 'nameEn']}
            </button>
          ))}
        </div>

        {/* Visual Animated Breathing Circle */}
        {}
        <div className="py-8 flex flex-col items-center justify-center relative">
          <div
            className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center border-4 border-teal-400/30 transition-all duration-1000 ${
              isPlaying
                ? phase.includes('Inhale') || phase.includes('Įkvėpkite')
                  ? 'scale-110 bg-teal-500/20 border-teal-500 shadow-2xl shadow-teal-500/30'
                  : phase.includes('Exhale') || phase.includes('iškvėpkite')
                  ? 'scale-90 bg-indigo-500/10 border-indigo-400'
                  : 'scale-100 bg-emerald-500/15 border-emerald-500'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
            }`}
          >
            <span className="text-sm font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              {isPlaying ? phase : (lang === 'lt' ? 'Pasiruošę?' : 'Ready?')}
            </span>

            <span className="text-4xl sm:text-5xl font-black my-1 text-slate-900 dark:text-white">
              {isPlaying ? timerCount : '4'}
            </span>

            <span className="text-[11px] font-semibold text-slate-400">
              {lang === 'lt' ? `Ciklai: ${cycleCount}` : `Cycles completed: ${cycleCount}`}
            </span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isPlaying ? (lang === 'lt' ? 'Sustabdyti' : 'Pause') : (lang === 'lt' ? 'Pradėti kvėpavimą' : 'Start Pacer')}</span>
          </button>
        </div>

      </div>

      {/* 5-4-3-2-1 SOMATIC GROUNDING CHECKLIST */}
      {}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>{lang === 'lt' ? '5-4-3-2-1 Juslių Įsižeminimas' : '5-4-3-2-1 Sensory Grounding'}</span>
        </h3>

        <p className="text-xs text-slate-500">
          {lang === 'lt'
            ? 'Atlikite šį pratimą, kai jaučiate disociaciją, perdegimą ar didelį nerimą.'
            : 'Focus on your environment to bring your nervous system back to the present moment.'}
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">👀 5 {lang === 'lt' ? 'dalykai, kuriuos MATOTE:' : 'things you SEE:'}</strong>
            <span className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Pastebėkite spalvas, šviesą, daiktus patalpoje.' : 'Look around for small details or objects.'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="text-teal-600 dark:text-teal-400 block mb-0.5">✋ 4 {lang === 'lt' ? 'dalykai, kuriuos JAUČIATE:' : 'things you CAN TOUCH:'}</strong>
            <span className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Pėdos ant grindų, drabužių audinys, kėdės atrama.' : 'Feet on the floor, texture of your desk.'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">👂 3 {lang === 'lt' ? 'garsai, kuriuos GIRDIRTE:' : 'things you HEAR:'}</strong>
            <span className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Kompiuterio ūžesys, paukščiai lauke, kvėpavimas.' : 'Background hum, birds, distant footsteps.'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="text-amber-600 dark:text-amber-400 block mb-0.5">👃 2 {lang === 'lt' ? 'kvapai, kuriuos UŽUODŽIATE:' : 'things you SMELL:'}</strong>
            <span className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Kava, šviežias oras, kvepalai.' : 'Coffee, fresh air, wood.'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="text-rose-600 dark:text-rose-400 block mb-0.5">👅 1 {lang === 'lt' ? 'skonis, kurį JAUČIATE:' : 'thing you TASTE:'}</strong>
            <span className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Arbatos gurkšnis arba burnos gaiva.' : 'Water, mint, or residual flavor.'}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
