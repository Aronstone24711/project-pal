import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
];

interface PhoneAuthFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const PhoneAuthForm = ({ onSuccess, onBack }: PhoneAuthFormProps) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { toast } = useToast();
  const { setCountryFromPhone } = useTheme();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const fullPhone = `${countryCode}${phoneNumber}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
      });

      if (error) throw error;

      setShowOtpInput(true);
      // Set location based on country code
      setCountryFromPhone(countryCode);
      
      toast({
        title: "OTP sent!",
        description: `A verification code has been sent to ${fullPhone}`,
      });
    } catch (error) {
      console.error('OTP send error:', error);
      toast({
        title: "Failed to send OTP",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const fullPhone = `${countryCode}${phoneNumber}`;

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You're now logged in",
      });
      onSuccess();
    } catch (error) {
      console.error('OTP verify error:', error);
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Phone className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-semibold">Phone Login</h2>
        <p className="text-muted-foreground text-sm">
          Sign in with your phone number
        </p>
      </div>

      {!showOtpInput ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.flag} {c.country} ({c.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2">
              <div className="w-20 flex items-center justify-center bg-muted rounded-md text-sm">
                {countryCode}
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="flex-1"
                maxLength={15}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
            <p className="text-xs text-muted-foreground text-center">
              Code sent to {countryCode}{phoneNumber}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Login'
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setShowOtpInput(false)}
          >
            Change phone number
          </Button>
        </form>
      )}

      <Button variant="outline" className="w-full" onClick={onBack}>
        Back to login options
      </Button>
    </div>
  );
};

export default PhoneAuthForm;
