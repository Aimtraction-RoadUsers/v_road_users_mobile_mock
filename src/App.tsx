

import { I18nProvider } from "./I18nProvider"; // <── ось імпорт
import AppRouter from "./rAppRouter";


export default function App() {
  return (
    <I18nProvider>
      <AppRouter />
    </I18nProvider>
  );
}