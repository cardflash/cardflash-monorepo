import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useI18nContext } from "@/i18n/i18n-react";
import { loadLocale } from "@/i18n/i18n-util.sync";
import { Locales } from "@/i18n/i18n-types";
const LOCALES = {
  en: "English",
  de: "Deutsch",
  "zh-Hant": "繁體中文",
};
export const LOCAL_STORAGE_LANG_KEY = "cardflash-lang-storage";
export default function LanguageSelector() {
  const { setLocale, locale, LL } = useI18nContext();
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="LanguageSelector-selector">{LL.LANGUAGE()}</Label>
      <Select
        value={locale}
        onValueChange={(val) => {
          loadLocale(val as Locales);
          localStorage.setItem(LOCAL_STORAGE_LANG_KEY, val);
          setLocale(val as Locales);
        }}
      >
        <SelectTrigger id="LanguageSelector-selector" className="w-[180px]">
          <SelectValue placeholder={LL.LANGUAGE_SELECTOR()} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(LOCALES).map(([val, label]) => (
            <SelectItem key={val} value={val}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
