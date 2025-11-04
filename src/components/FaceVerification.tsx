import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Camera, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface FaceVerificationProps {
  onVerified: (verified: boolean) => void;
  verified: boolean;
}

export function FaceVerification({ onVerified, verified }: FaceVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsVerifying(true);
    } catch (error) {
      toast.error('无法访问摄像头，请检查权限设置');
      console.error('Camera access error:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsVerifying(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        
        // 模拟人脸识别验证过程
        setTimeout(() => {
          const success = Math.random() > 0.1; // 90% 成功率模拟
          if (success) {
            toast.success('人脸识别验证成功');
            onVerified(true);
          } else {
            toast.error('人脸识别验证失败，请重试');
            setCapturedImage(null);
          }
        }, 1500);
      }
    }
  };

  const retryVerification = () => {
    setCapturedImage(null);
    onVerified(false);
    startCamera();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          人脸识别验证 <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          请确保光线充足，正面面对摄像头，完成人脸识别验证
        </p>
      </div>

      {!isVerifying && !capturedImage && !verified && (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium mb-1">开始人脸识别</p>
              <p className="text-sm text-muted-foreground">
                点击下方按钮开启摄像头进行实名认证
              </p>
            </div>
            <Button onClick={startCamera} className="mt-2">
              <Camera className="w-4 h-4 mr-2" />
              开启摄像头
            </Button>
          </div>
        </Card>
      )}

      {isVerifying && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-64 border-2 border-white rounded-lg"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                拍摄照片
              </Button>
              <Button onClick={stopCamera} variant="outline">
                取消
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              请将面部置于框内，保持正面，点击拍摄
            </p>
          </div>
        </Card>
      )}

      {capturedImage && !verified && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>正在验证...</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {verified && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-900">人脸识别验证成功</p>
              <p className="text-sm text-green-700 mt-1">
                您的身份已通过实名认证验证
              </p>
            </div>
            <Button onClick={retryVerification} variant="outline" size="sm">
              重新验证
            </Button>
          </div>
        </Card>
      )}

      {!verified && capturedImage === null && !isVerifying && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            人脸识别是必需的验证步骤，用于确保账户安全和身份真实性
          </p>
        </div>
      )}
    </div>
  );
}
