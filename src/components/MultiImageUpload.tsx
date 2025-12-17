import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MultiImageUploadProps {
    label: string;
    files: File[];
    onChange: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number; // MB
    description?: string;
}

export function MultiImageUpload({
    label,
    files,
    onChange,
    maxFiles = 5,
    maxSize = 5,
    description
}: MultiImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    // Generate previews when files change
    useEffect(() => {
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        // Cleanup URLs to avoid memory leaks
        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        const validFiles: File[] = [];
        let hasError = false;

        // Check available slots
        const remainingSlots = maxFiles - files.length;
        if (selectedFiles.length > remainingSlots) {
            toast.error(`最多只能再上传 ${remainingSlots} 张图片`);
            if (inputRef.current) inputRef.current.value = '';
            return;
        }

        selectedFiles.forEach(file => {
            // Validate size
            if (file.size > maxSize * 1024 * 1024) {
                toast.error(`文件 ${file.name} 超过 ${maxSize}MB 限制`);
                hasError = true;
                return;
            }
            // Validate type
            if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
                toast.error(`文件 ${file.name} 格式不正确，仅支持 JPG/PNG`);
                hasError = true;
                return;
            }
            validFiles.push(file);
        });

        if (validFiles.length > 0) {
            onChange([...files, ...validFiles]);
        }

        // Reset input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleRemove = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        onChange(newFiles);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-xs text-gray-500">
                    {files.length} / {maxFiles}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Previews */}
                {previews.map((preview, index) => (
                    <div key={preview + index} className="relative group aspect-square rounded-lg border overflow-hidden bg-gray-50">
                        <img
                            src={preview}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleRemove(index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Upload Button */}
                {files.length < maxFiles && (
                    <div
                        onClick={handleClick}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
                    >
                        <Plus className="w-8 h-8" />
                        <span className="text-xs font-medium">点击上传</span>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                onChange={handleFileChange}
                className="hidden"
            />

            {description && (
                <p className="text-xs text-gray-500">{description}</p>
            )}
        </div>
    );
}
