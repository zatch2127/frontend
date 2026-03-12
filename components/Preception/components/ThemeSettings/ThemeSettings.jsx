import React, { useState } from 'react';

const ThemeSettings = () => {
    const [themeColor, setThemeColor] = useState('Light');

    return (
        <div className="p-8">
            <h1 className="text-[22px] font-bold text-[#202020] mb-8">Dashboard layout</h1>
            <div className="flex flex-col gap-2 max-w-sm">
                <h1 className="text-[15px] font-bold text-[#444444]">Color mode</h1>
                <label className="text-[14px] text-[#202020] flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">🎨</div>
                    Theme
                </label>
                <select
                    className="w-full mt-2 p-[12px] rounded-lg border-2 border-gray-100 focus:outline-none focus:border-[#69b4ff] text-[14px] font-medium text-[#202020] cursor-pointer bg-white"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                >
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                    <option value="System">System Default</option>
                </select>
            </div>
        </div>
    );
};

export default ThemeSettings;
