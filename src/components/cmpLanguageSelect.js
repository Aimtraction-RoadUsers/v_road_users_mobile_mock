import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/features/profile/LanguageSelect.tsx
import { useI18n } from "@/i18n/I18nProvider";
export function LanguageSelect() {
    const { lang, setLang, t } = useI18n();
    return (_jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [_jsx("div", { className: "text-sm font-medium mb-2", children: t("profile.language") }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => setLang("uk"), className: `px-3 py-2 rounded-lg border text-sm ${lang === "uk" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`, "aria-pressed": lang === "uk", children: "\uD83C\uDDFA\uD83C\uDDE6 \u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430" }), _jsx("button", { type: "button", onClick: () => setLang("en"), className: `px-3 py-2 rounded-lg border text-sm ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`, "aria-pressed": lang === "en", children: "\uD83C\uDDEC\uD83C\uDDE7 English" })] })] }));
}
