import React, { useState } from 'react';
import Button from '../UI/Button';

// Mock Data
const INITIAL_REMINDERS = [
    {
        id: 1,
        title: "Sarah Johnson",
        subtitle: "Routine Checkup",
        time: "[09:00] AM",
        priority: "Medium",
        enabled: true,
        isSnoozed: false
    },
    {
        id: 2,
        title: "Sarah Johnson",
        subtitle: "Routine Checkup",
        time: "[09:00] AM",
        priority: "Medium",
        enabled: true,
        isSnoozed: false
    },
    {
        id: 3,
        title: "Sarah Johnson",
        subtitle: "Routine Checkup",
        time: "[09:00] AM",
        priority: "Medium",
        enabled: true,
        isSnoozed: false
    }
];

const ReminderPage = () => {
    const [reminders, setReminders] = useState(INITIAL_REMINDERS);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newReminder, setNewReminder] = useState({
        title: '',
        date: '',
        timeStart: '00:00',
        timeEnd: '00:00',
        description: '',
        pushInfo: true,
        emailInfo: false,
        smsInfo: true,
        priority: 'Medium',
        repeat: 'None'
    });

    const handleToggleEnable = (id) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    const handleSnooze = (id) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, isSnoozed: !r.isSnoozed } : r));
    };

    const handleSave = () => {
        const newId = reminders.length + 1;
        const reminder = {
            id: newId,
            title: newReminder.title || "New Reminder",
            subtitle: "Custom Reminder",
            time: `[${newReminder.timeStart}] AM`, // Simplified for now
            priority: newReminder.priority,
            enabled: true,
            isSnoozed: false
        };
        setReminders([...reminders, reminder]);
        setShowAddForm(false);
    };

    return (
        <div className="w-full relative min-h-screen pb-10">

            {/* Top Bar */}
            <div className="bg-rose-50/50 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm border border-rose-100/50">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                    {/* Search */}
                    <div className="relative w-full md:max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search Appointment"
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-300 text-sm bg-white"
                        />
                    </div>
                    <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-rose-300 text-gray-500 cursor-pointer">
                        <option>All Types</option>
                    </select>
                    <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-rose-300 text-gray-500 cursor-pointer">
                        <option>All Status</option>
                    </select>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Button
                        className="flex-1 md:flex-none bg-rose-400 hover:bg-rose-500 text-white px-6 py-2 rounded-xl shadow-lg shadow-rose-200 transition-all font-medium flex items-center gap-2 justify-center"
                        onClick={() => setShowAddForm(true)}
                    >
                        <span>+</span> New Reminder
                    </Button>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                        🔔
                    </button>
                </div>
            </div>

            {/* Reminders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reminders.map(reminder => (
                    <div key={reminder.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        {/* Selection Border logic from image */}
                        <div className={`absolute inset-0 border-2 rounded-2xl pointer-events-none transition-colors ${reminder.enabled ? 'border-transparent group-hover:border-rose-100' : 'border-gray-100'}`}></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 text-xl">
                                    ⏰
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{reminder.title}</h3>
                                    <p className="text-sm text-gray-500">{reminder.subtitle}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="font-medium text-gray-700 text-sm">{reminder.time}</span>
                                <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-400 rounded-lg">{reminder.priority}</span>
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <button
                                onClick={() => handleToggleEnable(reminder.id)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${reminder.enabled ? 'bg-rose-400 text-white shadow-md shadow-rose-200' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {reminder.enabled ? 'Enabled' : 'Enable'}
                            </button>
                            <button
                                onClick={() => handleSnooze(reminder.id)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${reminder.isSnoozed ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                {reminder.isSnoozed ? 'Snoozed' : 'Snooze'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Reminder Sidebar (Floating Right) */}
            {showAddForm && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setShowAddForm(false)}
                    />

                    {/* Sidebar Form */}
                    <div className="fixed top-4 right-4 bottom-4 w-full max-w-sm bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300 border border-gray-100 flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-gray-800">Add Reminder</h2>
                            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
                        </div>

                        <div className="p-6 space-y-5 flex-1">
                            {/* Title */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Reminder title</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-sm bg-gray-50/50"
                                    placeholder="Patient X"
                                    value={newReminder.title}
                                    onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                                />
                            </div>

                            {/* Date */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-sm bg-gray-50/50"
                                    placeholder="DD/MM/YYYY"
                                />
                            </div>

                            {/* Time */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Time</label>
                                <div className="flex gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-sm bg-gray-50/50 text-center"
                                            value={newReminder.timeStart}
                                            onChange={e => setNewReminder({ ...newReminder, timeStart: e.target.value })}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">AM</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-sm bg-gray-50/50 text-center"
                                            value={newReminder.timeEnd}
                                            onChange={e => setNewReminder({ ...newReminder, timeEnd: e.target.value })}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">AM</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Add Description</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-sm bg-gray-50/50 min-h-[100px] resize-none"
                                    value={newReminder.description}
                                    onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
                                ></textarea>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Push Notification</span>
                                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${newReminder.pushInfo ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setNewReminder({ ...newReminder, pushInfo: !newReminder.pushInfo })}>
                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${newReminder.pushInfo ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Email Notification</span>
                                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${newReminder.emailInfo ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setNewReminder({ ...newReminder, emailInfo: !newReminder.emailInfo })}>
                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${newReminder.emailInfo ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">SMS Notification</span>
                                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${newReminder.smsInfo ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setNewReminder({ ...newReminder, smsInfo: !newReminder.smsInfo })}>
                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${newReminder.smsInfo ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Priority</label>
                                <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                    {['Low', 'Medium', 'High'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setNewReminder({ ...newReminder, priority: p })}
                                            className={`flex-1 py-2 text-sm rounded-lg transition-all ${newReminder.priority === p ? 'bg-white shadow-sm text-gray-800 font-medium' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Repeat */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Repeat</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 text-sm bg-white"
                                    value={newReminder.repeat}
                                    onChange={e => setNewReminder({ ...newReminder, repeat: e.target.value })}
                                >
                                    <option>None</option>
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10 flex gap-4">
                            <Button
                                className="flex-1 bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-xl shadow-lg shadow-rose-200 transition-all font-semibold"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <button
                                className="flex-1 border border-gray-200 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                onClick={() => setShowAddForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReminderPage;
