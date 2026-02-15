import React, { useState } from 'react';
import { X, RefreshCw, Trash2, Plus, Info, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useSetup } from '../../contexts/SetupContext';
import { TaskStatus } from '../../types/setup';
// Button import removed (unused)

interface ActivityViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivityView: React.FC<ActivityViewProps> = ({ isOpen, onClose }) => {
  const { state } = useSetup();
  const [selectedTab, setSelectedTab] = useState<'workflows' | 'agents'>('workflows');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  const allTasks = [...state.activeTasks, ...state.completedTasks];

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedTasks.size === allTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(allTasks.map(t => t.id)));
    }
  };

  const getStatusIcon = (status: TaskStatus['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: TaskStatus['status']) => {
    const styles = {
      complete: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-600',
      error: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {getStatusIcon(status)}
        {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return new Date(date).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Activity Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Recent agentic workflows and AI agents activity</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1">
                      View analytics
                      <span className="text-xs">↗</span>
                    </button>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-200 -mb-px">
                  <button
                    onClick={() => setSelectedTab('workflows')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                      selectedTab === 'workflows'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Agentic workflows
                  </button>
                  <button
                    onClick={() => setSelectedTab('agents')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                      selectedTab === 'agents'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    AI agents
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-300">
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-300"
                    disabled={selectedTasks.size === 0}
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="px-3 py-2 hover:bg-white rounded-lg transition-colors border border-gray-300 text-sm font-medium text-gray-700">
                    Export
                  </button>
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTasks.size === allTasks.length && allTasks.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date created
                    </th>
                    <th className="w-12 px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50 transition-colors"
                     
                     
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(task.id)}
                          onChange={() => toggleTaskSelection(task.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{task.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md">
                          {task.currentAction || 'Processing in background'}
                          {task.status === 'in-progress' && task.progress > 0 && (
                            <div className="mt-1">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                                <span>{Math.round(task.progress)}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(task.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(state.startTime)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Info className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {allTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">No agent activity yet</p>
                          <p className="text-xs text-gray-400 mt-1">Tasks will appear here as they start</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {allTasks.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {selectedTasks.size > 0 ? `${selectedTasks.size} selected` : `${allTasks.length} total tasks`}
                  </span>
                  <span>
                    {state.activeTasks.length} active · {state.completedTasks.length} completed
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
  );
};

export default ActivityView;
