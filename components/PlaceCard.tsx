import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { GroundingChunk } from '../types';

interface PlaceCardProps {
  chunk: GroundingChunk;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ chunk }) => {
  if (!chunk.maps) return null;

  const { title, uri } = chunk.maps;
  
  // Use a fallback if the title is missing
  const displayTitle = title || "اسم المكان غير متوفر";

  // Extract a snippet if available, or just use a generic description
  const snippet = chunk.maps.placeAnswerSources?.reviewSnippets?.[0]?.content;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-sm mb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <MapPin size={20} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{displayTitle}</h3>
        </div>
        <a 
          href={uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <ExternalLink size={18} />
        </a>
      </div>
      
      {snippet && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          "{snippet}"
        </p>
      )}

      <a 
        href={uri} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center w-full py-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
      >
        عرض على الخريطة
      </a>
    </div>
  );
};

export default PlaceCard;