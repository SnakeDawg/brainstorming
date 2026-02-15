import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import mockSystemData from '../../data/mockSystemData.json';

const ActionsRecommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(mockSystemData.recommendations);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAllModal, setShowAllModal] = useState(false);

  const handleAction = (recommendation) => {
    if (recommendation.actionType === 'navigate') {
      // Navigate with state to auto-trigger action
      navigate(recommendation.actionPath, {
        state: {
          autoTrigger: true,
          action: recommendation.action,
          recommendationId: recommendation.id
        }
      });

      // Mark recommendation as in-progress (will be removed when action completes)
      setRecommendations(prev =>
        prev.map(r => r.id === recommendation.id ? { ...r, inProgress: true } : r)
      );
    } else if (recommendation.actionType === 'toggle') {
      // Simulate toggling
      setRecommendations(prev =>
        prev.filter(r => r.id !== recommendation.id)
      );
    }
  };

  // Listen for completion events from localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'completedRecommendation') {
        const completedId = parseInt(e.newValue);
        setRecommendations(prev =>
          prev.filter(r => r.id !== completedId)
        );
        // Clear the flag
        localStorage.removeItem('completedRecommendation');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check on interval for same-window updates
    const interval = setInterval(() => {
      const completedId = localStorage.getItem('completedRecommendation');
      if (completedId) {
        setRecommendations(prev =>
          prev.filter(r => r.id !== parseInt(completedId))
        );
        localStorage.removeItem('completedRecommendation');
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getVariant = (type) => {
    const variants = {
      error: 'error',
      warning: 'warning',
      info: 'default',
    };
    return variants[type] || 'default';
  };

  const getPriorityBadge = (recommendation) => {
    if (recommendation.type === 'error') {
      return <Badge variant="critical">Critical</Badge>;
    }
    if (recommendation.recommended) {
      return <Badge variant="recommended">Recommended</Badge>;
    }
    return null;
  };

  const renderRecommendationCard = (rec, compact = false) => (
    <Card
      key={rec.id}
      variant={getVariant(rec.type)}
      padding="normal"
      className="transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            {rec.type === 'error' && (
              <AlertTriangle className="w-4 h-4 text-error-600 flex-shrink-0" />
            )}
            {rec.type === 'warning' && (
              <AlertTriangle className="w-4 h-4 text-warning-600 flex-shrink-0" />
            )}
            <h3 className={`font-semibold text-neutral-900 dark:text-white ${compact ? 'text-sm' : 'text-base'}`}>{rec.title}</h3>
          </div>
          <p className={`text-neutral-600 dark:text-neutral-400 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>{rec.description}</p>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              variant={rec.type === 'error' ? 'primary' : 'secondary'}
              onClick={() => handleAction(rec)}
              disabled={rec.inProgress}
            >
              {rec.inProgress ? 'Processing...' : rec.action}
            </Button>
            {getPriorityBadge(rec)}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Actions & Recommendations
        </h2>
        {recommendations.length > visibleCount && (
          <button
            onClick={() => setShowAllModal(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            View All ({recommendations.length})
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {recommendations.slice(0, visibleCount).map((rec) => renderRecommendationCard(rec, true))}
      </div>

      <Modal
        isOpen={showAllModal}
        onClose={() => setShowAllModal(false)}
        title={`All Actions & Recommendations (${recommendations.length})`}
        size="large"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
          {recommendations.map((rec) => renderRecommendationCard(rec, false))}
        </div>
      </Modal>
    </div>
  );
};

export default ActionsRecommendations;
