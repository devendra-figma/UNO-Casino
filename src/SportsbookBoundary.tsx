import { Component, Suspense, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './sportsbook-boundary.css';

class LoadError extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<div className="empty" role="alert"><h2>Sportsbook page unavailable.</h2><p>The page could not load. Check your connection and try again.</p><button className="gold-button" onClick={()=>window.location.reload()}>Retry loading</button><Link to="/sports">Back to sports</Link></div>:this.props.children}
}
export function SportsbookBoundary({children}:{children:ReactNode}){return <LoadError><Suspense fallback={<div className="sportsbook-loading" role="status" aria-label="Loading sportsbook"><div className="sportsbook-skeleton-title"/><div className="sportsbook-skeleton-card"/><div className="sportsbook-skeleton-card"/><span className="sr-only">Loading sportsbook</span></div>}>{children}</Suspense></LoadError>}
