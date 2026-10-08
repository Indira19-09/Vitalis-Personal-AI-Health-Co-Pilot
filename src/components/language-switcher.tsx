import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/components/language-provider";
import { isLanguage } from "@/lib/translations";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <Select value={language} onValueChange={(value) => { if (isLanguage(value)) setLanguage(value); }}>
      <SelectTrigger aria-label={t("Language")} className="w-36 shrink-0 bg-background text-foreground">
        <Languages className="h-4 w-4 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">हिन्दी</SelectItem>
        <SelectItem value="te">తెలుగు</SelectItem>
      </SelectContent>
    </Select>
  );
}