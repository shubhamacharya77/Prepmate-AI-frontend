import { useState, useEffect } from 'react';
import client from '../../api/client';
import toast from 'react-hot-toast';



export default function InterviewReport({ interviewId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/api/interview_details/${interviewId}`)
      .then(res => {
        // If there's no report yet or it failed to fetch proper data
        if (!res.data || !res.data.report) {
          toast.error("Failed to load interview report");
          setData(null);
        } else {
          setData(res.data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch report", err);
        toast.error("Failed to fetch report from server");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-in fade-in">
        <div className="flex gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-primary/50 animate-bounce" />
          <span className="w-3 h-3 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.1s' }} />
          <span className="w-3 h-3 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        <p className="text-text-muted">Loading your AI report...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-in fade-in">
        <p className="text-text-muted mb-4">Report not found or failed to load.</p>
        <button onClick={onBack} className="px-6 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-medium transition-colors">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { interview, q_and_a, report } = data;

  return (
    <div className="bg-bg-surface border border-border rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="p-8 border-b border-border bg-bg-surface-2 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors font-medium mb-6 relative z-10">
          <span>←</span> Back to Dashboard
        </button>

        <div className="flex justify-between items-end relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold tracking-wider uppercase">
                {interview.interviews_type}
              </span>
              <span className="px-3 py-1 bg-bg-surface text-text-secondary border border-border rounded-lg text-xs font-bold tracking-wider uppercase">
                {interview.difficulty_level}
              </span>
            </div>
            <h2 className="text-3xl font-black text-text-primary mb-1">{interview.title}</h2>
            <p className="text-text-muted text-sm font-medium">
              Completed on {new Date(interview.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 shadow-lg shadow-primary/10 relative" style={{ borderColor: report.final_score > 70 ? 'var(--color-success)' : report.final_score > 40 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-black/10 mix-blend-overlay" />
            <span className="text-3xl font-black" style={{ color: report.final_score > 70 ? 'var(--color-success)' : report.final_score > 40 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
              {report.final_score}
            </span>
            <span className="text-[10px] uppercase font-bold text-text-muted mt-0.5">Score</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Feedback Section */}
        <section>
          <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <span>📝</span> AI Feedback
          </h3>
          <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl text-text-secondary leading-relaxed shadow-inner">
            {report.final_feedback}
          </div>
        </section>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-success/5 border border-success/20 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl">💪</div>
            <h3 className="text-lg font-bold text-success mb-4 relative z-10">Strengths</h3>
            <ul className="space-y-3 relative z-10">
              {String(report.strengths ?? '').split('\n').filter(s => s.trim()).map((strength, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="text-success mt-0.5">✓</span>
                  <span>{strength.replace(/^- /, '')}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-warning/5 border border-warning/20 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl">🎯</div>
            <h3 className="text-lg font-bold text-warning mb-4 relative z-10">Areas to Improve</h3>
            <ul className="space-y-3 relative z-10">
              {String(report.weaknesses ?? '').split('\n').filter(s => s.trim()).map((weakness, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="text-warning mt-0.5">→</span>
                  <span>{weakness.replace(/^- /, '')}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Q&A Transcript */}
        <section>
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-border pb-4">
            <span>💬</span> Interview Transcript
          </h3>
          <div className="space-y-6">
            {(q_and_a || []).map((qa, index) => (
              <div key={qa.id || index} className="bg-bg-surface-2 rounded-2xl p-6 border border-border">
                {/* Question Bubble */}
                <div className="mb-6 pl-4 border-l-4 border-primary">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Question {index + 1}</p>
                  <p className="text-text-primary font-semibold leading-relaxed">{qa.question}</p>
                </div>
                {/* Answer Bubble */}
                <div className="bg-bg-surface p-5 rounded-xl border border-border ml-4 shadow-sm relative">
                  <div className="absolute -left-[18px] top-4 w-4 h-4 bg-bg-surface border-l border-b border-border rotate-45" />
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Your Answer</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{qa.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
