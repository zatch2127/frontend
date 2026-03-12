import React, { useState, useRef, useEffect } from 'react';
import Button from '../../UI/Button';

const LANGUAGES = [
    { id: 'en', label: 'English (In)' },
    { id: 'hi', label: 'Hindi (हिंदी)' },
    { id: 'gu', label: 'Gujarati (ગુજરાતી)' },
    { id: 'es', label: 'Spanish (española(F)/español(M))' },
    { id: 'ta', label: 'Tamil (தமிழ்)' }
];

const LanguagePreferences = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en'); // Default to English based on screenshot showing it selected initially, or empty
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (langId) => {
        setSelectedLang(langId);
        setIsOpen(false);
    };

    return (
        <div className="w-full h-full p-6 md:p-8 min-h-[500px] flex flex-col justify-between max-w-4xl">
            <div>
                <h2 className="text-[22px] font-bold text-[#202020] mb-8">Language Preferences</h2>

                <div className="max-w-sm">
                    <label className="block text-[#444444] text-[14px] mb-2 font-medium">Language</label>
                    <div className="relative" ref={dropdownRef}>
                        {/* Dropdown Header */}
                        <div
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-sm p-[10px] flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#69b4ff]"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span className={`text-[13px] ${selectedLang ? 'text-[#202020]' : 'text-[#999999]'}`}>
                                {selectedLang ? LANGUAGES.find(l => l.id === selectedLang)?.label : 'Select language'}
                            </span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <div className="absolute w-full mt-1 bg-[#fcfcfc] border border-gray-200 rounded-lg shadow-lg z-20 py-2">
                                {LANGUAGES.map((lang) => (
                                    <div
                                        key={lang.id}
                                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
                                        onClick={() => handleSelect(lang.id)}
                                    >
                                        <span className="text-[14px] text-[#202020]">{lang.label}</span>
                                        <div className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center ${selectedLang === lang.id ? 'border-[#ff6b6b]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                            {selectedLang === lang.id && (
                                                <div className="w-[8px] h-[8px] rounded-full bg-[#ff6b6b]"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-8 mt-auto">
                <Button className="w-[100px] bg-[#ff6b6b] hover:bg-[#fa5555] text-white font-medium py-[10px] rounded shadow-sm shadow-rose-200 transition-all border-none text-[14px]">
                    Save
                </Button>
            </div>
        </div>
    );
};

export default LanguagePreferences;
