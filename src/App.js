import { jsx as _jsx } from "react/jsx-runtime";
import { I18nProvider } from "./I18nProvider"; // <── ось імпорт
import AppRouter from "./rAppRouter";
export default function App() {
    return (_jsx(I18nProvider, { children: _jsx(AppRouter, {}) }));
}
