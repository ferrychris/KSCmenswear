import { useState } from 'react';
import { ThumbsUp, Lightbulb, Bookmark, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoFeedbackProps {
  videoId: string;
}

export function VideoFeedback({ videoId }: VideoFeedbackProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const handleFeedback = (type: string) => {
    setFeedback(type);
    // Here you would typically send this to your analytics
    console.log(`Video ${videoId} feedback: ${type}`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <p className="text-gray-700 text-sm mb-3">Did this video inspire your wedding vision?</p>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleFeedback('inspired')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            feedback === 'inspired'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          Inspired Me
        </button>

        <button
          onClick={() => handleFeedback('considering')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            feedback === 'considering'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <Lightbulb className="h-4 w-4" />
          Considering Ideas
        </button>

        <button
          onClick={() => setSaved(!saved)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            saved
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <Bookmark className="h-4 w-4" />
          {saved ? 'Saved' : 'Save for Later'}
        </button>

        <button
          onClick={() => setShared(!shared)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            shared
              ? 'bg-rose-100 text-rose-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      {feedback && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            {feedback === 'inspired'
              ? 'Thanks for your feedback! Would you like to schedule a consultation to discuss your rustic wedding vision?'
              : 'Thanks for your feedback! Our style experts can help you explore more rustic wedding ideas.'}
          </p>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium mt-2">
            Book a Consultation
          </button>
        </div>
      )}
    </div>
  );
}