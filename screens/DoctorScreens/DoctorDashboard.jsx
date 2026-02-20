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

  // Helper for responsive calendar logic (simplified)
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };

  const dayList = getDaysInMonth(new Date());

  const renderTable = (items) => (
    <View className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
      {/* Header */}
      <View className="flex-row bg-gray-50 py-3 border-b border-gray-200 px-4">
        <Text className="flex-[0.5] text-xs font-bold text-gray-500 uppercase">ID</Text>
        <Text className="flex-1 text-xs font-bold text-gray-500 uppercase">Time</Text>
        <Text className="flex-[2] text-xs font-bold text-gray-500 uppercase">Patient</Text>
        <Text className="flex-[2] text-xs font-bold text-gray-500 uppercase hidden md:flex">Type</Text>
        <Text className="flex-1 text-xs font-bold text-gray-500 uppercase text-center md:text-left">Details</Text>
      </View>

      {/* Rows */}
      {items.length === 0 ? (
        <View className="p-8 items-center justify-center">
          <Text className="text-gray-400">No appointments found</Text>
        </View>
      ) : (
        items.map((item, idx) => (
          <View key={idx} className="flex-row items-center py-4 border-b border-gray-100 px-4 hover:bg-gray-50">
            <Text className="flex-[0.5] text-gray-600 font-medium">#{item.serial}</Text>
            <Text className="flex-1 text-gray-800 font-semibold">{item.start_time}</Text>
            <Text className="flex-[2] text-gray-800 font-medium">{item.patientName}</Text>

            {/* Desktop Type */}
            <View className="flex-[2] hidden md:flex items-start">
              <View className="bg-blue-50 px-2 py-1 rounded-md">
                <Text className="text-blue-600 text-xs font-medium">{item.consultationType}</Text>
              </View>
            </View>

            {/* Action */}
            <View className="flex-1 items-center md:items-start">
              {item.meet_link ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.meet_link)}
                  className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
                >
                  <Ionicons name="videocam" size={16} color="#ef4444" />
                </TouchableOpacity>
              ) : (
                <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                  <Ionicons name="videocam-off" size={16} color="#9ca3af" />
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </View>
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
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold text-gray-800">Upcoming Appointments</Text>
                  {/* Legend */}
                  <View className="flex-row gap-3">
                    <View className="flex-row items-center gap-1">
                      <View className="w-2 h-2 rounded-full bg-red-400" />
                      <Text className="text-xs text-gray-500">Selected</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <View className="w-2 h-2 rounded-full bg-gray-300" />
                      <Text className="text-xs text-gray-500">Available</Text>
                    </View>
                  </View>
                </View>

                {/* Calendar Strip */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  <View className="flex-row gap-2 px-1 pb-2">
                    {dayList.map((date, i) => {
                      const isSelected = selectedDate && date.getDate() === selectedDate.getDate();
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => setSelectedDate(date)}
                          className={`w-14 h-16 rounded-xl justify-center items-center border shadow-sm ${isSelected
                              ? "bg-red-400 border-red-500"
                              : "bg-white border-gray-200"
                            }`}
                        >
                          <Text className={`text-xs ${isSelected ? "text-white" : "text-gray-400"}`}>
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </Text>
                          <Text className={`text-lg font-bold ${isSelected ? "text-white" : "text-gray-800"}`}>
                            {date.getDate()}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </ScrollView>

                {/* Appointments Table */}
                {renderTable(bookings)}
              </View>

              {/* RIGHT COLUMN: Patient History & Notifications (Stacked on Mobile/Tablet, Side on Large Screens) */}
              <View className="w-full xl:w-[400px] flex-col gap-6">
                {/* Patient History Filter */}
                <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-base font-bold text-gray-800">Patient History</Text>
                    <TouchableOpacity>
                      <Text className="text-blue-500 text-xs font-bold">Filter</Text>
                    </TouchableOpacity>
                  </View>

                  <DatePickerField
                    label="Date"
                    value={selectedHistoryDate}
                    onChange={setSelectedHistoryDate}
                  />

                  <View className="mt-4 bg-gray-50 rounded-lg flex-row items-center border border-gray-200 px-3 py-2">
                    <Ionicons name="search" size={20} color="#9ca3af" />
                    <TextInput
                      className="flex-1 ml-2 text-gray-800 bg-transparent outline-none border-none"
                      placeholder="Search patient..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      style={Platform.OS === 'web' ? { outline: "none" } : {}}
                    />
                  </View>

                  <View className="mt-4 max-h-[300px]">
                    {filteredDocuments.length > 0 ? (
                      <ScrollView nestedScrollEnabled>
                        {filteredDocuments.slice(0, 5).map((doc, i) => (
                          <View key={i} className="py-3 border-b border-gray-100 flex-row justify-between items-center">
                            <View>
                              <Text className="font-semibold text-gray-800">{doc.name}</Text>
                              <Text className="text-xs text-gray-500">{doc.time}</Text>
                            </View>
                            <Text className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                              {doc.type}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    ) : (
                      <Text className="text-center text-gray-400 py-4">No history records found</Text>
                    )}
                  </View>
                </View>

                {/* Notifications */}
                <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <Text className="text-base font-bold text-gray-800 mb-4">Notifications</Text>
                  {/* Dummy Notifications */}
                  {[1, 2, 3].map((_, i) => (
                    <View key={i} className="flex-row gap-3 mb-4">
                      <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                        <Ionicons name="notifications-outline" size={20} color="#3b82f6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-gray-800">New Patient Subscribed</Text>
                        <Text className="text-xs text-gray-500">Today, 10:00 AM</Text>
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
