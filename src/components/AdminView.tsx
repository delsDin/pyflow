import { useState, useEffect, useCallback } from 'react';
import {
  Shield, Lock, Unlock, Key, LogOut, Eye, EyeOff,
  CheckSquare, Square, Trophy, UserPlus, Trash2,
  RefreshCw, AlertCircle, ChevronDown, ChevronUp, Users,
  Settings, ToggleLeft, ToggleRight, Pencil
} from 'lucide-react';
import { courseDays } from '../data/curriculum';
import { projects } from '../data/projects';
import { generateDayQuizzes, generateDayChallenges } from '../data/exercises';
import {
  adminLogin, adminLogout,
  fetchStudents, createStudent, deleteStudent, updateStudentAccess,
  fetchAdmins, createAdmin, updateAdmin,
  getStoredAdminToken, setStoredAdminToken, clearStoredAdminToken,
  Student, AdminAccount
} from '../services/api';

interface AdminViewProps {
  unlockedDays: number[];
  unlockedProjects: string[];
  onUpdateUnlockedDays: (days: number[]) => void;
  onUpdateUnlockedProjects: (projects: string[]) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
}

const phases = [
  { name: 'Débutant (J1–7)', type: 'Débutant', days: courseDays.filter(d => d.phase === 'Débutant') },
  { name: 'Intermédiaire (J8–14)', type: 'Intermédiaire', days: courseDays.filter(d => d.phase === 'Intermédiaire') },
  { name: 'Expert (J15–28)', type: 'Expert', days: courseDays.filter(d => d.phase === 'Expert') },
];

