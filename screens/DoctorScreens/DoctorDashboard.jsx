import React, { useRef, useState } from "react";
import {
  View,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  Linking,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import NewestSidebar from "../../components/DoctorsPortalComponents/NewestSidebar";
import HeaderLoginSignUp from "../../components/PatientScreenComponents/HeaderLoginSignUp";
import { useDoctorDashboard } from "../../hooks/useDoctorDashboard";

// ------------------- SUB-COMPONENTS ------------------- //

const StatCard = ({ icon, label, value, trend, trendIcon }) => (
  <View className="flex-1 min-w-[150px] bg-white p-4 rounded-xl shadow-sm border border-gray-100 m-1">
    <View className="flex-row justify-between mb-2">
      <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
        <Image source={icon} className="w-6 h-6" resizeMode="contain" />
      </View>
      <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-full">
        <Text className="text-green-600 text-xs font-bold mr-1">{trend || "0%"}</Text>
        <Image source={trendIcon} className="w-3 h-3" resizeMode="contain" />
      </View>
    </View>
    <Text className="text-gray-500 text-xs mb-1 font-medium">{label}</Text>
    <Text className="text-xl font-bold text-gray-800">{value}</Text>
  </View>
);

const DatePickerField = ({ value, onChange, label }) => {
  const [show, setShow] = useState(false);

  if (Platform.OS === "web") {
    return (
      <View className="flex-col mr-4">
        {label && <Text className="text-gray-500 text-xs mb-1">{label}</Text>}
        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-2 py-1">
          <input
            type="date"
            value={value ? value.toISOString().split("T")[0] : ""}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
            style={{ border: 'none', outline: 'none', color: '#374151', fontSize: '14px', background: 'transparent' }}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="mr-4">
      {label && <Text className="text-gray-500 text-xs mb-1">{label}</Text>}
      <TouchableOpacity
        onPress={() => setShow(true)}
        className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2"
      >
        <Text className="text-gray-800 font-medium text-sm">
          {value ? value.toLocaleDateString() : "Select Date"}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );
};

const DoctorDashboard = ({ navigation }) => {
  const {
    user,
    bookingStats,
    bookings,
    filteredDocuments,
    selectedDate,
    setSelectedDate,
    selectedHistoryDate,
    setSelectedHistoryDate,
    searchQuery,
    setSearchQuery,
    handleWebUpload,
  } = useDoctorDashboard(navigation);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const uploadInputRef = useRef(null);

  // Dummy Appointments Data
  const getDummyBookingsForDate = (date) => {
    if (!date) return [];

    // Create consistent "random" data based on the date so it feels deterministic
    const day = date.getDate();

    // If it's the 14th or 20th (unavailable days), return empty
    if (day === 14 || day === 20) return [];

    // For other days, generate 15-25 appointments to ensure pagination actually has multiple pages
    const numAppointments = (day % 10) + 15;

    const patients = ['Arjun Panday', 'Aryan Param', 'Kunal Meshram', 'Aditi Pilai', 'Devdat', 'Rahul Kumar', 'Sneha Sharma', 'Amit Singh', 'Priya Patel', 'Vikram Verma'];
    const types = ['Video Consultation', 'Audio Consultation', 'Offline Consultation', 'Chat Consultation'];
    const statuses = ['Pending', 'Completed', 'Urgent', 'In Progress'];

    return Array.from({ length: numAppointments }).map((_, i) => ({
      serial: day * 10 + i + 1,
      start_time: `${10 + i}:00 AM`,
      patientName: patients[(day + i) % patients.length],
      consultationType: types[(day + i) % types.length],
      status: statuses[(day + i) % statuses.length],
      meet_link: day % 2 === 0 ? "https://meet.google.com" : null,
    }));
  };

  const currentDayBookings = getDummyBookingsForDate(selectedDate || new Date());

  // Pagination for Upcoming Appointments
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  React.useEffect(() => {
    setCurrentPage(1); // Reset page on date change
  }, [selectedDate]);

  const totalItems = currentDayBookings.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedBookings = currentDayBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Dummy Data for Today's Appointments Timeline (6 AM to 10 PM)
  const getTodaysAppointmentsByHour = () => {
    const hours = [];
    // 6 AM to 10 PM (22:00)
    for (let i = 6; i <= 22; i++) {
      const timeLabel = `${i > 12 ? i - 12 : i}:00${i >= 12 ? 'PM' : 'AM'}`;
      // Randomly inject some appointments for realism, favoring morning/afternoon
      const hasAppt = (i % 3 === 0 && i < 18) || (i === 10) || (i === 11);

      let appointment = null;
      if (hasAppt) {
        const names = ['Anamika singh', 'Aditya singh', 'Aditya Dhar', 'Devdat singh', 'Priya Patel'];
        appointment = {
          patientName: names[i % names.length],
          type: 'Regular checkup',
          hasVideo: true,
          // Random dummy avatar via explicit dicebear
          avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${names[i % names.length]}`
        };
      }

      hours.push({
        time: timeLabel,
        rawHour: i,
        appointment
      });
    }
    return hours;
  };

  const todaysTimelineData = getTodaysAppointmentsByHour();

  // Helper for responsive calendar logic (simplified)
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };

  const displayDate = selectedDate || new Date();
  const fullDayList = getDaysInMonth(displayDate);

  // Pagination logic for the horizontal date strip
  const [dateStripIndex, setDateStripIndex] = useState(0);
  const DATES_PER_VIEW = 11;
  const dayList = fullDayList.slice(dateStripIndex, dateStripIndex + DATES_PER_VIEW);

  const handlePreviousSlice = () => {
    setDateStripIndex(prev => Math.max(0, prev - DATES_PER_VIEW));
  };

  const handleNextSlice = () => {
    setDateStripIndex(prev => Math.min(fullDayList.length - 1, prev + DATES_PER_VIEW));
  };

  // Dummy Data for Patient History Table
  const getDummyPatientHistory = () => {
    return [
      { id: '#1', date: '25-june-25', time: '10:00 AM', name: 'Arjun Panday', condition: 'Heart Attack', status: 'Completed', conditionColor: 'bg-orange-100 text-orange-400 border border-orange-200', statusColor: 'bg-green-100 text-green-500 border border-green-200' },
      { id: '#2', date: '26-june-25', time: '11:00 AM', name: 'Aryan Param', condition: 'Regular Checkup', status: 'Follow Up', conditionColor: 'bg-green-100 text-green-500 border border-green-200', statusColor: 'bg-orange-100 text-orange-400 border border-orange-200' },
      { id: '#3', date: '27-june-25', time: '12:00 PM', name: 'Kunal Meshram', condition: 'Regular Checkup', status: 'Follow Up', conditionColor: 'bg-green-100 text-green-500 border border-green-200', statusColor: 'bg-orange-100 text-orange-400 border border-orange-200' },
      { id: '#4', date: '28-june-25', time: '10:00 AM', name: 'Aditi Pilai', condition: 'Regular Checkup', status: 'Follow Up', conditionColor: 'bg-green-100 text-green-500 border border-green-200', statusColor: 'bg-orange-100 text-orange-400 border border-orange-200' },
      { id: '#5', date: '29-june-25', time: '10:00 AM', name: 'Devdat', condition: 'Regular Checkup', status: 'Follow Up', conditionColor: 'bg-green-100 text-green-500 border border-green-200', statusColor: 'bg-orange-100 text-orange-400 border border-orange-200' },
      { id: '#6', date: '29-june-25', time: '10:00 AM', name: 'Devdat', condition: 'Regular Checkup', status: 'Follow Up', conditionColor: 'bg-green-100 text-green-500 border border-green-200', statusColor: 'bg-orange-100 text-orange-400 border border-orange-200' },
    ];
  };

  const patientHistoryData = getDummyPatientHistory();

  // Pagination for Patient History
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const ITEMS_PER_HISTORY_PAGE = 7;
  const totalHistoryItems = patientHistoryData.length;
  const totalHistoryPages = Math.ceil(totalHistoryItems / ITEMS_PER_HISTORY_PAGE);
  const paginatedHistory = patientHistoryData.slice((historyCurrentPage - 1) * ITEMS_PER_HISTORY_PAGE, historyCurrentPage * ITEMS_PER_HISTORY_PAGE);

  const renderTable = (items) => (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="w-full">
      <View className="min-w-[800px] w-full mt-4">
        {/* Header */}
        <View className="flex-row bg-gray-50 py-4 border-b border-gray-200 px-4">
          <Text className="w-16 text-sm font-bold text-gray-800">Id</Text>
          <Text className="w-28 text-sm font-bold text-gray-800">Time</Text>
          <Text className="flex-[2] text-sm font-bold text-gray-800">Patient Name</Text>
          <Text className="flex-[1.5] text-sm font-bold text-gray-800">Consultation type</Text>
          <Text className="flex-[1.5] text-sm font-bold text-gray-800">Status</Text>
          <Text className="w-24 text-sm font-bold text-gray-800 text-center md:text-left">Action</Text>
        </View>

        {/* Rows */}
        {items.length === 0 ? (
          <View className="p-8 items-center justify-center">
            <Text className="text-gray-400">No appointments found</Text>
          </View>
        ) : (
          items.map((item, idx) => {
            const getStatusBadge = (status) => {
              const s = (status || 'Pending').toLowerCase();
              if (s === 'completed') return 'bg-green-100 text-green-500 border border-green-200';
              if (s === 'urgent') return 'bg-red-100 text-red-500 border border-red-200';
              return 'bg-orange-100 text-orange-400 border border-orange-200';
            };

            const isOffline = item.consultationType && item.consultationType.toLowerCase().includes('offline');

            return (
              <View key={idx} className="flex-row items-center py-4 border-b border-gray-100 px-4 hover:bg-gray-50">
                <Text className="w-16 text-yellow-400 font-semibold">#{item.serial || (idx + 1)}</Text>
                <Text className="w-28 text-gray-600 font-medium">{item.start_time || '10:00 AM'}</Text>
                <Text className="flex-[2] text-gray-800 font-bold">{item.patientName}</Text>

                {/* Type */}
                <View className="flex-[1.5] items-start">
                  <Text className={`font-semibold ${isOffline ? 'text-green-500' : 'text-blue-400'}`}>
                    {item.consultationType || 'Video Consultation'}
                  </Text>
                </View>

                {/* Status */}
                <View className="flex-[1.5] items-start">
                  <View className={`px-3 py-1 rounded-md flex-row items-center justify-center ${getStatusBadge(item.status)}`}>
                    <Text className={`text-xs font-semibold ${getStatusBadge(item.status).split(' ')[1]}`}>
                      {item.status || 'Pending'}
                    </Text>
                  </View>
                </View>

                {/* Action */}
                <View className="w-24 flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => item.meet_link && Linking.openURL(item.meet_link)}
                    className={`w-8 h-8 rounded-md items-center justify-center ${isOffline ? 'bg-pink-100' : 'bg-red-100'}`}
                  >
                    <Ionicons name={isOffline ? "cloud-offline" : "videocam"} size={16} color={isOffline ? "#000" : "#ef4444"} />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-8 h-8 bg-gray-50 rounded-md items-center justify-center border border-gray-100">
                    <Ionicons name="ellipsis-horizontal" size={16} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );

  const renderHistoryTable = (items) => (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="w-full">
      <View className="min-w-[900px] w-full mt-6">
        {/* Header */}
        <View className="flex-row bg-gray-50 py-4 border-b border-gray-200 px-6">
          <Text className="w-16 text-sm font-bold text-gray-800">Id</Text>
          <Text className="w-32 text-sm font-bold text-gray-800">Date</Text>
          <Text className="w-28 text-sm font-bold text-gray-800">Time</Text>
          <Text className="flex-[2] text-sm font-bold text-gray-800">Patient Name</Text>
          <Text className="flex-[1.5] text-sm font-bold text-gray-800">Condition</Text>
          <Text className="flex-[1.5] text-sm font-bold text-gray-800">Status</Text>
          <Text className="w-24 text-sm font-bold text-gray-800 text-center">Action</Text>
        </View>

        {/* Rows */}
        {items.length === 0 ? (
          <View className="p-8 items-center justify-center">
            <Text className="text-gray-400">No history found</Text>
          </View>
        ) : (
          items.map((item, idx) => (
            <View key={idx} className="flex-row items-center py-4 border-b border-gray-100 px-6 hover:bg-gray-50">
              <Text className="w-16 text-yellow-400 font-bold">{item.id}</Text>
              <Text className="w-32 text-gray-600 font-medium">{item.date}</Text>
              <Text className="w-28 text-gray-600 font-medium">{item.time}</Text>
              <Text className="flex-[2] text-gray-800 font-bold">{item.name}</Text>

              {/* Condition */}
              <View className="flex-[1.5] items-start">
                <View className={`px-4 py-1.5 rounded-md ${item.conditionColor}`}>
                  <Text className={`text-xs font-semibold ${item.conditionColor.split(' ')[1]}`}>
                    {item.condition}
                  </Text>
                </View>
              </View>

              {/* Status */}
              <View className="flex-[1.5] items-start">
                <View className={`px-4 py-1.5 rounded-md ${item.statusColor}`}>
                  <Text className={`text-xs font-semibold ${item.statusColor.split(' ')[1]}`}>
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* Action */}
              <View className="w-24 items-center justify-center border-l border-transparent">
                <TouchableOpacity className="w-8 h-8 bg-gray-50 rounded-md items-center justify-center border border-gray-100">
                  <Ionicons name="ellipsis-horizontal" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Web Upload Input */}
      {Platform.OS === "web" && (
        <input
          type="file"
          ref={uploadInputRef}
          onChange={handleWebUpload}
          multiple
          style={{ display: "none" }}
        />
      )}

      <View className="flex-1 flex-row h-full">
        {/* ------------ SIDEBAR (Desktop) ------------ */}
        <View className="hidden md:flex w-[250px] bg-white border-r border-gray-200 h-full">
          <NewestSidebar navigation={navigation} />
        </View>

        {/* ------------ MAIN CONTENT ------------ */}
        <View className="flex-1 flex-col h-full">
          {/* Header */}
          <View className="bg-white border-b border-gray-200 px-4 py-2 flex-row items-center justify-between z-20">
            <View className="flex-row items-center gap-2 md:hidden">
              <TouchableOpacity onPress={() => setSidebarOpen(true)}>
                <Ionicons name="menu" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <HeaderLoginSignUp navigation={navigation} />
            </View>
          </View>

          <ScrollView
            className="flex-1 w-full"
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Welcome */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900">
                Welcome, <Text className="text-green-600">{user?.name || "Doctor"}</Text>
              </Text>
              <Text className="text-gray-500 text-sm mt-1">Here is your daily overview</Text>
            </View>

            {/* Stats Grid */}
            <View className="flex-row flex-wrap gap-4 mb-8">
              <View className="flex-1 min-w-[300px] flex-row gap-2">
                <StatCard
                  icon={require("../../assets/DoctorsPortal/Icons/todayappointment.png")}
                  label="Today's Appointments"
                  value={bookingStats.todayCount}
                  trend="15%"
                  trendIcon={require("../../assets/DoctorsPortal/Icons/upArrow.png")}
                />
                <StatCard
                  icon={require("../../assets/DoctorsPortal/Icons/todayappointment.png")}
                  label="Total Subscribers"
                  value={bookingStats.subscriberCount}
                  trend="8%"
                  trendIcon={require("../../assets/DoctorsPortal/Icons/upArrow.png")}
                />
              </View>
              <View className="flex-1 min-w-[300px] flex-row gap-2">
                <StatCard
                  icon={require("../../assets/DoctorsPortal/Icons/pending consultation.png")}
                  label="Pending Consultations"
                  value={bookingStats.pendingConsultations}
                  trend="2%"
                  trendIcon={require("../../assets/DoctorsPortal/Icons/downArrow.png")}
                />
                <StatCard
                  icon={require("../../assets/DoctorsPortal/Icons/todayappointment.png")}
                  label="Month Earnings"
                  value={`₹${bookingStats.monthEarnings.toLocaleString()}`}
                  trend="12%"
                  trendIcon={require("../../assets/DoctorsPortal/Icons/upArrow.png")}
                />
              </View>
            </View>

            {/* Main Section */}
            <View className="flex-col xl:flex-row gap-6">
              {/* LEFT COLUMN: Appointments */}
              <View className="w-full xl:flex-[2.5] flex-col overflow-hidden gap-6">

                {/* Upcoming Appointments Card */}
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 pb-4">

                  {/* Header row */}
                  <View className="flex-row items-center justify-between p-6 pb-4 flex-wrap gap-4 border-b border-gray-50">
                    <View className="flex-row items-center gap-3">
                      <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center">
                        <Ionicons name="calendar-outline" size={24} color="#ef4444" />
                      </View>
                      <View>
                        <Text className="text-2xl font-bold text-gray-800">Upcoming Appointments</Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center gap-2">
                        <View className="w-3 h-3 rounded-full bg-gray-200" />
                        <Text className="text-sm text-gray-600 font-medium">Available Slots</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <View className="w-3 h-3 rounded-full bg-red-400" />
                        <Text className="text-sm text-gray-600 font-medium">Selected</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <View className="w-3 h-3 rounded-full border-2 border-gray-200 bg-white" />
                        <Text className="text-sm text-gray-600 font-medium">Unavailable</Text>
                      </View>
                    </View>
                  </View>

                  {/* Date Selector */}
                  <View className="flex-row items-center border-b border-gray-100 px-6 py-6">
                    <TouchableOpacity
                      onPress={handlePreviousSlice}
                      disabled={dateStripIndex === 0}
                      className={`p-2 rounded-full border mr-4 shadow-sm ${dateStripIndex === 0 ? 'bg-gray-50 border-gray-100 opacity-50' : 'bg-white border-gray-200 hover:bg-gray-50 active:bg-gray-100'}`}
                    >
                      <Ionicons name="chevron-back" size={20} color={dateStripIndex === 0 ? "#d1d5db" : "#6b7280"} />
                    </TouchableOpacity>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="flex-1"
                      contentContainerStyle={{ gap: 12, paddingRight: 16 }}
                    >
                      {dayList.map((date, index) => {
                        const actualDayIndex = dateStripIndex + index;
                        const isSelected = selectedDate
                          ? (selectedDate.getDate() === date.getDate() && selectedDate.getMonth() === date.getMonth())
                          : actualDayIndex === 2; // Default 3rd day of the month as selected initially
                        const isUnavailable = actualDayIndex === 6 || actualDayIndex === 11 || actualDayIndex === 20;
                        const isAvailable = !isSelected && !isUnavailable;

                        let bgClass = "bg-gray-100";
                        let textClass = "text-gray-600";
                        let borderClass = "";

                        if (isSelected) {
                          bgClass = "bg-red-400";
                          textClass = "text-white";
                          borderClass = "border border-red-400 shadow-sm shadow-red-200";
                        } else if (isUnavailable) {
                          bgClass = "bg-white";
                          textClass = "text-gray-400";
                          borderClass = "border border-gray-200 opacity-60";
                        } else if (isAvailable) {
                          bgClass = "bg-white";
                          textClass = "text-gray-600";
                          borderClass = "border border-gray-200 shadow-sm hover:bg-gray-50";
                        }

                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedDate && setSelectedDate(date)}
                            className={`w-12 h-12 rounded-full items-center justify-center ${bgClass} ${borderClass}`}
                          >
                            <Text className={`text-sm font-semibold ${textClass}`}>
                              {date.getDate()}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                    <TouchableOpacity
                      onPress={handleNextSlice}
                      disabled={dateStripIndex + DATES_PER_VIEW >= fullDayList.length}
                      className={`p-2 rounded-full border ml-2 shadow-sm ${dateStripIndex + DATES_PER_VIEW >= fullDayList.length ? 'bg-gray-50 border-gray-100 opacity-50' : 'bg-white border-gray-200 hover:bg-gray-50 active:bg-gray-100'}`}
                    >
                      <Ionicons name="chevron-forward" size={20} color={dateStripIndex + DATES_PER_VIEW >= fullDayList.length ? "#d1d5db" : "#6b7280"} />
                    </TouchableOpacity>
                  </View>

                  {/* Table */}
                  {renderTable(paginatedBookings)}

                  {/* Pagination */}
                  <View className="flex-row items-center justify-between mt-4 border-t border-gray-50 pt-4 px-6 flex-wrap gap-4">
                    <Text className="text-sm font-medium text-gray-500">
                      Showing <Text className="font-bold text-gray-700">{totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</Text> to <Text className="font-bold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</Text> of <Text className="font-bold text-gray-700">{totalItems}</Text> Result
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`flex-row items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm ${currentPage === 1 ? 'bg-gray-50 opacity-50' : 'bg-white hover:bg-gray-50'}`}
                      >
                        <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? "#9ca3af" : "#6b7280"} />
                        <Text className={`text-sm font-semibold ml-2 ${currentPage === 1 ? "text-gray-400" : "text-gray-600"}`}>Prev</Text>
                      </TouchableOpacity>

                      <View className="flex-row items-center px-2">
                        <Text className="text-sm font-bold text-gray-700">{currentPage} / {Math.max(1, totalPages)}</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage >= totalPages || totalPages === 0}
                        className={`flex-row items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm ${currentPage >= totalPages || totalPages === 0 ? 'bg-gray-50 opacity-50' : 'bg-white hover:bg-gray-50'}`}
                      >
                        <Text className={`text-sm font-semibold mr-2 ${currentPage >= totalPages || totalPages === 0 ? "text-gray-400" : "text-gray-600"}`}>Next</Text>
                        <Ionicons name="chevron-forward" size={16} color={currentPage >= totalPages || totalPages === 0 ? "#9ca3af" : "#6b7280"} />
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>


                {/* Patient History Card */}
                <View className=" bg-white rounded-xl shadow-sm border border-gray-100 pb-4">

                  {/* Header */}
                  <View className="p-6 pb-4 border-b border-gray-50">
                    <View className="flex-row items-center gap-3 mb-6">
                      <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center">
                        <Ionicons name="calendar-outline" size={24} color="#ef4444" />
                      </View>
                      <Text className="text-2xl font-bold text-gray-800">Patient History</Text>
                    </View>

                    {/* Filter row */}
                    <View className="flex-row items-center flex-wrap gap-4 w-full">
                      {/* Filter Button */}
                      <TouchableOpacity className="flex-row items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <Ionicons name="options-outline" size={20} color="#374151" />
                        <Text className="ml-2 font-bold text-gray-800">Filter</Text>
                      </TouchableOpacity>

                      {/* Date Picker */}
                      <View className="flex-row items-center">
                        <Text className="font-bold text-gray-800 mr-2">Date :</Text>
                        <View className="bg-white border border-gray-200 rounded-lg px-3 py-2 w-40">
                          <Text className="text-gray-400">Select Date</Text>
                        </View>
                      </View>

                      {/* Status Dropdown */}
                      <View className="flex-row items-center">
                        <Text className="font-bold text-gray-800 mr-2">Status :</Text>
                        <View className="bg-white border border-gray-200 rounded-lg px-3 py-2 w-40">
                          <Text className="text-gray-400">All Patients</Text>
                        </View>
                      </View>

                      {/* Search Bar */}
                      <View className="flex-1 min-w-[200px] flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2 ml-auto">
                        <Ionicons name="search" size={20} color="#9ca3af" />
                        <TextInput
                          className="flex-1 ml-2 text-gray-800 bg-transparent"
                          placeholder="Search For Patient"
                          style={Platform.OS === 'web' ? { outline: "none" } : {}}
                        />
                      </View>
                    </View>
                  </View>


                  {/* Table */}
                  {renderHistoryTable(paginatedHistory)}

                  {/* History Pagination */}
                  <View className="flex-row items-center justify-between mt-4 border-t border-gray-50 pt-4 px-6 flex-wrap gap-4">
                    <Text className="text-sm font-medium text-gray-500">
                      Showing <Text className="font-bold text-gray-700">{totalHistoryItems === 0 ? 0 : (historyCurrentPage - 1) * ITEMS_PER_HISTORY_PAGE + 1}</Text> to <Text className="font-bold text-gray-700">{Math.min(historyCurrentPage * ITEMS_PER_HISTORY_PAGE, totalHistoryItems)}</Text> of <Text className="font-bold text-gray-700">{totalHistoryItems}</Text> Result
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => setHistoryCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={historyCurrentPage === 1}
                        className={`flex-row items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm ${historyCurrentPage === 1 ? 'bg-gray-50 opacity-50' : 'bg-white hover:bg-gray-50'}`}
                      >
                        <Ionicons name="chevron-back" size={16} color={historyCurrentPage === 1 ? "#9ca3af" : "#6b7280"} />
                        <Text className={`text-sm font-semibold ml-2 ${historyCurrentPage === 1 ? "text-gray-400" : "text-gray-600"}`}>Prev</Text>
                      </TouchableOpacity>

                      <View className="flex-row items-center px-2">
                        <Text className="text-sm font-bold text-gray-700">{historyCurrentPage} / {Math.max(1, totalHistoryPages)}</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => setHistoryCurrentPage(prev => Math.min(totalHistoryPages, prev + 1))}
                        disabled={historyCurrentPage >= totalHistoryPages || totalHistoryPages === 0}
                        className={`flex-row items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm ${historyCurrentPage >= totalHistoryPages || totalHistoryPages === 0 ? 'bg-gray-50 opacity-50' : 'bg-white hover:bg-gray-50'}`}
                      >
                        <Text className={`text-sm font-semibold mr-2 ${historyCurrentPage >= totalHistoryPages || totalHistoryPages === 0 ? "text-gray-400" : "text-gray-600"}`}>Next</Text>
                        <Ionicons name="chevron-forward" size={16} color={historyCurrentPage >= totalHistoryPages || totalHistoryPages === 0 ? "#9ca3af" : "#6b7280"} />
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>

              </View>

              {/* RIGHT COLUMN: Stacked Today's Appointments & Notifications */}
              <View className="w-full xl:w-[400px] flex-col gap-6">

                {/* Today's Appointments (Timeline) */}
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 pb-4 max-h-[804px] flex-col overflow-hidden">
                  {/* Header row */}
                  <View className="flex-row items-center p-6 pb-4 border-b border-gray-50">
                    <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-4">
                      <Ionicons name="calendar-outline" size={24} color="#ef4444" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800">Today&apos;s Appointments</Text>
                  </View>

                  {/* Scrollable Timeline */}
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="flex-1 px-4 mt-4"
                    contentContainerStyle={{ paddingBottom: 24 }}
                  >
                    {todaysTimelineData.map((slot, index) => (
                      <View key={index} className="flex-row mb-6 relative">
                        {/* Left: Time Label */}
                        <View className="w-[80px] pt-4 z-10 bg-white">
                          <Text className="text-sm font-bold text-gray-800">{slot.time}</Text>
                        </View>

                        {/* Connecting Background Line */}
                        <View className="absolute top-7 left-[80px] right-0 h-[1px] bg-gray-100 -z-10" />

                        {/* Right: Appointment Card or Empty Space */}
                        <View className="flex-1 min-h-[80px]">
                          {slot.appointment ? (
                            <View className="bg-green-50 rounded-xl rounded-tl-none border border-green-100 p-4 ml-2 shadow-sm relative overflow-hidden">
                              {/* Left Green Border Accent */}
                              <View className="absolute left-0 top-0 bottom-0 w-1 bg-green-400" />

                              <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-row items-center gap-2">
                                  <View className="w-6 h-6 rounded-full bg-green-400 items-center justify-center">
                                    <Ionicons name="stethoscope-outline" size={12} color="white" />
                                  </View>
                                  <Text className="font-bold text-gray-800 text-base">{slot.appointment.patientName}</Text>
                                </View>
                                <TouchableOpacity>
                                  <Ionicons name="ellipsis-horizontal" size={20} color="#4b5563" />
                                </TouchableOpacity>
                              </View>

                              <View className="flex-row justify-between items-end">
                                <View>
                                  <Text className="text-xs text-gray-400 mb-1">Appointment Type</Text>
                                  <Text className="font-semibold text-gray-800 text-sm">{slot.appointment.type}</Text>
                                </View>
                                {slot.appointment.hasVideo && (
                                  <View className="w-8 h-8 rounded-lg bg-green-500 items-center justify-center shadow-md shadow-green-200">
                                    <Ionicons name="videocam" size={16} color="white" />
                                  </View>
                                )}
                              </View>
                            </View>
                          ) : (
                            // Empty state visualizing the timeslot but with no card
                            <View className="h-[80px]" />
                          )}
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                {/* Notifications */}
                <View className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex-1 ">
                  <View className="flex-row items-center gap-3 mb-8">
                    <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center">
                      <Ionicons name="calendar-outline" size={24} color="#ef4444" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800">Notifications</Text>
                    {/* Tiny hypothetical user avatar beside header as per reference */}
                    {/* <View className="w-8 h-8 rounded-full ml-1 overflow-hidden border border-gray-200">
                      <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Aditya' }} className="w-full h-full" />
                    </View> */}
                  </View>

                  {/* Dummy Notifications matching reference Image */}
                  {[
                    { title: "New Patient Subscribed Preeti Sabrawal" },
                    { title: "New Patient Subscribed Preeti Sabrawal" },
                    { title: "New Patient Subscribed Preeti Sabrawal" },
                    { title: "Lab Report Uploaded - Aditya Dhar" },
                    { title: "New Patient Subscribed Preeti Sabrawal" },
                    { title: "New Patient Subscribed Preeti Sabrawal" },
                    { title: "New Patient Subscribed Preeti Sabrawal" },
                  ].map((notif, i) => (
                    <View key={i} className="flex-row gap-5 mb-6 items-center bg-white px-2">
                      {/* Left: Green Clock Icon */}
                      <View className="w-14 h-14 bg-green-200/60 rounded-full items-center justify-center">
                        <Ionicons name="time-outline" size={28} color="white" />
                      </View>

                      {/* Right: Text Content */}
                      <View className="flex-1 justify-center">
                        <Text className="text-[15px] font-bold text-gray-700 mb-1 leading-5">
                          {notif.title}
                        </Text>
                        <View className="flex-row items-center gap-1.5">
                          <Ionicons name="time-outline" size={14} color="#fb923c" />
                          <Text className="text-[13px] font-medium text-gray-400">Mon ,May 01 , 10:00 AM</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Mobile Sidebar Modal */}
      <Modal
        visible={isSidebarOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View className="flex-1 bg-black/50 flex-row">
          <View className="w-[80%] h-full bg-white shadow-xl">
            <NewestSidebar navigation={navigation} closeSidebar={() => setSidebarOpen(false)} />
          </View>
          <TouchableOpacity className="flex-1" onPress={() => setSidebarOpen(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DoctorDashboard;
