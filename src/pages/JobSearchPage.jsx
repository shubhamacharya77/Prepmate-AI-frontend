import { useState } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import client from '../api/client';

function JobCard({ job }) {
  return (
    <div className="group bg-bg-surface border border-border rounded-2xl p-6 card-hover overflow-hidden relative">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(0,212,255,0.05), transparent 60%)' }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-text-primary leading-tight truncate">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm font-medium text-accent">{job.company}</span>
              {job.location && (
                <>
                  <span className="text-text-muted">•</span>
                  <span className="text-sm text-text-secondary">{job.location}</span>
                </>
              )}
            </div>
          </div>
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-xl hover:bg-primary/20 transition-all"
            >
              View Job →
            </a>
          )}
        </div>

        {/* Description snippet */}
        {job.description && (
          <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mt-3">
            {job.description}
          </p>
        )}

        {/* Job ID badge */}
        {job.job_id && (
          <div className="mt-4">
            <Badge variant="muted" className="text-xs">ID: {job.job_id}</Badge>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobSearchPage() {
  const isAuth = useRequireAuth();
  const [keyword, setKeyword] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  if (!isAuth) return null;

  const handleSearch = async () => {
    const searchText = keyword.trim();
    if (!searchText) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await client.post(`/api/job_search?JD=${encodeURIComponent(searchText)}`);
      const result = response.data;
      const jobList = Array.isArray(result) ? result : (result?.jobs || []);
      setJobs(jobList);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to search jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔍</span>
          <div>
            <h1 className="text-4xl font-black text-text-primary">Job Search</h1>
            <p className="text-text-secondary mt-1">Find opportunities matched to your profile</p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="bg-bg-surface border border-border rounded-3xl p-8 mb-8">
        <div>
          <p className="text-text-secondary text-sm mb-3">
            Search by role, skill, or technology to discover relevant opportunities.
          </p>
          <input
            id="keyword-input"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 'Python backend engineer, remote' or 'React developer, fintech'"
            className="w-full px-4 py-4 bg-bg-surface-2 border border-border rounded-2xl text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            id="job-search-btn"
            onClick={handleSearch}
            disabled={loading || !keyword.trim()}
            className="
              flex items-center gap-2 px-8 py-3.5
              bg-gradient-to-r from-primary to-accent
              text-white font-semibold rounded-xl transition-all
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:opacity-90 btn-press shadow-lg hover:shadow-glow-primary
            "
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>🔍 Find Jobs</>
            )}
          </button>
          {searched && (
            <button
              onClick={() => { setJobs([]); setSearched(false); setKeyword(''); setError(null); }}
              className="px-5 py-3.5 bg-bg-surface-2 border border-border text-text-secondary text-sm rounded-xl hover:text-text-primary hover:border-border-light transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div>
          <div className="flex items-center gap-3 mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl">
            <div className="flex gap-1.5">
              <span className="processing-dot" style={{ width: '6px', height: '6px' }} />
              <span className="processing-dot" style={{ width: '6px', height: '6px' }} />
              <span className="processing-dot" style={{ width: '6px', height: '6px' }} />
            </div>
            <p className="text-accent text-sm">Searching for matching opportunities...</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
          <p className="text-danger font-semibold mb-2">Search failed</p>
          <p className="text-text-secondary text-sm">{error}</p>
        </div>
      )}

      {!loading && searched && !error && jobs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-bg-surface-2 border border-border flex items-center justify-center mx-auto mb-6 text-4xl">
            🔭
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No jobs found</h3>
          <p className="text-text-secondary text-sm max-w-sm mx-auto">
            Try different keywords. Make sure your query is specific enough to find matches.
          </p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text-primary">
              {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
            <Badge variant="success">{jobs.length} matches</Badge>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {jobs.map((job, i) => (
              <JobCard key={job.job_id || i} job={job} />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
