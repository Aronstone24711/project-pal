import { useState } from "react";
import { Check, Globe, ChevronRight } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  // Indian Languages
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", flag: "🇮🇳" },
  { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी", flag: "🇮🇳" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", flag: "🇮🇳" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇮🇳" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", flag: "🇮🇳" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी", flag: "🇮🇳" },
  { code: "ks", name: "Kashmiri", nativeName: "कॉशुर", flag: "🇮🇳" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", flag: "🇮🇳" },
  { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্", flag: "🇮🇳" },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", flag: "🇮🇳" },
  { code: "brx", name: "Bodo", nativeName: "बड़ो", flag: "🇮🇳" },
  { code: "raj", name: "Rajasthani", nativeName: "राजस्थानी", flag: "🇮🇳" },
  { code: "chhg", name: "Chhattisgarhi", nativeName: "छत्तीसगढ़ी", flag: "🇮🇳" },
  { code: "mag", name: "Magahi", nativeName: "मगही", flag: "🇮🇳" },
  { code: "awa", name: "Awadhi", nativeName: "अवधी", flag: "🇮🇳" },
  { code: "hne", name: "Haryanvi", nativeName: "हरियाणवी", flag: "🇮🇳" },
  { code: "gbm", name: "Garhwali", nativeName: "गढ़वाली", flag: "🇮🇳" },
  { code: "kfy", name: "Kumaoni", nativeName: "कुमाऊँनी", flag: "🇮🇳" },
  { code: "tcy", name: "Tulu", nativeName: "ತುಳು", flag: "🇮🇳" },
  { code: "gom", name: "Goan Konkani", nativeName: "गोंयची कोंकणी", flag: "🇮🇳" },
  
  // Major World Languages
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "zh", name: "Chinese (Mandarin)", nativeName: "中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "繁體中文", flag: "🇹🇼" },
  { code: "yue", name: "Cantonese", nativeName: "粵語", flag: "🇭🇰" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "pt-PT", name: "Portuguese (Portugal)", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "🇱🇻" },
  { code: "et", name: "Estonian", nativeName: "Eesti", flag: "🇪🇪" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာဘာသာ", flag: "🇲🇲" },
  { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ", flag: "🇰🇭" },
  { code: "lo", name: "Lao", nativeName: "ລາວ", flag: "🇱🇦" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪" },
  { code: "hy", name: "Armenian", nativeName: "Հայերdelays", flag: "🇦🇲" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", flag: "🇦🇿" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақ", flag: "🇰🇿" },
  { code: "uz", name: "Uzbek", nativeName: "Oʻzbek", flag: "🇺🇿" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", flag: "🇲🇳" },
  { code: "sq", name: "Albanian", nativeName: "Shqip", flag: "🇦🇱" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", flag: "🇲🇰" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski", flag: "🇧🇦" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", flag: "🇮🇸" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge", flag: "🇮🇪" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "gd", name: "Scottish Gaelic", nativeName: "Gàidhlig", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "eu", name: "Basque", nativeName: "Euskara", flag: "🇪🇸" },
  { code: "ca", name: "Catalan", nativeName: "Català", flag: "🇪🇸" },
  { code: "gl", name: "Galician", nativeName: "Galego", flag: "🇪🇸" },
  { code: "mt", name: "Maltese", nativeName: "Malti", flag: "🇲🇹" },
  { code: "lb", name: "Luxembourgish", nativeName: "Lëtzebuergesch", flag: "🇱🇺" },
  { code: "be", name: "Belarusian", nativeName: "Беларуская", flag: "🇧🇾" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmen", flag: "🇹🇲" },
  { code: "ps", name: "Pashto", nativeName: "پښتو", flag: "🇦🇫" },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî", flag: "🇮🇶" },
  { code: "so", name: "Somali", nativeName: "Soomaali", flag: "🇸🇴" },
  { code: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda", flag: "🇷🇼" },
  { code: "mg", name: "Malagasy", nativeName: "Malagasy", flag: "🇲🇬" },
  { code: "ht", name: "Haitian Creole", nativeName: "Kreyòl Ayisyen", flag: "🇭🇹" },
  { code: "haw", name: "Hawaiian", nativeName: "ʻŌlelo Hawaiʻi", flag: "🇺🇸" },
  { code: "mi", name: "Maori", nativeName: "Māori", flag: "🇳🇿" },
  { code: "sm", name: "Samoan", nativeName: "Gagana Samoa", flag: "🇼🇸" },
  { code: "jv", name: "Javanese", nativeName: "Basa Jawa", flag: "🇮🇩" },
  { code: "su", name: "Sundanese", nativeName: "Basa Sunda", flag: "🇮🇩" },
  { code: "ceb", name: "Cebuano", nativeName: "Cebuano", flag: "🇵🇭" },
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
