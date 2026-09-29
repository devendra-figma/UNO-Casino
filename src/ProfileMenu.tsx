import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Check, LogOut, Settings, UserRound } from 'lucide-react';
import { money, type DemoState } from './data';
import './profile-menu.css';

export type ProfileSection = 'profile' | 'notifications' | 'settings';
export const profileTitles = { profile: 'Your profile', notifications: 'Notifications', settings: 'Account settings' };
const options = [
  { id: 'profile', label: 'View profile', icon: UserRound },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Log out', icon: LogOut },
] as const;

export function ProfileMenu({ name, anchor, onClose, onSelect }: { name: string; anchor: HTMLElement; onClose: () => void; onSelect: (section: ProfileSection | 'logout') => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const menu = ref.current!;
    const rect = anchor.getBoundingClientRect();
    menu.showPopover();
    menu.style.left = `${Math.max(12, Math.min(rect.right - menu.offsetWidth, window.innerWidth - menu.offsetWidth - 12))}px`;
    menu.style.top = `${Math.max(12, rect.bottom + menu.offsetHeight + 12 < window.innerHeight ? rect.bottom + 8 : rect.top - menu.offsetHeight - 8)}px`;
    menu.querySelector<HTMLButtonElement>('button')?.focus();
    const dismiss = () => onClose();
    window.addEventListener('resize', dismiss);
    return () => { window.removeEventListener('resize', dismiss); menu.hidePopover(); };
  }, [anchor, onClose]);
  return createPortal(<div ref={ref} id="profile-options" className="profile-menu" popover="auto" role="menu" aria-label="Account options"
    onToggle={e => { if (e.newState === 'closed') onClose(); }}
    onKeyDown={e => {
      const items = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('button')];
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        items[e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (index + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
      }
      if (e.key === 'Escape' || e.key === 'Tab') { anchor.focus(); onClose(); }
    }}>
    <div className="profile-menu-identity"><strong>{name}</strong><small>Demo account · This browser</small></div>
    {options.map(({ id, label, icon: Icon }) => <button key={id} role="menuitem" type="button" onClick={() => { anchor.focus(); onSelect(id); }}><Icon size={18}/><span>{label}</span></button>)}
  </div>, document.body);
}

type Preferences = { notifications: boolean; read: string[] };
export function useProfilePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('uno-profile-preferences') || 'null');
      return { notifications: typeof saved?.notifications === 'boolean' ? saved.notifications : true, read: Array.isArray(saved?.read) ? saved.read.filter((id: unknown) => typeof id === 'string') : [] };
    } catch { return { notifications: true, read: [] }; }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem('uno-profile-preferences', JSON.stringify(preferences)); }
    catch { setStorageError(true); }
  }, [preferences]);
  return { preferences, setPreferences, storageError };
}

export function ProfilePanel({ section, state, preferences, onPreferences, storageError }: {
  section: ProfileSection; state: DemoState; preferences: Preferences; onPreferences: (value: Preferences) => void; storageError: boolean;
}) {
  const notifications = [
    ...state.bets.slice(0, 20).map(bet => ({ id: bet.id, title: 'Demo bet placed', text: `${money(bet.stake)} virtual stake · Pending · ${bet.selections.map(s => s.outcome).join(' + ')}` })),
    { id: 'welcome', title: 'Welcome to your demo account', text: 'Your profile, favorites and virtual wallet are saved in this browser. No real money is involved.' },
  ];
  const unread = notifications.filter(item => !preferences.read.includes(item.id));
  return <div className="profile-panel">
    {section === 'profile' && <><div className="account-identity"><span className="avatar">U</span><div><h3>UNO Player</h3><span>Demo account · This browser</span></div><span className="account-status">DEMO</span></div><dl className="profile-details"><div><dt>Account type</dt><dd>Local demo</dd></div><div><dt>Virtual balance</dt><dd>{money(state.balance)} USD</dd></div><div><dt>Favorite games</dt><dd>{state.favorites.length}</dd></div><div><dt>Pending demo bets</dt><dd>{state.bets.length}</dd></div></dl><p className="muted">This is a simulated profile. No email, password or identity verification is connected.</p></>}
    {section === 'notifications' && <><p className="muted">Demo account updates only. No push or email notifications are sent.</p>{preferences.notifications ? <><div className="profile-notification-heading"><span>{unread.length} unread</span><button className="profile-text-button" disabled={!unread.length} onClick={() => onPreferences({ ...preferences, read: [...new Set([...preferences.read, ...notifications.map(n => n.id)])] })}><Check size={16}/> Mark all as read</button></div><ul className="profile-notifications">{notifications.map(item => <li key={item.id} className={preferences.read.includes(item.id) ? '' : 'unread'}><Bell size={18}/><div><strong>{item.title}</strong><p>{item.text}</p><small>{preferences.read.includes(item.id) ? 'Read' : 'Unread'} · Demo</small></div></li>)}</ul></> : <div className="profile-notification-empty"><Bell size={28}/><h3>Demo notifications are off</h3><p>Enable them in Settings to see account updates here.</p></div>}</>}
    {section === 'settings' && <><p className="muted">Preferences apply to this demo account on this browser.</p><label className="profile-preference"><span><strong>Demo notifications</strong><small>Show local account updates in Notifications.</small></span><input type="checkbox" checked={preferences.notifications} onChange={e => onPreferences({ ...preferences, notifications: e.target.checked })}/></label><dl className="profile-details"><div><dt>Language</dt><dd>English</dd></div><div><dt>Demo currency</dt><dd>USD</dd></div></dl><p className="muted">Language and currency are fixed for this prototype. Use the theme button in the header to change appearance.</p><small role="status">Changes save automatically in this browser.</small></>}
    {storageError && <p role="alert">Browser storage is unavailable. These preferences will reset when you reload.</p>}
  </div>;
}
