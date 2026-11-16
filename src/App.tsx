import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sun,
  Sunrise,
  Sunset,
  Calendar,
  Clock,
  Activity,
  Shield,
  Zap,
  Moon,
  Download,
  Trash2,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Globe,
  Info,
  Brain,
  BarChart2,
  FileSpreadsheet,
  PlusCircle,
  Edit3,
  X,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Github,
  Key,
  Database,
  Upload,
  FileText,
  Settings,
  ArrowUpDown,
  Eye,
  Link as LinkIcon,
  Unlink,
  Layers,
  Flame,
  TrendingUp,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceArea
} from 'recharts';

const STORAGE_KEY_RECORDS = 'window_of_tolerance_phase4_logs';
const STORAGE_KEY_GITHUB = 'window_of_tolerance_github_config';

// 20 records imported directly from Tolerance_Window_Logs_2026-10-14.xlsx
const INITIAL_RECORDS = [
  {
    "date": "2026-11-16",
    "morningScore": 6,
    "morningTime": "08:04",
    "morningNotes": "super gera nuotaika, labai gerai praleidau laika universitete",
    "middayScore": 6,
    "middayTime": "17:27",
    "middayNotes": "su orestu prijapinau, labai stipri rysi siandien pajauciau",
    "eveningScore": 7,
    "eveningTime": "19:31",
    "eveningNotes": "iki siol isleika dekingumas",
    "updatedAt": "2026-11-16T15:33:59.695Z"
  },
  {
    "date": "2026-11-10",
    "morningScore": 5,
    "morningTime": "10:45",
    "morningNotes": "ramus rytas, full chill",
    "middayScore": "MISSED",
    "middayTime": "MISSED",
    "middayNotes": "",
    "eveningScore": "MISSED",
    "eveningTime": "MISSED",
    "eveningNotes": "",
    "updatedAt": "2026-11-16T15:26:15.529Z"
  },
  {
    "date": "2026-11-09",
    "morningScore": 8,
    "morningTime": "10:45",
    "morningNotes": "stresas del refleksijos ir atisiskaitymo",
    "middayScore": 7,
    "middayTime": "10:46",
    "middayNotes": "atsisiskaiciau, reikia tik pataisu",
    "eveningScore": 7,
    "eveningTime": "22:48",
    "eveningNotes": "lolas visa diena",
    "updatedAt": "2026-11-10T08:47:34.176Z"
  },
  {
    "date": "2026-11-08",
    "morningScore": 3,
    "morningTime": "06:50",
    "morningNotes": "stresas del interview, ziauriai daug visko ir mazai laiko",
    "middayScore": 8,
    "middayTime": "22:51",
    "middayNotes": "bandau spet trasncriba",
    "eveningScore": 9,
    "eveningTime": "06:48",
    "eveningNotes": "ruosiuosiu interview atlikti",
    "updatedAt": "2026-11-10T08:52:04.139Z"
  },
  {
    "date": "2026-11-07",
    "morningScore": "MISSED",
    "morningTime": "MISSED",
    "morningNotes": "",
    "middayScore": 5,
    "middayTime": "13:51",
    "middayNotes": "interview prep, bandau atsisiusti visa iranga transkribam",
    "eveningScore": "MISSED",
    "eveningTime": "MISSED",
    "eveningNotes": "",
    "updatedAt": "2026-11-10T08:52:52.588Z"
  },
  {
    "date": "2026-10-27",
    "morningScore": 5,
    "morningTime": "09:10",
    "morningNotes": "",
    "middayScore": 6,
    "middayTime": "15:43",
    "middayNotes": "meeh",
    "eveningScore": 7,
    "eveningTime": "21:46",
    "eveningNotes": "su draugais pakalbejau, jauciu tokia siluma ir jaukuma",
    "updatedAt": "2026-11-16T15:25:54.372Z"
  },
  {
    "date": "2026-10-23",
    "morningScore": 4,
    "morningTime": "9:12",
    "morningNotes": "labai ramiai jauciuosi",
    "middayScore": 9,
    "middayTime": "15:04",
    "middayNotes": "big hype omg goin out with FREINNNNND",
    "eveningScore": 2,
    "eveningTime": "21:36",
    "eveningNotes": "Labai patenkintas diena, taciau labai pavarges",
    "updatedAt": "2026-11-16T15:23:36.503Z"
  },
  {
    "date": "2026-10-19",
    "morningScore": 6,
    "morningTime": "MISSED",
    "morningNotes": "",
    "middayScore": 7,
    "middayTime": "MISSED",
    "middayNotes": "",
    "eveningScore": 7,
    "eveningTime": "MISSED",
    "eveningNotes": "",
    "updatedAt": "2026-11-16T15:38:07.457Z"
  },
  {
    "date": "2026-10-18",
    "morningScore": 4,
    "morningTime": "MISSED",
    "morningNotes": "",
    "middayScore": 5,
    "middayTime": "MISSED",
    "middayNotes": "",
    "eveningScore": 6,
    "eveningTime": "MISSED",
    "eveningNotes": "",
    "updatedAt": "2026-11-16T15:39:26.625Z"
  },
  {
    "date": "2026-10-17",
    "morningScore": 7,
    "morningTime": "11:15",
    "morningNotes": "super gera nuotaika, praeita savaite buvo pilna ir apatijos ir gilaus liudesio",
    "middayScore": 4,
    "middayTime": "17:41",
    "middayNotes": "truputi pavarges",
    "eveningScore": 6,
    "eveningTime": "20:21",
    "eveningNotes": "labai pasikroviau pagrojas gitara",
    "updatedAt": "2026-11-16T15:22:31.460Z"
  },
  {
    "date": "2026-10-16",
    "morningScore": 5,
    "morningTime": "MISSED",
    "morningNotes": "",
    "middayScore": 4,
    "middayTime": "MISSED",
    "middayNotes": "",
    "eveningScore": 6,
    "eveningTime": "MISSED",
    "eveningNotes": "",
    "updatedAt": "2026-11-16T15:38:23.683Z"
  },
  {
    "date": "2026-10-14",
    "morningScore": 6,
    "morningTime": "MISSED",
    "morningNotes": "",
    "middayScore": 7,
    "middayTime": "MISSED",
    "middayNotes": "",
    "eveningScore": 4,
    "eveningTime": "MISSED",
    "eveningNotes": "",
    "updatedAt": "2026-11-16T15:38:27.662Z"
  },
  {
    "date": "2026-10-13",
    "morningScore": 5,
    "morningTime": "MISSED",
    "morningNotes": "",
    "middayScore": 6,
    "middayTime": "MISSED",
    "middayNotes": "",
    "eveningScore": 2,
    "eveningTime": "19:12",
    "eveningNotes": "nieko neivyko siandein, taciau labai jauciuosi pavarges ir nejudrus",
    "updatedAt": "2026-11-16T15:38:42.176Z"
  },
  {
    "date": "2026-10-09",
    "morningScore": 4,
    "morningTime": "10:18",
    "morningNotes": "Labai fainas rytas, visa laika siandien skiriu mokymuisi r ir darbams",
    "middayScore": 6,
    "middayTime": "17:17",
    "middayNotes": "Padariau bakalauro statistika, ismokau naudotis r ir dar liko keli darbeliai",
    "eveningScore": 6,
    "eveningTime": "21:54",
    "eveningNotes": "league of legend",
    "updatedAt": "2026-11-16T15:21:42.157Z"
  },
  {
    "date": "2026-10-08",
    "morningScore": 5,
    "morningTime": "10:14",
    "morningNotes": "rytas - ramiai ruosiuosi univerui",
    "middayScore": 5,
    "middayTime": "14:15",
    "middayNotes": "univere nebuvau, vaziavau i labaratorija, pabai dziaugiausi darbu",
    "eveningScore": 5,
    "eveningTime": "20:15",
    "eveningNotes": "po dienos jauciuos issiblaskes bet gerai praleides laika, anksti einu miegot",
    "updatedAt": "2026-10-09T14:16:14.555Z"
  },
  {
    "date": "2026-10-07",
    "morningScore": 8,
    "morningTime": "08:55",
    "morningNotes": "Ejau miegoti anksti vakar, labai stipriai jauciau nora ir issibalansuoti ir susidelioti savo diena taip kad ji padetu man klesteti, siandein miegojau ilgiau bet viliuosi kad su ateinanciom dienom bus daugiau jegu buti rysi ne tik su savim bet ir su tuo kas man svarbu (mokslai ir akademinis pazangumas )",
    "middayScore": 1,
    "middayTime": "15:50",
    "middayNotes": "extreme issekimas viduri dienos, per paskaita niekaip neisdeziu, vidiniu resursu irgi nebera",
    "eveningScore": 8,
    "eveningTime": "19:51",
    "eveningNotes": "Pabuvau tarp zmoniu, jauciuos pasikures, po paskaitu issikalbejaau su destytoja apie ateities planus ir darbus, dave nauju pareigu ir labai susijaudinau is dziaugsmo ;DD",
    "updatedAt": "2026-10-07T16:52:03.049Z"
  },
  {
    "date": "2026-10-06",
    "morningScore": 4,
    "morningTime": "08:55",
    "morningNotes": "Labai nenusiteikes eiti i universiteta, bet reikia",
    "middayScore": 7,
    "middayTime": "16:03",
    "middayNotes": "Su draugu gerai pakalbejome, labai pasijaute gyvumas pokalbio ir apciuopeme gilias temas",
    "eveningScore": 1,
    "eveningTime": "08:58",
    "eveningNotes": "DIena jautesi labai pilnavertiska, iki pat vakaro lyg buvo labai reiksminga. Jauciu kad universiteto grafikas labai smarkiai neatitinka mano asmeniniu poreikiu ir kad man reikia pakeisti save rutina taip, kad ji deretu su mano buviu ir lukesciais",
    "updatedAt": "2026-10-07T05:59:11.864Z"
  },
  {
    "date": "2026-10-05",
    "morningScore": 7,
    "morningTime": "09:48",
    "morningNotes": "max good mood super high energy",
    "middayScore": 5,
    "middayTime": "22:03",
    "middayNotes": "pradejau skaityti apie komputacini kognityvine moksla (huge nerd hype)",
    "eveningScore": 7,
    "eveningTime": "23:32",
    "eveningNotes": "breaking bad season 4 binginau omg",
    "updatedAt": "2026-10-05T19:06:59.247Z"
  },
  {
    "date": "2026-10-04",
    "morningScore": 5,
    "morningTime": "09:47",
    "morningNotes": "I universiteta nejau, tai labai gerai jauciuos ;D",
    "middayScore": 6,
    "middayTime": "16:47",
    "middayNotes": "Nieko nedarau, ir prisiminiau kad reikia pildyti",
    "eveningScore": 3,
    "eveningTime": "12:12",
    "eveningNotes": "velyvas vakaras, jau pavarges ,bet gera diena",
    "updatedAt": "2026-10-05T18:48:09.217Z"
  },
  {
    "date": "2026-10-03",
    "morningScore": 3,
    "morningTime": "10:37",
    "morningNotes": "ramus rytas, jauciuos gan issimiegojas ir siektiek nepatiko geltonas alert ryte del drono. rasau su nuovargiu del svetaines kurimo bet ir didziuojuosi savimi",
    "middayScore": 7,
    "middayTime": "16:10",
    "middayNotes": "Sestadienio nuotaikos geros, darbus darau ir viskas laimingai",
    "eveningScore": 4,
    "eveningTime": "12:12",
    "eveningNotes": "siek tiek issekes",
    "updatedAt": "2026-10-05T10:11:31.043Z"
  }
];

