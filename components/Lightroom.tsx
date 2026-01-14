
import React, { useRef } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { useTimetableStore } from '../store';

export const Lightroom: React.FC = () => {
  const { selectedTheme, setSelectedTheme, schedule, subjects, isTransposed, department, branch, classroom } = useTimetableStore();
  const timetableRef = useRef<HTMLDivElement>(null);

  if (!selectedTheme) return null;

  const TIME_SLOTS = [
    "8:00-8:50", "8:50-9:40", "9:40-10:30", "10:30-11:20", "11:20-12:10", "12:10-1:00", "2:00-4:30"
  ];
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const rows = isTransposed ? TIME_SLOTS : DAYS;
  const cols = isTransposed ? DAYS : TIME_SLOTS;

  const handleDownload = async () => {
    // In a real production app, we would use html-to-image here.
    // For this prototype, we'll simulate the download intent.
    alert("In a real application, this would download a high-resolution PNG of your styled timetable using html-to-image.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={() => setSelectedTheme(null)}
      />
      
      <div className="relative w-full max-w-6xl max-h-full bg-zinc-950 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold">{selectedTheme.name}</h2>
            <p className="text-zinc-500 text-sm">Theme Preview</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button 
              onClick={() => setSelectedTheme(null)}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-auto p-8" style={{ background: selectedTheme.background }}>
          <div 
            ref={timetableRef}
            className="w-full mx-auto shadow-2xl p-8"
            style={{ 
              borderRadius: selectedTheme.borderRadius,
              fontFamily: selectedTheme.fontFamily,
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${selectedTheme.accentColor}20`
            }}
          >
            <div className="mb-8 flex justify-between items-end border-b pb-4" style={{ borderColor: `${selectedTheme.accentColor}20` }}>
              <div>
                <h1 className="text-3xl font-bold mb-1" style={{ color: selectedTheme.primaryColor }}>{department || 'Department'}</h1>
                <p className="text-lg opacity-80" style={{ color: selectedTheme.textColor }}>{branch || 'Branch'} • {classroom || 'Room'}</p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-widest opacity-60" style={{ color: selectedTheme.textColor }}>Weekly Schedule</span>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left border-b w-32" style={{ borderColor: `${selectedTheme.accentColor}20`, color: selectedTheme.textColor }}>
                    {isTransposed ? 'Time' : 'Day'}
                  </th>
                  {cols.map((col) => (
                    <th key={col} className="p-4 text-center border-b" style={{ borderColor: `${selectedTheme.accentColor}20`, color: selectedTheme.textColor }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row}>
                    <td className="p-4 font-bold opacity-80" style={{ color: selectedTheme.textColor }}>
                      {row}
                    </td>
                    {cols.map((col) => {
                      const day = isTransposed ? col : row;
                      const slot = isTransposed ? row : col;
                      const subId = schedule[day]?.[slot]?.subjectId;
                      const subject = subjects.find(s => s.id === subId);
                      
                      return (
                        <td key={col} className="p-2 border-b" style={{ borderColor: `${selectedTheme.accentColor}10` }}>
                          {subject ? (
                            <div 
                              className="p-3 rounded-lg text-center h-24 flex flex-col justify-center transition-all hover:scale-[1.02]"
                              style={{ 
                                backgroundColor: `${subject.color}20`,
                                borderLeft: `4px solid ${subject.color}`,
                                borderRadius: selectedTheme.borderRadius
                              }}
                            >
                              <div className="font-bold text-sm mb-1" style={{ color: selectedTheme.textColor }}>{subject.code}</div>
                              <div className="text-[10px] opacity-70 truncate mb-1" style={{ color: selectedTheme.textColor }}>{subject.name}</div>
                              <div className="text-[10px] font-medium" style={{ color: subject.color }}>{subject.room}</div>
                            </div>
                          ) : (
                            <div className="h-24 opacity-10 flex items-center justify-center text-[10px]" style={{ color: selectedTheme.textColor }}>--</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
