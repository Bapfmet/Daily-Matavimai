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

function generateDemoData() {
  const records = [];
  const today = new Date();

  // Create 14 realistic historical days
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateISO(d);

    let morningScore, morningTime, morningNotes;
    let middayScore, middayTime, middayNotes;
    let eveningScore, eveningTime, eveningNotes;

    if (i === 0) {
      // Today: Morning and Midday logged, Evening pending/missed
      morningScore = 6;
      morningTime = '08:15';
      morningNotes = 'Slept well, felt calm';
      middayScore = 8;
      middayTime = '13:30';
      middayNotes = 'Work deadline stress';
      eveningScore = 'MISSED';
      eveningTime = 'MISSED';
      eveningNotes = '';
    } else if (i === 1) {
      // Yesterday: Morning missed, Midday & Evening logged
      morningScore = 'MISSED';
      morningTime = 'MISSED';
      morningNotes = '';
      middayScore = 5;
      middayTime = '14:00';
      middayNotes = 'Lunch walk helped balance';
      eveningScore = 4;
      eveningTime = '20:45';
      eveningNotes = 'Relaxing reading session';
    } else if (i === 2) {
      // Fully optimal day
      morningScore = 7;
      morningTime = '07:45';
      morningNotes = 'Morning tea & breathing';
      middayScore = 6;
      middayTime = '12:30';
      middayNotes = 'Productive team sync';
      eveningScore = 5;
      eveningTime = '21:15';
      eveningNotes = 'Grounded evening';
    } else if (i === 3) {
      // High hyperarousal day
      morningScore = 'MISSED';
      morningTime = 'MISSED';
      morningNotes = '';
      middayScore = 9;
      middayTime = '15:10';
      middayNotes = 'Panic surge before presentation';
      eveningScore = 8;
      eveningTime = '19:50';
      eveningNotes = '4-7-8 breathing exercise used';
    } else if (i === 4) {
      // Hypoarousal / exhausted day
      morningScore = 2;
      morningTime = '09:10';
      morningNotes = 'Heavy brain fog & apathy';
      middayScore = 3;
      middayTime = '13:15';
      middayNotes = 'Slow light walk outside';
      eveningScore = 'MISSED';
      eveningTime = 'MISSED';
      eveningNotes = '';
    } else if (i === 5) {
      morningScore = 5;
      morningTime = '08:00';
      morningNotes = 'Steady start';
      middayScore = 'MISSED';
      middayTime = 'MISSED';
      middayNotes = '';
      eveningScore = 6;
      eveningTime = '21:00';
      eveningNotes = 'Grounded';
    } else {
      // Randomized realistic historical pattern
      const rM = Math.random();
      morningScore = rM > 0.3 ? Math.floor(Math.random() * 5) + 3 : 'MISSED';
      morningTime = morningScore !== 'MISSED' ? '08:30' : 'MISSED';
      morningNotes = morningScore !== 'MISSED' ? 'Morning check-in' : '';

      const rMid = Math.random();
      middayScore = rMid > 0.25 ? Math.floor(Math.random() * 6) + 3 : 'MISSED';
      middayTime = middayScore !== 'MISSED' ? '13:15' : 'MISSED';
      middayNotes = middayScore !== 'MISSED' ? 'Midday check-in' : '';

      const rEve = Math.random();
      eveningScore = rEve > 0.35 ? Math.floor(Math.random() * 6) + 3 : 'MISSED';
      eveningTime = eveningScore !== 'MISSED' ? '20:30' : 'MISSED';
      eveningNotes = eveningScore !== 'MISSED' ? 'Evening check-in' : '';
    }

    records.push({
      date: dateStr,
      morningScore,
      morningTime,
      morningNotes: morningNotes || '',
      middayScore,
      middayTime,
      middayNotes: middayNotes || '',
      eveningScore,
      eveningTime,
      eveningNotes: eveningNotes || '',
      updatedAt: new Date(d.getTime() + 18000000).toISOString()
    });
  }

  return records.sort((a, b) => b.date.localeCompare(a.date));
}