// 3 Time Slot definitions with boundary hours
const SLOT_CONFIGS = [
  {
    id: 'morning',
    nameEn: 'Morning',
    nameLt: 'Rytas',
    timeRangeEn: '06:00 - 11:59',
    icon: Sunrise,
    startHour: 6,
    endHour: 12,
    order: 0
  },
  {
    id: 'midday',
    nameEn: 'Midday',
    nameLt: 'Diena',
    timeRangeEn: '12:00 - 17:59',
    icon: Sun,
    startHour: 12,
    endHour: 18,
    order: 1
  },
  {
    id: 'evening',
    nameEn: 'Evening',
    nameLt: 'Vakaras',
    timeRangeEn: '18:00 - 23:59',
    icon: Sunset,
    startHour: 18,
    endHour: 24,
    order: 2
  }
];

const ZONES = {
  HYPO: {
    id: 'hypo',
    range: [1, 2, 3],
    shortName: 'Hypoarousal',
    nameEn: 'Lower Zone: Hypoarousal',
    nameLt: 'Apatinė zona: Hipo-sujaudinimas',
    subtitleEn: 'Freeze / Collapse / Numbness / Exhaustion',
    subtitleLt: 'Sustingimas / Išsekimas / Nutirpimas',
    bgBadge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    barColor: 'from-indigo-500 to-blue-500',
    cardBg: 'bg-gradient-to-br from-indigo-50/90 to-blue-50/60 dark:from-indigo-950/40 dark:to-blue-950/30 border-indigo-200 dark:border-indigo-800/80',
    btnActive: 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/30 scale-105',
    btnDefault: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60',
    descEn: 'Dorsal Vagal Shutdown. Low neurological energy, brain fog, apathy, feeling empty, numb, or disconnected.',
    descLt: 'Dorsalinės klajoklio nervo šakos reakcija. Žema neurologinė energija, smegenų rūkas, pasyvumas, išsekimas.',
    physioEn: 'Up-regulate gently: Rhythmic bilateral movement, splash lukewarm water on face, light stretching, sensory stimulation (citrus/lavender, humming).',
    physioLt: 'Švelnus aktyvinimas: Ritmiški judesiai, šlakstyti veidą vandeniu, lengvas tempimas, pojūčių žadinimas.'
  },
  OPTIMAL: {
    id: 'optimal',
    range: [4, 5, 6, 7],
    shortName: 'Optimal Window',
    nameEn: 'Middle Zone: Optimal Tolerance Window',
    nameLt: 'Vidurinė zona: Optimali tolerancijos ribų zona',
    subtitleEn: 'Grounded / Calm / Present / Emotionally Regulated',
    subtitleLt: 'Ramybė / Įsižeminimas / Lankstumas',
    bgBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    barColor: 'from-emerald-500 to-teal-500',
    cardBg: 'bg-gradient-to-br from-emerald-50/90 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800/80',
    btnActive: 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30 scale-105',
    btnDefault: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60',
    descEn: 'Ventral Vagal Social Engagement. Balanced autonomic nervous system, cognitive clarity, emotional safety, curiosity.',
    descLt: 'Ventralinės klajoklio nervo šakos veikla. Kūno saugumas, aiškus mąstymas, emociškai tvari būsena.',
    physioEn: 'Maintain & Nourish: Mindful deep breathing, creative tasks, meaningful social engagement, gratitude journaling.',
    physioLt: 'Palaikymas: Dėmesingas kvėpavimas, kūryba, bendravimas, dėkingumas.'
  },
  HYPER: {
    id: 'hyper',
    range: [8, 9, 10],
    shortName: 'Hyperarousal',
    nameEn: 'Upper Zone: Hyperarousal',
    nameLt: 'Viršutinė zona: Hiper-sujaudinimas',
    subtitleEn: 'Fight / Flight / Anxiety / Agitation / Overwhelm',
    subtitleLt: 'Kova / Bėgimas / Nerimas / Pyktis',
    bgBadge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    barColor: 'from-amber-500 to-rose-600',
    cardBg: 'bg-gradient-to-br from-amber-50/90 to-rose-50/60 dark:from-amber-950/40 dark:to-rose-950/30 border-rose-200 dark:border-rose-800/80',
    btnActive: 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-lg shadow-rose-500/30 scale-105',
    btnDefault: 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60',
    descEn: 'Sympathetic Nervous System Activation. Fight or flight, racing thoughts, muscle tension, panic, hyper-vigilance.',
    descLt: 'Simpatinės nervų sistemos suaktyvėjimas. Greitas širdies plakimas, įtampa, nerimastingos mintys.',
    physioEn: 'Down-regulate: Extended exhales (4-7-8 breathing), cold water/ice pack on chest, weighted blanket, wall-sit grounding.',
    physioLt: 'Lėtinimas: Ilgesni iškvėpimai (4-7-8 kvėpavimas), šaltas vanduo, sunkumo spaudimas kūne.'
  }
};

