import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { Sparkles, Send } from 'lucide-react';
import mockSystemData from '../../data/mockSystemData.json';

const AskPCAI = () => {
  const navigate = useNavigate();
  const { aiExamples } = mockSystemData;
  const [query, setQuery] = useState('');

  const handleExampleClick = (example) => {
    navigate('/assistant', { state: { initialQuery: example } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/assistant', { state: { initialQuery: query } });
      setQuery('');
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-neutral-900 dark:text-white">Ask Your PC AI</h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your PC..."
            className="flex-1 px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Try these examples:</p>
        <div className="space-y-2">
          {aiExamples.slice(0, 3).map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="w-full text-left px-3 py-2 bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AskPCAI;
