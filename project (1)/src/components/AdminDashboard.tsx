import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('pdfs').list();
    if (data) {
      setFiles(data);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    setUploading(true);

    try {
      const { error } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file);

      if (error) throw error;
      fetchFiles();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const { error } = await supabase.storage.from('pdfs').remove([fileName]);
      if (error) throw error;
      fetchFiles();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Uploaded PDFs
          </h3>
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
                  onClick={() => handleDelete(file.name)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;