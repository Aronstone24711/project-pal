import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Loader2, ScanLine, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Component } from "@/types/arduino";

interface CameraScannerProps {
  onComponentsIdentified: (components: Component[]) => void;
}

const CameraScanner = ({ onComponentsIdentified }: CameraScannerProps) => {
  const [mode, setMode] = useState<"select" | "camera" | "upload">("select");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setMode("camera");
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setMode("upload");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-components", {
        body: { imageBase64: capturedImage, action: "identify" }
      });

      if (error) throw error;

      if (data.components && data.components.length > 0) {
        toast({
          title: "Components Identified!",
          description: `Found ${data.components.length} components.`
        });
        onComponentsIdentified(data.components);
      } else {
        toast({
          title: "No Components Found",
          description: "Try taking a clearer photo with better lighting.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setMode("select");
    stopCamera();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Scan Your Components</h2>
        <p className="text-muted-foreground">
          Take a photo or upload an image of your Arduino and electronic components
        </p>
      </div>

      {mode === "select" && !capturedImage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
            onClick={startCamera}
          >
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">Live Camera</h3>
                <p className="text-sm text-muted-foreground">Point and capture in real-time</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">Upload Photo</h3>
                <p className="text-sm text-muted-foreground">Select from your gallery</p>
              </div>
            </CardContent>
          </Card>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {mode === "camera" && !capturedImage && (
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-3/4 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
                <ScanLine className="w-12 h-12 text-primary/50 animate-pulse" />
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <Button variant="outline" onClick={resetCapture}>
                Cancel
              </Button>
              <Button onClick={captureImage} className="gap-2">
                <Camera className="w-4 h-4" />
                Capture
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {capturedImage && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured components" 
                className="w-full aspect-video object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-foreground font-medium">Analyzing components...</p>
                </div>
              )}
            </div>
            <div className="p-4 flex gap-3 justify-center">
              <Button variant="outline" onClick={resetCapture} disabled={isAnalyzing}>
                <ImageIcon className="w-4 h-4 mr-2" />
                New Photo
              </Button>
              <Button onClick={analyzeImage} disabled={isAnalyzing} className="gap-2">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4" />
                    Identify Components
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="text-center text-sm text-muted-foreground">
        <p>📸 Tip: Ensure good lighting and spread components apart for better detection</p>
      </div>
    </div>
  );
};

export default CameraScanner;
