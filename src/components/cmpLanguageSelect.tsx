// src/features/profile/LanguageSelect.tsx
import { useI18n } from "../I18nProvider";

export function LanguageSelect() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-sm font-medium mb-2">{t("profile.language")}</div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setLang("uk")}
          className={`px-3 py-2 rounded-lg border text-sm ${
            lang === "uk" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"
          }`}
          aria-pressed={lang === "uk"}
        >
          🇺🇦 Українська
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`px-3 py-2 rounded-lg border text-sm ${
            lang === "en" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"
          }`}
          aria-pressed={lang === "en"}
        >
          🇬🇧 English
        </button>
      </div>
    </div>
  );
}
