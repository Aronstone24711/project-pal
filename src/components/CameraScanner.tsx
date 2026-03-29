import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, ScanLine, ImageIcon, Keyboard, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Component } from "@/types/arduino";

interface CameraScannerProps {
  onComponentsIdentified: (components: Component[]) => void;
  language: string;
}

const CameraScanner = ({ onComponentsIdentified, language }: CameraScannerProps) => {
  const [mode, setMode] = useState<"select" | "camera" | "upload" | "manual">("select");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [manualComponents, setManualComponents] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Set video srcObject when stream is available and video element is mounted
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, mode]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 }
      });
      setStream(mediaStream);
      setMode("camera");
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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

  const addManualComponent = () => {
    const trimmed = manualInput.trim();
    if (trimmed && !manualComponents.includes(trimmed)) {
      setManualComponents(prev => [...prev, trimmed]);
      setManualInput("");
    }
  };

  const removeManualComponent = (item: string) => {
    setManualComponents(prev => prev.filter(c => c !== item));
  };

  const handleManualKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addManualComponent();
    }
  };

  const submitManualComponents = () => {
    if (manualComponents.length === 0) {
      toast({
        title: "No Components",
        description: "Please add at least one component.",
        variant: "destructive"
      });
      return;
    }

    const components: Component[] = manualComponents.map((name, idx) => ({
      name,
      type: "other",
      quantity: 1,
      description: `Manually entered: ${name}`,
    }));

    toast({
      title: "Components Added!",
      description: `${components.length} components ready.`
    });
    onComponentsIdentified(components);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setMode("select");
    stopCamera();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Scan Your Items</h2>
        <p className="text-muted-foreground">
          Take a photo, upload an image, or type in what you have!
        </p>
      </div>

      {mode === "select" && !capturedImage && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
            onClick={startCamera}
          >
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground text-sm">Live Camera</h3>
                <p className="text-xs text-muted-foreground">Capture in real-time</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground text-sm">Upload Photo</h3>
                <p className="text-xs text-muted-foreground">From your gallery</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg group"
            onClick={() => setMode("manual")}
          >
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Keyboard className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground text-sm">Type Manually</h3>
                <p className="text-xs text-muted-foreground">Enter components</p>
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

      {mode === "manual" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Arduino Uno, LED, Resistor, Cardboard..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={handleManualKeyDown}
                className="flex-1"
                maxLength={100}
              />
              <Button onClick={addManualComponent} size="icon" disabled={!manualInput.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {manualComponents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {manualComponents.map((item) => (
                  <Badge key={item} variant="secondary" className="gap-1 px-3 py-1.5 text-sm">
                    {item}
                    <button onClick={() => removeManualComponent(item)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={resetCapture}>
                Cancel
              </Button>
              <Button onClick={submitManualComponents} disabled={manualComponents.length === 0} className="gap-2">
                <ScanLine className="w-4 h-4" />
                Find Projects ({manualComponents.length})
              </Button>
            </div>
          </CardContent>
        </Card>
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
        <p>📸 Tip: Ensure good lighting and spread items apart for better detection</p>
      </div>
    </div>
  );
};

export default CameraScanner;
