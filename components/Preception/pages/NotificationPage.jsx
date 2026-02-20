import React, { useState } from 'react';

const NOTIFICATIONS_DATA = [
    {
        id: 1,
        message: "Your Appointment with Doctor Smith is Confirmed",
        type: "appointment",
        time: "10 min Ago",
        isRead: false,
        icon: "🔔",
        color: "text-rose-400",
        isStarred: false
    },
    {
        id: 2,
        message: "Payment Reminder : due for sarah johnson Consultation",
        type: "payment",
        time: "20 min Ago",
        isRead: false,
        icon: "💳",
        color: "text-rose-400",
        isStarred: true
    },
    {
        id: 3,
        message: "Upcoming Appointment : Mike Peter 9:00 AM tomorrow",
        type: "appointment",
        time: "30 min Ago",
        isRead: true,
        icon: "📅",
        color: "text-rose-400",
        isStarred: false
    },
    {
        id: 4,
        message: "New Hospital Added Near you",
        type: "info",
        time: "1 Hour Ago",
        isRead: true,
        icon: "🏥",
        color: "text-rose-400",
        isStarred: false
    }
];

const NotificationPage = () => {
    const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
    const [searchQuery, setSearchQuery] = useState('');

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleClear = () => {
        setNotifications([]);
    };

    const handleToggleStar = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, isStarred: !n.isStarred } : n
        ));
    };

    const filteredNotifications = notifications.filter(n =>
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full flex-1">
            {/* Filters Bar */}
            <div className="bg-rose-50/50 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm border border-rose-100/50">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                    {/* Search */}
                    <div className="relative w-full md:max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search Appointment"
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-300 text-sm bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Type Filter */}
                    <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-rose-300 text-gray-500 cursor-pointer">
                        <option>All Types</option>
                        <option>Appointment</option>
                        <option>Payment</option>
                        <option>Info</option>
                    </select>

                    {/* Status Filter */}
                    <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-rose-300 text-gray-500 cursor-pointer">
                        <option>All Status</option>
                        <option>Unread</option>
                        <option>Read</option>
                    </select>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={handleMarkAllRead}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Mark All Read
                    </button>
                    <button
                        onClick={handleClear}
                        className="text-sm font-semibold text-gray-700 hover:underline hover:text-rose-500 transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Notification List */}
            <div className="flex flex-col">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((note) => (
                        <div key={note.id} className="bg-white p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center ">
                                <div className={`w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-lg ${note.color}`}>
                                    {note.icon}
                                </div>
                                <div className={`font-medium ${note.isRead ? 'text-gray-500' : 'text-gray-800'}`}>
                                    {note.message}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => handleToggleStar(note.id)}
                                    className={`text-2xl transition-colors ${note.isStarred ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                                >
                                    {note.isStarred ? '★' : '☆'}
                                </button>
                                <div className="text-sm text-gray-400 font-medium min-w-[80px] text-right">
                                    {note.time}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400">
                        No notifications found
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
