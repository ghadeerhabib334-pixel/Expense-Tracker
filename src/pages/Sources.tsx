import { useState, useEffect } from 'react';
import { useExpensesStore } from '../store/expensesStore';
import { ThemeToggle } from '../components/ThemeToggle';
import { Source } from '../types/Source';
import { formatCurrency } from '../utils/calculations';

export const Sources = () => {
  const { sources, addSource, updateSource, deleteSource, transferFromSource, walletTotal, loadData } = useExpensesStore();
  
  // Calculate total of all sources
  const totalSources = sources.reduce((sum, source) => sum + source.value, 0);
  const [showSourceForm, setShowSourceForm] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [sourceName, setSourceName] = useState('');
  const [sourceValue, setSourceValue] = useState('');
  const [transferAmounts, setTransferAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSource = () => {
    const value = parseFloat(sourceValue) || 0;
    if (editingSource) {
      updateSource(editingSource.id, { name: sourceName, value });
    } else {
      addSource({ name: sourceName, value });
    }
    setShowSourceForm(false);
    setEditingSource(null);
    setSourceName('');
    setSourceValue('');
  };

  const handleEditSource = (source: Source) => {
    setEditingSource(source);
    setSourceName(source.name);
    setSourceValue(source.value.toString());
    setShowSourceForm(true);
  };

  const handleDeleteSource = (id: string) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      deleteSource(id);
    }
  };


  const handleTransfer = (sourceId: string) => {
    const amountStr = transferAmounts[sourceId] || '';
    const amount = parseFloat(amountStr);
    const source = sources.find((s) => s.id === sourceId);

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!source || source.value < amount) {
      alert('Insufficient funds in source');
      return;
    }

    if (window.confirm(`Transfer ${formatCurrency(amount)} from ${source.name} to wallet?`)) {
      transferFromSource(sourceId, amount);
      setTransferAmounts({ ...transferAmounts, [sourceId]: '' });
    }
  };

  const handleTransferAll = (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId);
    if (!source || source.value <= 0) {
      return;
    }

    if (window.confirm(`Transfer all ${formatCurrency(source.value)} from ${source.name} to wallet?`)) {
      transferFromSource(sourceId, source.value);
      setTransferAmounts({ ...transferAmounts, [sourceId]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sources</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your money sources and transfer to wallet</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="space-y-6">
          {/* Wallet Total Display */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl p-6 text-white">
            <div>
              <h3 className="text-sm font-medium text-green-100 mb-1">Wallet Total</h3>
              <div className="text-3xl font-bold">{formatCurrency(walletTotal)}</div>
            </div>
          </div>

          {/* Add Source Button */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setShowSourceForm(true);
                setEditingSource(null);
                setSourceName('');
                setSourceValue('');
              }}
              className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              + Add Source
            </button>
          </div>

          {/* Source Form */}
          {showSourceForm && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingSource ? 'Edit Source' : 'Add New Source'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Source Name
                  </label>
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter source name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Value (RON)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={sourceValue}
                    onChange={(e) => setSourceValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveSource}
                    disabled={!sourceName.trim() || !sourceValue || isNaN(parseFloat(sourceValue))}
                    className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingSource ? 'Update' : 'Add'}
                  </button>
                  <button
                    onClick={() => {
                      setShowSourceForm(false);
                      setEditingSource(null);
                      setSourceName('');
                      setSourceValue('');
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Total Sources */}
          {sources.length > 0 && (
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl p-6 text-white">
              <div>
                <h3 className="text-sm font-medium text-blue-100 mb-1">Total Sources</h3>
                <div className="text-3xl font-bold">{formatCurrency(totalSources)}</div>
              </div>
            </div>
          )}

          {/* Sources List */}
          <div className="space-y-4">
            {sources.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-500 dark:text-gray-400">No sources yet. Add your first source above.</p>
              </div>
            ) : (
              sources.map((source) => (
                <div
                  key={source.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{source.name}</h3>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {formatCurrency(source.value)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSource(source)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteSource(source.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Transfer Section */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={source.value}
                        value={transferAmounts[source.id] || ''}
                        onChange={(e) => setTransferAmounts({ ...transferAmounts, [source.id]: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Amount to transfer"
                      />
                      <button
                        onClick={() => handleTransfer(source.id)}
                        disabled={!transferAmounts[source.id] || parseFloat(transferAmounts[source.id] || '0') <= 0 || parseFloat(transferAmounts[source.id] || '0') > source.value}
                        className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Transfer
                      </button>
                      {source.value > 0 && (
                        <button
                          onClick={() => handleTransferAll(source.id)}
                          className="px-4 py-2 bg-green-700 dark:bg-green-600 text-white rounded-lg font-medium hover:bg-green-800 dark:hover:bg-green-700 transition-colors"
                          title="Transfer all"
                        >
                          All
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

