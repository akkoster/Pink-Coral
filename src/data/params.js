// ── Shared UI components ──────────────────────────────────────────
import { useState } from 'react';
import { statusColor } from '../hooks/useEngine';

// Hex → rgba
export function hex(h, a) {
  h = h.replace('#', '');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

// ── Card ──────────────────────────────────────────────────────────
export function Card({ children, className='', style={} }) {
  return (
    <div className={`bg-reef-card border border-reef-border rounded-2xl p-[18px] mb-3 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return <div className="font-head font-bold text-sm text-[#FFF0F5] mb-3">{children}</div>;
}

// ── Button ────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant='primary', size='md', full=false, className='', style={} }) {
  const base = 'font-head font-bold cursor-pointer rounded-[9px] transition-opacity active:opacity-70 border-0';
  const sizes = { sm:'px-3 py-1.5 text-xs', md:'px-5 py-[11px] text-sm' };
  const variants = {
    primary: 'text-[#0F0A0E]',
    secondary: 'bg-reef-panel text-[#9B7088] border border-reef-border',
    ghost:   'text-[#E8457A] border border-[rgba(232,69,122,.35)]',
    danger:  'text-[#F04060] border border-[rgba(240,64,96,.25)]',
  };
  const bgStyle = variant==='primary'
    ? { background:'linear-gradient(135deg,#E8457A,#B03060)', ...style }
    : variant==='ghost' ? { background:'rgba(232,69,122,.1)', ...style }
    : variant==='danger' ? { background:'rgba(240,64,96,.1)', ...style }
    : style;
  return (
    <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${full?'w-full':''} ${className}`} style={bgStyle}>
      {children}
    </button>
  );
}

// ── Input / Select / Textarea ─────────────────────────────────────
const inputBase = 'bg-reef-bg border border-reef-border rounded-[9px] px-3 py-[10px] text-[#FFF0F5] text-[13px] w-full outline-none focus:border-[#E8457A] focus:shadow-[0_0_0_2px_rgba(232,69,122,.15)] transition-all';

export function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-[11px] font-semibold text-[#9B7088] mb-1">{label}</label>}
      <input className={inputBase} {...props} />
    </div>
  );
}

export function Select({ label, options, ...props }) {
  return (
    <div>
      {label && <label className="block text-[11px] font-semibold text-[#9B7088] mb-1">{label}</label>}
      <select className={`${inputBase} cursor-pointer`} {...props}>
        {options.map(o => <option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-[11px] font-semibold text-[#9B7088] mb-1">{label}</label>}
      <textarea className={`${inputBase} resize-y`} {...props} />
    </div>
  );
}

// ── Status dot ────────────────────────────────────────────────────
export function StatusDot({ status, pulse=false }) {
  const col = statusColor(status);
  return (
    <span className={`inline-block w-[7px] h-[7px] rounded-full flex-shrink-0 ${pulse&&status!=='good'?'animate-pulse-dot':''}`}
      style={{ background:col, boxShadow:`0 0 6px ${col}` }}/>
  );
}

// ── Alert banner ──────────────────────────────────────────────────
export function Alert({ level, children }) {
  const cfg = {
    good: { bg:'rgba(232,69,122,.08)', border:'rgba(232,69,122,.35)', col:'#E8457A' },
    warn: { bg:'rgba(245,166,35,.08)', border:'rgba(245,166,35,.4)',  col:'#F5A623' },
    crit: { bg:'rgba(240,64,96,.08)',  border:'rgba(240,64,96,.4)',   col:'#F04060' },
  }[level]||{ bg:'rgba(232,69,122,.08)', border:'rgba(232,69,122,.35)', col:'#E8457A' };
  return (
    <div className="flex gap-2.5 items-start rounded-xl px-4 py-3 mb-2 border" style={{ background:cfg.bg, borderColor:cfg.border }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]" style={{ background:cfg.col, boxShadow:`0 0 6px ${cfg.col}` }}/>
      <span className="text-[13px] leading-relaxed" style={{ color:cfg.col }}>{children}</span>
    </div>
  );
}

// ── SVG Sparkline ─────────────────────────────────────────────────
export function Sparkline({ history, color, height=42 }) {
  const vals = history.slice(-14);
  const min = Math.min(...vals.map(d=>d.value));
  const max = Math.max(...vals.map(d=>d.value));
  const range = max - min || 1;
  const pts = vals.map((d,i) => {
    const x = (i/(vals.length-1))*100;
    const y = 100 - ((d.value-min)/range)*100;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none" className="block">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Range bar ─────────────────────────────────────────────────────
export function RangeBar({ pct, color, targetPct }) {
  return (
    <div className="h-1 bg-reef-border rounded-full relative my-1">
      {targetPct !== undefined && (
        <div className="absolute top-[-2px] bottom-[-2px] w-[2px]" style={{ left:`${targetPct}%`, background:'rgba(232,69,122,.5)' }}/>
      )}
      <div className="h-1 rounded-full transition-all duration-500" style={{ width:`${Math.min(100,pct)}%`, background:color, boxShadow:`0 0 8px ${hex(color,.5)}` }}/>
    </div>
  );
}

// ── Data row (result rows) ────────────────────────────────────────
export function DataRow({ label, value, col }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[rgba(61,31,46,.5)] last:border-0">
      <span className="text-[13px] text-[#9B7088]">{label}</span>
      <span className="text-[14px] font-bold font-head" style={{ color:col }}>{value}</span>
    </div>
  );
}

// ── Protocol list ─────────────────────────────────────────────────
export function Protocol({ steps, color }) {
  if (!steps?.length) return null;
  return (
    <div className="mt-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B7088] font-head mb-2">Dosing Protocol</div>
      {steps.map((step, i) => (
        <div key={i} className="flex gap-2 mb-1.5">
          <span className="text-[12px] font-bold font-head min-w-[18px] flex-shrink-0" style={{ color }}>{i+1}.</span>
          <span className="text-[12px] leading-relaxed text-[#E8C8D8]">{step}</span>
        </div>
      ))}
    </div>
  );
}

// ── Section tabs ──────────────────────────────────────────────────
export function SectionTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 mb-5">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className="flex-1 rounded-[9px] py-2.5 text-xs font-bold font-head cursor-pointer transition-all border"
          style={{
            background: active===t.id ? 'rgba(232,69,122,.12)' : 'transparent',
            borderColor: active===t.id ? '#E8457A' : '#3D1F2E',
            color: active===t.id ? '#E8457A' : '#9B7088',
          }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────
export function Divider({ className='' }) {
  return <div className={`h-px bg-reef-border my-5 ${className}`}/>;
}

// ── Empty state ───────────────────────────────────────────────────
export function EmptyState({ children }) {
  return <div className="p-6 text-center text-[#9B7088] text-sm border border-dashed border-reef-border rounded-xl">{children}</div>;
}
