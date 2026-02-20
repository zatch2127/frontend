import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useDashboard } from '../context/Dashboardcontext';
import { SUBSCRIBERS } from '../../../constants/subscribers';

const AppointmentsPage = () => {
    const navigation = useNavigation();
    const { setActiveNav, setSelectedSubscriber } = useDashboard();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const subscribers = SUBSCRIBERS;

    const filteredSubscribers = subscribers.filter((s) => {
        const statusMatch =
            selectedStatus === 'all' ||
            s.status.toLowerCase() === selectedStatus.toLowerCase();

        const searchMatch =
            !searchQuery ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && searchMatch;
    });

    const handleViewDetails = (subscriber) => {
        setSelectedSubscriber(subscriber);
        setActiveNav('PatientDetails');

        if (navigation?.navigate) {
            // Fix: Pass only serializable data (ID), not the full object to avoid URL issues
            navigation.navigate('PatientDetails', {
                id: subscriber.id,
                initialNav: 'PatientDetails',
            });
        }
    };

    return (
        <div className="w-full flex justify-center h-[calc(100vh-140px)] min-h-[600px]">
            <Card
                className="
                    w-full 
                    max-w-[1600px] 
                    h-full
                    bg-white/80 
                    backdrop-blur-xl
                    border border-white/50
                    shadow-2xl shadow-rose-100/50
                    rounded-3xl 
                    flex 
                    flex-col
                    overflow-hidden
                "
                padding="p-0"
            >

                {/* ===== Sticky Header / Filters ===== */}
                <div className="px-6 py-5 md:px-8 md:py-6 border-b border-gray-100 bg-white/50 z-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-6">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Subscribers</span>
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm"
                        />

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Search patient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm sm:col-span-2 lg:col-span-2"
                        />
                    </div>
                </div>

                {/* ===== Scrollable List ===== */}
                <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 custom-scrollbar space-y-4 bg-gradient-to-b from-white/30 to-rose-50/10">
                    {filteredSubscribers.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <span className="text-4xl mb-2">🔍</span>
                            <p>No subscribers found</p>
                        </div>
                    ) : (
                        filteredSubscribers.map((subscriber) => (
                            <SubscriberCard
                                key={subscriber.id}
                                subscriber={subscriber}
                                onViewDetails={handleViewDetails}
                            />
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
};

/* ================= Subscriber Card ================= */

const SubscriberCard = ({ subscriber, onViewDetails }) => {
    const statusColor = {
        Cancelled: 'text-red-600',
        Scheduled: 'text-green-600',
        Completed: 'text-blue-600',
        Pending: 'text-yellow-600',
    };

    return (
        <div className="bg-white border rounded-xl p-4 md:p-6 hover:shadow-md transition max-w-full min-w-0">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-w-0">

                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold break-words">{subscriber.name}</h3>
                        <p className="text-sm text-gray-600">Age: {subscriber.age}</p>
                        <p className="text-sm text-gray-600">Gender: {subscriber.gender}</p>
                        <p className="text-sm text-gray-600 break-words">Condition: {subscriber.condition}</p>
                        <p className={`text-sm font-semibold ${statusColor[subscriber.status]}`}>
                            {subscriber.status}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600">
                            Date: {subscriber.appointmentDate}
                        </p>
                        <p className="text-sm text-gray-600">
                            Time: {subscriber.time}
                        </p>
                    </div>

                    <div className="flex flex-col md:items-end justify-between">
                        <p
                            className={`font-bold ${subscriber.healthScore >= 80
                                ? 'text-green-600'
                                : subscriber.healthScore >= 60
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}
                        >
                            Health Score: {subscriber.healthScore}
                        </p>

                        <Button
                            variant="primary"
                            onClick={() => onViewDetails(subscriber)}
                            className="mt-3 md:mt-0"
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsPage;
