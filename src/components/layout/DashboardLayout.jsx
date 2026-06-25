import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-base flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
