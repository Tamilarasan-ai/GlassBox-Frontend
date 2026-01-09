import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, Modal } from '@/components/ui';
import { ChatContainer } from '@/features/chat';
import { TraceTable, TraceInspector } from '@/features/traces';

const App = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Innowhyte Frontend</h1>
          <p className="text-sm text-gray-500">Production-ready feature-based architecture</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'chat' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('chat')}
          >
            Chat Feature
          </Button>
          <Button
            variant={activeTab === 'traces' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('traces')}
          >
            Traces Feature
          </Button>
          <Button
            variant={activeTab === 'ui' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('ui')}
          >
            UI Components
          </Button>
        </div>

        {/* Content Area */}
        {activeTab === 'chat' && (
          <Card className="h-[600px]">
            <ChatContainer />
          </Card>
        )}

        {activeTab === 'traces' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Traces</CardTitle>
              </CardHeader>
              <CardContent>
                <TraceTable traces={[]} isLoading={false} />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'ui' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
                <Button isLoading>Loading...</Button>
              </CardContent>
            </Card>

            {/* Modal Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Modal</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Example Modal"
                  description="This is a production-ready modal component"
                >
                  <p className="text-gray-700">
                    This modal includes accessibility features like focus trap,
                    ESC key handling, and body scroll lock.
                  </p>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                      Confirm
                    </Button>
                  </div>
                </Modal>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;