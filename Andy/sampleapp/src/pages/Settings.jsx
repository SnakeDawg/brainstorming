import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Settings as SettingsIcon, Info, Link, FolderOpen, Save, RefreshCw, Brain, Trash2, X } from 'lucide-react';

const Settings = () => {
  const [mcpServers, setMcpServers] = useState([
    { id: 1, name: 'Filesystem MCP', status: 'connected', url: 'http://localhost:3001' },
    { id: 2, name: 'Database MCP', status: 'disconnected', url: 'http://localhost:3002' },
  ]);

  const [permissions, setPermissions] = useState({
    desktopAccess: true,
    fileSystemAccess: false,
    networkAccess: true,
  });

  const [newServer, setNewServer] = useState({ name: '', url: '' });
  const [showAddServer, setShowAddServer] = useState(false);

  const [memoryItems, setMemoryItems] = useState([
    { id: 1, type: 'preference', content: 'User prefers dark mode for coding', source: 'Chat on Jan 10', category: 'Preferences' },
    { id: 2, type: 'fact', content: 'Working on a React project with TypeScript', source: 'Chat on Jan 12', category: 'Work Context' },
    { id: 3, type: 'preference', content: 'Prefers concise code explanations', source: 'Chat on Jan 8', category: 'Communication Style' },
    { id: 4, type: 'fact', content: 'Uses Windows 11 Pro', source: 'System scan', category: 'System Info' },
  ]);

  const handleTogglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddServer = () => {
    if (newServer.name && newServer.url) {
      setMcpServers(prev => [
        ...prev,
        {
          id: prev.length + 1,
          name: newServer.name,
          url: newServer.url,
          status: 'disconnected'
        }
      ]);
      setNewServer({ name: '', url: '' });
      setShowAddServer(false);
    }
  };

  const handleToggleServerStatus = (id) => {
    setMcpServers(prev =>
      prev.map(server =>
        server.id === id
          ? { ...server, status: server.status === 'connected' ? 'disconnected' : 'connected' }
          : server
      )
    );
  };

  const handleRemoveServer = (id) => {
    setMcpServers(prev => prev.filter(server => server.id !== id));
  };

  const handleDeleteMemory = (id) => {
    setMemoryItems(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">Configure application settings and integrations</p>
      </div>

      {/* Application Information */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Application Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Application Name</p>
            <p className="font-semibold text-neutral-900 dark:text-white">AI System Manager</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Version</p>
            <p className="font-semibold text-neutral-900 dark:text-white">1.0.0</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Build Number</p>
            <p className="font-semibold text-neutral-900 dark:text-white">20250115.1</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Last Updated</p>
            <p className="font-semibold text-neutral-900 dark:text-white">January 15, 2025</p>
          </div>
        </div>

        <div className="mt-4 p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">About</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            AI System Manager is an intelligent system monitoring and optimization tool powered by
            advanced AI. It helps keep your PC running smoothly with automated health checks,
            personalized recommendations, and seamless AI assistance.
          </p>
        </div>
      </Card>

      {/* MCP Server Configuration */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">MCP Server Configuration</h2>
          </div>
          <Button
            size="small"
            variant="secondary"
            onClick={() => setShowAddServer(!showAddServer)}
          >
            {showAddServer ? 'Cancel' : 'Add Server'}
          </Button>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Configure Model Context Protocol (MCP) servers to extend the Personal Assistant's capabilities with
          external tools and data sources.
        </p>

        {showAddServer && (
          <div className="mb-4 p-4 border border-primary-200 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Add New MCP Server</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Server Name
                </label>
                <input
                  type="text"
                  value={newServer.name}
                  onChange={(e) => setNewServer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., GitHub MCP, Slack MCP"
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Server URL
                </label>
                <input
                  type="text"
                  value={newServer.url}
                  onChange={(e) => setNewServer(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="e.g., http://localhost:3003"
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Button
                onClick={handleAddServer}
                disabled={!newServer.name || !newServer.url}
                icon={Save}
              >
                Add Server
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {mcpServers.map(server => (
            <div
              key={server.id}
              className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{server.name}</h3>
                  <Badge variant={server.status === 'connected' ? 'success' : 'default'}>
                    {server.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{server.url}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleServerStatus(server.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    server.status === 'connected' ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      server.status === 'connected' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => handleRemoveServer(server.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {mcpServers.length === 0 && (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            <p className="text-sm">No MCP servers configured</p>
            <p className="text-xs mt-1">Click "Add Server" to configure your first MCP server</p>
          </div>
        )}
      </Card>

      {/* Personal Assistant Permissions */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Personal Assistant Permissions</h2>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Control what the Personal Assistant can access on your system.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Desktop Access</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Allow AI to read and interact with files on your desktop
              </p>
            </div>
            <button
              onClick={() => handleTogglePermission('desktopAccess')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                permissions.desktopAccess ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  permissions.desktopAccess ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">File System Access</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Allow AI to read, write, and modify files anywhere on your system
              </p>
              <div className="mt-2 px-3 py-1 bg-warning-100 dark:bg-warning-900/30 border border-warning-300 dark:border-warning-700 rounded text-xs text-warning-700 dark:text-warning-400 inline-block">
                ⚠️ Use with caution - grants broad file access
              </div>
            </div>
            <button
              onClick={() => handleTogglePermission('fileSystemAccess')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                permissions.fileSystemAccess ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  permissions.fileSystemAccess ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Network Access</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Allow AI to make network requests and access web resources
              </p>
            </div>
            <button
              onClick={() => handleTogglePermission('networkAccess')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                permissions.networkAccess ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  permissions.networkAccess ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-600 rounded-lg">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Privacy Note:</strong> All permissions can be toggled at any time. Data processed by
            the Personal Assistant remains on your device and is never shared externally without your explicit consent.
          </p>
        </div>
      </Card>

      {/* Personal Assistant Memory */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Personal Assistant Memory</h2>
          </div>
          <Button
            size="small"
            variant="ghost"
            icon={Trash2}
            onClick={() => setMemoryItems([])}
          >
            Clear All
          </Button>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          The Personal Assistant remembers key information about you to provide more personalized assistance. You can view and manage what it remembers here.
        </p>

        {memoryItems.length > 0 ? (
          <div className="space-y-3">
            {memoryItems.map(item => (
              <div
                key={item.id}
                className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-primary-200 dark:hover:border-primary-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={item.type === 'preference' ? 'info' : 'default'} size="small">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.source}</span>
                    </div>
                    <p className="text-sm text-neutral-900 dark:text-white">{item.content}</p>
                  </div>
                  <button
                    onClick={() => setMemoryItems(prev => prev.filter(m => m.id !== item.id))}
                    className="p-1 text-neutral-400 hover:text-error-600 transition-colors"
                    aria-label="Delete memory"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            <Brain className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm">No memory items yet</p>
            <p className="text-xs mt-1">The Personal Assistant will remember important details as you interact</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-600 rounded-lg">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Privacy:</strong> Memory items are stored locally on your device and can be deleted at any time. They help the AI provide more relevant and personalized assistance.
          </p>
        </div>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Advanced Settings</h2>
        </div>

        <div className="space-y-3">
          <Button variant="secondary" icon={RefreshCw}>
            Reset All Settings
          </Button>
          <Button variant="ghost">
            Export Configuration
          </Button>
          <Button variant="ghost">
            Import Configuration
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
