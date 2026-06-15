import { useState, useEffect, useRef } from 'react';
import { fetchStudentAccess, getStoredStudentCode, setStoredStudentCode } from './services/api';
import StudentLogin from './components/StudentLogin';
import { 
  BookOpen, 
  Terminal, 
  Sparkles, 
  Award, 
  Flame, 
  Menu, 
  X, 
  CheckSquare, 
  ExternalLink, 
  GraduationCap, 
  BookMarked,
  LayoutDashboard,
  Trophy,
  Code,
  Shield,
  LogOut,
  User
} from 'lucide-react';

import { UserProgress } from './types';
import { courseDays } from './data/curriculum';
import Dashboard from './components/Dashboard';
import CourseView from './components/CourseView';
import ExerciseView from './components/ExerciseView';
import ProjectView from './components/ProjectView';
import TerminalView from './components/TerminalView';
import AdminView from './components/AdminView';

const STORAGE_KEY = 'pyflow_progress';

const initialProgress: UserProgress = {
  completedDays: [],
  completedQuizzes: {},
  completedChallenges: {},
  completedProjects: [],
  streak: 1,
  lastActiveDate: null
};

export default function App() {
  // Navigation: 'dashboard' | 'cours' | 'exercices' | 'projets' | 'outils' | 'terminal' | 'admin'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cours' | 'exercices' | 'projets' | 'outils' | 'terminal' | 'admin'>('dashboard');
  const [selectedDayId, setSelectedDayId] = useState<number>(1);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Access control state loaded from local persistence
  const [unlockedDays, setUnlockedDays] = useState<number[]>([]);
  const [unlockedProjects, setUnlockedProjects] = useState<string[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Student identity & gate
  const [studentName, setStudentName] = useState<string | null>(null);
  const [isAccessReady, setIsAccessReady] = useState<boolean>(false);

  // Responsive mobile sidebar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Collapsible desktop sidebar
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  // Progressive training profile loaded from local persistence
  const [progress, setProgress] = useState<UserProgress>(initialProgress);

  // Track if Supabase access has been loaded
  const accessLoaded = useRef(false);

  useEffect(() => {
    if (accessLoaded.current) return;
    accessLoaded.current = true;

    const studentCode = getStoredStudentCode();
    if (studentCode) {
      fetchStudentAccess(studentCode)
        .then(({ student, unlocked_days, unlocked_projects }) => {
          setStudentName(student.name);
          setUnlockedDays(unlocked_days);
          setUnlockedProjects(unlocked_projects);
          localStorage.setItem('pyflow_unlocked_days', JSON.stringify(unlocked_days));
          localStorage.setItem('pyflow_unlocked_projects', JSON.stringify(unlocked_projects));
        })
        .catch(() => {
          // Code stored but network error: use cache and let through
          const savedDays = localStorage.getItem('pyflow_unlocked_days');
          const savedProjects = localStorage.getItem('pyflow_unlocked_projects');
          if (savedDays) { try { setUnlockedDays(JSON.parse(savedDays)); } catch { setUnlockedDays([]); } }
          if (savedProjects) { try { setUnlockedProjects(JSON.parse(savedProjects)); } catch { setUnlockedProjects([]); } }
        })
        .finally(() => setIsAccessReady(true));
    } else {
      // No stored code → show login screen
      setIsAccessReady(true);
    }
  }, []);

  const handleStudentLogin = (name: string, days: number[], projs: string[]) => {
    setStudentName(name);
    setUnlockedDays(days);
    setUnlockedProjects(projs);
    localStorage.setItem('pyflow_unlocked_days', JSON.stringify(days));
    localStorage.setItem('pyflow_unlocked_projects', JSON.stringify(projs));
  };

  const handleStudentLogout = () => {
    setStoredStudentCode('');
    localStorage.removeItem('pyflow_student_code');
    localStorage.removeItem('pyflow_unlocked_days');
    localStorage.removeItem('pyflow_unlocked_projects');
    setStudentName(null);
    setUnlockedDays([]);
    setUnlockedProjects([]);
  };

  const handleUpdateUnlockedDays = (days: number[]) => {
    setUnlockedDays(days);
    localStorage.setItem('pyflow_unlocked_days', JSON.stringify(days));
  };

  const handleUpdateUnlockedProjects = (projs: string[]) => {
    setUnlockedProjects(projs);
    localStorage.setItem('pyflow_unlocked_projects', JSON.stringify(projs));
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: UserProgress = JSON.parse(raw);
        
        // Dynamic streak verification on load
        const todayStr = new Date().toISOString().split('T')[0];
        if (parsed.lastActiveDate) {
          const lastActive = new Date(parsed.lastActiveDate);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - lastActive.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 1) {
            // Reset streak if inactive more than 1 day
            parsed.streak = Math.max(1, parsed.streak);
          }
        }
        
        setProgress(parsed);
      } catch (err) {
        console.error("Impossible de parser la progression sauvegardée :", err);
      }
    }
  }, []);

  // Sync state changes with localStorage
  const saveProgress = (updated: UserProgress) => {
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Toggle completion flag on course day reading
  const handleToggleCompleteDay = (dayId: number) => {
    const isCompleted = progress.completedDays.includes(dayId);
    let updatedCompletedDays = [...progress.completedDays];

    if (isCompleted) {
      updatedCompletedDays = updatedCompletedDays.filter(id => id !== dayId);
    } else {
      updatedCompletedDays.push(dayId);
    }

    // Bump streak on new completions
    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = progress.streak;
    if (!isCompleted && progress.lastActiveDate !== todayStr) {
      newStreak = progress.streak + 1;
    }

    saveProgress({
      ...progress,
      completedDays: updatedCompletedDays,
      lastActiveDate: todayStr,
      streak: newStreak
    });
  };

  // Pass quiz item
  const handlePassQuiz = (quizId: string) => {
    saveProgress({
      ...progress,
      completedQuizzes: {
        ...progress.completedQuizzes,
        [quizId]: true
      }
    });
  };

  // Pass coding challenge item
  const handlePassChallenge = (challengeId: string, submittedCode: string) => {
    saveProgress({
      ...progress,
      completedChallenges: {
        ...progress.completedChallenges,
        [challengeId]: submittedCode
      }
    });
  };

  // Complete project milestone
  const handleCompleteProject = (projectId: string) => {
    const isCompleted = progress.completedProjects.includes(projectId);
    let updatedProjs = [...progress.completedProjects];

    if (isCompleted) {
      updatedProjs = updatedProjs.filter(id => id !== projectId);
    } else {
      updatedProjs.push(projectId);
    }

    saveProgress({
      ...progress,
      completedProjects: updatedProjs
    });
  };

  const handleSelectDay = (dayId: number) => {
    setSelectedDayId(dayId);
    setActiveTab('cours');
    // auto collapse on mobile selection
    setMobileSidebarOpen(false);
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveTab('projets');
    setMobileSidebarOpen(false);
  };

  const totalSteps = 28;
  const globalCompleted = progress.completedDays.length;
  const globalPercent = Math.round((globalCompleted / totalSteps) * 100);

  // Show login screen if not authenticated yet
  if (!isAccessReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" />
          Chargement de votre espace…
        </div>
      </div>
    );
  }

  if (!studentName && !getStoredStudentCode()) {
    return <StudentLogin onSuccess={handleStudentLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR NAVIGATION - COLLAPSIBLE FOR BOTH DESKTOP & MOBILE */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-300 border-r border-slate-850 z-40 flex flex-col justify-between shrink-0 lg:static transition-all duration-300 overflow-hidden ${
          mobileSidebarOpen 
            ? 'translate-x-0 w-64 flex' 
            : '-translate-x-full lg:translate-x-0'
        } ${
          desktopSidebarOpen 
            ? 'lg:flex lg:w-64' 
            : 'lg:flex lg:w-0 lg:border-r-0'
        }`}
      >
        <div className="flex flex-col flex-1 w-64">
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-850 bg-slate-950 w-64">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold tracking-tight shadow-md select-none font-display">
                Py
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-white text-base tracking-tight">PyFlow</span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase font-bold">Python Express</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setMobileSidebarOpen(false);
                setDesktopSidebarOpen(false);
              }}
              className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-850 rounded-lg transition-colors cursor-pointer"
              title="Masquer la barre"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Progress overview stats in sidebar */}
          <div className="p-5 border-b border-slate-850 bg-slate-900/40 w-64">
            <div className="flex items-center justify-between text-xs text-slate-450 font-bold mb-2">
              <span>PROGRESSION GLOBALE</span>
              <span className="font-mono text-white">{globalPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${globalPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 select-none w-64">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-s'
                  : 'hover:bg-slate-850 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              <span>Tableau de Bord</span>
            </button>

            <button
              onClick={() => { setActiveTab('cours'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'cours'
                  ? 'bg-indigo-600 text-white shadow-s'
                  : 'hover:bg-slate-850 hover:text-white'
              }`}
            >
              <BookMarked className="h-4.5 w-4.5" />
              <span>Cours par Jour</span>
            </button>

            <button
              onClick={() => { setActiveTab('exercices'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'exercices'
                  ? 'bg-indigo-600 text-white shadow-s'
                  : 'hover:bg-slate-850 hover:text-white'
              }`}
            >
              <CheckSquare className="h-4.5 w-4.5" />
              <span>Exercices Pratiques</span>
            </button>

            <button
              onClick={() => { setActiveTab('projets'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'projets'
                  ? 'bg-indigo-600 text-white shadow-s'
                  : 'hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Trophy className="h-4.5 w-4.5" />
              <span>Projets Guidés</span>
            </button>

            <button
              onClick={() => { setActiveTab('terminal'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'terminal'
                  ? 'bg-indigo-600 text-white shadow-s'
                  : 'hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Terminal className="h-4.5 w-4.5" />
              <span>Terminal Linux</span>
            </button>

            <button
              onClick={() => { setActiveTab('outils'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'outils'
                  ? 'bg-indigo-600 text-white shadow-s'
                  : 'hover:bg-slate-850 hover:text-white'
              }`}
            >
              <GraduationCap className="h-4.5 w-4.5" />
              <span>Conseils &amp; Outils</span>
            </button>

            {getStoredStudentCode() === 'PYFLOW-ADMIN-PY' && (
              <button
                onClick={() => { setActiveTab('admin'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border-t border-slate-800/60 pt-3 mt-2 ${
                  activeTab === 'admin'
                    ? 'bg-indigo-650 text-white shadow-s'
                    : 'hover:bg-slate-850 hover:text-white'
                }`}
              >
                <Shield className="h-4.5 w-4.5 text-indigo-400" />
                <span>Administration</span>
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-850 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500 w-64">
          <span className="font-mono">v1.1 (Stable)</span>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>App Prête</span>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY BACKGROUND WHEN SIDEBAR OPENED */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        ></div>
      )}

      {/* MAIN CONTAINER LAYOUT WITH HEADER AND CONTENT SCREEN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header of the Application */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Ouvrir le menu"
            >
              <Menu className="h-5.5 w-5.5 text-slate-700" />
            </button>
            
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="hidden lg:flex p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all cursor-pointer text-slate-700 gap-2 items-center border border-slate-200 shadow-2xs bg-white"
              title={desktopSidebarOpen ? "Masquer la barre latérale" : "Afficher la barre latérale"}
            >
              <Menu className="h-4.5 w-4.5" />
              <span className="text-xs font-semibold text-slate-600 font-sans">
                {desktopSidebarOpen ? "Réduire le menu" : "Développer le menu"}
              </span>
            </button>
            <div className="hidden lg:block">
              <h2 className="text-sm font-bold text-slate-800 capitalize font-display">
                {activeTab === 'dashboard' ? 'Tableau de bord étudiant' : 
                 activeTab === 'cours' ? 'Espace Lecteur des Cours' : 
                 activeTab === 'exercices' ? 'Workspace d\'Évaluation' : 
                 activeTab === 'projets' ? 'Milestone Projets' : 
                 activeTab === 'terminal' ? 'Console Linux & REPL Python' : 
                 activeTab === 'admin' ? 'Administration des Droits' : 'Guide & Ressources pour Réussir'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct streak flame tracker badge */}
            <div className="flex items-center gap-1 rounded-full bg-orange-50/50 border border-orange-100 px-3.5 py-1.5 shadow-2xs">
              <Flame className="h-4.5 w-4.5 text-orange-500 fill-current animate-bounce" />
              <span className="text-xs font-mono font-bold text-orange-950">
                {progress.streak} Jour{progress.streak > 1 ? 's' : ''}
              </span>
            </div>

            {/* General progress indicators */}
            <div className="hidden sm:block bg-slate-100/60 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono border border-slate-200">
              {globalCompleted}/28 Jours
            </div>

            {/* Student identity + logout */}
            {studentName && (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <div className="hidden sm:flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-xs font-semibold text-indigo-700 max-w-28 truncate">{studentName}</span>
                </div>
                <button
                  onClick={handleStudentLogout}
                  title="Se déconnecter"
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* SCREEN SCROLLABLE CONTENT BODY */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              progress={progress}
              onSelectDay={handleSelectDay}
              onNavigateTab={setActiveTab}
              onSelectProject={handleSelectProject}
              unlockedDays={unlockedDays}
              unlockedProjects={unlockedProjects}
            />
          )}

          {activeTab === 'cours' && (
            <CourseView
              dayId={selectedDayId}
              progress={progress}
              onToggleCompleteDay={handleToggleCompleteDay}
              onSelectDay={setSelectedDayId}
              unlockedDays={unlockedDays}
              isAdminAuthenticated={isAdminAuthenticated}
            />
          )}

          {activeTab === 'exercices' && (
            <ExerciseView
              dayId={selectedDayId}
              progress={progress}
              onPassQuiz={handlePassQuiz}
              onPassChallenge={handlePassChallenge}
              onSelectDay={setSelectedDayId}
              unlockedDays={unlockedDays}
            />
          )}

          {activeTab === 'projets' && (
            <ProjectView
              progress={progress}
              activeProjectId={activeProjectId}
              onSelectProject={setActiveProjectId}
              onCompleteProject={handleCompleteProject}
              unlockedProjects={unlockedProjects}
            />
          )}

          {activeTab === 'terminal' && (
            <TerminalView />
          )}

          {activeTab === 'admin' && (
            <AdminView
              unlockedDays={unlockedDays}
              unlockedProjects={unlockedProjects}
              onUpdateUnlockedDays={handleUpdateUnlockedDays}
              onUpdateUnlockedProjects={handleUpdateUnlockedProjects}
              isAdminAuthenticated={isAdminAuthenticated}
              setIsAdminAuthenticated={setIsAdminAuthenticated}
            />
          )}

          {activeTab === 'outils' && <OutilsView />}
        </main>
      </div>
    </div>
  );
}

// Sub-component OutilsView encapsulating Recommendations from PDF page 4
function OutilsView() {
  const practiceTips = [
    { title: "Fréquence Ciblée", desc: "Consacrez 4 à 6 heures par jour de codage rigoureux. C'est l'immersion totale qui crée le déclic algorithmique." },
    { title: "Découpage Logique", desc: "Divisez vos programmes complexes en de petites parties testables uniques. N'accumulez pas les bugs !" },
    { title: "Rôle du Débogueur", desc: "Utilisez un débogueur pas à pas officiel ou visualisez vos variables au lieu d'utiliser uniquement des instructions print()." },
    { title: "Documentation Amie", desc: "Formez-vous le réflexe de lire régulièrement la documentation de référence standard du site docs.python.org." }
  ];

  const tools = [
    { title: "VS Code + Extensions", desc: "Visual Studio Code avec l’extension officielle Microsoft Python & Pylance pour l’analyse statique ultra performante." },
    { title: "Jupyter Notebooks", desc: "Excellent pour explorer instantanément de petits calculs matriciels en science de données Numpy et Pandas." },
    { title: "Git et GitHub", desc: "Le réflexe indispensable pour versionner vos scripts de projets au quotidien et documenter vos accomplissements." },
    { title: "Systèmes d’Environnements", desc: "Utilisez en priorité venv (intégré) ou conda pour compartimenter l'installation d'outils tiers." }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-700">
      {/* Top Banner layout */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-md">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-350 tracking-wider text-indigo-300 uppercase">
            <Award className="h-3.5 w-3.5" /> Plan de Vol de Votre Succès
          </div>
          <h1 className="font-display text-2xl font-black leading-tight">Recommandations &amp; Outils Majeurs de l’Expert</h1>
          <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
            Pour réussir ce programme intensif de 28 jours, nous avons compilé ici les meilleures directives méthodologiques, de configuration d'environnements d'exécution locaux et de lectures recommandées issues de notre guide officiel PDF.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane details: Practice guidelines & Tool setup */}
        <div className="lg:col-span-8 space-y-6">
          {/* Practice section */}
          <div className="border border-slate-100/80 rounded-2xl p-6 bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 font-display uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              📝 Conseils de Pratique Quotidienne
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {practiceTips.map((tip, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-orange-50/20 border border-orange-100/30 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-orange-500"></span> {tip.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Local environment setup suggestions */}
          <div className="border border-slate-100/80 rounded-2xl p-6 bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 font-display uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              ⚙ Configuration &amp; Outils Locaux Indispensables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tools.map((devTool, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-indigo-50/10 border border-indigo-100/30 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600"></span> {devTool.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{devTool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right pane sidebar: External reference books and educational portals */}
        <div className="lg:col-span-4 space-y-6">
          {/* Books selection */}
          <div className="border border-slate-102 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-405 uppercase tracking-widest pl-0.5">Lectures d'excellence</h3>
            
            <div className="space-y-3.5">
              <div className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="h-8 w-8 text-xl font-bold">📗</div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">Fluent Python</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Luciano Ramalho — Pour se perfectionner</span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-sans">Guide haut de gamme explorant les subtilités avancées et les meilleures idiotismes du langage.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="h-8 w-8 text-xl font-bold">📘</div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">Clean Code in Python</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Mariano Anaya — Architectures saines</span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-sans">Parfait pour adopter les modèles, linters PEP8 et architectures de tests professionnels.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Portals links click-list */}
          <div className="border border-slate-102 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-405 uppercase tracking-widest pl-0.5">Portails d'Apprentissage</h3>
            
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <a 
                href="https://docs.python.org/3/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-150 rounded-xl hover:bg-slate-50/50 group transition-all"
              >
                <div className="space-y-0.5">
                  <strong className="font-semibold text-slate-800">docs.python.org</strong>
                  <span className="block text-[10px] text-slate-400 font-sans">Référence d’API officielle</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-350 group-hover:text-indigo-600 transition-colors" />
              </a>

              <a 
                href="https://realpython.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-150 rounded-xl hover:bg-slate-50/50 group transition-all"
              >
                <div className="space-y-0.5">
                  <strong className="font-semibold text-slate-800">Real Python</strong>
                  <span className="block text-[10px] text-slate-400 font-sans">Tutoriels experts et articles de blog</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-350 group-hover:text-indigo-600 transition-colors" />
              </a>

              <a 
                href="https://stackoverflow.com/questions/tagged/python" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-150 rounded-xl hover:bg-slate-50/50 group transition-all"
              >
                <div className="space-y-0.5">
                  <strong className="font-semibold text-slate-800">Stack Overflow</strong>
                  <span className="block text-[10px] text-slate-400 font-sans">Résolutions de bugs de la communauté</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-350 group-hover:text-indigo-600 transition-colors" />
              </a>

              <a 
                href="https://www.datacamp.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-150 rounded-xl hover:bg-slate-50/50 group transition-all"
              >
                <div className="space-y-0.5">
                  <strong className="font-semibold text-slate-800">DataCamp</strong>
                  <span className="block text-[10px] text-slate-400 font-sans">Syllabus de cours interactifs data</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-350 group-hover:text-indigo-600 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
