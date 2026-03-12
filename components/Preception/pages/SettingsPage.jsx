import React, { useState, useRef } from 'react';
import Button from '../UI/Button';
import LanguagePreferences from '../components/LanguagePreferences/LanguagePreferences';
import ThemeSettings from '../components/ThemeSettings/ThemeSettings';
import AccountSettings from '../components/AccountSettings/AccountSettings';
import NotificationSettings from '../components/NotificationSettings/NotificationSettings';
const SETTINGS_MENU = [
    { id: 'profile', label: 'Profile Setting', icon: '👤' },
    { id: 'language', label: 'Language preference', icon: 'A/文' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'account', label: 'Account', icon: '🔒' },
    { id: 'notification', label: 'Notification', icon: '🔔' },
];

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [activeSubTab, setActiveSubTab] = useState('Edit Personal Information');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Using state for input values but starting them empty to show placeholders
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        contact: '',
        age: '',
        gender: ''
    });

    // State for file uploads
    const [files, setFiles] = useState({
        medicalRegistration: null,
        degreeCertificate: null,
        governmentId: null
    });

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [field]: file }));
        }
    };

    // Establishment Timings State
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [selectedDays, setSelectedDays] = useState([]);
    const [activeSessionDay, setActiveSessionDay] = useState('Monday');
    const [sessions, setSessions] = useState({
        Sunday: [], Monday: ['11:00 AM - 02:00 PM'], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: []
    });
    const [sessionInput, setSessionInput] = useState({ from: '', to: '' });
    const [emergencyHours, setEmergencyHours] = useState({ sixToTen: true, twentyFourSeven: false });

    const toggleDay = (day) => {
        setActiveSessionDay(day);
        setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const handleAddSession = () => {
        if (sessionInput.from || sessionInput.to) {
            setSessions(prev => ({
                ...prev,
                [activeSessionDay]: [...prev[activeSessionDay], `${sessionInput.from}${sessionInput.to ? ' - ' + sessionInput.to : ''}`]
            }));
            setSessionInput({ from: '', to: '' });
        }
    };

    const handleRemoveSession = (day, idx) => {
        setSessions(prev => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== idx)
        }));
    };

    // Subscriber Fees State
    const [feesState, setFeesState] = useState({
        fees: '',
        regularCheckups: 1,
        emergencyCheckups: 1,
        enableEmergencyConsults: true,
        emergencyLimit: 3
    });

    const handleIncrement = (field) => {
        setFeesState(prev => ({ ...prev, [field]: prev[field] + 1 }));
    };

    const handleDecrement = (field) => {
        setFeesState(prev => ({ ...prev, [field]: Math.max(0, prev[field] - 1) }));
    };

    const getTimeOptions = (type) => {
        const options = [];
        let startHour = 0;
        let endHour = 23;

        if (emergencyHours.sixToTen) {
            if (type === 'from') {
                startHour = 6;
                endHour = 21; // up to 9 PM
            } else {
                startHour = 7;
                endHour = 22; // up to 10 PM
            }
        }

        for (let i = startHour; i <= endHour; i++) {
            const hour = i === 0 ? 12 : (i > 12 ? i - 12 : i);
            const ampm = i < 12 || i === 24 ? 'AM' : 'PM';
            options.push(`${hour}:00 ${ampm}`);

            // Add :30 times, but skip 10:30 PM if 10 PM is the max
            if (!(emergencyHours.sixToTen && type === 'to' && i === 22)) {
                options.push(`${hour}:30 ${ampm}`);
            }
        }

        return options;
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row overflow-hidden shadow-sm min-h-[calc(100vh-100px)] relative">

            {/* Left Secondary Sidebar (Settings Menu) */}
            <div className="hidden md:flex min-h-screen">
                {/* Sidebar */}
                <div className="w-full md:w-64 shrink-0 bg-[#Fdfdfd] py-6 flex flex-col relative z-10 
                  before:absolute before:inset-0 before:border-r before:border-[#69b4ff] 
                  before:opacity-50 before:pointer-events-none
                  h-screen sticky top-0 overflow-y-auto">
                    <h2 className="text-[28px] font-bold text-[#202020] mb-8 pl-6">Settings</h2>
                    <nav className="space-y-1 pr-2">
                        {SETTINGS_MENU.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-6 py-3 rounded-r-lg text-[15px] font-medium transition-colors ${activeTab === item.id
                                    ? 'bg-[#ff6b6b] text-white shadow-sm'
                                    : 'text-[#666666] hover:bg-rose-50'
                                    }`}
                            >
                                <span className="text-lg w-6 text-center">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>


            </div>

            {/* Mobile Settings Nav (Dropdown) - Keep padding for mobile */}
            <div className="md:hidden w-full p-4 border-b border-gray-100 bg-blue-50/30">
                <h2 className="text-[28px] font-bold text-[#202020] mb-4 block">Settings</h2>
                <select
                    className="w-full p-3 rounded-xl border-2 border-blue-400 bg-white focus:outline-none focus:border-rose-400 font-medium"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    {SETTINGS_MENU.map(item => (
                        <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                </select>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
                <div className="rounded-sm bg-white min-h-full flex flex-col">
                    {activeTab === 'language' && <LanguagePreferences />}
                    {activeTab === 'theme' && <ThemeSettings />}
                    {activeTab === 'account' && <AccountSettings />}
                    {activeTab === 'notification' && <NotificationSettings />}

                    {activeTab === 'profile' && (
                        <>
                            {/* Header */}
                            <div className="p-8 pb-4">
                                <h1 className="text-[22px] font-bold text-[#202020]">Profile Setting</h1>
                                <p className="text-[#999999] text-[13px] mt-1">Manage your account settings</p>
                            </div>

                            {/* Horizontal Tabs */}
                            <div className="px-8 border-b border-gray-100 flex gap-8 overflow-x-auto custom-scrollbar">
                                {['Edit Personal Information', 'Medical proof', 'Establishment timings', 'Subscriber fees'].map((tab, idx) => {
                                    const isActive = activeSubTab === tab;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveSubTab(tab)}
                                            className={`pb-3 text-[14px] font-medium whitespace-nowrap transition-colors relative ${isActive ? 'text-[#202020]' : 'text-[#666666] hover:text-gray-800'}`}
                                        >
                                            {tab}
                                            {isActive && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff6b6b]"></div>}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Form Content - Edit Personal Information */}
                            {activeSubTab === 'Edit Personal Information' && (
                                <div className="p-8 max-w-3xl">
                                    {/* Avatar Area */}
                                    <div className="mb-10 relative inline-block cursor-pointer" onClick={handleAvatarClick}>
                                        <div className="w-24 h-24 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-300 text-3xl">👤</span>
                                            )}
                                        </div>
                                        <button className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#ff6b6b] transition-colors shadow-sm border border-gray-100 pointer-events-none">
                                            <span className="text-[10px]">✏️</span>
                                        </button>
                                        {/* Hidden File Input */}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-0">
                                        {/* Name Row */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 text-[#444444] font-bold text-[14px] shrink-0">Name</label>
                                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                                <input
                                                    type="text"
                                                    className="flex-1 w-full p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    value={formData.name}
                                                    onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Doctor"
                                                />
                                                <input
                                                    type="text"
                                                    className="flex-1 w-full p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    value={formData.lastName}
                                                    onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                        </div>

                                        {/* Email Row */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 text-[#444444] font-bold text-[14px] shrink-0">Email</label>
                                            <div className="w-full">
                                                <input
                                                    type="email"
                                                    className="w-full md:w-[calc(100%-1rem)] p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="Example@gmail.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Contact Row */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 text-[#444444] font-bold text-[14px] shrink-0">Contact No</label>
                                            <div className="w-full">
                                                <input
                                                    type="text"
                                                    maxLength="15"
                                                    className="w-full sm:max-w-[280px] p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    value={formData.contact}
                                                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                    placeholder="9874563210"
                                                />
                                            </div>
                                        </div>

                                        {/* Age Row */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 text-[#444444] font-bold text-[14px] shrink-0">Age</label>
                                            <div className="w-full">
                                                <input
                                                    type="text"
                                                    maxLength="3"
                                                    className="w-full sm:max-w-[280px] p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    value={formData.age}
                                                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                    placeholder="x"
                                                />
                                            </div>
                                        </div>

                                        {/* Gender Row */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 text-[#444444] font-bold text-[14px] shrink-0">Gender</label>
                                            <div className="w-full">
                                                <select
                                                    className={`w-full sm:max-w-[280px] p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] cursor-pointer bg-white ${!formData.gender ? 'text-[#999999]' : 'text-[#202020]'}`}
                                                    value={formData.gender}
                                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                >
                                                    <option value="" disabled hidden>Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Backup Doctor */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 text-[#444444] font-bold text-[14px] shrink-0">Backup Doctor</label>
                                            <div className="w-full">
                                                <button className="bg-[#ff6b6b] hover:bg-[#fa5555] text-white text-[11px] font-bold py-[6px] px-5 rounded uppercase tracking-wide transition-colors">
                                                    ADD
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <div className="pt-8">
                                            <Button className="w-[100px] bg-[#ff6b6b] hover:bg-[#fa5555] text-white font-medium py-[10px] rounded shadow-sm shadow-rose-200 transition-all border-none text-[14px]">
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Content - Medical proof */}
                            {activeSubTab === 'Medical proof' && (
                                <div className="p-8 max-w-3xl">
                                    <div className="space-y-0">
                                        {/* Medical License No */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 md:w-56 text-[#444444] font-bold text-[14px] shrink-0">Medical License No</label>
                                            <div className="flex-1 w-full">
                                                <input
                                                    type="text"
                                                    className="w-full p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    placeholder="Enter Medical License No."
                                                />
                                            </div>
                                        </div>

                                        {/* Specialization */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 md:w-56 text-[#444444] font-bold text-[14px] shrink-0">Specialization</label>
                                            <div className="flex-1 w-full">
                                                <select
                                                    className={`w-full p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] cursor-pointer bg-white text-[#999999]`}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled hidden>Select Specialization</option>
                                                    <option value="Cardiologist">Cardiologist</option>
                                                    <option value="Dermatologist">Dermatologist</option>
                                                    <option value="Neurologist">Neurologist</option>
                                                    <option value="Pediatrician">Pediatrician</option>
                                                    <option value="Psychiatrist">Psychiatrist</option>
                                                    <option value="General Practitioner">General Practitioner</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Year of Experience */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 md:w-56 text-[#444444] font-bold text-[14px] shrink-0">Year of Experience</label>
                                            <div className="flex-1 w-full">
                                                <input
                                                    type="text"
                                                    className="w-full sm:max-w-[280px] p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                                    placeholder="e.g. 5"
                                                />
                                            </div>
                                        </div>

                                        {/* Affiliated Hospital */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 md:w-56 text-[#444444] font-bold text-[14px] shrink-0">Affiliated Hospital</label>
                                            <div className="flex-1 w-full">
                                                <input
                                                    type="text"
                                                    className="w-full p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    placeholder="Enter Hospital Name"
                                                />
                                            </div>
                                        </div>

                                        {/* Medical Registration Council Id */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 md:w-56 text-[#444444] font-bold text-[14px] leading-tight shrink-0">Medical Registration Council Id</label>
                                            <div className="flex flex-col lg:flex-row gap-4 flex-1 w-full">
                                                <input
                                                    type="text"
                                                    className="flex-1 w-full p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    placeholder="9878456874563210"
                                                />
                                                <div className="relative flex-1 w-full">
                                                    <div className="w-full border border-dashed border-gray-300 rounded-md p-2 flex items-center justify-between bg-white relative">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <svg className="w-8 h-8 text-[#ff6b6b] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                            <span className="text-[12px] text-gray-500 truncate pr-2">
                                                                {files.medicalRegistration ? files.medicalRegistration.name : "No file chosen"}
                                                            </span>
                                                        </div>
                                                        <div className="relative overflow-hidden inline-block shrink-0">
                                                            <button type="button" className="border border-[#ff6b6b] text-[#555555] bg-white px-4 py-1.5 text-[13px] rounded-sm hover:bg-rose-50 transition-colors pointer-events-none">
                                                                Browse File
                                                            </button>
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0]"
                                                                onChange={(e) => handleFileUpload(e, 'medicalRegistration')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Degree Certificate ID */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 md:w-56 text-[#444444] font-bold text-[14px] leading-tight shrink-0">Degree Certificate ID</label>
                                            <div className="flex flex-col lg:flex-row gap-4 flex-1 w-full">
                                                <input
                                                    type="text"
                                                    className="flex-1 w-full p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    placeholder="9878456874563210"
                                                />
                                                <div className="relative flex-1 w-full">
                                                    <div className="w-full border border-dashed border-gray-300 rounded-md p-2 flex items-center justify-between bg-white relative">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <svg className="w-8 h-8 text-[#ff6b6b] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                            <span className="text-[12px] text-gray-500 truncate pr-2">
                                                                {files.degreeCertificate ? files.degreeCertificate.name : "No file chosen"}
                                                            </span>
                                                        </div>
                                                        <div className="relative overflow-hidden inline-block shrink-0">
                                                            <button type="button" className="border border-[#ff6b6b] text-[#555555] bg-white px-4 py-1.5 text-[13px] rounded-sm hover:bg-rose-50 transition-colors pointer-events-none">
                                                                Browse File
                                                            </button>
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0]"
                                                                onChange={(e) => handleFileUpload(e, 'degreeCertificate')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Government Id Proof */}
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-5 border-b border-gray-100">
                                            <label className="w-40 md:w-56 text-[#444444] font-bold text-[14px] leading-tight shrink-0">Government Id Proof</label>
                                            <div className="flex flex-col lg:flex-row gap-4 flex-1 w-full">
                                                <input
                                                    type="text"
                                                    className="flex-1 w-full p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] text-[#202020] bg-[#fcfcfc] placeholder-[#999999]"
                                                    placeholder="9878456874563210"
                                                />
                                                <div className="relative flex-1 w-full">
                                                    <div className="w-full border border-dashed border-gray-300 rounded-md p-2 flex items-center justify-between bg-white relative">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <svg className="w-8 h-8 text-[#ff6b6b] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                            <span className="text-[12px] text-gray-500 truncate pr-2">
                                                                {files.governmentId ? files.governmentId.name : "No file chosen"}
                                                            </span>
                                                        </div>
                                                        <div className="relative overflow-hidden inline-block shrink-0">
                                                            <button type="button" className="border border-[#ff6b6b] text-[#555555] bg-white px-4 py-1.5 text-[13px] rounded-sm hover:bg-rose-50 transition-colors pointer-events-none">
                                                                Browse File
                                                            </button>
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0]"
                                                                onChange={(e) => handleFileUpload(e, 'governmentId')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <div className="pt-8">
                                            <Button className="w-[100px] bg-[#ff6b6b] hover:bg-[#fa5555] text-white font-medium py-[10px] rounded shadow-sm shadow-rose-200 transition-all border-none text-[14px]">
                                                Save Info
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Content - Establishment timings */}
                            {activeSubTab === 'Establishment timings' && (
                                <div className="p-8 max-w-4xl">
                                    {/* Days */}
                                    <div className="mb-10">
                                        <h3 className="text-[15px] font-bold text-[#202020] mb-4">Days</h3>
                                        <div className="flex flex-wrap gap-3 md:gap-4">
                                            {DAYS.map(day => (
                                                <button
                                                    key={day}
                                                    onClick={() => toggleDay(day)}
                                                    className={`px-5 py-2.5 rounded-md border text-[13px] font-medium transition-colors min-w-[100px] text-center ${selectedDays.includes(day)
                                                        ? 'border-[#69b4ff] text-[#69b4ff] bg-blue-50/10'
                                                        : 'border-gray-200 text-[#666666] hover:bg-gray-50'
                                                        } ${activeSessionDay === day ? 'ring-2 ring-offset-1 ring-[#69b4ff]' : ''}`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Session 1 */}
                                    <div className="mb-12">
                                        <h3 className="text-[15px] font-bold text-[#202020] mb-4">Sessions for {activeSessionDay}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mb-6">
                                            <select
                                                className={`w-full sm:w-[180px] p-[10px] rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[13px] bg-white cursor-pointer ${!sessionInput.from ? 'text-[#999999]' : 'text-[#202020]'}`}
                                                value={sessionInput.from}
                                                onChange={e => setSessionInput({ ...sessionInput, from: e.target.value })}
                                            >
                                                <option value="" disabled hidden>From</option>
                                                {getTimeOptions('from').map(time => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                            <select
                                                className={`w-full sm:w-[180px] p-[10px] rounded-sm border border-[#69b4ff] focus:outline-none focus:border-[#69b4ff] text-[13px] bg-white cursor-pointer ${!sessionInput.to ? 'text-[#999999]' : 'text-[#202020]'}`}
                                                value={sessionInput.to}
                                                onChange={e => setSessionInput({ ...sessionInput, to: e.target.value })}
                                            >
                                                <option value="" disabled hidden>To</option>
                                                {getTimeOptions('to').map(time => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleAddSession}
                                                className="bg-[#ff6b6b] hover:bg-[#fa5555] text-white text-[13px] font-medium py-[10px] px-8 rounded-sm transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {/* Added Sessions */}
                                        <div className="flex flex-wrap gap-3">
                                            {sessions[activeSessionDay]?.map((session, idx) => (
                                                <div key={idx} className="border border-[#69b4ff] text-[#69b4ff] bg-blue-50/10 px-4 py-2 rounded-sm text-[13px] font-medium flex items-center gap-2">
                                                    {session}
                                                    <button onClick={() => handleRemoveSession(activeSessionDay, idx)} className="ml-1 hover:text-red-500">×</button>
                                                </div>
                                            ))}
                                            {(!sessions[activeSessionDay] || sessions[activeSessionDay].length === 0) && (
                                                <p className="text-[13px] text-[#999999] italic mt-2">No sessions added for {activeSessionDay}.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Emergency Hours */}
                                    <div className="mt-8 pt-8 border-t border-transparent">
                                        <h3 className="text-[18px] font-bold text-[#444444] mb-6">Emergency Hours</h3>
                                        <div className="space-y-6 max-w-sm">
                                            <div className="flex items-center gap-12">
                                                <span className="text-[14px] font-bold text-[#444444] w-32">6 AM to 10 PM</span>
                                                <button
                                                    onClick={() => {
                                                        setEmergencyHours({ sixToTen: true, twentyFourSeven: false });
                                                        setSessionInput({ from: '', to: '' });
                                                    }}
                                                    className={`w-11 h-6 rounded-full relative transition-colors ${emergencyHours.sixToTen ? 'bg-[#ff6b6b]' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-[2px] transition-transform shadow-sm ${emergencyHours.sixToTen ? 'left-[22px]' : 'left-[2px]'}`}></div>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-12">
                                                <span className="text-[14px] font-bold text-[#444444] w-32">24/7</span>
                                                <button
                                                    onClick={() => {
                                                        setEmergencyHours({ sixToTen: false, twentyFourSeven: true });
                                                        setSessionInput({ from: '', to: '' });
                                                    }}
                                                    className={`w-11 h-6 rounded-full relative transition-colors ${emergencyHours.twentyFourSeven ? 'bg-[#ff6b6b]' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-[2px] transition-transform shadow-sm ${emergencyHours.twentyFourSeven ? 'left-[22px]' : 'left-[2px]'}`}></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-8 border-t border-transparent">
                                        <Button className="w-[100px] bg-[#ff6b6b] hover:bg-[#fa5555] text-white font-medium py-[10px] rounded shadow-sm shadow-rose-200 transition-all border-none text-[14px]">
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Form Content - Subscriber fees */}
                            {activeSubTab === 'Subscriber fees' && (
                                <div className="p-4 md:p-8 max-w-4xl">
                                    <div className="space-y-0">
                                        {/* Fees */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-gray-100">
                                            <label className="text-[#444444] font-bold text-[15px] shrink-0">Fees</label>
                                            <div className="w-full sm:max-w-[300px] sm:ml-auto flex-1">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444] font-medium">₹</span>
                                                    <input
                                                        type="text"
                                                        className="w-full p-[10px] pl-8 rounded-sm border border-gray-200 focus:outline-none focus:border-[#69b4ff] text-[14px] text-[#202020] bg-white placeholder-[#999999]"
                                                        value={feesState.fees}
                                                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                                        onChange={(e) => setFeesState({ ...feesState, fees: e.target.value })}
                                                        placeholder="1999"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* No of Regular Check-up */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-gray-100">
                                            <label className="text-[#444444] font-bold text-[15px] shrink-0">No of Regular Check-up</label>
                                            <div className="w-full sm:max-w-[300px] flex sm:justify-start sm:ml-auto items-center gap-2 flex-1">
                                                <button
                                                    onClick={() => handleDecrement('regularCheckups')}
                                                    className="w-6 h-6 flex items-center justify-center bg-[#ff6b6b] text-white rounded text-sm hover:bg-[#fa5555] transition-colors"
                                                >-</button>
                                                <input
                                                    type="text"
                                                    className="w-12 text-center p-1 border border-gray-200 rounded-sm text-[14px] outline-none"
                                                    value={feesState.regularCheckups}
                                                    readOnly
                                                />
                                                <button
                                                    onClick={() => handleIncrement('regularCheckups')}
                                                    className="w-6 h-6 flex items-center justify-center bg-[#ff6b6b] text-white rounded text-sm hover:bg-[#fa5555] transition-colors"
                                                >+</button>
                                            </div>
                                        </div>

                                        {/* No of Emergency Check-up */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-gray-100">
                                            <label className="text-[#444444] font-bold text-[15px] shrink-0">No of Emergency Check-up</label>
                                            <div className="w-full sm:max-w-[300px] flex sm:justify-start sm:ml-auto items-center gap-2 flex-1">
                                                <button
                                                    onClick={() => handleDecrement('emergencyCheckups')}
                                                    className="w-6 h-6 flex items-center justify-center bg-[#ff6b6b] text-white rounded text-sm hover:bg-[#fa5555] transition-colors"
                                                >-</button>
                                                <input
                                                    type="text"
                                                    className="w-12 text-center p-1 border border-gray-200 rounded-sm text-[14px] outline-none"
                                                    value={feesState.emergencyCheckups}
                                                    readOnly
                                                />
                                                <button
                                                    onClick={() => handleIncrement('emergencyCheckups')}
                                                    className="w-6 h-6 flex items-center justify-center bg-[#ff6b6b] text-white rounded text-sm hover:bg-[#fa5555] transition-colors"
                                                >+</button>
                                            </div>
                                        </div>

                                        {/* Enable emergency Consults */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-gray-100">
                                            <label className="text-[#444444] font-bold text-[15px] shrink-0">Enable emergency Consults</label>
                                            <div className="w-full sm:max-w-[400px] flex sm:justify-start sm:ml-auto items-center flex-wrap gap-4 sm:gap-6 flex-1">
                                                {/* Toggle */}
                                                <button
                                                    onClick={() => setFeesState(prev => ({ ...prev, enableEmergencyConsults: !prev.enableEmergencyConsults }))}
                                                    className={`w-11 h-6 shrink-0 rounded-full relative transition-colors ${feesState.enableEmergencyConsults ? 'bg-[#ff6b6b]' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-[2px] transition-transform shadow-sm ${feesState.enableEmergencyConsults ? 'left-[22px]' : 'left-[2px]'}`}></div>
                                                </button>

                                                {/* Limit controls (only show if enabled) */}
                                                <div className={`flex items-center gap-3 transition-opacity duration-300 ${feesState.enableEmergencyConsults ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                                    <span className="text-[15px] font-bold text-[#444444]">Limit</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleDecrement('emergencyLimit')}
                                                            className="w-6 h-6 flex items-center justify-center bg-[#ff6b6b] text-white rounded text-sm hover:bg-[#fa5555] transition-colors"
                                                        >-</button>
                                                        <input
                                                            type="text"
                                                            className="w-12 text-center p-1 border border-gray-200 rounded-sm text-[14px] outline-none"
                                                            value={feesState.emergencyLimit}
                                                            readOnly
                                                        />
                                                        <button
                                                            onClick={() => handleIncrement('emergencyLimit')}
                                                            className="w-6 h-6 flex items-center justify-center bg-[#ff6b6b] text-white rounded text-sm hover:bg-[#fa5555] transition-colors"
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <div className="pt-8">
                                            <Button className="w-[100px] bg-[#ff6b6b] hover:bg-[#fa5555] text-white font-medium py-[10px] rounded shadow-sm shadow-rose-200 transition-all border-none text-[14px]">
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default SettingsPage;
