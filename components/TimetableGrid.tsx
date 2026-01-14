
import React from 'react';
import { Clock } from 'lucide-react';
import { useTimetableStore } from '../store';

const TIME_SLOTS = [
  "8:00-8:50", "8:50-9:40", "9:40-10:30", "10:30-11:20", "11:20-12:10", "12:10-1:00", "2:00-4:30"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Custom Switcher Arrow SVG from user prompt
const SwitcherArrow = () => (
  <svg viewBox="0 0 54 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M10.5 46C15.5 45 35.8 46.8 41.1 40.8C46.4 34.8 42.1 15.2 42.4 10.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24.7 39.5L10.5 46L25.4 50.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M49.6 25L42.4 10.1L37.8 25.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TimetableGrid: React.FC = () => {
  const { 
    subjects, 
    schedule, 
    interval, 
    isTransposed,
    setInterval, 
    setScheduleCell,
    toggleTranspose 
  } = useTimetableStore();

  const rows = isTransposed ? TIME_SLOTS : DAYS;
  const cols = isTransposed ? DAYS : TIME_SLOTS;

  const handleCellChange = (rowKey: string, colKey: string, subjectId: string) => {
    const day = isTransposed ? colKey : rowKey;
    const slot = isTransposed ? rowKey : colKey;
    setScheduleCell(day, slot, subjectId === "none" ? null : subjectId);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-20">
      {/* Control Panel Refined */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
        
        {/* Switcher Component - Styled like the sketch */}
        <div className="flex flex-col gap-2 w-full max-w-[180px]">
          {/* Top Row Label (X-Axis representative) */}
          <div className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-inner">
            <span className="text-sm font-handwritten font-bold tracking-wide text-zinc-400">
              {isTransposed ? 'Days' : 'Timings'}
            </span>
          </div>
          
          <div className="flex gap-2 h-24">
            {/* Left Box (Y-Axis representative) */}
            <div className="w-12 h-full bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
              <span className="font-handwritten font-bold text-sm text-zinc-400 flex flex-col items-center leading-none">
                {isTransposed ? (
                  <><span>T</span><span className="mt-1">i</span><span className="mt-1">m</span><span className="mt-1">e</span></>
                ) : (
                  <><span>D</span><span className="mt-1">a</span><span className="mt-1">y</span><span className="mt-1">s</span></>
                )}
              </span>
            </div>
            
            {/* Transpose Button with SVG */}
            <button 
              onClick={toggleTranspose}
              className="flex-grow bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-800 hover:border-zinc-700 transition-all shadow-md active:scale-95 text-zinc-500 hover:text-blue-400"
              title="Swap Axis"
            >
              <div className={`transition-transform duration-500 ${isTransposed ? 'rotate-180 scale-x-[-1]' : ''}`}>
                <SwitcherArrow />
              </div>
            </button>
          </div>
        </div>

        {/* Right Section: Time Interval Input Only */}
        <div className="flex items-center gap-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl px-6 py-4 flex-grow max-w-md">
          <Clock className="w-5 h-5 text-zinc-500" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-600">Time intervals (min)</label>
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value) || 50)}
              className="bg-transparent border-none text-xl font-medium text-zinc-200 outline-none w-24 focus:text-blue-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="overflow-x-auto rounded-[2.5rem] border border-zinc-800 bg-zinc-950 shadow-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-6 border border-zinc-800 bg-zinc-900/50 text-xs font-bold uppercase tracking-widest text-zinc-500 w-32 whitespace-nowrap">
                {isTransposed ? 'Time' : 'Day'}
              </th>
              {cols.map((col) => (
                <th key={col} className="p-6 border border-zinc-800 bg-zinc-900/50 text-xs font-bold uppercase tracking-widest text-zinc-500 min-w-[160px] whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="group/row">
                <td className="p-6 border border-zinc-800 bg-zinc-900/30 text-sm font-semibold text-zinc-400 whitespace-nowrap group-hover/row:bg-zinc-900/50 transition-colors">
                  {row}
                </td>
                {cols.map((col) => {
                  const day = isTransposed ? col : row;
                  const slot = isTransposed ? row : col;
                  const selectedSubId = schedule[day]?.[slot]?.subjectId || "none";
                  const subject = subjects.find(s => s.id === selectedSubId);
                  
                  return (
                    <td key={col} className="p-1 border border-zinc-800 h-28 group relative hover:bg-white/[0.01] transition-colors">
                      <select
                        value={selectedSubId}
                        onChange={(e) => handleCellChange(row, col, e.target.value)}
                        className="w-full h-full bg-transparent p-2 text-xs appearance-none focus:outline-none cursor-pointer text-center z-10 relative text-transparent"
                      >
                        <option value="none" className="text-zinc-900">-- select --</option>
                        {subjects.filter(s => s.code).map(sub => (
                          <option key={sub.id} value={sub.id} className="text-zinc-900">{sub.code}</option>
                        ))}
                      </select>
                      {subject ? (
                        <div 
                          className="absolute inset-2 rounded-2xl p-2 flex flex-col justify-center items-center pointer-events-none transition-all duration-300 shadow-sm"
                          style={{ backgroundColor: `${subject.color}10`, border: `1px solid ${subject.color}30` }}
                        >
                          <span className="font-black text-xs" style={{ color: subject.color }}>{subject.code}</span>
                          <span className="text-[10px] text-zinc-600 font-medium truncate w-full text-center mt-0.5">{subject.room}</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity">
                           <Clock className="w-4 h-4 text-zinc-400" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
