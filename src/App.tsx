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

// Hardcoded default dataset containing exact unedited notes from the file
function generateDemoData() { 
  return [ 
    { 
      date: '2025-02-23', 
      morningScore: 6, morningTime: '08:15', morningNotes: 'Slept well, felt calm', 
      middayScore: 8, middayTime: '13:30', middayNotes: 'Work deadline stress', 
      eveningScore: 'MISSED', eveningTime: 'MISSED', eveningNotes: '', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-22', 
      morningScore: 'MISSED', morningTime: 'MISSED', morningNotes: '', 
      middayScore: 5, middayTime: '14:00', middayNotes: 'Lunch walk helped balance', 
      eveningScore: 4, eveningTime: '20:45', eveningNotes: 'Relaxing reading session', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-21', 
      morningScore: 7, morningTime: '07:45', morningNotes: 'Morning tea & breathing', 
      middayScore: 6, middayTime: '12:30', middayNotes: 'Productive team sync', 
      eveningScore: 5, eveningTime: '21:15', eveningNotes: 'Grounded evening', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-20', 
      morningScore: 'MISSED', morningTime: 'MISSED', morningNotes: '', 
      middayScore: 9, middayTime: '15:10', middayNotes: 'Panic surge before presentation', 
      eveningScore: 8, eveningTime: '19:50', eveningNotes: '4-7-8 breathing exercise used', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-19', 
      morningScore: 2, morningTime: '09:10', morningNotes: 'Heavy brain fog & apathy', 
      middayScore: 3, middayTime: '13:15', middayNotes: 'Slow light walk outside', 
      eveningScore: 'MISSED', eveningTime: 'MISSED', eveningNotes: '', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-18', 
      morningScore: 5, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 6, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 5, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-17', 
      morningScore: 4, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 7, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 6, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-16', 
      morningScore: 7, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 6, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 5, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-15', 
      morningScore: 6, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 5, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 4, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-14', 
      morningScore: 3, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 4, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 'MISSED', eveningTime: 'MISSED', eveningNotes: '', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-13', 
      morningScore: 6, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 7, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 6, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-12', 
      morningScore: 5, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 8, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 7, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-11', 
      morningScore: 7, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 6, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 5, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-10', 
      morningScore: 3, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 4, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 5, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-09', 
      morningScore: 6, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 5, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 4, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-08', 
      morningScore: 8, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 7, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 6, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-07', 
      morningScore: 5, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 6, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 5, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-06', 
      morningScore: 4, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 5, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 4, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-05', 
      morningScore: 7, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 6, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 6, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    }, 
    { 
      date: '2025-02-04', 
      morningScore: 3, morningTime: '08:30', morningNotes: 'Morning check-in', 
      middayScore: 5, middayTime: '13:15', middayNotes: 'Midday check-in', 
      eveningScore: 5, eveningTime: '20:30', eveningNotes: 'Evening check-in', 
      updatedAt: new Date().toISOString() 
    } 
  ]; 
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
    } fontally { 
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
                <h1 className="text-xl font-extrabold tracking-tight"> 
                  {lang === 'lt' ? 'Tolerancijos Ribų Diagnostika' : 'Window of Tolerance Tracker'} 
                </h1> 
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800"> 
                  Phase 4 
                </span> 
              </div> 
              <p className="text-xs text-slate-500 dark:text-slate-400"> 
                {lang === 'lt' ? 'Nervų sistemos būsenų stebėjimas ir reguliavimas' : 'Autonomic Nervous System Dynamic Monitor & Excel Sync'} 
              </p> 
            </div> 
          </div> 

          {/* Action Bar */} 
          <div className="flex items-center gap-2 flex-wrap"> 
            <button 
              onClick={() => setLang(l => l === 'en' ? 'lt' : 'en')} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition" 
            > 
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> 
              <span>{lang === 'en' ? 'LT' : 'EN'}</span> 
            </button> 

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition" 
            > 
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />} 
            </button> 

            <button 
              onClick={handleDownloadXLSX} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition" 
            > 
              <Download className="w-3.5 h-3.5" /> 
              <span>Export XLSX</span> 
            </button> 

            <button 
              onClick={handlePushToGitHub} 
              disabled={isSyncing} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition" 
            > 
              <Upload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} /> 
              <span>{lang === 'lt' ? 'Į GitHub' : 'Push .xlsx'}</span> 
            </button> 

            <button 
              onClick={handlePullFromGitHub} 
              disabled={isSyncing} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition" 
            > 
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} /> 
              <span>{lang === 'lt' ? 'Iš GitHub' : 'Pull .xlsx'}</span> 
            </button> 

            <button 
              onClick={() => setIsGhModalOpen(true)} 
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition" 
              title="GitHub Settings" 
            > 
              <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" /> 
            </button> 
          </div> 
        </div> 
      </header> 

      {/* TOAST NOTIFICATION */} 
      {toastMessage && ( 
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold border backdrop-blur-md transition-all duration-300 ${ 
          toastMessage.type === 'error' 
            ? 'bg-rose-500/95 text-white border-rose-400' 
            : 'bg-emerald-600/95 text-white border-emerald-400' 
        }`}> 
          {toastMessage.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} 
          <span>{toastMessage.msg}</span> 
        </div> 
      )} 

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-8"> 
        
        {/* TOP ANALYTICS DASHBOARD */} 
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4"> 
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"> 
            <div className="flex items-center justify-between text-slate-400"> 
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'lt' ? 'Dienų Kiekis' : 'Total Days'}</span> 
              <Database className="w-4 h-4 text-indigo-500" /> 
            </div> 
            <div className="mt-2 flex items-baseline gap-1"> 
              <span className="text-2xl font-black">{analyticsKPIs.totalDays}</span> 
              <span className="text-xs text-slate-400">days</span> 
            </div> 
          </div> 

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"> 
            <div className="flex items-center justify-between text-slate-400"> 
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'lt' ? 'Optimali Zona' : 'In Optimal'}</span> 
              <Shield className="w-4 h-4 text-emerald-500" /> 
            </div> 
            <div className="mt-2 flex items-baseline gap-1"> 
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{analyticsKPIs.optimalPct}%</span> 
              <span className="text-xs text-slate-400">logs</span> 
            </div> 
          </div> 

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"> 
            <div className="flex items-center justify-between text-slate-400"> 
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'lt' ? 'Vid. Sujaudinimas' : 'Avg Score'}</span> 
              <Activity className="w-4 h-4 text-teal-500" /> 
            </div> 
            <div className="mt-2 flex items-baseline gap-1"> 
              <span className="text-2xl font-black text-teal-600 dark:text-teal-400">{analyticsKPIs.avgScore}</span> 
              <span className="text-xs text-slate-400">/ 10</span> 
            </div> 
          </div> 

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"> 
            <div className="flex items-center justify-between text-slate-400"> 
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'lt' ? 'Praleisti Slotai' : 'Missed Slots'}</span> 
              <AlertTriangle className="w-4 h-4 text-rose-500" /> 
            </div> 
            <div className="mt-2 flex items-baseline gap-1"> 
              <span className="text-2xl font-black text-rose-500">{analyticsKPIs.totalMissed}</span> 
              <span className="text-xs text-slate-400">slots</span> 
            </div> 
          </div> 

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"> 
            <div className="flex items-center justify-between text-slate-400"> 
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'lt' ? 'Lankomumas' : 'Compliance'}</span> 
              <CheckCircle2 className="w-4 h-4 text-blue-500" /> 
            </div> 
            <div className="mt-2 flex items-baseline gap-1"> 
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{analyticsKPIs.complianceRate}%</span> 
            </div> 
          </div> 

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"> 
            <div className="flex items-center justify-between text-slate-400"> 
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'lt' ? 'Serija' : 'Streak'}</span> 
              <Flame className="w-4 h-4 text-amber-500" /> 
            </div> 
            <div className="mt-2 flex items-baseline gap-1"> 
              <span className="text-2xl font-black text-amber-500">{analyticsKPIs.streak}</span> 
              <span className="text-xs text-slate-400">days</span> 
            </div> 
          </div> 
        </div> 

        {/* SECTION 1: DAILY LOGGING INPUT CARD */} 
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6"> 
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4"> 
            <div className="flex items-center gap-2.5"> 
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400"> 
                <PlusCircle className="w-5 h-5" /> 
              </div> 
              <div> 
                <h2 className="text-lg font-extrabold">{lang === 'lt' ? 'Registruoti Būsenos Įrašą' : 'Log State Check-In'}</h2> 
                <p className="text-xs text-slate-500">{lang === 'lt' ? 'Pasirinkite dieną, laiko slotą ir sujaudinimo lygį' : 'Select date, slot and log your current nervous system arousal'}</p> 
              </div> 
            </div> 

            {/* Date & Time Selectors */} 
            <div className="flex items-center gap-3 flex-wrap"> 
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700"> 
                <Calendar className="w-4 h-4 text-slate-500" /> 
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer" 
                /> 
              </div> 
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700"> 
                <Clock className="w-4 h-4 text-slate-500" /> 
                <input 
                  type="time" 
                  value={inputTime} 
                  onChange={(e) => setInputTime(e.target.value)} 
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer" 
                /> 
              </div> 
            </div> 
          </div> 

          {/* 3 TIME SLOTS PICKER */} 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
            {SLOT_CONFIGS.map((slot) => { 
              const Icon = slot.icon; 
              const isSelected = selectedSlot === slot.id; 
              const activeRecord = records.find(r => r.date === selectedDate); 
              const slotScore = activeRecord ? activeRecord[`${slot.id}Score`] : null; 
              const slotTime = activeRecord ? activeRecord[`${slot.id}Time`] : null; 

              let badgeText = lang === 'lt' ? 'Laukia' : 'Pending'; 
              let badgeStyle = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'; 

              if (slotScore === 'MISSED') { 
                badgeText = lang === 'lt' ? 'MISSED' : 'MISSED'; 
                badgeStyle = 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'; 
              } else if (typeof slotScore === 'number') { 
                badgeText = `${slotScore}/10 (${slotTime})`; 
                badgeStyle = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'; 
              } 

              return ( 
                <button 
                  key={slot.id} 
                  type="button" 
                  onClick={() => setSelectedSlot(slot.id)} 
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${ 
                    isSelected 
                      ? 'border-teal-500 ring-2 ring-teal-500/30 bg-teal-50/40 dark:bg-teal-950/20 shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50' 
                  }`} 
                > 
                  <div className="flex items-start justify-between"> 
                    <div className="flex items-center gap-2.5"> 
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}> 
                        <Icon className="w-5 h-5" /> 
                      </div> 
                      <div> 
                        <h3 className="font-extrabold text-sm">{lang === 'lt' ? slot.nameLt : slot.nameEn}</h3> 
                        <span className="text-[11px] text-slate-500">{slot.timeRangeEn}</span> 
                      </div> 
                    </div> 
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border border-transparent ${badgeStyle}`}> 
                      {badgeText} 
                    </span> 
                  </div> 

                  <div className="mt-4 text-[11px] text-slate-500 flex items-center gap-1"> 
                    <span>{isSelected ? (lang === 'lt' ? 'Pasirinkta taisymui' : 'Currently Selected') : (lang === 'lt' ? 'Spauskite pasirinkti' : 'Click to log slot')}</span> 
                  </div> 
                </button> 
              ); 
            })} 
          </div> 

          {/* SCORE SLIDER & ZONE PREVIEW */} 
          <div className="space-y-4 pt-2"> 
            <div className="flex items-center justify-between"> 
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500"> 
                {lang === 'lt' ? 'Sujaudinimo Įvertinimas (1-10)' : 'Nervous System Arousal Score (1-10)'} 
              </label> 
              <span className="text-2xl font-black text-teal-600 dark:text-teal-400"> 
                {selectedScore} / 10 
              </span> 
            </div> 

            <div className="relative"> 
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={selectedScore} 
                onChange={(e) => setSelectedScore(Number(e.target.value))} 
                className="w-full h-3 bg-gradient-to-r from-indigo-400 via-emerald-400 to-rose-500 rounded-lg appearance-none cursor-pointer accent-teal-600" 
              /> 
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5"> 
                <span>1 (Hypo / Shutdown)</span> 
                <span>4-7 (Optimal Window)</span> 
                <span>10 (Hyper / Panic)</span> 
              </div> 
            </div> 

            {/* DYNAMIC ZONE CARDS DISPLAY */} 
            {activeZone && ( 
              <div className={`p-4 rounded-2xl border transition-all ${activeZone.cardBg}`}> 
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3"> 
                  <div> 
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${activeZone.bgBadge}`}> 
                      {lang === 'lt' ? activeZone.nameLt : activeZone.nameEn} 
                    </span> 
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1"> 
                      {lang === 'lt' ? activeZone.subtitleLt : activeZone.subtitleEn} 
                    </p> 
                  </div> 
                  <span className="text-xs font-extrabold font-mono opacity-80"> 
                    Score Zone: {activeZone.range.join(', ')} 
                  </span> 
                </div> 

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs"> 
                  <div> 
                    <span className="font-extrabold text-slate-700 dark:text-slate-200 block mb-1"> 
                      {lang === 'lt' ? 'Neurobiologinė Būsena:' : 'Neurobiological State:'} 
                    </span> 
                    <p className="text-slate-600 dark:text-slate-300"> 
                      {lang === 'lt' ? activeZone.descLt : activeZone.descEn} 
                    </p> 
                  </div> 
                  <div> 
                    <span className="font-extrabold text-slate-700 dark:text-slate-200 block mb-1"> 
                      {lang === 'lt' ? 'Rekomenduojami Fiziniai Veiksmai:' : 'Somatic Regulation Support:'} 
                    </span> 
                    <p className="text-slate-600 dark:text-slate-300"> 
                      {lang === 'lt' ? activeZone.physioLt : activeZone.physioEn} 
                    </p> 
                  </div> 
                </div> 
              </div> 
            )} 
          </div> 

          {/* NOTES & SAVE BUTTON */} 
          <div className="space-y-3"> 
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500"> 
              {lang === 'lt' ? 'Pastabos / Triggers / Somatiniai Jausmai' : 'Context, Triggers & Somatic Observations'} 
            </label> 
            <textarea 
              rows={2} 
              value={inputNotes} 
              onChange={(e) => setInputNotes(e.target.value)} 
              placeholder={lang === 'lt' ? 'Įveskite pastabas...' : 'Enter notes...'} 
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-teal-500 transition" 
            /> 
          </div> 

          <div className="flex justify-end gap-3 pt-2"> 
            <button 
              onClick={handleSaveEntry} 
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-2" 
            > 
              <Check className="w-4 h-4" /> 
              <span>{lang === 'lt' ? 'Išsaugoti Sloto Įrašą' : 'Save Slot Check-In'}</span> 
            </button> 
          </div> 
        </section> 

        {/* SECTION 2: TOLERANCE WINDOW DYNAMICS DUAL CHART */} 
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6"> 
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4"> 
            <div className="flex items-center gap-2.5"> 
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"> 
                <TrendingUp className="w-5 h-5" /> 
              </div> 
              <div> 
                <h2 className="text-lg font-extrabold">{lang === 'lt' ? 'Tolerancijos Ribų Dinamika' : 'Tolerance Window Dynamics'}</h2> 
                <p className="text-xs text-slate-500">{lang === 'lt' ? 'Chronologinis visų slotų kitimas su 3 zonų fonu' : 'Sequential timeline across slots with color-coded nervous system zones'}</p> 
              </div> 
            </div> 

            {/* Timeframe & Display Controls */} 
            <div className="flex items-center gap-3 flex-wrap"> 
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer"> 
                <input 
                  type="checkbox" 
                  checked={connectMissedLines} 
                  onChange={(e) => setConnectMissedLines(e.target.checked)} 
                  className="rounded text-teal-600 focus:ring-teal-500" 
                /> 
                <span className="text-slate-600 dark:text-slate-400">{lang === 'lt' ? 'Rodyti praleistus slotus' : 'Bridge Missed Slots'}</span> 
              </label> 

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700"> 
                <button 
                  onClick={() => setTimeframe('7d')} 
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${timeframe === '7d' ? 'bg-white dark:bg-slate-700 shadow-xs text-teal-600 dark:text-teal-400' : 'text-slate-500'}`} 
                > 
                  7 Days 
                </button> 
                <button 
                  onClick={() => setTimeframe('30d')} 
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${timeframe === '30d' ? 'bg-white dark:bg-slate-700 shadow-xs text-teal-600 dark:text-teal-400' : 'text-slate-500'}`} 
                > 
                  30 Days 
                </button> 
                <button 
                  onClick={() => setTimeframe('all')} 
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${timeframe === 'all' ? 'bg-white dark:bg-slate-700 shadow-xs text-teal-600 dark:text-teal-400' : 'text-slate-500'}`} 
                > 
                  All 
                </button> 
              </div> 
            </div> 
          </div> 

          {/* RECHARTS CONTINUOUS LINE CHART */} 
          <div className="h-72 w-full pt-2"> 
            <ResponsiveContainer width="100%" height="100%"> 
              <LineChart data={chartTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}> 
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} /> 
                <XAxis 
                  dataKey="timePointLabel" 
                  tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }} 
                  interval="preserveStartEnd" 
                /> 
                <YAxis 
                  domain={[1, 10]} 
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} 
                  tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }} 
                /> 
                <RechartsTooltip content={<CustomChartTooltip />} /> 

                {/* BACKGROUND ZONE REFERENCE AREAS */} 
                <ReferenceArea y1={7.5} y2={10} fill="#f43f5e" fillOpacity={isDarkMode ? 0.15 : 0.08} /> 
                <ReferenceArea y1={3.5} y2={7.5} fill="#10b981" fillOpacity={isDarkMode ? 0.15 : 0.08} /> 
                <ReferenceArea y1={1} y2={3.5} fill="#6366f1" fillOpacity={isDarkMode ? 0.15 : 0.08} /> 

                <Line 
                  type="monotone" 
                  dataKey="displayChartVal" 
                  stroke="#0d9488" 
                  strokeWidth={2.5} 
                  dot={renderCustomChartDot} 
                  activeDot={{ r: 7, strokeWidth: 2, fill: '#0f766e' }} 
                  connectNulls={connectMissedLines} 
                /> 
              </LineChart> 
            </ResponsiveContainer> 
          </div> 

          {/* ZONE LEGEND BAR */} 
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs"> 
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50"> 
              <div className="w-3 h-3 rounded-full bg-indigo-500" /> 
              <span className="font-semibold text-indigo-900 dark:text-indigo-300">Hypoarousal Zone (1-3)</span> 
            </div> 
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50"> 
              <div className="w-3 h-3 rounded-full bg-emerald-500" /> 
              <span className="font-semibold text-emerald-900 dark:text-emerald-300">Optimal Window (4-7)</span> 
            </div> 
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50"> 
              <div className="w-3 h-3 rounded-full bg-rose-500" /> 
              <span className="font-semibold text-rose-900 dark:text-rose-300">Hyperarousal Zone (8-10)</span> 
            </div> 
          </div> 
        </section> 

        {/* SECTION 3: LOGS & HISTORY MANAGEMENT TABLE */} 
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6"> 
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4"> 
            <div className="flex items-center gap-2.5"> 
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"> 
                <FileSpreadsheet className="w-5 h-5" /> 
              </div> 
              <div> 
                <h2 className="text-lg font-extrabold">{lang === 'lt' ? 'Žurnalų Istorija ir Valdymas' : 'Logs & History Management'}</h2> 
                <p className="text-xs text-slate-500">{lang === 'lt' ? 'Tiesioginis Excel duomenų peržiūrėjimas ir redagavimas' : 'View, search, filter and modify logged records'}</p> 
              </div> 
            </div> 

            {/* Filter and Search controls */} 
            <div className="flex items-center gap-3 flex-wrap"> 
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700"> 
                <Search className="w-3.5 h-3.5 text-slate-400" /> 
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder={lang === 'lt' ? 'Iškoti datos (YYYY-MM-DD)...' : 'Filter by date...'} 
                  className="bg-transparent text-xs font-semibold outline-none w-32" 
                /> 
              </div> 

              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700"> 
                <Filter className="w-3.5 h-3.5 text-slate-400" /> 
                <select 
                  value={zoneFilter} 
                  onChange={(e) => setZoneFilter(e.target.value)} 
                  className="bg-transparent text-xs font-semibold outline-none cursor-pointer" 
                > 
                  <option value="all">All Zones</option> 
                  <option value="optimal">Optimal Only</option> 
                  <option value="hypo">Hypoarousal</option> 
                  <option value="hyper">Hyperarousal</option> 
                  <option value="missed">Contains Missed</option> 
                </select> 
              </div> 
            </div> 
          </div> 

          {/* TABLE */} 
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"> 
            <table className="w-full text-left border-collapse text-xs"> 
              <thead> 
                <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800"> 
                  <th className="p-3.5">{lang === 'lt' ? 'Data' : 'Date'}</th> 
                  <th className="p-3.5">{lang === 'lt' ? 'Rytas' : 'Morning'}</th> 
                  <th className="p-3.5">{lang === 'lt' ? 'Diena' : 'Midday'}</th> 
                  <th className="p-3.5">{lang === 'lt' ? 'Vakaras' : 'Evening'}</th> 
                  <th className="p-3.5 text-right">{lang === 'lt' ? 'Veiksmai' : 'Actions'}</th> 
                </tr> 
              </thead> 
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium"> 
                {filteredRecords.length === 0 ? ( 
                  <tr> 
                    <td colSpan={5} className="p-8 text-center text-slate-400"> 
                      {lang === 'lt' ? 'Įrašų nerasta pagal pasirinktus filtrus' : 'No logs found matching filter criteria'} 
                    </td> 
                  </tr> 
                ) : ( 
                  filteredRecords.map((row) => ( 
                    <tr key={row.date} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"> 
                      <td className="p-3.5 font-bold font-mono text-slate-900 dark:text-slate-100"> 
                        {row.date} 
                        <span className="block text-[10px] text-slate-400 font-sans font-normal"> 
                          {formatDisplayDate(row.date, lang)} 
                        </span> 
                      </td> 

                      {/* MORNING CELL */} 
                      <td className="p-3.5"> 
                        {row.morningScore === 'MISSED' ? ( 
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-[11px] font-bold"> 
                            MISSED 
                          </span> 
                        ) : ( 
                          <div> 
                            <div className="flex items-center gap-1.5"> 
                              <span className="font-extrabold text-slate-900 dark:text-slate-100">{row.morningScore}/10</span> 
                              <span className="text-[10px] text-slate-400 font-mono">({row.morningTime})</span> 
                            </div> 
                            {row.morningNotes && ( 
                              <p className="text-[10px] text-slate-500 truncate max-w-[140px]" title={row.morningNotes}> 
                                {row.morningNotes} 
                              </p> 
                            )} 
                          </div> 
                        )} 
                      </td> 

                      {/* MIDDAY CELL */} 
                      <td className="p-3.5"> 
                        {row.middayScore === 'MISSED' ? ( 
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-[11px] font-bold"> 
                            MISSED 
                          </span> 
                        ) : ( 
                          <div> 
                            <div className="flex items-center gap-1.5"> 
                              <span className="font-extrabold text-slate-900 dark:text-slate-100">{row.middayScore}/10</span> 
                              <span className="text-[10px] text-slate-400 font-mono">({row.middayTime})</span> 
                            </div> 
                            {row.middayNotes && ( 
                              <p className="text-[10px] text-slate-500 truncate max-w-[140px]" title={row.middayNotes}> 
                                {row.middayNotes} 
                              </p> 
                            )} 
                          </div> 
                        )} 
                      </td> 

                      {/* EVENING CELL */} 
                      <td className="p-3.5"> 
                        {row.eveningScore === 'MISSED' ? ( 
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-[11px] font-bold"> 
                            MISSED 
                          </span> 
                        ) : ( 
                          <div> 
                            <div className="flex items-center gap-1.5"> 
                              <span className="font-extrabold text-slate-900 dark:text-slate-100">{row.eveningScore}/10</span> 
                              <span className="text-[10px] text-slate-400 font-mono">({row.eveningTime})</span> 
                            </div> 
                            {row.eveningNotes && ( 
                              <p className="text-[10px] text-slate-500 truncate max-w-[140px]" title={row.eveningNotes}> 
                                {row.eveningNotes} 
                              </p> 
                            )} 
                          </div> 
                        )} 
                      </td> 

                      {/* ACTIONS CELL */} 
                      <td className="p-3.5 text-right"> 
                        <div className="flex items-center justify-end gap-1.5"> 
                          <button 
                            onClick={() => setEditRowData({ ...row })} 
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition" 
                            title="Edit Record" 
                          > 
                            <Edit3 className="w-3.5 h-3.5" /> 
                          </button> 
                          <button 
                            onClick={() => handleDeleteRow(row.date)} 
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition" 
                            title="Delete Record" 
                          > 
                            <Trash2 className="w-3.5 h-3.5" /> 
                          </button> 
                        </div> 
                      </td> 
                    </tr> 
                  )) 
                )} 
              </tbody> 
            </table> 
          </div> 
        </section> 
      </main> 

      {/* EDIT ROW MODAL */} 
      {editRowData && ( 
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"> 
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5"> 
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"> 
              <h3 className="font-extrabold text-base">Redaguoti {editRowData.date} Įrašus</h3> 
              <button onClick={() => setEditRowData(null)} className="text-slate-400 hover:text-slate-600"> 
                <X className="w-5 h-5" /> 
              </button> 
            </div> 

            <form onSubmit={handleUpdateEditedRow} className="space-y-4 text-xs"> 
              {SLOT_CONFIGS.map(slot => ( 
                <div key={slot.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2"> 
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 block">{slot.nameEn} ({slot.timeRangeEn})</span> 
                  <div className="grid grid-cols-2 gap-2"> 
                    <div> 
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Score / State</label> 
                      <input 
                        type="text" 
                        value={editRowData[`${slot.id}Score`]} 
                        onChange={(e) => { 
                          const val = e.target.value; 
                          const num = Number(val); 
                          setEditRowData({ 
                            ...editRowData, 
                            [`${slot.id}Score`]: val === 'MISSED' ? 'MISSED' : isNaN(num) ? val : num 
                          }); 
                        }} 
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold" 
                      /> 
                    </div> 
                    <div> 
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Time</label> 
                      <input 
                        type="text" 
                        value={editRowData[`${slot.id}Time`]} 
                        onChange={(e) => setEditRowData({ ...editRowData, [`${slot.id}Time`]: e.target.value })} 
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold" 
                      /> 
                    </div> 
                  </div> 
                  <div> 
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Notes</label> 
                    <input 
                      type="text" 
                      value={editRowData[`${slot.id}Notes`]} 
                      onChange={(e) => setEditRowData({ ...editRowData, [`${slot.id}Notes`]: e.target.value })} 
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                    /> 
                  </div> 
                </div> 
              ))} 

              <div className="flex justify-end gap-2 pt-2"> 
                <button 
                  type="button" 
                  onClick={() => setEditRowData(null)} 
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold" 
                > 
                  Cancel 
                </button> 
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold" 
                > 
                  Save Changes 
                </button> 
              </div> 
            </form> 
          </div> 
        </div> 
      )} 

      {/* GITHUB CONFIG MODAL */} 
      {isGhModalOpen && ( 
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"> 
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"> 
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"> 
              <div className="flex items-center gap-2"> 
                <Github className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> 
                <h3 className="font-extrabold text-base">GitHub Storage Settings</h3> 
              </div> 
              <button onClick={() => setIsGhModalOpen(false)} className="text-slate-400 hover:text-slate-600"> 
                <X className="w-5 h-5" /> 
              </button> 
            </div> 

            <div className="space-y-3 text-xs"> 
              <div> 
                <label className="text-[10px] text-slate-400 uppercase font-bold">Personal Access Token (PAT)</label> 
                <input 
                  type="password" 
                  value={ghConfig.token} 
                  onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })} 
                  placeholder="ghp_xxxxxxxxxxxx" 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono" 
                /> 
              </div> 

              <div className="grid grid-cols-2 gap-2"> 
                <div> 
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Repo Owner</label> 
                  <input 
                    type="text" 
                    value={ghConfig.owner} 
                    onChange={(e) => setGhConfig({ ...ghConfig, owner: e.target.value })} 
                    placeholder="username" 
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold" 
                  /> 
                </div> 
                <div> 
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Repository</label> 
                  <input 
                    type="text" 
                    value={ghConfig.repo} 
                    onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })} 
                    placeholder="my-repo" 
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold" 
                  /> 
                </div> 
              </div> 

              <div> 
                <label className="text-[10px] text-slate-400 uppercase font-bold">File Path in Repo</label> 
                <input 
                  type="text" 
                  value={ghConfig.path} 
                  onChange={(e) => setGhConfig({ ...ghConfig, path: e.target.value })} 
                  placeholder="data/tolerance_window_logs.xlsx" 
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono" 
                /> 
              </div> 
            </div> 

            <div className="flex justify-end gap-2 pt-2"> 
              <button 
                onClick={() => setIsGhModalOpen(false)} 
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs" 
              > 
                Done 
              </button> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}
