import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserDashboard: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('pdfs').list();
    if (data) {
      setFiles(data);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdfs')
        .download(fileName);
      
      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available PDFs</h1>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900">
                  {file.name}
                </span>
                <button
                  onClick={() => handleDownload(file.name)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;