import React, { useState } from 'react';
import { Bot, Activity, Box, User, Layers, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Modal } from '@/components/ui';
import ChatContainer from './features/chat/components/ChatContainer';
import { TraceTable } from '@/features/traces';
import { ToastProvider } from '@/components/ui/Toast';

const App = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-bg text-text-primary font-sans selection:bg-primary/30 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`${isSidebarOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full opacity-0'
            } bg-panel border-r border-border-soft flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap`}
        >
          {/* Logo & Toggle */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-gradient_start to-primary-gradient_end rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Box className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary tracking-tight">GlassBox</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-surface rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* AGENTS Section */}
            <div>
              <div className="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Agents
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${activeTab === 'chat'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  }`}
              >
                <Bot className={`w-4 h-4 ${activeTab === 'chat' ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}`} />
                <span className="font-medium">Calculator Agent</span>
              </button>
            </div>

            {/* MONITORING Section */}
            <div>
              <div className="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Monitoring
              </div>
              <button
                onClick={() => setActiveTab('traces')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${activeTab === 'traces'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  }`}
              >
                <Activity className={`w-4 h-4 ${activeTab === 'traces' ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}`} />
                <span className="font-medium">Traces</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-bg relative transition-all duration-300">
          {activeTab === 'chat' && (
            <ChatContainer
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          )}

          {activeTab === 'traces' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <header className="h-16 border-b border-border-soft flex items-center justify-between px-6 bg-bg/80 backdrop-blur-md z-10 flex-shrink-0">
                <div className="flex items-center gap-4">
                  {!isSidebarOpen && (
                    <button
                      onClick={toggleSidebar}
                      className="p-2 hover:bg-surface rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <PanelLeftOpen className="w-5 h-5" />
                    </button>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Trace History</h2>
                    <p className="text-xs text-text-secondary">Monitor and debug agent execution runs with full transparency.</p>
                  </div>
                </div>
              </header>
              <div className="flex-1 overflow-auto p-6">
                <TraceTable />
              </div>
            </div>
          )}


        </main>
      </div>
    </ToastProvider>
  );
};

export default App;