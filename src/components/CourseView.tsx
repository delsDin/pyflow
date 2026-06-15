import { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle2, Terminal, Play, RotateCcw, Copy, Flame, Lock, Shield } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CourseDay, UserProgress } from '../types';
import { courseDays } from '../data/curriculum';
import { PythonHighlighter } from '../utils/pythonHighlighter';
import { runPythonCode } from '../utils/pythonRunner';
import { handleEditorKeyDown } from '../utils/editorUtils';

interface CourseViewProps {
  dayId: number;
  progress: UserProgress;
  onToggleCompleteDay: (dayId: number) => void;
  onSelectDay: (dayId: number) => void;
  unlockedDays: number[];
  isAdminAuthenticated: boolean;
}

export default function CourseView({ dayId, progress, onToggleCompleteDay, onSelectDay, unlockedDays, isAdminAuthenticated }: CourseViewProps) {
  const currentDay = courseDays.find(d => d.id === dayId) || courseDays[0];
  const isCompleted = progress.completedDays.includes(currentDay.id);
  const isLocked = !unlockedDays.includes(currentDay.id);

  // Live code execution simulator states
  const [code, setCode] = useState(currentDay.codeExample);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const syncScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Reset code when changing day
  useEffect(() => {
    setCode(currentDay.codeExample);
    setOutput('');
    // Reset scroll values
    setTimeout(() => {
      if (textareaRef.current && preRef.current) {
        textareaRef.current.scrollTop = 0;
        textareaRef.current.scrollLeft = 0;
        preRef.current.scrollTop = 0;
        preRef.current.scrollLeft = 0;
      }
    }, 50);
  }, [currentDay]);

  if (isLocked) {
    return (
      <div className="max-w-xl mx-auto my-12 animate-fade-in text-slate-700">
        <div className="border border-slate-200 rounded-3xl bg-white p-8 shadow-md text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Lock className="h-8 w-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-display font-black text-xl text-slate-900 tracking-tight">
              Cours du Jour {currentDay.id} : Verrouillé par l'Admin
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-sans px-4">
              Ce cours n'a pas encore été ouvert d'accès pour votre session d'apprentissage. Par défaut, tous les cours, exercices et projets sont bloqués.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-105 rounded-xl text-left space-y-2">
            <h4 className="font-bold text-slate-805 text-xs flex items-center gap-1.5 uppercase tracking-wide text-indigo-900">
              <span>💡</span> Comment débloquer ce module ?
            </h4>
            <ul className="text-[11px] text-slate-500 font-sans space-y-1.5 pl-1.5 leading-relaxed">
              <li className="flex items-start gap-1">
                <span>•</span>
                <span>Contactez votre enseignant pour qu'il ouvre l'accès à ce cours quotidien.</span>
              </li>
              <li className="flex items-start gap-1">
                <span>•</span>
                <span>Si vous êtes l’administrateur ou pour vos tests d'évaluation, rendez-vous dans l'onglet <strong className="text-slate-800">Administration</strong> de la barre latérale pour activer le Jour {currentDay.id}.</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => {
                // Find first unlocked day
                const firstUnlocked = courseDays.find(d => unlockedDays.includes(d.id));
                if (firstUnlocked) {
                  onSelectDay(firstUnlocked.id);
                } else {
                  onSelectDay(1);
                }
              }}
              className="px-4 py-2 hover:bg-slate-100 border border-slate-200 hover:border-slate-350 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
            >
              Aller au premier jour débloqué
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Initialisation de l\'interpréteur Python v3.11...\n');
    setTimeout(() => {
      try {
        const result = runPythonCode(code);
        if (result.success) {
          setOutput(`Exécution réussie.\n--------------------------\n${result.stdout || '(Le script n’a rien imprimé en sortie)'}`);
        } else {
          setOutput(`Erreur d'exécution.\n--------------------------\n${result.error || 'Erreur inconnue.'}`);
        }
      } catch (err: any) {
        setOutput(`Erreur système de l'interpréteur :\n${err.message || err}`);
      }
      setIsRunning(false);
    }, 450);
  };

  const handleResetCode = () => {
    setCode(currentDay.codeExample);
    setOutput('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Define custom elements for react-markdown to match polished layout, coding guidelines and user formatting
  const markdownComponents = {
    // Override pre so it doesn't wrap our styled divs with standard pre formatting
    pre: ({ children }: any) => <>{children}</>,
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className;
      if (isInline) {
        const codeText = String(children);
        // Highlight inline code if it contains common Python elements/keywords
        const hasKeyword = /\b(if|elif|else|and|or|not|True|False|None|print|while|for|range)\b/.test(codeText);
        return (
          <code className="px-1.5 py-0.5 bg-slate-100 font-mono text-slate-800 text-xs rounded-md font-semibold border border-slate-200/50" {...props}>
            {hasKeyword ? <PythonHighlighter code={codeText} isDark={false} /> : children}
          </code>
        );
      }
      const lang = match ? match[1] : 'python';
      return (
        <div className="my-4 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800/60 select-none">
            <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider">
              {lang}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
              }}
              className="px-2 py-1 text-[10px] text-slate-400 hover:text-white font-semibold font-mono flex items-center gap-1 transition-colors rounded hover:bg-slate-800"
            >
              <Copy className="h-2.5 w-2.5" /> Copier
            </button>
          </div>
          <pre className="p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 max-h-96 custom-scrollbar">
            <code className={className} {...props}>
              {lang === 'python' || !match ? (
                <PythonHighlighter code={String(children).replace(/\n$/, '')} />
              ) : (
                children
              )}
            </code>
          </pre>
        </div>
      );
    },
    h1: ({ children }: any) => <h1 className="font-display text-2xl font-black text-slate-900 mt-6 mb-3 border-b border-slate-100 pb-2">{children}</h1>,
    h2: ({ children }: any) => <h2 className="font-display text-xl font-extrabold text-slate-900 mt-6 mb-3 border-b border-slate-100 pb-2">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-display text-base font-bold text-slate-850 mt-5 mb-2 flex items-center gap-1.5 text-indigo-950">{children}</h3>,
    h4: ({ children }: any) => <h4 className="font-display text-sm font-semibold text-slate-800 mt-4 mb-1.5">{children}</h4>,
    p: ({ children }: any) => <p className="text-slate-650 leading-relaxed text-sm mb-4 font-sans">{children}</p>,
    strong: ({ children }: any) => <strong className="font-bold text-slate-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-slate-600">{children}</em>,
    ul: ({ children }: any) => <ul className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>,
    li: ({ children }: any) => <li className="text-slate-650 text-sm leading-relaxed font-sans">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-indigo-200 bg-indigo-50/20 pl-4 py-2.5 pr-2.5 my-4 rounded-r-xl italic text-indigo-950 font-sans">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-6 border border-slate-200/80 rounded-xl shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 text-xs text-left text-slate-700 bg-white">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50 text-slate-800 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
    tr: ({ children }: any) => <tr className="hover:bg-slate-50/50 transition-colors">{children}</tr>,
    th: ({ children }: any) => <th className="px-4 py-3 font-semibold">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 leading-relaxed">{children}</td>,
    a: ({ href, children, ...props }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-500 underline underline-offset-4 transition-colors font-medium"
        {...props}
      >
        {children}
      </a>
    ),
  };

  const hasPrev = currentDay.id > 1;
  const hasNext = currentDay.id < 28;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in">
      {/* Left Pane: Detailed Course Lesson (7 columns) */}
      <div className="xl:col-span-7 space-y-6">
        {/* Navigation & Phase Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Phase {currentDay.phase}
            </span>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Jour {currentDay.id} : {currentDay.title}
              </h1>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100 shrink-0">
                  <CheckCircle2 className="h-3 w-3" /> Lu
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={!hasPrev}
              onClick={() => onSelectDay(currentDay.id - 1)}
              className="p-2 border border-slate-100 hover:border-slate-300 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Jour Précédent"
            >
              <ChevronLeft className="h-4.5 w-4.5 text-slate-600" />
            </button>
            <span className="text-xs font-mono px-2 font-semibold text-slate-500">
              {currentDay.id} / 28
            </span>
            <button
              disabled={!hasNext}
              onClick={() => onSelectDay(currentDay.id + 1)}
              className="p-2 border border-slate-100 hover:border-slate-300 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Jour Suivant"
            >
              <ChevronRight className="h-4.5 w-4.5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Topics outline box */}
        <div className="bg-linear-to-r from-indigo-50/50 to-indigo-100/10 border border-indigo-100/50 rounded-2xl p-5 space-y-3">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-750 flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Au programme aujourd’hui :
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {currentDay.topics.map((topic, i) => (
              <li key={i} className="flex items-start gap-1.5 text-slate-700">
                <span className="text-indigo-500 font-bold mt-0.5">•</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin/Teacher Guide */}
        {isAdminAuthenticated && currentDay.adminGuide && (
          <div className="bg-amber-50/50 border-2 border-amber-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-bl-full -z-10"></div>
            <h3 className="text-amber-800 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-amber-600" /> Guide de l'Instructeur
            </h3>
            <div className="prose prose-sm prose-amber max-w-none text-amber-900/90 leading-relaxed font-sans">
              <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{currentDay.adminGuide}</Markdown>
            </div>
          </div>
        )}

        {/* Core Lesson Text */}
        <div className="prose prose-slate max-w-none text-slate-700">
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{currentDay.contentMarkdown}</Markdown>
        </div>

        {/* Validation Completion Action in footer of lesson */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">Prêt pour l’étape d’après ?</h4>
            <p className="text-xs text-slate-400">Valider cette leçon pour mettre à jour votre score général de progression.</p>
          </div>
          <button
            onClick={() => onToggleCompleteDay(currentDay.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              isCompleted
                ? 'bg-emerald-100 border border-emerald-200 text-emerald-800 hover:bg-emerald-200/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Marqué comme Lu (Annuler)
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Valider le Jour {currentDay.id}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Pane: Live Python Simulator Playground (5 columns) */}
      <div className="xl:col-span-5 sticky top-6 space-y-6">
        <div className="border border-slate-100 rounded-2xl bg-slate-900 shadow-lg overflow-hidden flex flex-col">
          {/* Editor Header */}
          <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-mono font-bold text-slate-350 tracking-wide">
                playground.py
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Copier le code"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleResetCode}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Réinitialiser"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Code Area */}
          <div className="relative bg-slate-950 font-mono text-xs leading-relaxed h-56 border-b border-slate-800/80 overflow-hidden">
            {/* Syntax Highlighter Display layer */}
            <pre
              ref={preRef}
              className="absolute inset-0 p-4 font-mono text-xs leading-relaxed text-slate-300 overflow-hidden whitespace-pre pointer-events-none select-none z-0 bg-transparent"
            >
              <code>
                <PythonHighlighter code={code} />
              </code>
            </pre>
            {/* Edit Input layer */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => handleEditorKeyDown(e, code, setCode)}
              onScroll={syncScroll}
              className="absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none p-4 font-mono text-xs leading-relaxed text-transparent caret-slate-100 focus:ring-0 whitespace-pre z-10 overflow-auto scrollbar-thin"
              spellCheck="false"
            />
          </div>

          {/* Code run trigger bar */}
          <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-mono">
              {copied ? 'Copie effectuée !' : 'Modifiable librement'}
            </span>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-3.5 py-1.5 bg-emerald-600 font-semibold hover:bg-emerald-500 text-white rounded-lg text-xs flex items-center gap-1 disabled:opacity-50 transition-colors"
            >
              <Play className="h-3 w-3 fill-current" /> {isRunning ? 'Calcul...' : 'Lancer le code'}
            </button>
          </div>

          {/* Output simulated Shell terminal */}
          <div className="border-t border-slate-800 bg-black min-h-32 p-4 text-xs font-mono text-slate-300 flex flex-col justify-between">
            <div className="space-y-1 overflow-auto max-h-44 custom-scrollbar whitespace-pre-wrap">
              {output ? (
                <span>{output}</span>
              ) : (
                <span className="text-slate-550 italic">
                  Cliquez sur "Lancer le code" pour exécuter l'exemple de code officiel Python.
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center text-[10px] text-slate-500 justify-between">
              <span>Python 3.11.2 (PyFlow Engine)</span>
              <div>
                <span className="h-1.5 w-1.5 inline-block rounded-full bg-emerald-500 mr-1.5"></span>
                <span>Interpréteur Prêt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Help card */}
        <div className="bg-linear-to-b from-white to-slate-50 border border-slate-100 rounded-xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" /> Astuce d’exécution
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            Vous pouvez surcharger le code directement au sein de la fenêtre de saisie ! Changez les valeurs de variables arithmétiques, et observez de façon concrète la mise à jour des calculs.
          </p>
        </div>
      </div>
    </div>
  );
}
