import React from 'react';
import Button from '../../UI/Button';
const PatientInfoCard = ({ patient }) => {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* LEFT: Patient Profile */}
          <div className="flex gap-4 sm:gap-5 items-start xl:w-72">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
              </svg>
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {patient.name}
              </h2>

              <p className="text-sm text-gray-500 mt-0.5">
                {patient.age} yrs • {patient.gender}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full">
                  {patient.condition}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  {patient.status}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: Appointment Details */}
          <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem label="Date" value={patient.appointmentDate} />
              <InfoItem label="Time" value={patient.time} />
              <InfoItem
                label="Health Score"
                value={patient.healthScore}
                valueClass="text-amber-600 font-bold"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Summary
              </span>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-3 md:line-clamp-none">
                {patient.summary}
              </p>
            </div>
          </div>

          {/* RIGHT: Action */}
          <div className="flex xl:flex-col xl:justify-between gap-3 xl:w-56">
            <Button
              variant="primary"
              className="w-full shadow-md shadow-blue-200"
            >
              Generate Prescription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Small helper component */
const InfoItem = ({ label, value, valueClass = "" }) => (
  <div>
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {label}
    </span>
    <p className={`text-sm font-semibold text-gray-700 mt-0.5 ${valueClass}`}>
      {value}
    </p>
  </div>
);

export default PatientInfoCard;
