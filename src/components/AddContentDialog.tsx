import React, { useRef, useState } from 'react';
import Image from 'next/image';

export type NewContentData = {
  title: string;
  description: string;
  thumbnailUrl: string;
};

type AddContentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewContentData) => void;
};

const AddContentDialog: React.FC<AddContentDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadPreview(event.target?.result as string);
        setThumbnailUrl(''); // Clear URL if uploading
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title || !description || (!thumbnailUrl && !uploadPreview)) {
      alert('Please fill in all fields and provide a thumbnail.');
      return;
    }
    onSave({
      title,
      description,
      thumbnailUrl: uploadPreview || thumbnailUrl,
    });
    setTitle('');
    setDescription('');
    setThumbnailUrl('');
    setUploadPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Content</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Paste image URL"
                value={thumbnailUrl}
                onChange={e => { setThumbnailUrl(e.target.value); setUploadPreview(null); }}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm sm:text-sm"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-md bg-gray-500 text-white font-medium hover:bg-gray-600"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  const randomSeed = Math.random().toString(36).substring(2, 10);
                  setThumbnailUrl(`https://picsum.photos/seed/${randomSeed}/400/300`);
                  setUploadPreview(null);
                }}
                className="px-3 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
              >
                Random Image
              </button>
            </div>
            {(uploadPreview || thumbnailUrl) && (
              <div className="relative h-32 w-full mt-2 rounded overflow-hidden border">
                <Image
                  src={uploadPreview || thumbnailUrl}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Save Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContentDialog; 