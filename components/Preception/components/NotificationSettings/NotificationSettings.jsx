import React, { useState } from 'react';
import Button from '../../UI/Button';

const NotificationSettings = () => {
    const [notifications, setNotifications] = useState({
        push: true,
        email: true,
        sms: false,
        appointment: true,
        promotional: false
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-8 flex flex-col min-h-[500px]">
            <h1 className="text-[22px] font-bold text-[#202020] mb-8">Notification Settings</h1>
            <div className="space-y-0 max-w-3xl flex-1">
                {[
                    { id: 'push', label: 'Push Notification', desc: 'Receive instant notifications on your device.' },
                    { id: 'email', label: 'Email Notification', desc: 'Receive daily or weekly email summaries.' },
                    { id: 'sms', label: 'SMS Notification', desc: 'Receive text messages for important alerts.' },
                    { id: 'appointment', label: 'Appointment Reminders', desc: 'Get notified before your scheduled appointments.' },
                    { id: 'promotional', label: 'Promotional Messages', desc: 'Receive news about offers and updates.' },
                ].map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-b border-gray-100">
                        <div className="pr-4">
                            <h3 className="text-[15px] font-bold text-[#444444]">{item.label}</h3>
                            <p className="text-[13px] text-[#999999] mt-1">{item.desc}</p>
                        </div>
                        <button
                            onClick={() => toggleNotification(item.id)}
                            className={`w-11 h-6 shrink-0 rounded-full relative transition-colors ${notifications[item.id] ? 'bg-[#ff6b6b]' : 'bg-gray-300'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-[2px] transition-transform shadow-sm ${notifications[item.id] ? 'left-[22px]' : 'left-[2px]'}`}></div>
                        </button>
                    </div>
                ))}
            </div>
            <div className="pt-10 mt-auto">
                <Button className="w-[100px] bg-[#ff6b6b] hover:bg-[#fa5555] text-white font-medium py-[10px] rounded shadow-sm shadow-rose-200 transition-all border-none text-[14px]">
                    Save
                </Button>
            </div>
        </div>
    );
};

export default NotificationSettings;