export default function AdminView({
  isAdminAuthenticated, setIsAdminAuthenticated
}: AdminViewProps) {
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Student identity & gate
  const [adminName, setAdminName] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'etudiants' | 'admins'>('etudiants');

  // Admin accounts
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminDisplayName, setNewAdminDisplayName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminFormError, setAdminFormError] = useState('');
  const [adminFormLoading, setAdminFormLoading] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');

  // Students state
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');

  // Selected student for access management
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [localDays, setLocalDays] = useState<number[]>([]);
  const [localProjects, setLocalProjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Selected student tab state
  const [studentDetailTab, setStudentDetailTab] = useState<'access' | 'progress'>('access');
  const [selectedDetailDayId, setSelectedDetailDayId] = useState<number>(1);

  // Create student form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCode, setNewCode] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Expanded phases
  const [expandedPhases, setExpandedPhases] = useState<number[]>([0, 1, 2]);

  // Check token on mount
  useEffect(() => {
    const token = getStoredAdminToken();
    if (token) {
      setIsAdminAuthenticated(true);
      const storedName = localStorage.getItem('pyflow_admin_name') || '';
      setAdminName(storedName);
    }
  }, [setIsAdminAuthenticated]);

  const loadStudents = useCallback(async () => {
    setStudentsLoading(true);
    setStudentsError('');
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (e: unknown) {
      const err = e as Error;
      if (err.message.includes('401')) {
        clearStoredAdminToken();
        localStorage.removeItem('pyflow_admin_name');
        setIsAdminAuthenticated(false);
      }
      setStudentsError(err.message);
    } finally {
      setStudentsLoading(false);
    }
  }, [setIsAdminAuthenticated]);

  const loadAdmins = useCallback(async () => {
    setAdminsLoading(true);
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch { /* silent */ }
    finally { setAdminsLoading(false); }
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadStudents();
      loadAdmins();
    }
  }, [isAdminAuthenticated, loadStudents, loadAdmins]);

  // When student selected, load their current access into local state
  useEffect(() => {
    if (!selectedStudentId) return;
    const s = students.find(st => st.id === selectedStudentId);
    if (!s) return;
    setLocalDays(s.pyflow_unlocked_days.map(d => d.day_id));
    setLocalProjects(s.pyflow_unlocked_projects.map(p => p.project_id));
    setSaveMsg('');
    setStudentDetailTab('access');
    setSelectedDetailDayId(1);
  }, [selectedStudentId, students]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const { token, admin_name } = await adminLogin(password);
      setStoredAdminToken(token);
      localStorage.setItem('pyflow_admin_name', admin_name);
      setAdminName(admin_name);
      setIsAdminAuthenticated(true);
    } catch (err: unknown) {
      setLoginError((err as Error).message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    localStorage.removeItem('pyflow_admin_name');
    setAdminName('');
    setIsAdminAuthenticated(false);
    setStudents([]);
    setSelectedStudentId(null);
  };

  const handleSaveAccess = async () => {
    if (!selectedStudentId) return;
    setSaving(true);
    setSaveMsg('');
    try {
      await updateStudentAccess(selectedStudentId, localDays, localProjects);
      setSaveMsg('✅ Accès mis à jour avec succès.');
      // Refresh student list
      await loadStudents();
    } catch (err: unknown) {
      setSaveMsg(`❌ ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) {
      setCreateError('Nom et code étudiant requis.');
      return;
    }
    setCreateLoading(true);
    setCreateError('');
    try {
      await createStudent({ name: newName.trim(), email: newEmail.trim() || undefined, student_code: newCode.trim() });
      setNewName(''); setNewEmail(''); setNewCode('');
      setShowCreateForm(false);
      await loadStudents();
    } catch (err: unknown) {
      setCreateError((err as Error).message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Supprimer l'étudiant "${name}" ? Cette action est irréversible.`)) return;
    try {
      await deleteStudent(id);
      if (selectedStudentId === id) setSelectedStudentId(null);
      await loadStudents();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const toggleDay = (dayId: number) => {
    setLocalDays(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId].sort((a, b) => a - b)
    );
  };

  const toggleProject = (projectId: string) => {
    setLocalProjects(prev =>
      prev.includes(projectId) ? prev.filter(p => p !== projectId) : [...prev, projectId]
    );
  };

  const unlockAll = () => {
    setLocalDays(courseDays.map(d => d.id));
    setLocalProjects(projects.map(p => p.id));
  };

  const lockAll = () => { setLocalDays([]); setLocalProjects([]); };

  const unlockPhase = (phaseIdx: number) => {
    const phase = phases[phaseIdx];
    const dayIds = phase.days.map(d => d.id);
    const projIds = phaseIdx === 0 ? ['proj_debutant_1'] : phaseIdx === 1 ? ['proj_intermediaire_1'] : ['proj_expert_1'];
    setLocalDays(prev => Array.from(new Set([...prev, ...dayIds])).sort((a, b) => a - b));
    setLocalProjects(prev => Array.from(new Set([...prev, ...projIds])));
  };

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────────
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 animate-fade-in">
        <div className="border border-slate-200 rounded-3xl bg-white p-8 shadow-md space-y-6 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Shield className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-black text-xl text-slate-900">Portail Administrateur</h2>
            <p className="text-xs text-slate-500 leading-relaxed px-2">
              Connexion sécurisée via Supabase. Les accès sont persistants et partagés entre sessions.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mot de passe Admin</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mot de passe…"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-mono focus:bg-white focus:outline-indigo-500 pr-10"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {loginError && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-100 p-3 rounded-lg flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {loginError}
              </p>
            )}
            <button type="submit" disabled={loginLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold text-xs rounded-xl shadow cursor-pointer transition-colors flex items-center justify-center gap-2">
              {loginLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
              {loginLoading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // ── HANDLERS ADMINS ───────────────────────────────────────────────────────────

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim() || !newAdminDisplayName.trim() || !newAdminPassword.trim()) { setAdminFormError('Tous les champs sont requis.'); return; }
    setAdminFormLoading(true); setAdminFormError('');
    try {
      await createAdmin({ username: newAdminUsername.trim(), display_name: newAdminDisplayName.trim(), password: newAdminPassword.trim() });
      setNewAdminUsername(''); setNewAdminDisplayName(''); setNewAdminPassword('');
      setShowAdminForm(false);
      await loadAdmins();
    } catch (err: unknown) { setAdminFormError((err as Error).message); }
    finally { setAdminFormLoading(false); }
  };

  const handleUpdateAdminPassword = async (adminId: string) => {
    if (!editPassword.trim()) return;
    try { await updateAdmin(adminId, { password: editPassword.trim() }); setEditingAdminId(null); setEditPassword(''); await loadAdmins(); }
    catch (err: unknown) { alert((err as Error).message); }
  };

  const handleToggleAdminActive = async (adminId: string, currentState: boolean) => {
    try { await updateAdmin(adminId, { is_active: !currentState }); await loadAdmins(); }
    catch (err: unknown) { alert((err as Error).message); }
  };

  // ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in text-slate-700">

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-7 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold tracking-wider text-indigo-300 uppercase">
            <Shield className="h-3.5 w-3.5" /> Administration PyFlow · Supabase
          </div>
          <h1 className="font-display text-2xl font-black">Portail d'Administration</h1>
          {adminName && (
            <p className="text-indigo-300 text-xs font-semibold">
              Connecté en tant que : <span className="text-white">{adminName}</span>
            </p>
          )}
        </div>
        <button onClick={handleLogout}
          className="shrink-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer">
          <LogOut className="h-4 w-4 text-slate-400" /> Déconnexion
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {([['etudiants', 'Étudiants', Users], ['admins', 'Comptes Admins', Settings]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => setActiveSection(key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSection === key ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {/* ── SECTION COMPTES ADMINS ─────────────────────────────────────────── */}
      {activeSection === 'admins' && (
        <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-indigo-500" /> Comptes Administrateurs ({admins.length})
            </h2>
            <button onClick={() => setShowAdminForm(!showAdminForm)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors">
              <UserPlus className="h-3 w-3" /> Ajouter
            </button>
          </div>

          {showAdminForm && (
            <form onSubmit={handleCreateAdmin} className="p-5 border-b border-slate-100 bg-indigo-50/30 space-y-3">
              <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Nouvel administrateur</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={newAdminUsername} onChange={e => setNewAdminUsername(e.target.value.toLowerCase())} placeholder="Identifiant (ex: formateur2) *"
                  className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-indigo-400 font-mono" />
                <input value={newAdminDisplayName} onChange={e => setNewAdminDisplayName(e.target.value)} placeholder="Nom affiché (ex: Formateur 2) *"
                  className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-indigo-400" />
              </div>
              <input type="password" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} placeholder="Mot de passe *"
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-indigo-400 font-mono" />
              {adminFormError && <p className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg">{adminFormError}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={adminFormLoading}
                  className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1">
                  {adminFormLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                  {adminFormLoading ? 'Création…' : 'Créer le compte'}
                </button>
                <button type="button" onClick={() => setShowAdminForm(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer">Annuler</button>
              </div>
            </form>
          )}

          <div className="divide-y divide-slate-50">
            {adminsLoading ? (
              <div className="p-8 text-center text-slate-400 text-xs"><RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" /> Chargement…</div>
            ) : admins.map(adm => (
              <div key={adm.id} className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{adm.display_name}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${adm.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {adm.is_active ? '● Actif' : '○ Inactif'}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500">@{adm.username}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleToggleAdminActive(adm.id, adm.is_active)}
                      title={adm.is_active ? 'Désactiver' : 'Activer'}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                      {adm.is_active
                        ? <ToggleRight className="h-5 w-5 text-emerald-500" />
                        : <ToggleLeft className="h-5 w-5 text-slate-400" />}
                    </button>
                    <button onClick={() => { setEditingAdminId(editingAdminId === adm.id ? null : adm.id); setEditPassword(''); }}
                      title="Changer le mot de passe"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {editingAdminId === adm.id && (
                  <div className="flex gap-2 items-center">
                    <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)}
                      placeholder="Nouveau mot de passe…"
                      className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-indigo-400 font-mono" />
                    <button onClick={() => handleUpdateAdminPassword(adm.id)} disabled={!editPassword.trim()}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg cursor-pointer disabled:opacity-50">
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION ÉTUDIANTS ─────────────────────────────────────────────── */}
      {activeSection === 'etudiants' && <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: Student list ─────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-4 w-4 text-indigo-500" /> Étudiants ({students.length})
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={loadStudents} title="Rafraîchir"
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                  <RefreshCw className={`h-3.5 w-3.5 ${studentsLoading ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer">
                  <UserPlus className="h-3 w-3" /> Ajouter
                </button>
              </div>
            </div>

            {/* Create student form */}
            {showCreateForm && (
              <form onSubmit={handleCreateStudent} className="p-4 border-b border-slate-100 bg-indigo-50/30 space-y-3">
                <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Nouvel étudiant</p>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nom complet *"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-indigo-400" />
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email (optionnel)"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-indigo-400" />
                <input value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} placeholder="Code unique ex: DELA-2026 *"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-mono focus:outline-indigo-400" />
                {createError && <p className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg">{createError}</p>}
                <div className="flex gap-2">
                  <button type="submit" disabled={createLoading}
                    className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1">
                    {createLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                    {createLoading ? 'Création…' : 'Créer'}
                  </button>
                  <button type="button" onClick={() => setShowCreateForm(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer">
                    Annuler
                  </button>
                </div>
              </form>
            )}

            {/* Student list */}
            <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
              {studentsLoading && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" /> Chargement…
                </div>
              )}
              {studentsError && (
                <div className="p-4 text-xs text-rose-600 bg-rose-50 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {studentsError}
                </div>
              )}
              {!studentsLoading && students.length === 0 && !studentsError && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Aucun étudiant. Créez-en un avec le bouton "Ajouter".
                </div>
              )}
              {students.map(s => {
                const isSelected = s.id === selectedStudentId;
                const daysCount = s.pyflow_unlocked_days.length;
                const projCount = s.pyflow_unlocked_projects.length;
                const rawProgress = s.pyflow_progress;
                const progress = Array.isArray(rawProgress) ? rawProgress[0] : rawProgress;
                return (
                  <div key={s.id}
                    onClick={() => setSelectedStudentId(isSelected ? null : s.id)}
                    className={`px-4 py-3 cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 border-l-2 border-indigo-500' : 'hover:bg-slate-50 border-l-2 border-transparent'}`}>
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{s.name}</p>
                        <p className="text-[10px] font-mono text-indigo-600 font-semibold">{s.student_code}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {daysCount}/28 jours · {projCount} projets
                          {progress?.streak ? ` · 🔥 ${progress.streak}j` : ''}
                        </p>
                      </div>
                      <button onClick={e => { e.stopPropagation(); handleDeleteStudent(s.id, s.name); }}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Access editor ────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-4">
          {!selectedStudent ? (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm bg-white">
              <Shield className="h-10 w-10 mx-auto mb-3 text-slate-300" />
              <p className="font-semibold text-slate-500">Sélectionnez un étudiant</p>
              <p className="text-xs mt-1">Cliquez sur un étudiant dans la liste pour gérer ses accès.</p>
            </div>
          ) : (
            <>
              {/* Student header */}
              <div className="border border-slate-100 rounded-2xl bg-white shadow-sm p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-slate-900">{selectedStudent.name}</p>
                  <p className="text-xs font-mono text-indigo-600">{selectedStudent.student_code}</p>
                  {selectedStudent.email && <p className="text-[10px] text-slate-400">{selectedStudent.email}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={lockAll}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Tout bloquer
                  </button>
                  <button onClick={unlockAll}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1">
                    <Unlock className="h-3 w-3" /> Tout débloquer
                  </button>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setStudentDetailTab('access')}
                  className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    studentDetailTab === 'access'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  🔒 Accès & Déblocage
                </button>
                <button
                  onClick={() => setStudentDetailTab('progress')}
                  className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    studentDetailTab === 'progress'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  📈 Progression & Exercices
                </button>
              </div>

              {studentDetailTab === 'access' ? (
                <>
                  {/* Days by phase */}
                  <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        📅 Jours ({localDays.length}/28)
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {phases.map((phase, pIdx) => {
                        const isExpanded = expandedPhases.includes(pIdx);
                        const phaseUnlocked = phase.days.filter(d => localDays.includes(d.id)).length;
                        return (
                          <div key={pIdx}>
                            <div className="flex items-center justify-between px-5 py-3 bg-slate-50/50">
                              <button onClick={() => setExpandedPhases(prev =>
                                isExpanded ? prev.filter(i => i !== pIdx) : [...prev, pIdx]
                              )} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:text-indigo-600 transition-colors">
                                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                {phase.name}
                                <span className="font-mono text-slate-500">{phaseUnlocked}/{phase.days.length}</span>
                              </button>
                              <button onClick={() => unlockPhase(pIdx)}
                                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md transition-all cursor-pointer">
                                Débloquer phase
                              </button>
                            </div>
                            {isExpanded && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4">
                                {phase.days.map(day => {
                                  const isUnlocked = localDays.includes(day.id);
                                  return (
                                    <button key={day.id} onClick={() => toggleDay(day.id)}
                                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                        isUnlocked
                                          ? 'bg-indigo-500 text-white border-indigo-600 font-semibold shadow-sm'
                                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                      }`}>
                                      <span className="truncate pr-1.5 leading-tight select-none">J-{day.id}</span>
                                      {isUnlocked ? <Unlock className="h-3 w-3 shrink-0" /> : <Lock className="h-3 w-3 text-slate-400 shrink-0" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="border border-slate-100 rounded-2xl bg-white shadow-sm p-5 space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-orange-500" /> Projets ({localProjects.length}/{projects.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {projects.map(proj => {
                        const isUnlocked = localProjects.includes(proj.id);
                        return (
                          <button key={proj.id} onClick={() => toggleProject(proj.id)}
                            className={`flex items-center justify-between p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                              isUnlocked ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}>
                            <div className="space-y-0.5 truncate w-[85%]">
                              <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                                isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}>{proj.level}</span>
                              <div className="font-semibold text-xs truncate pt-1">{proj.title}</div>
                            </div>
                            {isUnlocked ? <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" /> : <Square className="h-4 w-4 text-slate-300 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="flex items-center justify-between gap-4">
                    {saveMsg && (
                      <p className={`text-xs font-medium px-3 py-2 rounded-lg border ${
                        saveMsg.startsWith('✅') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                      }`}>{saveMsg}</p>
                    )}
                    <button onClick={handleSaveAccess} disabled={saving}
                      className="ml-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors flex items-center gap-2">
                      {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                      {saving ? 'Sauvegarde…' : '💾 Sauvegarder les accès'}
                    </button>
                  </div>
                </>
              ) : (() => {
                const rawProg = selectedStudent.pyflow_progress;
                const prog = (Array.isArray(rawProg) ? rawProg[0] : rawProg) || {
                  streak: 0,
                  last_active_date: null,
                  completed_days: [],
                  completed_quizzes: {},
                  completed_challenges: {},
                  completed_projects: []
                };

                const completedQuizzesCount = Object.keys(prog.completed_quizzes || {}).filter(k => prog.completed_quizzes?.[k]).length;
                const completedChallengesCount = Object.keys(prog.completed_challenges || {}).length;

                return (
                  <div className="space-y-4">
                    {/* Summary metrics card */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jours complétés</p>
                        <p className="text-lg font-black text-slate-900 mt-1">
                          {prog.completed_days.length} / 28
                        </p>
                      </div>
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quiz validés</p>
                        <p className="text-lg font-black text-slate-900 mt-1">
                          {completedQuizzesCount}
                        </p>
                      </div>
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Défis soumis</p>
                        <p className="text-lg font-black text-slate-900 mt-1">
                          {completedChallengesCount}
                        </p>
                      </div>
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activité</p>
                        <p className="text-lg font-black text-indigo-650 mt-1">
                          🔥 {prog.streak || 0} jours
                        </p>
                      </div>
                    </div>

                    {/* Day selector & Exercises detailed view */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Day sidebar */}
                      <div className="md:col-span-4 border border-slate-150 rounded-2xl bg-white shadow-sm max-h-[400px] overflow-y-auto divide-y divide-slate-100">
                        <div className="p-3 bg-slate-50 border-b border-slate-100 sticky top-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sélectionner un jour</p>
                        </div>
                        {courseDays.map(day => {
                          const isSelected = day.id === selectedDetailDayId;
                          const dayQuizzes = generateDayQuizzes(day.id);
                          const dayChallenges = generateDayChallenges(day.id);
                          
                          const dayQuizzesCount = dayQuizzes.filter(q => prog.completed_quizzes?.[q.id]).length;
                          const dayChallengesCount = dayChallenges.filter(c => prog.completed_challenges?.[c.id]).length;
                          const isDayCompleted = prog.completed_days.includes(day.id);
                          
                          return (
                            <button
                              key={day.id}
                              onClick={() => setSelectedDetailDayId(day.id)}
                              className={`w-full text-left p-3 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected ? 'bg-indigo-50 font-semibold text-indigo-700' : 'hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <span className="font-mono mr-1.5">J-{day.id}</span>
                                <span className="truncate">{day.title}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 text-[9px]">
                                {dayQuizzesCount > 0 && (
                                  <span className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded-md font-mono">
                                    Q:{dayQuizzesCount}
                                  </span>
                                )}
                                {dayChallengesCount > 0 && (
                                  <span className="bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded-md font-mono">
                                    C:{dayChallengesCount}
                                  </span>
                                )}
                                {isDayCompleted && (
                                  <span className="text-emerald-600 font-bold ml-0.5" title="Jour marqué complété">✓</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Exercises view */}
                      <div className="md:col-span-8 border border-slate-150 rounded-2xl bg-white shadow-sm p-4 space-y-4 max-h-[400px] overflow-y-auto">
                        <div>
                          <h4 className="text-xs font-black text-slate-900">
                            Jour {selectedDetailDayId} : {courseDays.find(d => d.id === selectedDetailDayId)?.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Détails des quiz et défis de code validés par l'étudiant.
                          </p>
                        </div>

                        {/* Quizzes list */}
                        <div className="space-y-2.5">
                          <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                            📝 Quiz théoriques ({generateDayQuizzes(selectedDetailDayId).filter(q => prog.completed_quizzes?.[q.id]).length} / 15 validés)
                          </h5>
                          <div className="space-y-1.5">
                            {generateDayQuizzes(selectedDetailDayId).map((quiz, qIdx) => {
                              const isPassed = !!prog.completed_quizzes?.[quiz.id];
                              return (
                                <div key={quiz.id} className="text-xs flex gap-2 items-start p-2 rounded-xl border border-slate-100 bg-slate-50/50">
                                  <span className={`h-4 w-4 rounded-full shrink-0 flex items-center justify-center font-mono text-[9px] font-bold ${
                                    isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                                  }`}>
                                    {qIdx + 1}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 leading-relaxed text-[11px]">{quiz.question}</p>
                                    {isPassed ? (
                                      <p className="text-[9px] text-emerald-600 font-bold mt-0.5">✓ Validé · Option {quiz.answerIndex + 1} ({quiz.options[quiz.answerIndex]})</p>
                                    ) : (
                                      <p className="text-[9px] text-slate-450 mt-0.5">○ Non complété</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Challenges list */}
                        <div className="space-y-3">
                          <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                            💻 Défis de programmation
                          </h5>
                          <div className="space-y-2">
                            {generateDayChallenges(selectedDetailDayId).map((challenge) => {
                              const submittedCode = prog.completed_challenges?.[challenge.id];
                              return (
                                <div key={challenge.id} className="p-3 rounded-2xl border border-slate-150 bg-slate-50/20 space-y-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <h6 className="text-[11px] font-bold text-slate-850">{challenge.title}</h6>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                      submittedCode ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                      {submittedCode ? 'Soumis ✓' : 'Non soumis'}
                                    </span>
                                  </div>
                                  {submittedCode ? (
                                    <div className="space-y-1">
                                      <p className="text-[9px] font-bold text-slate-400">CODE DE L'ÉTUDIANT :</p>
                                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[10px] overflow-x-auto border border-slate-850">
                                        <code>{submittedCode}</code>
                                      </pre>
                                    </div>
                                  ) : (
                                    <p className="text-[11px] text-slate-450 italic">Le code de cet exercice n'a pas encore été soumis.</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>}
    </div>
  );
}
