import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Check, Settings, UserRound } from 'lucide-react';
import { ProfilePanel, type ProfileSection, useProfilePreferences } from './ProfileMenu';
import { type DemoState } from './data';

export type ProfileDetails = { name: string; email: string; phone: string; country: string };
const defaultProfile: ProfileDetails = { name: 'UNO Player', email: '', phone: '', country: '' };
export const demoUsername = 'uno_player';

export function useProfileDetails() {
  const [profile, setProfile] = useState<ProfileDetails>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('uno-profile-details') || 'null');
      return Object.fromEntries(Object.entries(defaultProfile).map(([key, value]) => [key, typeof saved?.[key] === 'string' ? saved[key].slice(0, 160) : value])) as ProfileDetails;
    } catch { return defaultProfile; }
  });
  const [error, setError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem('uno-profile-details', JSON.stringify(profile)); setError(false); }
    catch { setError(true); }
  }, [profile]);
  return { profile, setProfile, profileStorageError: error };
}

type Preferences = ReturnType<typeof useProfilePreferences>['preferences'];
export function ProfilePage({ section, loggedIn, onLogin, profile, onSave, profileStorageError, state, preferences, onPreferences, storageError }: {
  section: Exclude<ProfileSection, 'notifications'>; loggedIn: boolean; onLogin: () => void;
  profile: ProfileDetails; onSave: (details: ProfileDetails) => void; profileStorageError: boolean;
  state: DemoState; preferences: Preferences; onPreferences: (value: Preferences) => void; storageError: boolean;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [section, loggedIn]);
  return <section className="account-screen">
    <div className="page-title"><span className="eyebrow">YOUR ACCOUNT · DEMO</span><h1 ref={heading} tabIndex={-1}>{section === 'profile' ? 'Your profile' : 'Account settings'}<span>.</span></h1><p>{section === 'profile' ? 'Manage your name and personal details.' : 'Manage your preferences for this browser.'}</p></div>
    {!loggedIn ? <div className="account-screen-card"><h2>Sign in to your demo account</h2><p className="muted">Your profile and preferences are stored in this browser.</p><button className="gold-button" onClick={onLogin}>Log in</button></div> : <>
      <nav className="account-screen-tabs" aria-label="Account sections"><NavLink to="/profile"><UserRound size={18}/> Profile</NavLink><NavLink to="/settings"><Settings size={18}/> Settings</NavLink></nav>
      <div className="account-screen-card">{section === 'profile' ? <ProfileForm profile={profile} onSave={onSave} storageError={profileStorageError}/> : <ProfilePanel section="settings" state={state} preferences={preferences} onPreferences={onPreferences} storageError={storageError}/>}</div>
    </>}
  </section>;
}

function ProfileForm({ profile, onSave, storageError }: { profile: ProfileDetails; onSave: (details: ProfileDetails) => void; storageError: boolean }) {
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { setDraft(profile); }, [profile]);
  const dirty = Object.keys(profile).some(key => draft[key as keyof ProfileDetails] !== profile[key as keyof ProfileDetails]);
  function update(key: keyof ProfileDetails, value: string) { setDraft(p => ({ ...p, [key]: value })); setSaved(false); setError(''); }
  return <form className="profile-edit-form" onSubmit={e => {
    e.preventDefault();
    if (!draft.name.trim()) { setError('Enter your name.'); return; }
    const clean = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()])) as ProfileDetails;
    onSave(clean); setDraft(clean); setSaved(true); setError('');
  }}>
    <div className="account-identity"><span className="avatar">{profile.name.trim().charAt(0).toUpperCase() || 'U'}</span><div><h3>{profile.name}</h3><span>Demo account · This browser</span></div><span className="account-status">DEMO</span></div>
    <div className="profile-fields">
      <label>Username<input aria-label="Username" value={demoUsername} readOnly aria-describedby="username-help"/><small id="username-help">Your username cannot be changed.</small></label>
      <label>Full name<input name="name" autoComplete="name" value={draft.name} required maxLength={80} onChange={e => update('name', e.target.value)}/></label>
      <label>Email address<input name="email" type="email" autoComplete="email" value={draft.email} maxLength={160} placeholder="Add email address" onChange={e => update('email', e.target.value)}/></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" value={draft.phone} maxLength={40} placeholder="Add phone number" onChange={e => update('phone', e.target.value)}/></label>
      <label>Country / region<input name="country" autoComplete="country-name" value={draft.country} maxLength={80} placeholder="Add country or region" onChange={e => update('country', e.target.value)}/></label>
    </div>
    <p className="muted">Demo details are saved only in this browser. Email and phone are not verified or used for messages.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    {storageError ? <p className="form-error" role="alert">Browser storage is unavailable. Your edits will not survive a refresh.</p> : saved && <p className="profile-save-status" role="status"><Check size={18}/> Profile saved.</p>}
    <div className="profile-form-actions"><button className="gold-button" type="submit" disabled={!dirty}>Save changes</button><button className="profile-cancel" type="button" disabled={!dirty} onClick={() => { setDraft(profile); setSaved(false); setError(''); }}>Cancel</button></div>
  </form>;
}
