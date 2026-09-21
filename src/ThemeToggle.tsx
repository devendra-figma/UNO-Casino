import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Moon, Sun, Sparkles, Check } from 'lucide-react';
import { currentTheme, themes, type Theme } from './themes';
import './theme-picker.css';

export function ThemeToggle(){
 const [theme,setTheme]=useState<Theme>(currentTheme);
 const [open,setOpen]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null);
 const menu=useRef<HTMLDivElement>(null);
 function select(next:Theme){
  menu.current?.hidePopover();trigger.current?.focus();
  const apply=()=>{document.documentElement.dataset.theme=next;setTheme(next);};
  if(document.startViewTransition&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.startViewTransition(apply);else apply();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',themes.find(t=>t.id===next)!.browserColor);
  try{localStorage.setItem('uno-theme',next);}catch{/* Theme remains usable without storage. */}
 }
 function toggle(){
  if(open){menu.current?.hidePopover();return;}
  const rect=trigger.current!.getBoundingClientRect();
  menu.current!.style.top=`${Math.min(rect.bottom+8,window.innerHeight-170)}px`;
  menu.current!.style.right=`${Math.max(12,window.innerWidth-rect.right)}px`;
  menu.current?.showPopover();
  menu.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
 }
 return <><button ref={trigger} className="icon-button theme-toggle" type="button" onClick={toggle} aria-label="Choose color theme" aria-expanded={open} aria-controls="theme-preview-options" title={`Theme: ${themes.find(t=>t.id===theme)!.label}`}>{theme==='dark'?<Sun size={20}/>:theme==='light'?<Moon size={20}/>:<Sparkles size={20}/>}</button>{createPortal(<div ref={menu} id="theme-preview-options" className="theme-picker" popover="auto" role="group" aria-label="Color theme" onToggle={e=>setOpen(e.newState==='open')}>
 {themes.map(t=><button type="button" key={t.id} aria-pressed={theme===t.id} onClick={()=>select(t.id)}><span>{t.label}</span><Check size={16} style={{visibility:theme===t.id?'visible':'hidden'}}/></button>)}
 </div>,document.body)}</>;
}
