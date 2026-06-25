import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import client from '../api/client';
import toast from 'react-hot-toast';

function ConfirmDialog({ message, onConfirm, onCancel, danger = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div className="w-full max-w-sm bg-bg-surface border border-border rounded-3xl p-8 animate-in text-center shadow-2xl">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl ${danger ? 'bg-danger/10 border border-danger/30' : 'bg-warning/10 border border-warning/30'}`}>
          {danger ? '🗑️' : '⚠️'}
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-3">Are you sure?</h3>
        <p className="text-text-secondary text-sm mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-bg-surface-2 border border-border text-text-secondary rounded-xl text-sm hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 font-semibold rounded-xl text-sm transition-all ${
              danger ? 'bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30' : 'bg-warning/20 text-warning border border-warning/30 hover:bg-warning/30'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const isAuth = useRequireAuth();
  const { user, hasResume, logout, markResumeDeleted } = useAuth();
  const navigate = useNavigate();
  const [showResumeConfirm, setShowResumeConfirm] = useState(false);
  const [showAccountConfirm, setShowAccountConfirm] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  if (!isAuth) return null;

  const handleDeleteResume = async () => {
    setShowResumeConfirm(false);
    setDeletingResume(true);
    try {
      await client.delete('/api/delete_resume');
      markResumeDeleted();
      toast.success('Resume deleted successfully.');
    } catch (err) {
      const errorMsg = err?.response?.data?.detail || '';
      if (errorMsg.includes('No resume found')) {
        // The backend doesn't have it, so forcefully sync our local state
        markResumeDeleted();
        toast.success('Local state synced. No resume exists.');
      } else {
        toast.error(errorMsg || 'Failed to delete resume.');
      }
    } finally {
      setDeletingResume(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowAccountConfirm(false);
    setDeletingAccount(true);
    try {
      await client.delete('/api/user_delete');
      logout();
      toast.success('Account deleted. Goodbye!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to delete account.');
      setDeletingAccount(false);
    }
  };

  return (
    <>
      {showResumeConfirm && (
        <ConfirmDialog
          message="This will permanently delete your resume, all analysis data, and embeddings. You'll need to upload a new resume to use roadmap and interview features."
          onConfirm={handleDeleteResume}
          onCancel={() => setShowResumeConfirm(false)}
        />
      )}
      {showAccountConfirm && (
        <ConfirmDialog
          danger
          message="This will permanently delete your account and all associated data including your resume, interviews, and roadmap. This action cannot be undone."
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowAccountConfirm(false)}
        />
      )}

      <DashboardLayout>
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚙️</span>
            <div>
              <h1 className="text-4xl font-black text-text-primary">Settings</h1>
              <p className="text-text-secondary mt-1">Manage your account and resume</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile card */}
          <div className="bg-bg-surface border border-border rounded-3xl p-8">
            <h2 className="text-lg font-bold text-text-primary mb-6">Profile</h2>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary">{user?.name || 'User'}</p>
                <p className="text-text-secondary text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-success text-xs font-medium">Google Account Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resume management */}
          <div className="bg-bg-surface border border-border rounded-3xl p-8">
            <h2 className="text-lg font-bold text-text-primary mb-6">Resume</h2>

            {hasResume ? (
              <div>
                <div className="flex items-center gap-4 p-4 bg-success/10 border border-success/20 rounded-2xl mb-6">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-success font-semibold text-sm">Resume uploaded</p>
                    <p className="text-text-secondary text-xs">Your resume is active and being used for AI features.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResumeConfirm(true)}
                    disabled={deletingResume}
                    className="flex items-center gap-2 px-5 py-3 bg-danger/10 border border-danger/30 text-danger text-sm font-medium rounded-xl hover:bg-danger/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingResume ? (
                      <span className="w-4 h-4 border-2 border-danger border-t-transparent rounded-full animate-spin" />
                    ) : '🗑️'}
                    Delete Resume
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 p-4 bg-warning/10 border border-warning/20 rounded-2xl mb-6">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-warning font-semibold text-sm">No resume uploaded</p>
                    <p className="text-text-secondary text-xs">Upload a resume to unlock career roadmap and interview features.</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all btn-press"
                >
                  📎 Upload Resume
                </button>
              </div>
            )}
          </div>

          {/* Account info */}
          <div className="bg-bg-surface border border-border rounded-3xl p-8">
            <h2 className="text-lg font-bold text-text-primary mb-6">Account Information</h2>
            <div className="space-y-3">
              {[
                { label: 'Name', value: user?.name },
                { label: 'Email', value: user?.email },
                { label: 'Auth Method', value: 'Google OAuth 2.0' },
                { label: 'Account ID', value: user?.id || '—' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="text-text-muted text-sm">{item.label}</span>
                  <span className="text-text-primary text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-bg-surface border border-danger/20 rounded-3xl p-8">
            <h2 className="text-lg font-bold text-danger mb-2">Danger Zone</h2>
            <p className="text-text-muted text-sm mb-6">
              These actions are permanent and cannot be undone.
            </p>
            <button
              onClick={() => setShowAccountConfirm(true)}
              disabled={deletingAccount}
              className="flex items-center gap-2 px-6 py-3 bg-danger/10 border border-danger/30 text-danger text-sm font-semibold rounded-xl hover:bg-danger/20 transition-all disabled:opacity-50"
            >
              {deletingAccount ? (
                <span className="w-4 h-4 border-2 border-danger border-t-transparent rounded-full animate-spin" />
              ) : '⚠️'}
              Delete My Account
            </button>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
