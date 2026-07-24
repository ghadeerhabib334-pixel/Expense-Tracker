import { useState, useEffect } from 'react';
import { useExpensesStore } from '../store/expensesStore';
import { ThemeToggle } from '../components/ThemeToggle';
import { Source, SourceCurrency } from '../types/Source';
import { formatCurrency, formatCurrencyIn } from '../utils/calculations';

export const Sources = () => {
  const { sources, addSource, updateSource, deleteSource, transferFromSource, walletTotal, loadData } = useExpensesStore();
  
  const [showSourceForm, setShowSourceForm] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [sourceName, setSourceName] = useState('');
  const [sourceValue, setSourceValue] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState<SourceCurrency>('RON');
  const [transferAmounts, setTransferAmounts] = useState<Record<string, string>>({});
  
  // Exchange rate state (RON to EUR)
  const [exchangeRate, setExchangeRate] = useState(() => {
    const saved = localStorage.getItem('ronToEurRate');
    return saved ? parseFloat(saved) : 5.0; // Default to 5.0 if not set
  });
  const [showExchangeRateModal, setShowExchangeRateModal] = useState(false);
  const [exchangeRateInput, setExchangeRateInput] = useState('');
  
  // Normalize mixed-currency sources for combined totals.
  const totalSourcesRON = sources.reduce(
    (sum, source) => sum + (source.currency === 'EUR' ? source.value * exchangeRate : source.value),
    0
  );
  const totalSourcesEUR = totalSourcesRON / exchangeRate;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveExchangeRate = () => {
    const rate = parseFloat(exchangeRateInput);
    if (rate > 0) {
      setExchangeRate(rate);
      localStorage.setItem('ronToEurRate', rate.toString());
      setShowExchangeRateModal(false);
      setExchangeRateInput('');
    }
  };

  const handleSaveSource = () => {
    const value = parseFloat(sourceValue) || 0;
    if (editingSource) {
      updateSource(editingSource.id, { name: sourceName, value, currency: sourceCurrency });
    } else {
      addSource({ name: sourceName, value, currency: sourceCurrency });
    }
    setShowSourceForm(false);
    setEditingSource(null);
    setSourceName('');
    setSourceValue('');
    setSourceCurrency('RON');
  };

  const handleEditSource = (source: Source) => {
    setEditingSource(source);
    setSourceName(source.name);
    setSourceValue(source.value.toString());
    setSourceCurrency(source.currency || 'RON');
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

    const walletAmount = source.currency === 'EUR' ? amount * exchangeRate : amount;
    if (window.confirm(`Transfer ${formatCurrencyIn(amount, source.currency)} from ${source.name} to wallet (${formatCurrency(walletAmount)})?`)) {
      transferFromSource(sourceId, amount, walletAmount);
      setTransferAmounts({ ...transferAmounts, [sourceId]: '' });
    }
  };

  const handleTransferAll = (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId);
    if (!source || source.value <= 0) {
      return;
    }

    const walletAmount = source.currency === 'EUR' ? source.value * exchangeRate : source.value;
    if (window.confirm(`Transfer all ${formatCurrencyIn(source.value, source.currency)} from ${source.name} to wallet (${formatCurrency(walletAmount)})?`)) {
      transferFromSource(sourceId, source.value, walletAmount);
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
                    Value
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={sourceCurrency}
                    onChange={(e) => setSourceCurrency(e.target.value as SourceCurrency)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="RON">Lei (RON)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
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
                      setSourceCurrency('RON');
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
            <>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl p-6 text-white">
                <div>
                  <h3 className="text-sm font-medium text-blue-100 mb-1">Total Sources</h3>
                  <div className="text-3xl font-bold">{formatCurrency(totalSourcesRON)}</div>
                </div>
              </div>
              
              {/* Total Sources in EUR */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 rounded-xl p-6 text-white relative">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-purple-100">Total Sources (EUR)</h3>
                    <button
                      onClick={() => {
                        setShowExchangeRateModal(true);
                        setExchangeRateInput(exchangeRate.toString());
                      }}
                      className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-purple-100 transition-colors"
                      title="Set exchange rate"
                    >
                      Rate: {exchangeRate.toFixed(4)}
                    </button>
                  </div>
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(totalSourcesEUR)}
                  </div>
                </div>
              </div>
            </>
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
                        {formatCurrencyIn(source.value, source.currency || 'RON')}
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

          {/* Add Source Button */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setShowSourceForm(true);
                setEditingSource(null);
                setSourceName('');
                setSourceValue('');
                setSourceCurrency('RON');
              }}
              className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              + Add Source
            </button>
          </div>
        </div>

        {/* Exchange Rate Modal */}
        {showExchangeRateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md mx-4 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Set Exchange Rate (RON to EUR)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exchange Rate
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    value={exchangeRateInput}
                    onChange={(e) => setExchangeRateInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="5.0000"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    How many RON = 1 EUR
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveExchangeRate}
                    disabled={!exchangeRateInput || isNaN(parseFloat(exchangeRateInput)) || parseFloat(exchangeRateInput) <= 0}
                    className="flex-1 bg-purple-600 dark:bg-purple-500 text-white py-2 rounded-lg font-medium hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowExchangeRateModal(false);
                      setExchangeRateInput('');
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

