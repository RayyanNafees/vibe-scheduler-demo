
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col items-center py-16 text-center space-y-4">
      <h1 className="text-6xl font-bold tracking-tight font-handwritten bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        ZHCET Scheduler
      </h1>
      <p className="text-zinc-500 text-xl font-light">
        Craft beautiful time tables from messy schedule PDFs
      </p>
    </section>
  );
};