export default function WindowOfToleranceApp() {
  const [lang, setLang] = useState('en'); // 'en' | 'lt'
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Flat 7-column records state
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
    return generateDemoData();
  });

  // GitHub REST API Settings State
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

  // Chart Controls State (Phase 4)
  const [timeframe, setTimeframe] = useState('7d'); // '7d' | '30d' | 'all'
  const [connectMissedLines, setConnectMissedLines] = useState(true);

  // Form Logging Inputs State
  const [selectedDate, setSelectedDate] = useState(() => formatDateISO(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(() => detectSlotFromSystemTime());
  const [inputTime, setInputTime] = useState(() => getCurrentTimeFormatted());
  const [selectedScore, setSelectedScore] = useState(5);
  const [inputNotes, setInputNotes] = useState('');

  // Table Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all'); // 'all' | 'missed' | 'hypo' | 'optimal' | 'hyper'

  // Modals & UI States
  const [isGhModalOpen, setIsGhModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });
  
  // Row Editing Modal State
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

      // Enforce auto-resolution to "MISSED" for all earlier unlogged slots
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

      // Update target slot
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

      // 1. Fetch current file to retrieve existing SHA if present
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
        console.log('File does not exist on remote yet, will create new.');
      }

      // 2. PUT request to create or update file
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
    // Sort chronologically ascending for timeline
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
          const shortDate = r.date.slice(5); // "MM-DD"
          const slotAbbr = slot.id === 'morning' ? 'Morn' : slot.id === 'midday' ? 'Mid' : 'Eve';

          points.push({
            date: r.date,
            shortDate,
            slotId: slot.id,
            slotName: slot.nameEn,
            timePointLabel: `${shortDate} - ${slotAbbr}`,
            numericScore,
            isMissed,
            // For continuous Recharts connection when missed points toggle is ON
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

    // Compute active logging streak (consecutive days with at least 1 logged score)
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

  // Data table filtering
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

    let fill = '#10b981'; // optimal
    if (payload.numericScore <= 3) fill = '#6366f1'; // hypo
    if (payload.numericScore >= 8) fill = '#f43f5e'; // hyper

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

          <div className="flex items-center gap-2">
            {/* GitHub Sync Status Badge */}
            <button
              onClick={() => setIsGhModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                ghConfig.token
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>{ghConfig.token ? 'GitHub Configured' : 'Setup GitHub Sync'}</span>
              {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'lt' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{lang === 'en' ? 'LT' : 'EN'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-8">

        {/* TOAST NOTIFICATION FLOATER */}
        {toastMessage && (
          <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold border transition-all animate-bounce ${
            toastMessage.type === 'error'
              ? 'bg-rose-600 text-white border-rose-700'
              : toastMessage.type === 'info'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-emerald-600 text-white border-emerald-700'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.msg}</span>
          </div>
        )}

        {}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {lang === 'lt' ? 'Optimalioje Zonoje' : '% Time in Optimal Window'}
              </span>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {analyticsKPIs.optimalPct}%
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'lt' ? 'Įverčiai tarp 4 ir 7' : 'Scores between 4 and 7'}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {lang === 'lt' ? 'Vidutinis Sujaudinimas' : 'Average Emotional Score'}
              </span>
              <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {analyticsKPIs.avgScore} <span className="text-xs text-slate-400 font-normal">/ 10</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'lt' ? 'Registruotų įrašų vidurkis' : 'Average of valid logs'}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {lang === 'lt' ? 'Laikymosi Rodiklis' : 'Compliance & Missed'}
              </span>
              <h3 className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                {analyticsKPIs.complianceRate}%
              </h3>
              <p className="text-[10px] text-rose-500 font-semibold mt-0.5">
                {analyticsKPIs.totalMissed} {lang === 'lt' ? 'praleisti slotai' : 'missed slots total'}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {lang === 'lt' ? 'Aktyvus Srautas' : 'Logging Streak'}
              </span>
              <h3 className="text-2xl font-black text-amber-500 mt-1">
                {analyticsKPIs.streak} {lang === 'lt' ? 'd' : 'days'}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'lt' ? 'Nepertraukiamos dienos' : 'Consecutive daily logs'}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Flame className="w-6 h-6" />
            </div>
          </div>

        </div>

        {}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'lt' ? 'Emocinės Būsenos Dinamika (Recharts)' : 'Window of Tolerance Emotional Trend'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'lt'
                  ? 'Chronologinė sujaudinimo kitimo linija su spalviniais fono diapazonais'
                  : 'Chronological timeline chart mapped over Hyperarousal, Optimal, and Hypoarousal reference bands.'}
              </p>
            </div>

            {/* Timeframe & Line Controls */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Connect Missed Lines Toggle */}
              <button
                onClick={() => setConnectMissedLines(!connectMissedLines)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                  connectMissedLines
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title="Toggle connecting lines across missed slots"
              >
                {connectMissedLines ? <LinkIcon className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
                <span>{lang === 'lt' ? 'Sujungti praleistus' : 'Connect Missed Dots'}</span>
              </button>

              {/* Timeframe Filter Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                <button
                  onClick={() => setTimeframe('7d')}
                  className={`px-3 py-1 rounded-xl transition ${timeframe === '7d' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500'}`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeframe('30d')}
                  className={`px-3 py-1 rounded-xl transition ${timeframe === '30d' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500'}`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setTimeframe('all')}
                  className={`px-3 py-1 rounded-xl transition ${timeframe === 'all' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500'}`}
                >
                  All
                </button>
              </div>

            </div>
          </div>

          {/* Zone Legend Indicator Bar */}
          <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/50">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Upper: Hyperarousal (8-10)</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Middle: Optimal Window (4-7)</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/50">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>Lower: Hypoarousal (1-3)</span>
            </div>
          </div>

          {/* Recharts Chart Container */}
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartTimelineData} margin={{ top: 10, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={isDarkMode ? 0.15 : 0.4} />
                
                <XAxis
                  dataKey="timePointLabel"
                  tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                  interval="preserveStartEnd"
                  angle={-25}
                  textAnchor="end"
                  height={45}
                />
                
                <YAxis
                  domain={[0.5, 10.5]}
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                  tick={{ fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                />

                {/* Background Reference Zones */}
                {/* 1. Upper Zone: Hyperarousal (8-10) */}
                <ReferenceArea y1={7.5} y2={10.5} fill={isDarkMode ? 'rgba(159,18,57,0.18)' : '#fef2f2'} fillOpacity={0.8} />
                
                {/* 2. Middle Zone: Optimal Window (4-7) */}
                <ReferenceArea y1={3.5} y2={7.5} fill={isDarkMode ? 'rgba(6,78,59,0.18)' : '#f0fdf4'} fillOpacity={0.8} />
                
                {/* 3. Lower Zone: Hypoarousal (1-3) */}
                <ReferenceArea y1={0.5} y2={3.5} fill={isDarkMode ? 'rgba(30,27,75,0.18)' : '#eef2ff'} fillOpacity={0.8} />

                <RechartsTooltip content={<CustomChartTooltip />} />

                {/* Sequential Emotional Line */}
                <Line
                  type="monotone"
                  dataKey="displayChartVal"
                  stroke="#0f766e"
                  strokeWidth={3}
                  connectNulls={connectMissedLines}
                  dot={renderCustomChartDot}
                  activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2, fill: '#0d9488' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </section>

        {}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'lt' ? 'Įvesti Tolerancijos Lango Įrašą' : 'Log Daily Emotional State'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'lt'
                  ? 'Įvedus vėlesnį dienos slotą, neįvesti ankstesni slotai bus automatiškai pažymėti MISSED.'
                  : 'Select date, time slot, and score. Unlogged earlier slots for the date will automatically resolve to MISSED.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-6">

            {/* DATE & TIME CONTROLS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>{lang === 'lt' ? '1. Pasirinkite Data:' : '1. Select Date:'}</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                  className="w-full p-2.5 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'lt' ? '2. Laiko Slotas:' : '2. Select Time Slot:'}</span>
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  {SLOT_CONFIGS.map((slot) => {
                    const Icon = slot.icon;
                    const isSelected = selectedSlot === slot.id;
                    const isDetected = detectSlotFromSystemTime() === slot.id && selectedDate === formatDateISO(new Date());

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`relative flex items-center justify-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {isDetected && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-emerald-600 text-white shadow-xs">
                            System
                          </span>
                        )}
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                        <span>{lang === 'lt' ? slot.nameLt : slot.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* LIKERT RATING SCORE SELECTOR */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'lt' ? '3. Sujaudinimo Lygis (1-10 Likert Skalė):' : '3. Emotional Arousal Rating (1 to 10 Scale):'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'lt' ? 'Mėlyna = Žema energija | Žalia = Optimali | Raudona = Hiper-nerimas' : 'Blue = Hypoarousal | Green = Optimal Tolerance | Red = Hyperarousal'}
                  </p>
                </div>

                {activeZone && (
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${activeZone.bgBadge}`}>
                    {lang === 'lt' ? activeZone.nameLt : activeZone.nameEn}
                  </span>
                )}
              </div>

              {/* 10 Rating Buttons Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const numZone = getZoneByScore(num);
                  const isSelected = selectedScore === num;

                  let btnStyle = numZone.btnDefault;
                  if (isSelected) {
                    btnStyle = numZone.btnActive;
                  }

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedScore(num)}
                      className={`h-12 sm:h-14 rounded-2xl font-extrabold text-base transition-all duration-150 flex flex-col items-center justify-center ${btnStyle}`}
                    >
                      <span>{num}</span>
                      <span className="text-[9px] font-medium opacity-75 hidden sm:block">
                        {num <= 3 ? 'Hypo' : num <= 7 ? 'Optimal' : 'Hyper'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Context Notes & Time Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{lang === 'lt' ? 'Užregistruotas Laikas:' : 'Exact Log Time:'}</span>
                  </label>
                  <input
                    type="time"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    className="w-full p-2.5 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>{lang === 'lt' ? 'Pastabos / Kontekstas (neprivaloma):' : 'Contextual Notes & Somatic Triggers (Optional):'}</span>
                  </label>
                  <input
                    type="text"
                    value={inputNotes}
                    onChange={(e) => setInputNotes(e.target.value)}
                    placeholder={lang === 'lt' ? 'Pvz., Stresas darbe, ramus pasivaikščiojimas...' : 'e.g., Felt nervous before meeting, deep breathing helped...'}
                    className="w-full p-2.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

              </div>

              {/* Somatic Feedback Box */}
              {activeZone && (
                <div className={`p-4 rounded-2xl border space-y-2 transition-all ${activeZone.cardBg}`}>
                  <div className="flex items-center gap-2">
                    {activeZone.id === 'hypo' && <Moon className="w-5 h-5 text-indigo-600" />}
                    {activeZone.id === 'optimal' && <Shield className="w-5 h-5 text-emerald-600" />}
                    {activeZone.id === 'hyper' && <Zap className="w-5 h-5 text-rose-600" />}
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {lang === 'lt' ? activeZone.subtitleLt : activeZone.subtitleEn}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {lang === 'lt' ? activeZone.descLt : activeZone.descEn}
                  </p>

                  <div className="pt-1 text-xs border-t border-slate-200/50 dark:border-slate-800/50">
                    <strong className="text-slate-900 dark:text-slate-100">
                      💡 {lang === 'lt' ? 'Kūno reguliavimo patarimas: ' : 'Somatic Regulation Advice: '}
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      {lang === 'lt' ? activeZone.physioLt : activeZone.physioEn}
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-7 py-3 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white shadow-md shadow-emerald-500/20 active:scale-95 transition"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'lt' ? 'Išsaugoti dienos įrašą' : 'Save Slot Entry'}</span>
              </button>
            </div>

          </form>

        </section>

        {}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'lt' ? '7-Stulpelių Istorijos Registras' : '7-Column Flat Daily History'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                [ Date | Morning Score & Time | Midday Score & Time | Evening Score & Time ]
              </p>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadXLSX}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition"
                title="Download Excel file directly to your device"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download .xlsx</span>
              </button>

              <button
                onClick={handlePushToGitHub}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isSyncing ? 'Syncing...' : 'Sync to GitHub'}</span>
              </button>

              <button
                onClick={handlePullFromGitHub}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Pull GitHub</span>
              </button>

              <button
                onClick={() => setRecords(generateDemoData())}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Seed 14 Days</span>
              </button>
            </div>
          </div>

          {/* Search & Zone Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'lt' ? 'Ieškoti pagal datą...' : 'Filter by date (YYYY-MM)...'}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                {lang === 'lt' ? 'Filtras:' : 'Filter:'}
              </span>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="p-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Entries</option>
                <option value="missed">Has MISSED slots</option>
                <option value="hypo">Has Hypoarousal (1-3)</option>
                <option value="optimal">Has Optimal (4-7)</option>
                <option value="hyper">Has Hyperarousal (8-10)</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4 border-r border-slate-200 dark:border-slate-800">
                    Date
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-950/10">
                    Morning
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-950/10">
                    Morn Time
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-950/10">
                    Midday
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-950/10">
                    Mid Time
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 bg-indigo-50/30 dark:bg-indigo-950/10">
                    Evening
                  </th>
                  <th className="py-3.5 px-3 text-center border-r border-slate-200 dark:border-slate-800 bg-indigo-50/30 dark:bg-indigo-950/10">
                    Eve Time
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => {
                    
                    const renderCell = (scoreVal, timeVal) => {
                      const isMissed = scoreVal === 'MISSED' || scoreVal === null || scoreVal === undefined;

                      if (isMissed) {
                        return {
                          score: (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40">
                              MISSED
                            </span>
                          ),
                          time: <span className="text-[10px] text-rose-400 italic">MISSED</span>
                        };
                      }

                      const zone = getZoneByScore(scoreVal);
                      return {
                        score: (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-black text-xs border ${zone?.bgBadge}`}>
                            {scoreVal}
                          </span>
                        ),
                        time: <span className="font-semibold text-slate-700 dark:text-slate-300">{timeVal || '-'}</span>
                      };
                    };

                    const morn = renderCell(record.morningScore, record.morningTime);
                    const mid = renderCell(record.middayScore, record.middayTime);
                    const eve = renderCell(record.eveningScore, record.eveningTime);

                    return (
                      <tr key={record.date} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                        
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap border-r border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <span>{record.date}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({formatDisplayDate(record.date, lang)})
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">{morn.score}</td>
                        <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">{morn.time}</td>
                        
                        <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">{mid.score}</td>
                        <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">{mid.time}</td>

                        <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">{eve.score}</td>
                        <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">{eve.time}</td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setEditRowData({ ...record })}
                              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                              title="Edit Day Record"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: `Delete record for ${record.date}?`,
                                  message: 'This will purge this entry from history.',
                                  action: () => {
                                    setRecords(prev => prev.filter(r => r.date !== record.date));
                                    setConfirmModal({ isOpen: false, title: '', message: '', action: null });
                                    showToast('Record deleted');
                                  }
                                });
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 transition"
                              title="Delete Row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                      No records found matching filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>

      </main>

      {}
      {isGhModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                  GitHub REST API Sync Settings
                </h3>
              </div>
              <button
                onClick={() => setIsGhModalOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Configure your Personal Access Token (PAT) and repository to automatically read and save Excel (<code className="text-emerald-600">.xlsx</code>) logbooks directly to your GitHub repository.
            </p>

            <div className="space-y-3 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Personal Access Token (PAT):
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={ghConfig.token}
                    onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })}
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Repo Owner / Username:
                  </label>
                  <input
                    type="text"
                    value={ghConfig.owner}
                    onChange={(e) => setGhConfig({ ...ghConfig, owner: e.target.value })}
                    placeholder="octocat"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Repository Name:
                  </label>
                  <input
                    type="text"
                    value={ghConfig.repo}
                    onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                    placeholder="my-tolerance-logs"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    File Path in Repo:
                  </label>
                  <input
                    type="text"
                    value={ghConfig.path}
                    onChange={(e) => setGhConfig({ ...ghConfig, path: e.target.value })}
                    placeholder="data/tolerance_window_logs.xlsx"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Branch:
                  </label>
                  <input
                    type="text"
                    value={ghConfig.branch}
                    onChange={(e) => setGhConfig({ ...ghConfig, branch: e.target.value })}
                    placeholder="main"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsGhModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsGhModalOpen(false);
                  showToast('GitHub configuration saved locally');
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
              >
                Save Settings
              </button>
            </div>

          </div>
        </div>
      )}

      {}
      {editRowData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Edit Entry ({editRowData.date})</span>
              </h3>
              <button onClick={() => setEditRowData(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {SLOT_CONFIGS.map(slot => {
              const scoreKey = `${slot.id}Score`;
              const timeKey = `${slot.id}Time`;
              const notesKey = `${slot.id}Notes`;

              return (
                <div key={slot.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
                    {slot.nameEn} Slot
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500">Score (1-10 or MISSED):</label>
                      <input
                        type="text"
                        value={editRowData[scoreKey] ?? 'MISSED'}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          const num = Number(val);
                          setEditRowData({
                            ...editRowData,
                            [scoreKey]: isNaN(num) || val === '' ? 'MISSED' : num
                          });
                        }}
                        className="w-full p-1.5 rounded-xl border text-xs bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500">Time (HH:MM or MISSED):</label>
                      <input
                        type="text"
                        value={editRowData[timeKey] ?? 'MISSED'}
                        onChange={(e) => setEditRowData({ ...editRowData, [timeKey]: e.target.value })}
                        className="w-full p-1.5 rounded-xl border text-xs bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500">Context Notes:</label>
                    <input
                      type="text"
                      value={editRowData[notesKey] ?? ''}
                      onChange={(e) => setEditRowData({ ...editRowData, [notesKey]: e.target.value })}
                      className="w-full p-1.5 rounded-xl border text-xs bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditRowData(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRecords(prev => {
                    const idx = prev.findIndex(r => r.date === editRowData.date);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = { ...editRowData, updatedAt: new Date().toISOString() };
                      return updated;
                    }
                    return prev;
                  });
                  setEditRowData(null);
                  showToast('Record updated successfully');
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-md"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {confirmModal.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', action: null })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmModal.action && confirmModal.action()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
