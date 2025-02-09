'use client';

import { UploadCloud, X } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface FileInputProps {
    name: string;
    title: string;
    value: (string | File)[]; // Can be either URLs or Files
    multiple?: boolean;
    onChange: (values: (string | File)[]) => void;
}

export function FileInput({
    name,
    title,
    value = [],
    multiple = false,
    onChange,
}: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleDelete = useCallback(
        (indexToDelete: number) => {
            const newValues = value.filter(
                (_, index) => index !== indexToDelete
            );
            onChange(newValues);
        },
        [value, onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const droppedFiles = e.dataTransfer.files;

            if (!droppedFiles?.length) return;

            // Filter for only image files
            const imageFiles = Array.from(droppedFiles).filter((file) =>
                file.type.startsWith('image/')
            );

            if (imageFiles.length === 0) return;

            if (multiple) {
                // Add new files to existing values
                onChange([...value, ...imageFiles]);
            } else {
                // Replace with new file
                onChange([imageFiles[0]]);
            }
        },
        [multiple, value, onChange]
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files?.length) return;

            const imageFiles = Array.from(files);

            if (multiple) {
                // Add new files to existing values
                onChange([...value, ...imageFiles]);
            } else {
                // Replace with new file
                onChange([imageFiles[0]]);
            }
        },
        [multiple, value, onChange]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const getImageSrc = (item: string | File): string => {
        if (typeof item === 'string') {
            return item;
        }
        return URL.createObjectURL(item);
    };

    return (
        <div className="space-y-4">
            <div
                className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                role="button"
                tabIndex={0}
                aria-label={`Upload ${title}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept="image/*"
                    multiple={multiple}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                    {multiple
                        ? 'Upload multiple images'
                        : 'Upload a single image'}
                </p>
            </div>

            {/* Preview Section */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {value.map((item, index) => (
                        <div key={index} className="relative group max-w-40">
                            <div className="aspect-square relative rounded-lg overflow-hidden border max-w-40">
                                <img
                                    src={
                                        getImageSrc(item) || '/placeholder.svg'
                                    }
                                    alt={`Preview ${index + 1}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(index);
                                }}
                                aria-label="Remove image"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
