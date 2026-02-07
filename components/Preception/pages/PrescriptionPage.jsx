import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import PrescriptionForm from '../Prescription/PrescriptionForm';

const PrescriptionPage = () => {
  return (
    <div className="w-full flex justify-center">
<Card className="
  w-full 
  max-w-4xl 
  h-[85vh] 
  bg-white/80 
  backdrop-blur-md 
  border 
  border-gray-200 
  shadow-xl 
  rounded-2xl 
  flex 
  flex-col
  p-6 
  md:p-8
">

        {/* ================= Header (Fixed) ================= */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              Generate Prescription
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              AI-assisted prescription generation from reports & history
            </p>
          </div>

          <Button variant="secondary" size="sm">
            Select Subscriber
          </Button>
        </div>

        {/* ================= Scrollable Content ================= */}
        <div className="flex-1 overflow-y-auto pr-2">
  <PrescriptionForm />
</div>

      </Card>
    </div>
  );
};

export default PrescriptionPage;
