import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Content, importContent, ContentType } from '@/lib/contentStore';
import CloseButton from './CloseButton';
import { FiUpload } from 'react-icons/fi';
import { parseCSV } from '../lib/csvImport';

export type NewContentData = {
  title: string;
  description: string;
  thumbnailUrl: string;
  type: 'movie' | 'tv-show' | 'book' | 'video-game';
};

interface AddContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewContentData) => void;
  contentToEdit?: Content | null;
  onDelete?: () => void;
}

const AddContentDialog: React.FC<AddContentDialogProps> = ({ isOpen, onClose, onSave, contentToEdit, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [type, setType] = useState<'movie' | 'tv-show' | 'book' | 'video-game'>('movie');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accent = 'primary';

  useEffect(() => {
    if (isOpen && contentToEdit) {
      setTitle(contentToEdit.title);
      setDescription(contentToEdit.description);
      setThumbnailUrl(contentToEdit.thumbnailUrl || '');
      setType(contentToEdit.type);
      setUploadPreview(contentToEdit.thumbnailUrl || null);
    } else if (isOpen) {
      setTitle('');
      setDescription('');
      setThumbnailUrl('');
      setType('movie');
      setUploadPreview(null);
    }
  }, [isOpen, contentToEdit]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      type,
    });
    setTitle('');
    setDescription('');
    setThumbnailUrl('');
    setUploadPreview(null);
    setType('movie');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" style={{ background: 'var(--dialog-scrim-bg)' }}>
      <div className="bg-white dark:bg-gray-800 p-0 rounded-2xl shadow-2xl w-full max-w-md relative">
        <div className={`h-2 rounded-t-2xl bg-${accent}-600 w-full`} />
        <CloseButton onClick={onClose} className="absolute top-4 right-4" />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{contentToEdit ? 'Edit Item' : 'Add New Item'}</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm sm:text-sm px-3 py-2 focus:ring-2 focus:ring-${accent}-500 focus:border-${accent}-500`}
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                id="type"
                value={type}
                onChange={e => setType(e.target.value as 'movie' | 'tv-show' | 'book' | 'video-game')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-lg bg-white dark:bg-gray-700 px-3"
              >
                <option value="movie">Movie</option>
                <option value="tv-show">TV Show</option>
                <option value="book">Book</option>
                <option value="video-game">Video Game</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className={`mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm sm:text-sm px-3 py-2 focus:ring-2 focus:ring-${accent}-500 focus:border-${accent}-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Paste image URL"
                  value={thumbnailUrl}
                  onChange={e => { setThumbnailUrl(e.target.value); setUploadPreview(null); }}
                  className={`mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm sm:text-sm px-3 py-2 focus:ring-2 focus:ring-${accent}-500 focus:border-${accent}-500`}
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
                  className={`px-3 py-2 rounded-lg bg-${accent}-500 text-white font-medium hover:bg-${accent}-600 shadow`}
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
                  className={`px-3 py-2 rounded-lg bg-${accent}-600 text-white font-medium hover:bg-${accent}-700 shadow`}
                >
                  Random Image
                </button>
              </div>
              {(uploadPreview || thumbnailUrl) && (
                <div className="relative h-32 w-full mt-2 rounded-lg overflow-hidden border">
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
          <div className="mt-8 flex justify-end gap-4">
            {contentToEdit && onDelete && (
              <button
                onClick={onDelete}
                className="px-5 py-2 text-sm font-medium rounded-lg text-white bg-secondary hover:bg-secondary-hover shadow"
              >
                Delete
              </button>
            )}
            <button onClick={handleSave} className={`px-5 py-2 text-sm font-medium rounded-lg text-white bg-${accent}-600 hover:bg-${accent}-700 shadow`}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ImportCSVButton({ onImport }: { onImport?: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const items = parseCSV(text);
    importContent(items);
    if (onImport) onImport();
    alert(`${items.length} items imported!`);
    e.target.value = "";
  };
  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-16 h-16 rounded-full shadow-lg text-white font-bold text-2xl flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-4 bg-primary hover:bg-primary-hover focus:ring-primary"
        aria-label="Import from CSV"
        style={{ margin: 0 }}
      >
        <FiUpload size={32} />
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}

export default AddContentDialog; 