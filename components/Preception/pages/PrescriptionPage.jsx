import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import PrescriptionForm from '../Prescription/PrescriptionForm';

const PrescriptionPage = () => {
  return (
    <div className="w-full flex justify-center h-[calc(100vh-140px)] min-h-[600px]">
      <Card className="
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
      ">

        {/* ================= Header (Fixed) ================= */}
        <div className="px-6 py-5 md:px-8 md:py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Prescription</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              AI-assisted prescription generation from reports & history
            </p>
          </div>

          <Button variant="secondary" size="sm" className="shadow-sm border-gray-200">
            Select Subscriber
          </Button>
        </div>

        {/* ================= Scrollable Content ================= */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 custom-scrollbar bg-gradient-to-b from-white/30 to-rose-50/10">
          <PrescriptionForm />
        </div>

      </Card>
    </div>
  );
};

export default PrescriptionPage;
