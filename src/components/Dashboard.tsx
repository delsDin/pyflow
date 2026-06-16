import { useState, useEffect } from 'react';
import { BookOpen, Award, Zap, CheckCircle2, Play, Flame, Trophy, Calendar, Sparkles, Lock, RefreshCw } from 'lucide-react';
import { CourseDay, UserProgress, PhaseType } from '../types';
import { courseDays } from '../data/curriculum';
import { fetchLeaderboard, LeaderboardEntry } from '../services/api';

interface DashboardProps {
  progress: UserProgress;
  onSelectDay: (dayId: number) => void;
  onNavigateTab: (tab: 'cours' | 'exercices' | 'projets') => void;
  onSelectProject: (projectId: string) => void;
  unlockedDays: number[];
  unlockedProjects: string[];
}

export default function Dashboard({ progress, onSelectDay, onNavigateTab, onSelectProject, unlockedDays = [], unlockedProjects = [] }: DashboardProps) {
  const [activeSideTab, setActiveSideTab] = useState<'tip' | 'leaderboard'>('tip');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState('');

  useEffect(() => {
    if (activeSideTab === 'leaderboard') {
      setLeaderboardLoading(true);
      setLeaderboardError('');
      fetchLeaderboard()
        .then(data => setLeaderboard(data))
        .catch(err => setLeaderboardError(err.message || 'Erreur chargement classement'))
        .finally(() => setLeaderboardLoading(false));
    }
  }, [activeSideTab]);

  const totalDays = 28;
  const completedCount = progress.completedDays.length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  // Group days by phase
  const phases: { name: PhaseType; days: CourseDay[]; desc: string; badgeColor: string; bgClass: string; borderClass: string }[] = [
    {
      name: 'Débutant',
      days: courseDays.filter(d => d.phase === 'Débutant'),
      desc: 'Fondations et bases solides algorithmiques',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      bgClass: 'bg-emerald-50/50 dark:bg-emerald-950/10',
      borderClass: 'border-emerald-100 dark:border-emerald-900/40'
    },
    {
      name: 'Intermédiaire',
      days: courseDays.filter(d => d.phase === 'Intermédiaire'),
      desc: 'Gestion des données, fichiers et APIs web',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      bgClass: 'bg-blue-50/50 dark:bg-blue-950/10',
      borderClass: 'border-blue-100 dark:border-blue-900/40'
    },
    {
      name: 'Expert',
      days: courseDays.filter(d => d.phase === 'Expert'),
      desc: 'Orienté Objet, Base de données SQL et Machine Learning',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
      bgClass: 'bg-purple-50/50 dark:bg-purple-950/10',
      borderClass: 'border-purple-100 dark:border-purple-900/40'
    }
  ];

  // Identify first incomplete day
  const getNextRecommendedDay = (): CourseDay => {
    const sortedDays = [...courseDays].sort((a, b) => a.id - b.id);
    for (const d of sortedDays) {
      if (!progress.completedDays.includes(d.id)) {
        return d;
      }
    }
    return sortedDays[sortedDays.length - 1]; // return last if all complete
  };

  const nextDay = getNextRecommendedDay();

  // Custom Python advice based on current completed status
  const getDailyTip = () => {
    if (completedCount === 0) {
      return "Conseil du jour : Prenez le temps de bien installer VS Code et d'écrire votre premier print() aujourd'hui !";
    } else if (completedCount <= 7) {
      return "Conseil du jour : L'indentation est cruciale en Python (4 espaces). Ne mélangez pas les tabulations et les espaces !";
    } else if (completedCount <= 14) {
      return "Conseil du jour : Lorsque vous ouvrez un fichier, préférez toujours l'instruction 'with open()' pour éviter les verrous mémoire.";
    } else {
      return "Conseil du jour : Surchargez les opérateurs via les 'dunder methods' (ex. __str__) pour rendre l'import de vos classes d'objets élégant !";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-blue-300 uppercase">
              <Sparkles className="h-3 w-3 animate-pulse" /> Curriculum Accéléré 28 Jours
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl text-white">
              Prêt à accélérer sur Python ?
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              D’étudiant à expert opérationnel. Suivez les chapitres quotidiens, testez vos compétences par des quiz interactifs et concevez des mini-projets de synthèse.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 items-center text-xs text-slate-400">
              <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-orange-500" /> Série : <strong className="text-white font-medium">{progress.streak} jour{progress.streak > 1 ? 's' : ''}</strong></span>
              <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-blue-400" /> Progression : <strong className="text-white font-medium">{completedCount}/{totalDays} Cours</strong></span>
            </div>
          </div>
          
          <div className="shrink-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">État global</span>
            <div className="relative flex items-center justify-center">
              {/* Simple inline SVG radial progress */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="transparent" />
                <circle cx="48" cy="48" r="40" stroke="#a5b4fc" strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-bold font-display">{progressPercent}%</span>
              </div>
            </div>
            <button 
              onClick={() => onSelectDay(nextDay.id)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
            >
              <Play className="h-3.5 w-3.5 fill-current" /> Continuer (Jour {nextDay.id})
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Item & Tip of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-slate-100 rounded-2xl p-6 bg-white shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-500" /> Recommandation Actuelle
          </h2>
          
          <div className="flex flex-col sm:flex-row shadow-2xs border border-slate-50 rounded-xl p-4 gap-4 items-start hover:border-indigo-100 hover:bg-indigo-50/10 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold font-display text-lg">
              {nextDay.id}
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 uppercase">
                  Jour {nextDay.id} • {nextDay.phase}
                </span>
                <span className="text-xs text-slate-400">Recommandé</span>
              </div>
              <h3 className="font-bold text-slate-800 text-base">{nextDay.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{nextDay.description}</p>
              
              <div className="pt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    onSelectDay(nextDay.id);
                    onNavigateTab('cours');
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  Lire le Cours
                </button>
                <button
                  onClick={() => {
                    onSelectDay(nextDay.id);
                    onNavigateTab('exercices');
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Faire les Exercices
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PyFlow Quote / Tip / Leaderboard Widget */}
        <div className="border border-slate-100 rounded-2xl bg-linear-to-b from-slate-50 to-slate-100/30 flex flex-col justify-between overflow-hidden shadow-2xs">
          {/* Card Header Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50">
            <button
              onClick={() => setActiveSideTab('tip')}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeSideTab === 'tip'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              💡 Conseils
            </button>
            <button
              onClick={() => setActiveSideTab('leaderboard')}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeSideTab === 'leaderboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🏆 Classement
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
            {activeSideTab === 'tip' ? (
              <>
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    💡
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Le Conseil du Coach PyFlow</h3>
                  <p className="text-xs text-slate-650 leading-relaxed font-sans">
                    {getDailyTip()}
                  </p>
                </div>
                <div className="text-[10px] text-slate-450 italic font-mono mt-2">
                  "La régularité bat l’intensité de 100%."
                </div>
              </>
            ) : (
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    🏆 Top Étudiants PyFlow
                  </h3>
                  <p className="text-[10px] text-slate-450 mt-0.5 font-sans">Classement général de la promo</p>
                </div>

                {leaderboardLoading ? (
                  <div className="flex-1 flex items-center justify-center py-6">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-sans">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                      Mise à jour du classement...
                    </span>
                  </div>
                ) : leaderboardError ? (
                  <div className="text-[11px] text-rose-500 py-4 text-center font-sans">{leaderboardError}</div>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 mt-2">
                    {leaderboard.slice(0, 5).map((entry, idx) => {
                      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                      return (
                        <div key={entry.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-slate-100 shadow-3xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-slate-500 min-w-5 shrink-0 text-center">{medal}</span>
                            <span className="font-bold text-slate-800 truncate">{entry.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded-md font-bold font-mono">
                              {entry.score} pts
                            </span>
                            {entry.streak > 0 && (
                              <span className="text-[10px] text-orange-600 font-bold shrink-0">
                                🔥 {entry.streak}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {leaderboard.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-4 font-sans">Aucun étudiant dans le classement.</p>
                    )}
                  </div>
                )}

                <div className="text-[9px] text-slate-400 text-center mt-2 border-t border-slate-100 pt-2 font-mono">
                  Score = Jours × 100 + Quiz × 10 + Défis × 50
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Day map subdivided by Phase */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-950 font-display flex items-center gap-2">
          <BookOpen className="h-5.5 w-5.5 text-slate-700" /> Plan d’Études du Projet
        </h2>
        
        {phases.map((phase, idx) => {
          const finishedInPhase = phase.days.filter(d => progress.completedDays.includes(d.id)).length;
          const totalInPhase = phase.days.length;
          const phasePercent = Math.round((finishedInPhase / totalInPhase) * 100);

          return (
            <div key={idx} className={`border border-slate-100 rounded-2xl p-6 space-y-4 bg-white transition-all shadow-2xs`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-slate-900 text-lg uppercase tracking-wide">
                      Phase {idx + 1}: {phase.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${phase.badgeColor}`}>
                      {totalInPhase} jours
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{phase.desc}</p>
                </div>
                
                <div className="sm:text-right shrink-0">
                  <span className="text-xs text-slate-400">Progression Phase</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${phasePercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-700">{finishedInPhase}/{totalInPhase}</span>
                  </div>
                </div>
              </div>

              {/* Day Circle / Grid items */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {phase.days.map((day) => {
                  const isCompleted = progress.completedDays.includes(day.id);
                  const isCurrent = day.id === nextDay.id;
                  const isLocked = !unlockedDays.includes(day.id);

                  if (isLocked) {
                    return (
                      <button
                        key={day.id}
                        onClick={() => {
                          onSelectDay(day.id);
                          onNavigateTab('cours');
                        }}
                        className="relative flex flex-col justify-between items-start text-left p-3.5 rounded-xl border border-slate-100 transition-all h-28 cursor-pointer bg-slate-50/70 hover:bg-slate-50 hover:border-slate-350 opacity-65 text-slate-400"
                        title="Verrouillé par l'administration"
                      >
                        <div className="flex w-full items-center justify-between mb-1">
                          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-slate-200/50 text-slate-500">
                            J-{day.id} 🔒
                          </span>
                          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0 animate-pulse-slow" />
                        </div>
                        <div className="space-y-0.5 w-full">
                          <h4 className="font-semibold text-slate-500 text-[11px] leading-tight line-clamp-2">
                            {day.title}
                          </h4>
                          <p className="text-[9px] text-slate-400 capitalize truncate w-full">
                            Bloqué Admin
                          </p>
                        </div>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={day.id}
                      onClick={() => {
                        onSelectDay(day.id);
                        onNavigateTab('cours');
                      }}
                      className={`relative flex flex-col justify-between items-start text-left p-3.5 rounded-xl border transition-all h-28 cursor-pointer group ${
                        isCompleted
                          ? 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200 shadow-2xs'
                          : isCurrent
                          ? 'bg-indigo-50/30 border-indigo-200 shadow-sm ring-1 ring-indigo-100 hover:bg-indigo-50/50'
                          : 'bg-white border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between mb-1">
                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                          isCompleted 
                            ? 'bg-emerald-100/70 text-emerald-800' 
                            : isCurrent
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          J-{day.id}
                        </span>
                        {isCompleted && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />}
                        {isCurrent && <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>}
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="font-semibold text-slate-800 text-[11px] leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {day.title}
                        </h4>
                        <p className="text-[9px] text-slate-400 capitalize truncate w-full">
                          {day.topics.length} concepts
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Guided Projects Section */}
      <div className="border border-slate-100 rounded-2xl p-6 bg-white space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-950 font-display flex items-center gap-2">
            <Trophy className="h-5.5 w-5.5 text-orange-500" /> Vos Projets Pratiques
          </h2>
          <button 
            onClick={() => onNavigateTab('projets')}
            className="text-indigo-600 hover:text-indigo-500 text-xs font-semibold"
          >
            Tous les projets &rarr;
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-50 hover:border-slate-100 rounded-xl p-4 space-y-3 bg-linear-to-b from-white to-slate-50/40 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">Débutant</span>
              <span className="text-[10px] text-slate-400 font-medium">~1.5h</span>
            </div>
            <h3 className="font-bold text-slate-800 text-xs leading-tight">Calculatrice Interactive Console</h3>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">Associez inputs, boucles conditionnelles et fonctions.</p>
            <button 
              onClick={() => {
                onSelectProject('proj_debutant_1');
                onNavigateTab('projets');
              }}
              className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors mt-2 cursor-pointer ${
                unlockedProjects.includes('proj_debutant_1')
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  : 'bg-amber-50 border border-amber-100/50 hover:bg-amber-100/30 text-amber-800 flex items-center justify-center gap-1'
              }`}
            >
              {unlockedProjects.includes('proj_debutant_1') ? 'Lancer le Projet' : <>🔒 Bloqué Admin</>}
            </button>
          </div>

          <div className="border border-slate-50 hover:border-slate-100 rounded-xl p-4 space-y-3 bg-linear-to-b from-white to-slate-50/40 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">Intermédiaire</span>
              <span className="text-[10px] text-slate-400 font-medium">~2h</span>
            </div>
            <h3 className="font-bold text-slate-800 text-xs leading-tight">Analyseur de Ventes CSV/JSON</h3>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">Parsez des fichiers textes, calculez des moyennes de ventes clients.</p>
            <button 
              onClick={() => {
                onSelectProject('proj_intermediaire_1');
                onNavigateTab('projets');
              }}
              className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors mt-2 cursor-pointer ${
                unlockedProjects.includes('proj_intermediaire_1')
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  : 'bg-amber-50 border border-amber-100/50 hover:bg-amber-100/30 text-amber-800 flex items-center justify-center gap-1'
              }`}
            >
              {unlockedProjects.includes('proj_intermediaire_1') ? 'Lancer le Projet' : <>🔒 Bloqué Admin</>}
            </button>
          </div>

          <div className="border border-slate-50 hover:border-slate-100 rounded-xl p-4 space-y-3 bg-linear-to-b from-white to-slate-50/40 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">Expert</span>
              <span className="text-[10px] text-slate-400 font-medium">~3h</span>
            </div>
            <h3 className="font-bold text-slate-800 text-xs leading-tight">Micro-API RESTful en Flask</h3>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">Configurez un serveur et éditez des endpoints HTTP complets.</p>
            <button 
              onClick={() => {
                onSelectProject('proj_expert_1');
                onNavigateTab('projets');
              }}
              className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors mt-2 cursor-pointer ${
                unlockedProjects.includes('proj_expert_1')
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  : 'bg-amber-50 border border-amber-100/50 hover:bg-amber-100/30 text-amber-800 flex items-center justify-center gap-1'
              }`}
            >
              {unlockedProjects.includes('proj_expert_1') ? 'Lancer le Projet' : <>🔒 Bloqué Admin</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
