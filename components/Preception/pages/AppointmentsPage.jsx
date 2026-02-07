import React, { useState } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const AppointmentsPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const subscribers = [
    {
      id: 1,
      name: 'Anamika Singh',
      age: 50,
      gender: 'Female',
      condition: 'Heart Disease',
      status: 'Cancelled',
      appointmentDate: '18th Oct 2025',
      time: '11:00 AM',
      healthScore: 75,
      image: null,
    },
    {
      id: 2,
      name: 'Rahul Verma',
      age: 45,
      gender: 'Male',
      condition: 'Diabetes',
      status: 'Scheduled',
      appointmentDate: '20th Oct 2025',
      time: '09:30 AM',
      healthScore: 82,
      image: null,
    },
    {
      id: 3,
      name: 'Neha Sharma',
      age: 38,
      gender: 'Female',
      condition: 'Hypertension',
      status: 'Completed',
      appointmentDate: '15th Oct 2025',
      time: '04:00 PM',
      healthScore: 68,
      image: null,
    },
      {
      id: 4,
      name: 'Neha Sharma',
      age: 38,
      gender: 'Female',
      condition: 'Hypertension',
      status: 'Completed',
      appointmentDate: '15th Oct 2025',
      time: '04:00 PM',
      healthScore: 68,
      image: null,
    },
  ];

  const filteredSubscribers = subscribers.filter((s) => {
    const statusMatch =
      selectedStatus === 'all' ||
      s.status.toLowerCase() === selectedStatus.toLowerCase();

    const searchMatch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const handleViewDetails = (id) => {
    console.log('View details for:', id);
  };

  return (
    <div className="h-screen w-full bg-gray-50 px-4 md:px-6 py-4">
      <Card className="h-full flex flex-col" padding="p-4 md:p-6">

        {/* ===== Sticky Header / Filters ===== */}
        <div className="sticky top-0 bg-white z-10 pb-4 border-b">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Your Subscribers
          </h1>

          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400"
            />

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400"
            >
              <option value="all">All</option>
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
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400"
            />
          </div>
        </div>

        {/* ===== Scrollable List ===== */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
          {filteredSubscribers.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No subscribers found
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
    <div className="bg-white border rounded-xl p-4 md:p-6 hover:shadow-md transition">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">

        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-bold">{subscriber.name}</h3>
            <p className="text-sm text-gray-600">Age: {subscriber.age}</p>
            <p className="text-sm text-gray-600">Gender: {subscriber.gender}</p>
            <p className="text-sm text-gray-600">Condition: {subscriber.condition}</p>
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
              className={`font-bold ${
                subscriber.healthScore >= 80
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
              onClick={() => onViewDetails(subscriber.id)}
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
