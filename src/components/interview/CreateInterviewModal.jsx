import { useState } from 'react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function CreateInterviewModal({ onClose, onCreated }) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [type, setType] = useState('Technical');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter an interview topic');
      return;
    }

    setLoading(true);
    try {
      const res = await client.post('/api/create_interview', {
        topic: topic.trim(),
        difficulty_level: difficulty,
        interview_type: type,
        status: 'Start'
      });
      
      toast.success('Interview created successfully!', { className: 'toast-success' });
      onCreated(res.data.interview_id); // Pass new ID to start immediately
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div className="w-full max-w-md bg-bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary">Configure Interview</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Interview Topic / Role
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. React.js, System Design, Frontend Engineer..."
              className="w-full px-4 py-3 bg-bg-surface-2 border border-border rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Interview Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 bg-bg-surface-2 border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%)', backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)', backgroundSize: '5px 5px, 5px 5px', backgroundRepeat: 'no-repeat' }}
              >
                <option value="Technical">Technical</option>
                <option value="Hr">Behavioral / HR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-bg-surface-2 border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%)', backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)', backgroundSize: '5px 5px, 5px 5px', backgroundRepeat: 'no-repeat' }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 bg-bg-surface-2 border border-border text-text-secondary rounded-xl font-semibold hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 btn-press flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating...
                </>
              ) : (
                'Start Interview →'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
