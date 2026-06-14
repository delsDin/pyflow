import { useState } from 'react';
import { KeyRound, RefreshCw, AlertCircle, BookOpen, Zap, Trophy } from 'lucide-react';
import { fetchStudentAccess, setStoredStudentCode } from '../services/api';

interface StudentLoginProps {
  onSuccess: (studentName: string, unlockedDays: number[], unlockedProjects: string[]) => void;
}

export default function StudentLogin({ onSuccess }: StudentLoginProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setError('Veuillez saisir votre code d\'accès.'); return; }

    setLoading(true);
    setError('');
    try {
      const { student, unlocked_days, unlocked_projects } = await fetchStudentAccess(trimmed);
      setStoredStudentCode(trimmed);
      onSuccess(student.name, unlocked_days, unlocked_projects);
    } catch (err: unknown) {
      setError((err as Error).message || 'Code invalide. Vérifiez auprès de votre formateur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background grid decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-md space-y-8">

        {/* Brand */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-2xl shadow-indigo-500/30 mx-auto">
            <span className="text-white font-black text-3xl tracking-tight font-display">Py</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight font-display">PyFlow</h1>
            <p className="text-slate-400 text-sm mt-1">Formation Python Express</p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex justify-center gap-3 flex-wrap">
          {[
            { icon: BookOpen, label: 'Leçons' },
            { icon: Zap, label: 'Exercices pratiques' },
            { icon: Trophy, label: 'Projets guidés' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700 px-3 py-1.5 rounded-full text-xs text-slate-300 font-medium">
              <Icon className="h-3.5 w-3.5 text-indigo-400" />
              {label}
            </div>
          ))}
        </div>

        {/* Login card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-indigo-400" />
              Accéder à ma formation
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Saisissez le code d'accès fourni par votre formateur pour débloquer votre programme personnalisé.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Code d'accès étudiant
              </label>
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="Ex: PYFLOW-XXX-YYY"
                spellCheck={false}
                autoComplete="off"
                className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:bg-slate-800 text-white placeholder-slate-600 px-4 py-3 rounded-xl font-mono text-sm tracking-widest focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {loading
                ? <><RefreshCw className="h-4 w-4 animate-spin" /> Vérification…</>
                : <><KeyRound className="h-4 w-4" /> Accéder à ma formation</>
              }
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-600">
              Vous n'avez pas de code ? Contactez votre formateur.
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-700">
          PyFlow v1.1 · Formation Python Express
        </p>
      </div>
    </div>
  );
}
