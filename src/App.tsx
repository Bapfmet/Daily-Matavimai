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

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateISO(d);

    let morningScore, morningTime, morningNotes;
    let middayScore, middayTime, middayNotes;
    let eveningScore, eveningTime, eveningNotes;

    if (i === 0) {
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
      morningScore = 2;
      morningTime = '09:10';
      morningNotes = 'Heavy brain fog & apathy';
      middayScore = 3;
      middayTime = '13:15';
      middayNotes = 'Slow light walk outside';
      eveningScore = 'MISSED';
      eveningTime = 'MISSED';
      eveningNotes = '';
    } else {
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

  const [timeframe, setTimeframe] = useState('7d');
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
            {/* GitHub Sync Status Badge */}
            <button
              onClick={() => setIsGhModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition text-xs font-semibold"
            >
              <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>{ghConfig.owner && ghConfig.repo ? `${ghConfig.owner}/${ghConfig.repo}` : 'Configure GitHub'}</span>
              {ghConfig.token ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            {/* GitHub Sync Push/Pull Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={handlePushToGitHub}
                disabled={isSyncing}
                title="Push to GitHub"
                className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-50"
              >
                <Upload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
              </button>
              <button
                onClick={handlePullFromGitHub}
                disabled={isSyncing}
                title="Pull from GitHub"
                className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'lt' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition text-xs font-bold"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(d => !d)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition text-slate-700 dark:text-slate-300"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-md animate-fade-in ${
          toastMessage.type === 'error'
            ? 'bg-rose-500/90 text-white border-rose-600'
            : 'bg-emerald-600/90 text-white border-emerald-500'
        }`}>
          {toastMessage.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-8">
        
        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold">{analyticsKPIs.streak} {lang === 'lt' ? 'd.' : 'days'}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{lang === 'lt' ? 'Aktyvi serija' : 'Active Streak'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold">{analyticsKPIs.optimalPct}%</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{lang === 'lt' ? 'Optimali zona' : 'Optimal Zone'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold">{analyticsKPIs.avgScore}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{lang === 'lt' ? 'Vid. balas' : 'Avg Score'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold">{analyticsKPIs.complianceRate}%</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{lang === 'lt' ? 'Pildymo rodiklis' : 'Compliance Rate'}</p>
            </div>
          </div>
        </div>

        {/* LOGGING FORM PANEL */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-lg font-bold">{lang === 'lt' ? 'Registruoti Būsenos Įrašą' : 'Log Daily State'}</h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'lt' ? 'Auto-praleidimas atgaliniams slotams' : 'Auto-resolves earlier unlogged slots as MISSED'}
            </span>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lang === 'lt' ? 'Data' : 'Date'}</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Time Slot Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === 'lt' ? 'Dienos Metas (Slotas)' : 'Time Slot'}</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {SLOT_CONFIGS.map(s => {
                    const Icon = s.icon;
                    const isActive = selectedSlot === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSlot(s.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition ${
                          isActive
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-0.5" />
                        <span>{lang === 'lt' ? s.nameLt : s.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specific Time Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === 'lt' ? 'Laikas' : 'Logged Time'}</span>
                </label>
                <input
                  type="time"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Score Selector (1-10) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{lang === 'lt' ? 'Nervų Sistemos Sujaudinimo Lygis (1-10)' : 'Nervous System Arousal Scale (1-10)'}</span>
                </label>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${activeZone?.bgBadge}`}>
                  {selectedScore} - {activeZone?.shortName}
                </span>
              </div>

              <div className="grid grid-cols-10 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
                  const valZone = getZoneByScore(val);
                  const isSelected = selectedScore === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSelectedScore(val)}
                      className={`py-3 rounded-xl font-black text-sm transition-all ${
                        isSelected
                          ? valZone?.btnActive
                          : valZone?.btnDefault
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone Physiological Advice Card */}
            {activeZone && (
              <div className={`p-4 rounded-2xl border ${activeZone.cardBg} space-y-2`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm">{lang === 'lt' ? activeZone.nameLt : activeZone.nameEn}</h4>
                  <span className="text-xs font-semibold opacity-80">{lang === 'lt' ? activeZone.subtitleLt : activeZone.subtitleEn}</span>
                </div>
                <p className="text-xs opacity-90">{lang === 'lt' ? activeZone.descLt : activeZone.descEn}</p>
                <div className="pt-1 text-xs font-bold flex items-start gap-1.5">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <span><strong>{lang === 'lt' ? 'Rekomenduojamas veiksmas: ' : 'Physiological Action: '}</strong>{lang === 'lt' ? activeZone.physioLt : activeZone.physioEn}</span>
                </div>
              </div>
            )}

            {/* Notes Input & Save Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="w-full space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {lang === 'lt' ? 'Užrašai / Šeimininkavimo trigeriai (neprivaloma)' : 'Reflective Notes / Triggers (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'lt' ? 'Pvz., Sunkus susitikimas darbe, kava 15 val...' : 'E.g., Work presentation stress, afternoon coffee...'}
                  value={inputNotes}
                  onChange={(e) => setInputNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 transition shrink-0"
              >
                {lang === 'lt' ? 'Išsaugoti Įrašą' : 'Save Slot Entry'}
              </button>
            </div>
          </form>
        </div>

        {/* TIMELINE CHART SECTION */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-500" />
                <span>{lang === 'lt' ? 'Nervų Sistemos Dinamika' : 'Autonomic Nervous System Timeline'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'lt' ? 'Chromatinė zonų analizė (3 time slotai per dieną)' : 'Color-coded zones with 3 intraday slot intervals'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Connect Missed Lines Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={connectMissedLines}
                  onChange={(e) => setConnectMissedLines(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>{lang === 'lt' ? 'Jungti praleistus' : 'Connect Missed Points'}</span>
              </label>

              {/* Timeframe Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {['7d', '30d', 'all'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                      timeframe === tf
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recharts Chart */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="timePointLabel"
                  tick={{ fontSize: 10 }}
                  stroke="#94a3b8"
                />
                <YAxis
                  domain={[1, 10]}
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                  tick={{ fontSize: 10 }}
                  stroke="#94a3b8"
                />
                <RechartsTooltip content={<CustomChartTooltip />} />

                {/* Hypo Zone Shading (1-3) */}
                <ReferenceArea y1={1} y2={3.5} fill="#6366f1" fillOpacity={0.08} />
                {/* Optimal Zone Shading (4-7) */}
                <ReferenceArea y1={3.5} y2={7.5} fill="#10b981" fillOpacity={0.12} />
                {/* Hyper Zone Shading (8-10) */}
                <ReferenceArea y1={7.5} y2={10} fill="#f43f5e" fillOpacity={0.08} />

                <Line
                  type="monotone"
                  dataKey="displayChartVal"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  connectNulls={true}
                  dot={renderCustomChartDot}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 text-xs font-bold pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span>1-3: Hypoarousal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>4-7: Optimal Window</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>8-10: Hyperarousal</span>
            </div>
          </div>
        </div>

        {/* LOGS DATA TABLE SECTION */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'lt' ? 'Žurnalas ir Eksportas' : 'Data Log Table & Exports'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'lt' ? 'Plokščia 7 stulpelių duomenų struktūra su Excel atitikmeniu' : 'Flat 7-column schema ready for SheetJS XLSX download'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleDownloadXLSX}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'lt' ? 'Atsisiųsti XLSX' : 'Export .xlsx'}</span>
              </button>

              <button
                onClick={handlePushToGitHub}
                disabled={isSyncing}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-sm transition"
              >
                <Github className="w-4 h-4" />
                <span>{lang === 'lt' ? 'Siųsti į GitHub' : 'Push to GitHub'}</span>
              </button>
            </div>
          </div>

          {/* Search & Filter controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'lt' ? 'Iškada pagal datą (YYYY-MM-DD)...' : 'Filter by date (YYYY-MM-DD)...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full pb-1 sm:pb-0">
              {[
                { id: 'all', label: lang === 'lt' ? 'Visi' : 'All' },
                { id: 'optimal', label: 'Optimal (4-7)' },
                { id: 'hypo', label: 'Hypo (1-3)' },
                { id: 'hyper', label: 'Hyper (8-10)' },
                { id: 'missed', label: lang === 'lt' ? 'Praleisti' : 'Missed' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setZoneFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    zoneFilter === f.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 font-extrabold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">{lang === 'lt' ? 'Data' : 'Date'}</th>
                  <th className="p-3.5">{lang === 'lt' ? 'Rytas (Morning)' : 'Morning (06-12)'}</th>
                  <th className="p-3.5">{lang === 'lt' ? 'Diena (Midday)' : 'Midday (12-18)'}</th>
                  <th className="p-3.5">{lang === 'lt' ? 'Vakaras (Evening)' : 'Evening (18-24)'}</th>
                  <th className="p-3.5 text-right">{lang === 'lt' ? 'Veiksmai' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">
                      {lang === 'lt' ? 'Įrašų nerasta' : 'No matching records found'}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => {
                    const renderSlotCell = (score, time, notes) => {
                      if (score === 'MISSED') {
                        return (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono text-[11px] font-bold">
                            MISSED
                          </span>
                        );
                      }
                      const zone = getZoneByScore(score);
                      return (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md font-black text-xs ${zone?.bgBadge}`}>
                              {score}/10
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{time}</span>
                          </div>
                          {notes && <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px] italic">{notes}</p>}
                        </div>
                      );
                    };

                    return (
                      <tr key={r.date} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="p-3.5 font-bold font-mono text-slate-900 dark:text-slate-100">
                          {r.date}
                          <span className="block text-[10px] font-normal text-slate-400">
                            {formatDisplayDate(r.date, lang)}
                          </span>
                        </td>
                        <td className="p-3.5">{renderSlotCell(r.morningScore, r.morningTime, r.morningNotes)}</td>
                        <td className="p-3.5">{renderSlotCell(r.middayScore, r.middayTime, r.middayNotes)}</td>
                        <td className="p-3.5">{renderSlotCell(r.eveningScore, r.eveningTime, r.eveningNotes)}</td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => setEditRowData({ ...r })}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                            title="Edit Record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(r.date)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* GITHUB CONFIGURATION MODAL */}
      {isGhModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-extrabold text-base">{lang === 'lt' ? 'GitHub REST API Parametrai' : 'GitHub REST API Sync Settings'}</h3>
              </div>
              <button
                onClick={() => setIsGhModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'GitHub Personal Access Token' : 'GitHub Token (PAT)'}</label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={ghConfig.token}
                  onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Vartotojas / Org' : 'Owner / Org'}</label>
                  <input
                    type="text"
                    placeholder="octocat"
                    value={ghConfig.owner}
                    onChange={(e) => setGhConfig({ ...ghConfig, owner: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Repozitorija' : 'Repository'}</label>
                  <input
                    type="text"
                    placeholder="tolerance-logs"
                    value={ghConfig.repo}
                    onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Failo kelias' : 'File Path'}</label>
                  <input
                    type="text"
                    placeholder="data/tolerance_window_logs.xlsx"
                    value={ghConfig.path}
                    onChange={(e) => setGhConfig({ ...ghConfig, path: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Šaka' : 'Branch'}</label>
                  <input
                    type="text"
                    placeholder="main"
                    value={ghConfig.branch}
                    onChange={(e) => setGhConfig({ ...ghConfig, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsGhModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {lang === 'lt' ? 'Atšaukti' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setIsGhModalOpen(false);
                  showToast(lang === 'lt' ? 'Nustatymai išsaugoti' : 'GitHub settings saved!');
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs"
              >
                {lang === 'lt' ? 'Išsaugoti' : 'Save Config'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ROW MODAL */}
      {editRowData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base">
                {lang === 'lt' ? `Redaguoti Įrašą (${editRowData.date})` : `Edit Day Record (${editRowData.date})`}
              </h3>
              <button
                onClick={() => setEditRowData(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEditedRow} className="space-y-4 text-xs font-semibold">
              {SLOT_CONFIGS.map((slot) => {
                const scoreKey = `${slot.id}Score`;
                const timeKey = `${slot.id}Time`;
                const notesKey = `${slot.id}Notes`;

                return (
                  <div key={slot.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{slot.nameEn} ({slot.timeRangeEn})</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500">Score (1-10 or MISSED)</label>
                        <select
                          value={editRowData[scoreKey]}
                          onChange={(e) => {
                            const val = e.target.value === 'MISSED' ? 'MISSED' : Number(e.target.value);
                            setEditRowData({ ...editRowData, [scoreKey]: val });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="MISSED">MISSED</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500">Time</label>
                        <input
                          type="text"
                          value={editRowData[timeKey]}
                          onChange={(e) => setEditRowData({ ...editRowData, [timeKey]: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500">Notes</label>
                        <input
                          type="text"
                          value={editRowData[notesKey] || ''}
                          onChange={(e) => setEditRowData({ ...editRowData, [notesKey]: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditRowData(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {lang === 'lt' ? 'Atšaukti' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs"
                >
                  {lang === 'lt' ? 'Išsaugoti Pakeitimus' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
