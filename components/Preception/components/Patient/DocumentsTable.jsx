import React from 'react';

const DocumentsTable = ({
  documents,
  selectedDocuments,
  searchQuery,
  setSearchQuery,
  onSelectAll,
  onSelect,
}) => {
  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Patients Uploaded Documents
        </h2>

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className="w-full sm:w-64 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>

      {/* Scroll Container */}
      <div className="relative border border-gray-200 rounded-xl bg-white shadow-sm">
        <div
          className="
            max-h-[420px]
            overflow-x-auto
            overflow-y-auto
            custom-scrollbar
          "
        >
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200">
              <tr className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="p-4 w-12 text-center sticky left-0 z-30 bg-gray-50">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={
                      documents.length > 0 &&
                      selectedDocuments.length === documents.length
                    }
                    onChange={onSelectAll}
                  />
                </th>
                <th className="p-4">Document Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Size</th>
                <th className="p-4">Date Uploaded</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    No documents found.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className={`
                      group transition-colors
                      hover:bg-gray-50
                      ${selectedDocuments.includes(doc.id) ? 'bg-blue-50/40' : ''}
                    `}
                  >
                    <td className="p-4 text-center sticky left-0 bg-white group-hover:bg-gray-50">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => onSelect(doc.id)}
                      />
                    </td>

                    <td className="p-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {doc.type === 'PDF' ? '📄' : '🖼️'}
                        </span>
                        <span className="truncate max-w-[240px]">
                          {doc.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                        {doc.type}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600 text-sm">
                      {doc.size}
                    </td>

                    <td className="p-4 text-gray-600 text-sm">
                      <div className="flex flex-col">
                        <span>{doc.creationDate}</span>
                        <span className="text-xs text-gray-400">
                          {doc.time}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <ActionBtn title="View" color="blue">👁️</ActionBtn>
                        <ActionBtn title="Download" color="green">⬇️</ActionBtn>
                        <ActionBtn title="Delete" color="red">🗑️</ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile hint */}
      {/* <p className="text-xs text-gray-400 mt-3 text-center sm:hidden">
        ← Swipe left / right to see more →
      </p> */}
    </div>
  );
};

/* Small reusable button */
const ActionBtn = ({ children, title, color }) => (
  <button
    title={title}
    className={`p-1.5 rounded-lg transition-colors
      hover:bg-${color}-100 text-${color}-600`}
  >
    {children}
  </button>
);

export default DocumentsTable;
