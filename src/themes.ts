export type Theme = 'dark' | 'light' | 'vibrant';
// Temporary preview: remove this entry and vibrant-preview.css to retire the palette.
export const themes: {id:Theme;label:string;browserColor:string}[] = [
 {id:'dark',label:'Dark / Gold',browserColor:'#111313'},
 {id:'light',label:'Light',browserColor:'#f5f4ef'},
 {id:'vibrant',label:'Vibrant Preview',browserColor:'#10141e'},
];
export function currentTheme():Theme{return themes.find(t=>t.id===document.documentElement.dataset.theme)?.id||'dark';}
