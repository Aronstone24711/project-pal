import { useState } from "react";
import { Check, Globe, ChevronRight } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
];

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
}

const LanguageSelector = ({ onLanguageSelect }: LanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Choose Your Language
          </h2>
          <p className="text-muted-foreground">
            Select the language for project instructions
          </p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6 max-h-[400px] overflow-y-auto">
          {filteredLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleSelect(language)}
              className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors border-b border-border/50 last:border-b-0 ${
                selectedLanguage?.code === language.code
                  ? "bg-primary/10"
                  : "hover:bg-muted/50"
              }`}
            >
              <span className="text-2xl">{language.flag}</span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{language.name}</p>
                <p className="text-sm text-muted-foreground">{language.nativeName}</p>
              </div>
              {selectedLanguage?.code === language.code && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedLanguage}
          className="w-full py-4 rounded-xl font-semibold text-primary-foreground bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