function getZoneByScore(score) {
  if (typeof score !== 'number' || isNaN(score)) return null;
  if (score >= 8) return ZONES.HYPER;
  if (score >= 4) return ZONES.OPTIMAL;
  return ZONES.HYPO;
}

function formatDateISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentTimeFormatted() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function detectSlotFromSystemTime() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'midday';
  return 'evening';
}

function formatDisplayDate(dateStr, lang = 'en') {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  if (isNaN(date.getTime())) return dateStr;

  const todayStr = formatDateISO(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateISO(yesterday);

  if (dateStr === todayStr) return lang === 'lt' ? 'Šiandien' : 'Today';
  if (dateStr === yesterdayStr) return lang === 'lt' ? 'Vakar' : 'Yesterday';

  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-US', options);
}

const loadXLSXLibrary = () => {
  return new Promise((resolve, reject) => {
    if (window.XLSX) {
      resolve(window.XLSX);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.async = true;
    script.onload = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error('Failed to load SheetJS XLSX script'));
    document.head.appendChild(script);
  });
};

export default function WindowOfToleranceApp() {
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading records from LocalStorage', e);
    }
    return INITIAL_RECORDS;
  });

  const [ghConfig, setGhConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GITHUB);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading GitHub settings', e);
    }
    return {
      token: '',
      owner: '',
      repo: '',
      path: 'data/tolerance_window_logs.xlsx',
      branch: 'main'
    };
  });

  // Updated default timeframe to 'all'
  const [timeframe, setTimeframe] = useState('all');
  const [connectMissedLines, setConnectMissedLines] = useState(true);

  const [selectedDate, setSelectedDate] = useState(() => formatDateISO(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(() => detectSlotFromSystemTime());
  const [inputTime, setInputTime] = useState(() => getCurrentTimeFormatted());
  const [selectedScore, setSelectedScore] = useState(5);
  const [inputNotes, setInputNotes] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');

  const [isGhModalOpen, setIsGhModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [editRowData, setEditRowData] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed saving records', e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GITHUB, JSON.stringify(ghConfig));
    } catch (e) {
      console.error('Failed saving GitHub settings', e);
    }
  }, [ghConfig]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setInputTime(getCurrentTimeFormatted());
  }, [selectedSlot]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();

    setRecords(prevRecords => {
      const existingIdx = prevRecords.findIndex(r => r.date === selectedDate);
      
      let currentRecord = existingIdx >= 0
        ? { ...prevRecords[existingIdx] }
        : {
            date: selectedDate,
            morningScore: 'MISSED',
            morningTime: 'MISSED',
            morningNotes: '',
            middayScore: 'MISSED',
            middayTime: 'MISSED',
            middayNotes: '',
            eveningScore: 'MISSED',
            eveningTime: 'MISSED',
            eveningNotes: ''
          };

      const targetSlotConfig = SLOT_CONFIGS.find(s => s.id === selectedSlot);
      const targetOrder = targetSlotConfig ? targetSlotConfig.order : 0;

      SLOT_CONFIGS.forEach(slot => {
        if (slot.order < targetOrder) {
          const scoreKey = `${slot.id}Score`;
          const timeKey = `${slot.id}Time`;

          if (
            currentRecord[scoreKey] === undefined ||
            currentRecord[scoreKey] === null ||
            currentRecord[scoreKey] === ''
          ) {
            currentRecord[scoreKey] = 'MISSED';
            currentRecord[timeKey] = 'MISSED';
          }
        }
      });

      currentRecord[`${selectedSlot}Score`] = Number(selectedScore);
      currentRecord[`${selectedSlot}Time`] = inputTime || getCurrentTimeFormatted();
      currentRecord[`${selectedSlot}Notes`] = inputNotes.trim();
      currentRecord.updatedAt = new Date().toISOString();

      let updated;
      if (existingIdx >= 0) {
        updated = [...prevRecords];
        updated[existingIdx] = currentRecord;
      } else {
        updated = [currentRecord, ...prevRecords];
      }

      return updated.sort((a, b) => b.date.localeCompare(a.date));
    });

    setInputNotes('');
    const slotLabel = SLOT_CONFIGS.find(s => s.id === selectedSlot)?.[lang === 'lt' ? 'nameLt' : 'nameEn'];
    showToast(
      lang === 'lt'
        ? `Įrašas išsaugotas (${selectedDate} - ${slotLabel})`
        : `Entry logged for ${selectedDate} (${slotLabel})`
    );
  };

  const generateXLSXBase64 = async (dataRecords) => {
    const XLSX = await loadXLSXLibrary();

    const exportRows = dataRecords.map(r => ({
      'Date': r.date,
      'Morning Score': r.morningScore ?? 'MISSED',
      'Morning Time': r.morningTime ?? 'MISSED',
      'Morning Notes': r.morningNotes || '',
      'Midday Score': r.middayScore ?? 'MISSED',
      'Midday Time': r.middayTime ?? 'MISSED',
      'Midday Notes': r.middayNotes || '',
      'Evening Score': r.eveningScore ?? 'MISSED',
      'Evening Time': r.eveningTime ?? 'MISSED',
      'Evening Notes': r.eveningNotes || '',
      'Updated At': r.updatedAt || new Date().toISOString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet['!cols'] = [
      { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 25 },
      { wch: 14 }, { wch: 14 }, { wch: 25 },
      { wch: 14 }, { wch: 14 }, { wch: 25 },
      { wch: 22 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tolerance Logs');

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
  };

  const handleDownloadXLSX = async () => {
    try {
      const base64 = await generateXLSXBase64(records);
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Tolerance_Window_Logs_${selectedDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(lang === 'lt' ? 'Excel (.xlsx) failas parsisiųstas!' : 'Excel (.xlsx) file downloaded!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'lt' ? 'Klaida generuojant Excel' : 'Failed to export Excel file', 'error');
    }
  };

  const handlePushToGitHub = async () => {
    if (!ghConfig.token || !ghConfig.owner || !ghConfig.repo) {
      showToast(lang === 'lt' ? 'Įveskite GitHub parametrus' : 'Please configure GitHub settings first', 'error');
      setIsGhModalOpen(true);
      return;
    }

    setIsSyncing(true);
    try {
      const base64Content = await generateXLSXBase64(records);
      const url = `https://api.github.com/repos/${ghConfig.owner}/${ghConfig.repo}/contents/${ghConfig.path}`;
      const branch = ghConfig.branch || 'main';

      let sha = null;
      try {
        const getRes = await fetch(`${url}?ref=${branch}`, {
          headers: {
            'Authorization': `Bearer ${ghConfig.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (getRes.ok) {
          const getData = await getRes.json();
          sha = getData.sha;
        }
      } catch (e) {
        console.log('File does not exist on remote yet.');
      }

      const payload = {
        message: `Sync Window of Tolerance logs (${records.length} days)`,
        content: base64Content,
        branch
      };
      if (sha) payload.sha = sha;

      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${ghConfig.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(payload)
      });

      if (!putRes.ok) {
        const errJson = await putRes.json();
        throw new Error(errJson.message || 'GitHub API rejected commit');
      }

      setLastSyncTime(new Date().toLocaleTimeString());
      showToast(lang === 'lt' ? 'Sėkmingai sinchronizuota su GitHub!' : 'Successfully synced .xlsx to GitHub!');
    } catch (err) {
      console.error(err);
      showToast(`GitHub Sync Error: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromGitHub = async () => {
    if (!ghConfig.token || !ghConfig.owner || !ghConfig.repo) {
      showToast(lang === 'lt' ? 'Įveskite GitHub parametrus' : 'Please configure GitHub settings first', 'error');
      setIsGhModalOpen(true);
      return;
    }

    setIsSyncing(true);
    try {
      const XLSX = await loadXLSXLibrary();
      const branch = ghConfig.branch || 'main';
      const url = `https://api.github.com/repos/${ghConfig.owner}/${ghConfig.repo}/contents/${ghConfig.path}?ref=${branch}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${ghConfig.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!res.ok) {
        throw new Error('Remote file not found or invalid GitHub credentials.');
      }

      const fileData = await res.json();
      const cleanBase64 = fileData.content.replace(/\s/g, '');
      const binary = atob(cleanBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const workbook = XLSX.read(bytes.buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const jsonRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const parseScore = (v) => {
        if (v === 'MISSED' || v === undefined || v === null || v === '') return 'MISSED';
        const n = Number(v);
        return isNaN(n) ? 'MISSED' : n;
      };

      const importedRecords = jsonRows.map(row => ({
        date: String(row['Date'] || row['date'] || ''),
        morningScore: parseScore(row['Morning Score']),
        morningTime: String(row['Morning Time'] || 'MISSED'),
        morningNotes: String(row['Morning Notes'] || ''),
        middayScore: parseScore(row['Midday Score']),
        middayTime: String(row['Midday Time'] || 'MISSED'),
        middayNotes: String(row['Midday Notes'] || ''),
        eveningScore: parseScore(row['Evening Score']),
        eveningTime: String(row['Evening Time'] || 'MISSED'),
        eveningNotes: String(row['Evening Notes'] || ''),
        updatedAt: row['Updated At'] || new Date().toISOString()
      })).filter(r => r.date);

      setRecords(importedRecords.sort((a, b) => b.date.localeCompare(a.date)));
      setLastSyncTime(new Date().toLocaleTimeString());
      showToast(lang === 'lt' ? `Atsisiųsta ${importedRecords.length} dienų iš GitHub!` : `Downloaded ${importedRecords.length} days from GitHub!`);
    } catch (err) {
      console.error(err);
      showToast(`GitHub Pull Error: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const chartTimelineData = useMemo(() => {
    const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

    let sliced = sorted;
    if (timeframe === '7d') {
      sliced = sorted.slice(-7);
    } else if (timeframe === '30d') {
      sliced = sorted.slice(-30);
    }

    const points = [];
    sliced.forEach((r) => {
      SLOT_CONFIGS.forEach((slot) => {
        const scoreVal = r[`${slot.id}Score`];
        const timeVal = r[`${slot.id}Time`];
        const notesVal = r[`${slot.id}Notes`];

        if (scoreVal !== undefined && scoreVal !== null && scoreVal !== '') {
          const isMissed = scoreVal === 'MISSED';
          const numericScore = typeof scoreVal === 'number' ? scoreVal : null;
          const shortDate = r.date.slice(5);
          const slotAbbr = slot.id === 'morning' ? 'Morn' : slot.id === 'midday' ? 'Mid' : 'Eve';

          points.push({
            date: r.date,
            shortDate,
            slotId: slot.id,
            slotName: slot.nameEn,
            timePointLabel: `${shortDate} - ${slotAbbr}`,
            numericScore,
            isMissed,
            displayChartVal: isMissed ? (connectMissedLines ? 5 : null) : numericScore,
            time: timeVal || 'MISSED',
            notes: notesVal || ''
          });
        }
      });
    });

    return points;
  }, [records, timeframe, connectMissedLines]);

  const analyticsKPIs = useMemo(() => {
    let totalLogged = 0;
    let totalMissed = 0;
    let sumScore = 0;
    let optimalCount = 0;

    records.forEach(r => {
      [r.morningScore, r.middayScore, r.eveningScore].forEach(s => {
        if (s === 'MISSED') {
          totalMissed++;
        } else if (typeof s === 'number') {
          totalLogged++;
          sumScore += s;
          if (s >= 4 && s <= 7) {
            optimalCount++;
          }
        }
      });
    });

    const totalSlots = totalLogged + totalMissed;
    const optimalPct = totalLogged > 0 ? Math.round((optimalCount / totalLogged) * 100) : 0;
    const avgScore = totalLogged > 0 ? (sumScore / totalLogged).toFixed(1) : 'N/A';
    const complianceRate = totalSlots > 0 ? Math.round((totalLogged / totalSlots) * 100) : 0;

    let streak = 0;
    const sortedDates = [...records].sort((a, b) => b.date.localeCompare(a.date));
    for (const r of sortedDates) {
      const hasLoggedSlot = [r.morningScore, r.middayScore, r.eveningScore].some(s => typeof s === 'number');
      if (hasLoggedSlot) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalDays: records.length,
      optimalPct,
      avgScore,
      totalMissed,
      complianceRate,
      streak
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = searchQuery.trim() === '' || r.date.includes(searchQuery.trim());
      if (!matchesSearch) return false;

      if (zoneFilter === 'all') return true;
      const scores = [r.morningScore, r.middayScore, r.eveningScore];
      if (zoneFilter === 'missed') return scores.includes('MISSED');
      if (zoneFilter === 'hypo') return scores.some(s => typeof s === 'number' && s <= 3);
      if (zoneFilter === 'optimal') return scores.some(s => typeof s === 'number' && s >= 4 && s <= 7);
      if (zoneFilter === 'hyper') return scores.some(s => typeof s === 'number' && s >= 8);
      return true;
    });
  }, [records, searchQuery, zoneFilter]);

  const activeZone = getZoneByScore(selectedScore);

  const renderCustomChartDot = (props) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined) return null;

    if (payload.isMissed) {
      return (
        <g key={`dot-missed-${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={6} stroke="#94a3b8" strokeWidth={2} fill="#ffffff" />
          <circle cx={cx} cy={cy} r={2} fill="#94a3b8" />
        </g>
      );
    }

    let fill = '#10b981';
    if (payload.numericScore <= 3) fill = '#6366f1';
    if (payload.numericScore >= 8) fill = '#f43f5e';

    return (
      <circle
        key={`dot-val-${cx}-${cy}`}
        cx={cx}
        cy={cy}
        r={5}
        stroke="#ffffff"
        strokeWidth={2}
        fill={fill}
      />
    );
  };

  const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const zone = getZoneByScore(data.numericScore);

      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between font-extrabold border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <span className="text-slate-900 dark:text-slate-100">{data.date} ({data.slotName})</span>
            <span className="text-slate-500 font-mono text-[11px]">{data.time}</span>
          </div>

          {data.isMissed ? (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold py-1">
              <AlertTriangle className="w-4 h-4" />
              <span>{lang === 'lt' ? 'Slotas praleistas (MISSED)' : 'Slot Missed / Not Logged'}</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{lang === 'lt' ? 'Sujaudinimo lygis:' : 'Arousal Score:'}</span>
                <span className={`px-2 py-0.5 rounded-md font-extrabold text-xs ${zone?.bgBadge}`}>
                  {data.numericScore} / 10
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {zone?.shortName}
              </div>
              {data.notes && (
                <p className="mt-1.5 text-slate-600 dark:text-slate-300 italic border-l-2 border-teal-500 pl-2 text-[11px]">
                  "{data.notes}"
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleUpdateEditedRow = (e) => {
    e.preventDefault();
    if (!editRowData) return;

    setRecords(prev => {
      const idx = prev.findIndex(r => r.date === editRowData.date);
      if (idx < 0) return prev;
      const copy = [...prev];
      copy[idx] = {
        ...editRowData,
        updatedAt: new Date().toISOString()
      };
      return copy;
    });

    setEditRowData(null);
    showToast(lang === 'lt' ? 'Įrašas atnaujintas' : 'Row updated successfully');
  };

  const handleDeleteRow = (dateStr) => {
    if (window.confirm(lang === 'lt' ? `Ar tikrai ištrinti ${dateStr}?` : `Delete logs for ${dateStr}?`)) {
      setRecords(prev => prev.filter(r => r.date !== dateStr));
      showToast(lang === 'lt' ? 'Ištrinta' : 'Record deleted');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} pb-20`}>
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-600 to-indigo-600 text-white shadow-md shadow-emerald-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 dark:from-teal-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {lang === 'lt' ? 'Tolerancijos Lango Metodas' : 'Window of Tolerance'}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Phase 4 Analytics
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {lang === 'lt'
                  ? 'Vizualinė analitika, Excel (.xlsx) ir GitHub REST API sinchronizavimas'
                  : 'Visual Analytics, Excel (.xlsx) Engine & GitHub REST API Sync'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setIsGhModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition text-xs font-semibold"
            >
              <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>{ghConfig.owner && ghConfig.repo ? `${ghConfig.owner}/${ghConfig.repo}` : 'Configure GitHub'}</span>
            </button>

            <button
              onClick={handleDownloadXLSX}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition text-xs font-semibold"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{lang === 'lt' ? 'Atsisiųsti .xlsx' : 'Export .xlsx'}</span>
            </button>

            <button
              onClick={() => setLang(l => l === 'en' ? 'lt' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold"
            >
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setIsDarkMode(d => !d)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

        </div>
      </header>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold animate-bounce ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
            : 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
        }`}>
          {toastMessage.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 lg:px-8 mt-6 space-y-8">
        
        {/* KPI SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{lang === 'lt' ? 'Iš viso dienų' : 'Total Days'}</span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{analyticsKPIs.totalDays}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{lang === 'lt' ? 'Optimali zona' : 'Optimal Zone'}</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{analyticsKPIs.optimalPct}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{lang === 'lt' ? 'Vid. Score' : 'Avg Score'}</span>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400">{analyticsKPIs.avgScore}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{lang === 'lt' ? 'Praleisti slotai' : 'Missed Slots'}</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{analyticsKPIs.totalMissed}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{lang === 'lt' ? 'Pildymo rodiklis' : 'Compliance'}</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{analyticsKPIs.complianceRate}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{lang === 'lt' ? 'Dienų serija' : 'Streak'}</span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <span>{analyticsKPIs.streak}</span>
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>

        {/* ENTRY INPUT FORM */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 lg:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <PlusCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-extrabold tracking-tight">
                {lang === 'lt' ? 'Naujas Tolerancijos Lango Įrašas' : 'Log Tolerance Window Entry'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-6">
            {/* Slot selector */}
            <div className="grid grid-cols-3 gap-3">
              {SLOT_CONFIGS.map((slot) => {
                const Icon = slot.icon;
                const isSelected = selectedSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 dark:bg-teal-950/60 dark:border-teal-500 dark:text-teal-200 ring-2 ring-teal-400/40'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-extrabold">{lang === 'lt' ? slot.nameLt : slot.nameEn}</span>
                    <span className="text-[10px] opacity-75">{slot.timeRangeEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Score selector 1-10 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-300">
                  {lang === 'lt' ? 'Sujaudinimo Lygis (1-10):' : 'Arousal Score (1-10):'}
                </span>
                {activeZone && (
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${activeZone.bgBadge}`}>
                    {selectedScore} - {lang === 'lt' ? activeZone.nameLt : activeZone.nameEn}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const z = getZoneByScore(num);
                  const isSelected = selectedScore === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedScore(num)}
                      className={`h-11 rounded-xl text-sm font-black transition flex items-center justify-center ${
                        isSelected ? z.btnActive : z.btnDefault
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {activeZone && (
                <div className={`p-4 rounded-2xl border text-xs space-y-1.5 transition ${activeZone.cardBg}`}>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">
                    {lang === 'lt' ? activeZone.subtitleLt : activeZone.subtitleEn}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{lang === 'lt' ? activeZone.descLt : activeZone.descEn}</p>
                  <div className="pt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 border-t border-slate-200/50 dark:border-slate-800/50">
                    <strong>{lang === 'lt' ? 'Rekomenduojama reguliacija: ' : 'Physiological Regulation: '}</strong>
                    {lang === 'lt' ? activeZone.physioLt : activeZone.physioEn}
                  </div>
                </div>
              )}
            </div>

            {/* Time & Notes Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {lang === 'lt' ? 'Laikas:' : 'Time:'}
                </label>
                <input
                  type="text"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                  placeholder="HH:MM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {lang === 'lt' ? 'Pastabos / Pojūčiai:' : 'Notes / Somatic Observations:'}
                </label>
                <input
                  type="text"
                  value={inputNotes}
                  onChange={(e) => setInputNotes(e.target.value)}
                  placeholder={lang === 'lt' ? 'Kaip jaučiatės? Kas nutiko?' : 'Somatic feelings, triggers, or interventions...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition scale-[1.005] active:scale-[0.995]"
            >
              {lang === 'lt' ? 'Išsaugoti Įrašą' : 'Save Log Entry'}
            </button>
          </form>
        </section>

        {/* TIMELINE CHART SECTION */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 lg:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-extrabold tracking-tight">
                {lang === 'lt' ? 'Tolerancijos Lango Dinamikos Grafikas' : 'Tolerance Window Dynamics Chart'}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                {['7d', '30d', 'all'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg transition uppercase ${
                      timeframe === tf
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={connectMissedLines}
                  onChange={(e) => setConnectMissedLines(e.target.checked)}
                  className="rounded-xs text-teal-600 focus:ring-teal-500"
                />
                <span>{lang === 'lt' ? 'Jungti praleistus' : 'Connect missed'}</span>
              </label>
            </div>
          </div>

          <div className="h-72 sm:h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                <XAxis
                  dataKey="timePointLabel"
                  stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  domain={[1, 10]}
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                  stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                  tick={{ fontSize: 10 }}
                />
                <RechartsTooltip content={<CustomChartTooltip />} />

                {/* Zone background shading */}
                <ReferenceArea y1={8} y2={10} fill="#f43f5e" fillOpacity={isDarkMode ? 0.15 : 0.08} />
                <ReferenceArea y1={4} y2={7} fill="#10b981" fillOpacity={isDarkMode ? 0.15 : 0.08} />
                <ReferenceArea y1={1} y2={3} fill="#6366f1" fillOpacity={isDarkMode ? 0.15 : 0.08} />

                <Line
                  type="monotone"
                  dataKey="displayChartVal"
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  dot={renderCustomChartDot}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* LOGS TABLE SECTION */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 lg:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-extrabold tracking-tight">
                {lang === 'lt' ? 'Įrašų Istorija IR Valdymas' : 'Logs History & Record Management'}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'lt' ? 'Ieškoti pagal datą...' : 'Search by date...'}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">{lang === 'lt' ? 'Visos Zonos' : 'All Zones'}</option>
                <option value="optimal">{lang === 'lt' ? 'Optimali (4-7)' : 'Optimal (4-7)'}</option>
                <option value="hypo">{lang === 'lt' ? 'Hipo-sujaudinimas (1-3)' : 'Hypo (1-3)'}</option>
                <option value="hyper">{lang === 'lt' ? 'Hiper-sujaudinimas (8-10)' : 'Hyper (8-10)'}</option>
                <option value="missed">{lang === 'lt' ? 'Turi praleistų' : 'Has Missed'}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">{lang === 'lt' ? 'Data' : 'Date'}</th>
                  <th className="py-3 px-3">{lang === 'lt' ? 'Rytas (06-12)' : 'Morning (06-12)'}</th>
                  <th className="py-3 px-3">{lang === 'lt' ? 'Diena (12-18)' : 'Midday (12-18)'}</th>
                  <th className="py-3 px-3">{lang === 'lt' ? 'Vakaras (18-24)' : 'Evening (18-24)'}</th>
                  <th className="py-3 px-3 text-right">{lang === 'lt' ? 'Veiksmai' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredRecords.map((r) => {
                  const renderSlotBadge = (score, time, notes) => {
                    if (score === 'MISSED' || score === undefined || score === null) {
                      return <span className="text-slate-400 dark:text-slate-600 italic">MISSED</span>;
                    }
                    const z = getZoneByScore(score);
                    return (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md font-black ${z?.bgBadge}`}>
                            {score} / 10
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{time}</span>
                        </div>
                        {notes && (
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[200px]" title={notes}>
                            {notes}
                          </div>
                        )}
                      </div>
                    );
                  };

                  return (
                    <tr key={r.date} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-extrabold whitespace-nowrap text-slate-900 dark:text-slate-100">
                        {r.date}
                        <div className="text-[10px] text-slate-400 font-normal">{formatDisplayDate(r.date, lang)}</div>
                      </td>
                      <td className="py-3 px-3">{renderSlotBadge(r.morningScore, r.morningTime, r.morningNotes)}</td>
                      <td className="py-3 px-3">{renderSlotBadge(r.middayScore, r.middayTime, r.middayNotes)}</td>
                      <td className="py-3 px-3">{renderSlotBadge(r.eveningScore, r.eveningTime, r.eveningNotes)}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditRowData({ ...r })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Edit row"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(r.date)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Delete row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* EDIT ROW MODAL */}
      {editRowData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm">
                {lang === 'lt' ? `Redaguoti ${editRowData.date}` : `Edit Row for ${editRowData.date}`}
              </h3>
              <button onClick={() => setEditRowData(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateEditedRow} className="space-y-4 text-xs">
              {SLOT_CONFIGS.map(slot => (
                <div key={slot.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-extrabold text-teal-600 dark:text-teal-400">
                    {lang === 'lt' ? slot.nameLt : slot.nameEn}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">{lang === 'lt' ? 'Score / Būsena' : 'Score (1-10 or MISSED)'}</label>
                      <input
                        type="text"
                        value={editRowData[`${slot.id}Score`]}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setEditRowData({
                            ...editRowData,
                            [`${slot.id}Score`]: val === 'MISSED' ? 'MISSED' : (isNaN(Number(val)) ? val : Number(val))
                          });
                        }}
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">{lang === 'lt' ? 'Laikas' : 'Time'}</label>
                      <input
                        type="text"
                        value={editRowData[`${slot.id}Time`]}
                        onChange={(e) => setEditRowData({ ...editRowData, [`${slot.id}Time`]: e.target.value })}
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">{lang === 'lt' ? 'Pastabos' : 'Notes'}</label>
                    <input
                      type="text"
                      value={editRowData[`${slot.id}Notes`]}
                      onChange={(e) => setEditRowData({ ...editRowData, [`${slot.id}Notes`]: e.target.value })}
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditRowData(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold"
                >
                  {lang === 'lt' ? 'Atšaukti' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition"
                >
                  {lang === 'lt' ? 'Išsaugoti' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GITHUB SETTINGS MODAL */}
      {isGhModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-extrabold text-sm">
                <Github className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{lang === 'lt' ? 'GitHub API Sinchronizavimas' : 'GitHub REST API Sync Settings'}</span>
              </div>
              <button onClick={() => setIsGhModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400">Personal Access Token (PAT):</label>
                <input
                  type="password"
                  value={ghConfig.token}
                  onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400">Owner (Username):</label>
                  <input
                    type="text"
                    value={ghConfig.owner}
                    onChange={(e) => setGhConfig({ ...ghConfig, owner: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400">Repo Name:</label>
                  <input
                    type="text"
                    value={ghConfig.repo}
                    onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400">Path in Repo:</label>
                  <input
                    type="text"
                    value={ghConfig.path}
                    onChange={(e) => setGhConfig({ ...ghConfig, path: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400">Branch:</label>
                  <input
                    type="text"
                    value={ghConfig.branch}
                    onChange={(e) => setGhConfig({ ...ghConfig, branch: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handlePullFromGitHub}
                disabled={isSyncing}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Pull from GH</span>
              </button>
              <button
                onClick={handlePushToGitHub}
                disabled={isSyncing}
                className="flex-1 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>Push to GH</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
