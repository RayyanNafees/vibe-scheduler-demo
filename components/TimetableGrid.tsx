
import React from 'react';
import { RotateCw, Clock } from 'lucide-react';
import { useTimetableStore } from '../store';

const TIME_SLOTS = [
  "8:00-8:50", "8:50-9:40", "9:40-10:30", "10:30-11:20", "11:20-12:10", "12:10-1:00", "2:00-4:30"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const TimetableGrid: React.FC = () => {
  const { 
    subjects, 
    schedule, 
    interval, 
    startDay, 
    isTransposed,
    setInterval, 
    setStartDay, 
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
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-zinc-800/50">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" /> Timings
          </div>
          <button 
            onClick={toggleTranspose}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <RotateCw className={`w-5 h-5 transition-transform ${isTransposed ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">Time intervals (min):</span>
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value) || 50)}
              className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">Day of the week:</span>
            <select
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
            >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border border-zinc-800 bg-zinc-900/50 text-xs font-bold uppercase tracking-wider text-zinc-500 w-32">
                {isTransposed ? 'Time' : 'Day'}
              </th>
              {cols.map((col) => (
                <th key={col} className="p-4 border border-zinc-800 bg-zinc-900/50 text-xs font-bold uppercase tracking-wider text-zinc-500 min-w-[140px]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td className="p-4 border border-zinc-800 bg-zinc-900/30 text-sm font-medium text-zinc-400">
                  {row}
                </td>
                {cols.map((col) => {
                  const day = isTransposed ? col : row;
                  const slot = isTransposed ? row : col;
                  const selectedSubId = schedule[day]?.[slot]?.subjectId || "none";
                  const subject = subjects.find(s => s.id === selectedSubId);
                  
                  return (
                    <td key={col} className="p-1 border border-zinc-800 h-24 group relative">
                      <select
                        value={selectedSubId}
                        onChange={(e) => handleCellChange(row, col, e.target.value)}
                        className="w-full h-full bg-transparent p-2 text-xs appearance-none focus:outline-none cursor-pointer text-center z-10 relative"
                      >
                        <option value="none">-- select --</option>
                        {subjects.filter(s => s.code).map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.code}</option>
                        ))}
                      </select>
                      {subject && (
                        <div 
                          className="absolute inset-1 rounded-xl p-2 flex flex-col justify-center items-center pointer-events-none transition-all duration-300"
                          style={{ backgroundColor: `${subject.color}15`, border: `1px solid ${subject.color}40` }}
                        >
                          <span className="font-bold text-[10px]" style={{ color: subject.color }}>{subject.code}</span>
                          <span className="text-[9px] text-zinc-500 truncate w-full text-center">{subject.room}</span>
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
