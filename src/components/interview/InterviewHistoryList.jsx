import { useState, useEffect } from 'react';
import client from '../../api/client';
import toast from 'react-hot-toast';

const DEMO_DATA = [
  {
    id: 'demo-1',
    title: 'React Frontend Developer',
    difficulty_level: 'Medium',
    interviews_type: 'Technical',
    status: 'Complete',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Behavioral Team Fit',
    difficulty_level: 'Easy',
    interviews_type: 'Hr',
    status: 'Complete',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

export default function InterviewHistoryList({ onCreateNew, onResume, onViewReport }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/api/get_interviews')
      .then(res => {
        const history = res.data.history || [];
        if (history.length === 0) {
          // Use demo data if empty
          setInterviews(DEMO_DATA);
        } else {
          setInterviews(history);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to fetch interview history");
        setInterviews(DEMO_DATA);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="flex gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary/50 animate-bounce" />
          <span className="w-2.5 h-2.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.1s' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    );
  }

  // Find if there is an active interview
  const hasActive = interviews.some(i => i.status === 'Start');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-primary">Your Interviews</h2>
        <button
          onClick={onCreateNew}
          disabled={hasActive}
          className={`px-5 py-2.5 rounded-xl font-semibold transition-all btn-press ${
            hasActive 
              ? 'bg-bg-surface-2 text-text-muted cursor-not-allowed border border-border opacity-50'
              : 'bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/25'
          }`}
        >
          + New Interview
        </button>
      </div>

      {hasActive && (
        <div className="mb-4 p-5 bg-warning/10 border border-warning/20 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-warning font-semibold text-sm mb-1">⚠️ You have an interview in progress</p>
            <p className="text-text-secondary text-xs">Please complete it before starting a new one.</p>
          </div>
          <button 
             onClick={() => onResume(interviews.find(i => i.status === 'Start').id)}
             className="px-5 py-2.5 bg-warning/20 text-warning text-sm font-bold rounded-xl hover:bg-warning/30 transition-colors btn-press"
          >
            Resume →
          </button>
        </div>
      )}

      {interviews.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviews.map((interview) => (
            <div 
              key={interview.id} 
              className="bg-bg-surface border border-border hover:border-primary/30 rounded-2xl p-6 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                  interview.status === 'Complete' 
                    ? 'bg-success/10 text-success border border-success/20'
                    : 'bg-warning/10 text-warning border border-warning/20'
                }`}>
                  {interview.status === 'Complete' ? 'Completed' : 'In Progress'}
                </span>
                <span className="text-xs text-text-muted font-medium bg-bg-surface-2 px-2 py-1 rounded-md">
                  {new Date(interview.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {interview.title}
              </h3>
              <p className="text-text-secondary text-xs mb-5 font-medium flex gap-2 items-center">
                <span className="px-2 py-1 bg-bg-surface-2 rounded-md">{interview.interviews_type}</span>
                <span className="text-border-light">•</span>
                <span className="px-2 py-1 bg-bg-surface-2 rounded-md">{interview.difficulty_level}</span>
              </p>

              <button 
                onClick={() => interview.status === 'Complete' ? onViewReport(interview.id) : onResume(interview.id)}
                className="w-full py-3 bg-bg-surface-2 group-hover:bg-primary group-hover:text-white border border-transparent group-hover:shadow-lg group-hover:shadow-primary/25 rounded-xl text-sm font-bold transition-all text-text-primary"
              >
                {interview.status === 'Complete' ? 'View Report' : 'Resume Interview'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-bg-surface-2 rounded-3xl border border-dashed border-border">
          <div className="text-4xl mb-4">🎙️</div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No Interviews Yet</h3>
          <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
            Ready to test your skills? Create your first AI mock interview and get real-time feedback.
          </p>
          <button
            onClick={onCreateNew}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-light transition-all shadow-lg shadow-primary/25 btn-press"
          >
            Start Practice
          </button>
        </div>
      )}
    </div>
  );
}
