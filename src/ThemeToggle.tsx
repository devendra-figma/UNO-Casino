import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle(){
 const [theme,setTheme]=useState(()=>document.documentElement.dataset.theme==='light'?'light':'dark');
 function toggle(){
  const next=theme==='dark'?'light':'dark';
  const apply=()=>{document.documentElement.dataset.theme=next;setTheme(next);};
  if(document.startViewTransition&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.startViewTransition(apply);else apply();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',next==='light'?'#f5f4ef':'#111313');
  try{localStorage.setItem('uno-theme',next);}catch{/* Theme remains usable without storage. */}
 }
 return <button className="icon-button theme-toggle" type="button" onClick={toggle} aria-label="Light mode" aria-pressed={theme==='light'} title={`Switch to ${theme==='dark'?'light':'dark'} mode`}>{theme==='dark'?<Sun size={20}/>:<Moon size={20}/>}</button>;
}
