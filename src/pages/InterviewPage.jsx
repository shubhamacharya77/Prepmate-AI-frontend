import { useState } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/layout/DashboardLayout';
import InterviewHistoryList from '../components/interview/InterviewHistoryList';
import CreateInterviewModal from '../components/interview/CreateInterviewModal';
import InterviewReport from '../components/interview/InterviewReport';
import ActiveInterview from '../components/interview/ActiveInterview';

export default function InterviewPage() {
  const isAuth = useRequireAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'active', 'report'
  const [activeInterviewId, setActiveInterviewId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isAuth) return null;

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleResume = (id) => {
    setActiveInterviewId(id);
    setCurrentView('active');
  };

  const handleViewReport = (id) => {
    setActiveInterviewId(id);
    setCurrentView('report');
  };

  const handleInterviewCreated = (id) => {
    setShowCreateModal(false);
    setActiveInterviewId(id);
    setRefreshKey(prev => prev + 1);
    setCurrentView('active');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-text-primary">Interview Practice</h1>
        <p className="text-text-secondary mt-2 text-lg">Master your interviewing skills with AI feedback.</p>
      </div>
      
      {currentView === 'list' && (
        <InterviewHistoryList 
          key={refreshKey}
          onCreateNew={handleCreateNew} 
          onResume={handleResume}
          onViewReport={handleViewReport}
        />
      )}

      {showCreateModal && (
        <CreateInterviewModal 
          onClose={() => setShowCreateModal(false)} 
          onCreated={handleInterviewCreated} 
        />
      )}

      {currentView === 'report' && (
        <InterviewReport 
          interviewId={activeInterviewId}
          onBack={() => setCurrentView('list')}
        />
      )}

      {currentView === 'active' && (
        <ActiveInterview 
          interviewId={activeInterviewId} 
          onBack={() => setCurrentView('list')} 
          onComplete={() => setCurrentView('report')}
        />
      )}
    </DashboardLayout>
  );
}
