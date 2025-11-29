import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import PlaceCard from './PlaceCard';

interface MessageBubbleProps {
  message: ChatMessage;
  language: Language;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, language }) => {
  const isUser = message.role === 'user';
  const isRtl = ['ar', 'he', 'fa', 'ur'].includes(language);

  // Simple formatter for bold text (**text**)
  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className={`font-extrabold ${isUser ? 'text-white' : 'text-black dark:text-white'}`}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${isUser ? 'bg-emerald-600 text-white' : 'bg-teal-600 text-white shadow-emerald-200 dark:shadow-none'}
          shadow-md
        `}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`
            p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap transition-colors
            ${isUser 
              ? 'bg-emerald-600 text-white rounded-tl-2xl rounded-tr-none rounded-br-2xl rounded-bl-2xl font-medium' 
              : 'bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 font-medium rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-slate-100 dark:border-slate-700'}
          `}>
             {message.isLoading ? (
               <div className="flex gap-1 items-center h-6">
                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
               </div>
             ) : (
               formatText(message.text)
             )}
          </div>
          
          {/* Grounding/Map Cards (Only for model) */}
          {!isUser && message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {message.groundingChunks.map((chunk, idx) => (
                <PlaceCard key={idx} chunk={chunk} />
              ))}
            </div>
          )}
          
          {/* Timestamp */}
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;