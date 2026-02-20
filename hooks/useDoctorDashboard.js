import { useState, useEffect, useRef, useCallback } from "react";
import { Platform, Linking } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../env-vars";
import { useAuth } from "../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

// Helper Functions
const toDateKey = (d) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const fromDateKey = (key) => {
    if (!key) return null;
    return new Date(`${key}T00:00:00`);
};

const detectType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return "Report";
    if (["png", "jpg", "jpeg", "pdf"].includes(ext)) return "Scan";
    if (["txt", "doc", "docx"].includes(ext)) return "Prescription";
    if (["png", "jpg", "jpeg"].includes(ext)) return "Lab test";
    return "Other";
};

export const useDoctorDashboard = (navigation) => {
    const { user: authUser, role } = useAuth();
    const [user, setUser] = useState(authUser);

    // Dashboard Data State
    const [bookingStats, setBookingStats] = useState({
        todayCount: 0,
        subscriberCount: 0,
        pendingConsultations: 0,
        monthEarnings: 0,
    });

    const [bookings, setBookings] = useState([]);
    const [upcomingAppointment, setUpcomingAppointment] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);

    // UI State
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHistoryDate, setSelectedHistoryDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const hasFetchedRef = useRef(false);

    // Sync Auth User
    useEffect(() => {
        if (authUser) setUser(authUser);
    }, [authUser]);

    // Data Fetching Functions
    const fetchUserDetails = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/users/${userId}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data?.user || null;
        } catch (err) {
            console.error("❌ fetchUserDetails ERROR:", err);
            return null;
        }
    };

    const fetchStats = async (doctorId) => {
        try {
            const [earningsRes, subsRes] = await Promise.all([
                fetch(`${API_URL}/payouts/earnings/summary?doctor_id=${doctorId}`),
                fetch(`${API_URL}/booking/doctors/${doctorId}/subscribers`),
            ]);

            const earningsData = earningsRes.ok ? await earningsRes.json() : {};
            const subsData = subsRes.ok ? await subsRes.json() : [];

            setBookingStats(prev => ({
                ...prev,
                monthEarnings: earningsData?.available_amount ?? 0,
                subscriberCount: Array.isArray(subsData) ? subsData.length : 0,
            }));
        } catch (err) {
            console.error("❌ fetchStats ERROR:", err);
        }
    };

    const fetchTodayBookings = async (doctorId, date) => {
        try {
            const dateParam = toDateKey(date || new Date());
            const res = await fetch(`${API_URL}/booking/doctors/${doctorId}/bookings?date=${dateParam}`);
            if (!res.ok) return;

            const data = await res.json();
            if (!Array.isArray(data)) {
                setBookings([]);
                setBookingStats(prev => ({ ...prev, todayCount: 0 }));
                return;
            }

            const enrichedBookings = await Promise.all(
                data.map(async (booking, index) => {
                    const userDetails = await fetchUserDetails(booking.user_id);
                    return {
                        ...booking,
                        serial: index + 1,
                        patientName: userDetails?.name || "Unknown",
                        consultationType: booking.meet_link ? "Video Consultation" : "Offline Consultation",
                    };
                })
            );

            setBookings(enrichedBookings);
            // Update today's count if the selected date is today
            if (toDateKey(date) === toDateKey(new Date())) {
                setBookingStats(prev => ({ ...prev, todayCount: enrichedBookings.length }));
            }
        } catch (err) {
            console.error("❌ fetchTodayBookings ERROR:", err);
        }
    };

    const fetchUpcoming = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/booking/users/${userId}/bookings?type=upcoming`);
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setUpcomingAppointment(data[0]);
            } else {
                setUpcomingAppointment(null);
            }
        } catch (err) {
            console.error("❌ fetchUpcoming ERROR:", err);
        }
    };

    // Initial Data Load
    useEffect(() => {
        if (!user?.user_id || hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        fetchUpcoming(user.user_id);
    }, [user?.user_id]);

    useEffect(() => {
        if (user?.doctor_id) {
            fetchStats(user.doctor_id);
            fetchTodayBookings(user.doctor_id, selectedDate);
        }
    }, [user?.doctor_id, selectedDate]);

    // Document Handling (Mocked for WebLocalStorage as per original)
    useEffect(() => {
        if (Platform.OS === "web") {
            const savedDocs = localStorage.getItem("medilocker_docs");
            if (savedDocs) setDocuments(JSON.parse(savedDocs));
        }
    }, []);

    useEffect(() => {
        if (Platform.OS === "web") {
            localStorage.setItem("medilocker_docs", JSON.stringify(documents));
        }
    }, [documents]);

    // Filtering Logic
    useEffect(() => {
        let filtered = documents;

        if (searchQuery.trim()) {
            filtered = filtered.filter((doc) =>
                String(doc.name || "").toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedHistoryDate) {
            const selectedKey = toDateKey(selectedHistoryDate);
            filtered = filtered.filter((doc) => toDateKey(doc.date) === selectedKey);
        }

        if (selectedStatus !== "All Status") {
            filtered = filtered.filter((doc) => doc.type === selectedStatus);
        }

        setFilteredDocuments(filtered);
        setCurrentPage(1);
    }, [documents, searchQuery, selectedHistoryDate, selectedStatus]);

    // Helpers exposed to component
    const handleWebUpload = (e) => {
        const files = Array.from(e.target.files);
        const now = new Date();
        const newDocs = files.map((file) => ({
            id: Date.now() + Math.random(),
            date: toDateKey(now),
            time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            name: file.name,
            format: "." + file.name.split(".").pop(),
            type: detectType(file.name),
            uri: URL.createObjectURL(file), // Web only
        }));
        setDocuments((prev) => [...prev, ...newDocs]);
    };

    return {
        user,
        bookingStats,
        bookings,
        upcomingAppointment,
        filteredDocuments,
        // State Setters
        selectedDate,
        setSelectedDate,
        selectedHistoryDate,
        setSelectedHistoryDate,
        selectedStatus,
        setSelectedStatus,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        // Helpers
        handleWebUpload,
        toDateKey,
        fromDateKey,
    };
};
