import React, { useState } from 'react';

// Mock Data
const INITIAL_HISTORY = [
    {
        id: 1,
        date: "Mon, 20 Mar 2025",
        time: "09:00 AM",
        name: "Sarah johnson",
        description: "Regular Checkup",
        isRead: false
    },
    {
        id: 2,
        date: "Mon, 20 Mar 2025",
        time: "09:00 AM",
        name: "Sarah johnson",
        description: "Regular Checkup",
        isRead: false
    },
    {
        id: 3,
        date: "Mon, 20 Mar 2025",
        time: "09:00 AM",
        name: "Sarah johnson",
        description: "Regular Checkup",
        isRead: false
    },
    {
        id: 4,
        date: "Sun, 19 Mar 2025",
        time: "09:00 AM",
        name: "Sarah johnson",
        description: "Regular Checkup",
        isRead: true
    },
    {
        id: 5,
        date: "Sun, 19 Mar 2025",
        time: "09:00 AM",
        name: "Sarah johnson",
        description: "Regular Checkup",
        isRead: true
    },
    {
        id: 6,
        date: "Sun, 19 Mar 2025",
        time: "09:00 AM",
        name: "Sarah johnson",
        description: "Regular Checkup",
        isRead: true
    }
];

const HistoryPage = () => {
    const [history, setHistory] = useState(INITIAL_HISTORY);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [filterType, setFilterType] = useState('date'); // 'date' or 'time'

    // Filter and Search Logic
    const filteredHistory = history.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group by Date
    const groupedHistory = filteredHistory.reduce((acc, item) => {
        if (!acc[item.date]) {
            acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
    }, {});

    const handleToggleSelect = (id) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleMarkAllRead = () => {
        setHistory(prev => prev.map(item => ({ ...item, isRead: true })));
        // Optionally clear selection or give feedback
    };

    const handleClear = () => {
        if (selectedItems.size > 0) {
            // Clear selected
            setHistory(prev => prev.filter(item => !selectedItems.has(item.id)));
            setSelectedItems(new Set());
        } else {
            // Clear all (with confirm generally, but for now just clear)
            if (confirm("Are you sure you want to clear all history?")) {
                setHistory([]);
            }
        }
    };

    return (
        <div className="w-full flex-1 min-h-screen pb-10">

            {/* Top Bar */}
            <div className="bg-rose-50/50 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm border border-rose-100/50">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1 items-center">
                    {/* Search */}
                    <div className="relative w-full md:max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search History"
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-300 text-sm bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setFilterType('date')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-medium border transition-colors ${filterType === 'date' ? 'bg-white border-rose-200 text-rose-500 shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'}`}
                        >
                            By Date
                        </button>
                        <button
                            onClick={() => setFilterType('time')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-medium border transition-colors ${filterType === 'time' ? 'bg-white border-rose-200 text-rose-500 shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'}`}
                        >
                            By time
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <button
                        onClick={handleMarkAllRead}
                        className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Mark All Read
                    </button>
                    <button
                        onClick={handleClear}
                        className="text-sm font-bold text-gray-800 hover:underline hover:text-rose-500 transition-colors underline"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* History List */}
            <div className="space-y-8">
                {Object.keys(groupedHistory).length > 0 ? (
                    Object.entries(groupedHistory).map(([date, items]) => (
                        <div key={date}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 ml-1">{date}</h3>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${selectedItems.has(item.id) ? 'bg-rose-50/30' : ''}`}
                                    >
                                        {/* Checkbox */}
                                        <div className="shrink-0">
                                            <div
                                                onClick={() => handleToggleSelect(item.id)}
                                                className={`w-6 h-6 rounded-md border-2 cursor-pointer flex items-center justify-center transition-colors ${selectedItems.has(item.id) ? 'bg-rose-400 border-rose-400' : 'border-gray-200 hover:border-rose-300'}`}
                                            >
                                                {selectedItems.has(item.id) && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center">
                                            <div className="text-gray-500 font-medium text-sm">{item.time}</div>
                                            <div className={`font-semibold text-gray-800 ${item.isRead ? 'font-medium' : 'font-bold'}`}>{item.name}</div>
                                            <div className="text-gray-400 text-sm">{item.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        No history found
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
