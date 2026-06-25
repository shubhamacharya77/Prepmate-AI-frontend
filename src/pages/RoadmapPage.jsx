import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SkeletonRoadmap } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import client from '../api/client';

function RoadmapTimeline({ goal, roadmap }) {
  return (
    <div>
      {/* Goal chip */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-10">
        <span className="text-xl">🎯</span>
        <span className="text-sm font-semibold text-primary">Goal: {goal}</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="timeline-line" />
        <div className="space-y-8 pl-14">
          {roadmap.map((item, i) => (
            <div
              key={i}
              className="relative animate-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Timeline dot */}
              <div
                className="absolute -left-14 top-5 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, #6C63FF ${i * 15}%, #00D4FF)`,
                  boxShadow: '0 4px 16px rgba(108,99,255,0.4)',
                }}
              >
                {i + 1}
              </div>

              {/* Card */}
              <div className="group bg-bg-surface border border-border rounded-2xl p-6 card-hover overflow-hidden relative">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(ellipse at top left, rgba(108,99,255,0.05), transparent 60%)' }} />
                <div className="relative z-10">
                  {/* Month badge + topic */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <Badge variant="primary" className="mb-2">
                        📅 {item.month}
                      </Badge>
                      <h3 className="text-xl font-bold text-text-primary">{item.topics}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <span>Phase {i + 1}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <p className="text-text-secondary leading-relaxed text-sm">{item.details}</p>

                  {/* Progress indicator */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-bg-surface-3 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: `${Math.max(10, 100 - i * (70 / roadmap.length))}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted">
                      {i === 0 ? 'Start here' : i === roadmap.length - 1 ? 'Final goal' : 'In progress'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const isAuth = useRequireAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuth) return;
    fetchRoadmap();
  }, [isAuth]);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.get('/api/road_map');
      setData(response.data);
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 404) {
        setError('no_resume');
      } else {
        setError(detail || 'Failed to load roadmap. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRefreshing(true);
    try {
      const response = await client.get('/api/road_map');
      setData(response.data);
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 404) {
        setError('no_resume');
      } else {
        setError(detail || 'Failed to load roadmap. Please try again.');
      }
    } finally {
      setRefreshing(false);
    }
  };

  if (!isAuth) return null;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🗺️</span>
          <div>
            <h1 className="text-4xl font-black text-text-primary">Career Roadmap</h1>
            <p className="text-text-secondary mt-1">Your personalized month-by-month career growth plan</p>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div>
          <div className="flex items-center gap-3 mb-8 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
            <div className="flex gap-1.5">
              <span className="processing-dot" style={{ width: '6px', height: '6px' }} />
              <span className="processing-dot" style={{ width: '6px', height: '6px' }} />
              <span className="processing-dot" style={{ width: '6px', height: '6px' }} />
            </div>
            <p className="text-primary text-sm">Generating your AI-powered career roadmap...</p>
          </div>
          <SkeletonRoadmap count={4} />
        </div>
      )}

      {/* No resume error */}
      {!loading && error === 'no_resume' && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center mx-auto mb-6 text-4xl">
            📄
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">Upload Your Resume First</h2>
          <p className="text-text-secondary mb-8 max-w-sm mx-auto">
            Your career roadmap is generated from your resume. Please upload a PDF resume to get your personalized plan.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Upload Resume →
          </button>
        </div>
      )}

      {/* Generic error */}
      {!loading && error && error !== 'no_resume' && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-6 text-4xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">Something went wrong</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={fetchRoadmap}
            className="px-6 py-3 bg-bg-surface-2 border border-border text-text-primary rounded-xl hover:border-primary transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Roadmap data */}
      {!loading && !error && data && (
        <div>
          {/* Refresh button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleRegenerate}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-bg-surface-2 border border-border rounded-xl text-text-secondary text-sm hover:text-text-primary hover:border-border-light transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={refreshing ? 'animate-spin' : ''}
              >
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
              </svg>
              {refreshing ? 'Loading...' : 'Regenerate'}
            </button>
          </div>
          <RoadmapTimeline
            goal={data.goal || data.roadmap?.goal || 'Career Growth'}
            roadmap={
              Array.isArray(data.roadmap)
                ? data.roadmap
                : Array.isArray(data.roadmap?.roadmap)
                ? data.roadmap.roadmap
                : []
            }
          />
        </div>
      )}
    </DashboardLayout>
  );
}
