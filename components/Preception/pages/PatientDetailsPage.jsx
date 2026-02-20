import React, { useState, useEffect } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import PatientInfoCard from '../components/Patient/PatientInfoCard';
import DocumentsTable from '../components/Patient/DocumentsTable';
import { useRoute } from '@react-navigation/native';
import { useDashboard } from '../context/Dashboardcontext';
import { SUBSCRIBERS } from '../../../constants/subscribers';

const PatientDetailsPage = () => {
  const route = useRoute();
  const { selectedSubscriber } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Get ID from route params (if available) or fallback to context
  const patientId = route.params?.id || selectedSubscriber?.id;

  // Find patient data
  const patient = SUBSCRIBERS.find(p => p.id === Number(patientId)) || SUBSCRIBERS[0]; // Fallback to first if not found (or handle error)

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Angiography Report.pdf',
      type: 'PDF',
      size: '200KB',
      creationDate: 'Feb 09, 2025',
      time: '10:45 AM',
    },
    {
      id: 2,
      name: 'ECG Report.pdf',
      type: 'PDF',
      size: '150KB',
      creationDate: 'Feb 10, 2025',
      time: '11:30 AM',
    },
    {
      id: 3,
      name: 'Angiography Report.pdf',
      type: 'PDF',
      size: '200KB',
      creationDate: 'Feb 09, 2025',
      time: '10:45 AM',
    },
    {
      id: 4,
      name: 'ECG Report.pdf',
      type: 'PDF',
      size: '150KB',
      creationDate: 'Feb 10, 2025',
      time: '11:30 AM',
    },
  ]);

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (e) => {
    setSelectedDocuments(
      e.target.checked ? filteredDocuments.map((d) => d.id) : []
    );
  };

  const handleSelectDocument = (id) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full flex justify-center h-[calc(100vh-140px)] min-h-[600px]">
      <Card
        className="
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
        "
        padding="p-0"
      >
        {/* Header */}
        <div className="px-6 py-5 md:px-8 md:py-6 border-b border-gray-100 bg-white/50 z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Patient <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Details</span>
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 custom-scrollbar space-y-8 bg-gradient-to-b from-white/30 to-rose-50/10">
          <PatientInfoCard patient={patient} />

          <div className="overflow-x-auto">
            <DocumentsTable
              documents={filteredDocuments}
              selectedDocuments={selectedDocuments}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectAll={handleSelectAll}
              onSelect={handleSelectDocument}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PatientDetailsPage;
