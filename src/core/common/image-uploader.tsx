'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

type ImageUploaderSingleProps = {
  onSelect: (file: File) => void;
  imageUrl?: string;
  multiple?: false;
};

type ImageUploaderMultipleProps = {
  onSelect: (files: File[]) => void;
  imageUrl?: string;
  multiple: true;
};

type ImageUploaderProps = ImageUploaderSingleProps | ImageUploaderMultipleProps;

/**
 * @function ImageUploader
 * @description Component that allows users to upload and preview images
 *
 * @param {Object} props - Component properties
 * @param {function} props.onSelect - Callback function to handle image selection
 * @param {string} [props.imageUrl] - URL of the initial image to display
 * @param {boolean} [props.multiple=false] - Flag indicating if multiple images can be uploaded
 * @returns {JSX.Element} Rendered image uploader component
 */
export const ImageUploader = ({ onSelect, imageUrl, multiple }: ImageUploaderProps): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (imageUrl && selectedFiles.length === 0) {
      setPreviewUrls([imageUrl]);
    }
  }, [imageUrl, selectedFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);

      const urls = fileArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);

      if (multiple) {
        (onSelect as (files: File[]) => void)(fileArray);
      } else {
        (onSelect as (file: File) => void)(fileArray[0]);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <input type='file' accept='image/*' multiple={multiple} onChange={handleFileChange} />
      {previewUrls.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {previewUrls.map((url, index) => (
            <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
              <Image src={url} alt='Preview' width={previewUrls.length > 1 ? 200 : 600} height={200} className='opacity-50' />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: previewUrls.length > 1 ? '10px' : '14px',
                }}
              >
                {selectedFiles[index]?.name || 'Imagen actual'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
