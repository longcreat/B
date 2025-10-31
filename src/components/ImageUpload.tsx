import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Upload, X, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface ImageUploadProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  maxSize?: number; // in MB
}

export function ImageUpload({ label, file, onChange, maxSize = 5 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 验证文件大小
    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast.error(`文件大小不能超过 ${maxSize}MB`);
      return;
    }

    // 验证文件类型
    if (!selectedFile.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast.error('只支持 JPG、JPEG、PNG 格式的图片');
      return;
    }

    onChange(selectedFile);

    // 生成预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="border-2 border-dashed rounded-lg p-4">
        {!file ? (
          <div
            onClick={handleClick}
            className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors py-8"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-600 mb-1">{label}</p>
            <p className="text-gray-400">点击上传</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative group">
              <img
                src={preview || ''}
                alt={label}
                className="w-full h-48 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowPreview(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-600 truncate">{file.name}</p>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={handleClick}>
                替换
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handleRemove}>
                删除
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl" aria-describedby="image-description">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <div id="image-description" className="max-h-[70vh] overflow-auto">
            <img src={preview || ''} alt={label} className="w-full" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
