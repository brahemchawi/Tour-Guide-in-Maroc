export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            content: string;
        }[]
    }
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  groundingChunks?: GroundingChunk[];
  isLoading?: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

export type ViewMode = 'chat' | 'map';

export type Language = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'it' | 'ru' | 'zh' | 'ja' | 'ko' | 'tr' | 'pt';

export type Theme = 'light' | 'dark' | 'system';