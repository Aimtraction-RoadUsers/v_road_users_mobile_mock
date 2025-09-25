// src/i18n/I18nProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Lang = "uk" | "en";
type Dict = Record<string, string>;
type Dictionaries = Record<Lang, Dict>;

const dictionaries: Dictionaries = {
  uk: {
    "go.nowOrPlan": "Їхати зараз / запланувати",
    "go.hint": "Вкажи звідки і куди, дату й час — ми побудуємо маршрут і підкажемо паркування.",
    from: "Звідки?",
    to: "Куди?",
    "use.my.location": "Моя локація",
    swap: "Поміняти місцями",
    date: "Дата",
    time: "Час",
    "build.route": "Побудувати",
    "choose.mode": "Обери спосіб",
    "share.tip": "Підсадка зазвичай планується на майбутній час",
    "mode.drive": "Їду сам",
    "mode.drive.sub": "Маршрут і паркування",
    "mode.share": "Підсадка",
    "mode.share.sub": "Планова підсадка",
    "mode.taxi": "Таксі",
    "mode.taxi.sub": "Замовити авто",
    "mode.scooter": "Самокат",
    "mode.scooter.sub": "Швидко по місту",
    "parking.near": "Паркування біля",
    recommended: "Рекомендовано",
    "choose.parking": "Обрати паркінг",
    "profile.language": "Мова інтерфейсу",
    "choose.transport.title": "Як поїхати?",
    "choose.transport.desc": "Обери спосіб — доступність залежить від твого маршруту.",
    continue: "Продовжити",
    "availability.available": "Доступно",
    "availability.limited": "Обмежено",
    "availability.na": "Недоступно",
    "availability.checking": "Перевірка…",

    "notes.set_destination": "Вкажіть пункт призначення",
    "notes.scooters_night": "Самокати недоступні вночі",
    "notes.scooters_too_long": "Занадто довга відстань для самоката",
    "notes.share_night_few_drivers": "Вночі менше водіїв для підсадки",
    "notes.taxi_night_longer_eta": "Вночі час подачі довший",

    "carpool.title": "Підсадка",
    "carpool.actions.find": "Знайти поїздку",
    "carpool.actions.create": "Створити поїздку",
    "carpool.sections.passenger": "Мої поїздки",
    "carpool.sections.driver": "Мої оголошення",
    "carpool.sections.saved": "Збережені маршрути",
    "carpool.sections.suggested": "Рекомендовано",
    "carpool.empty.passenger": "Немає активних поїздок",
    "carpool.empty.driver": "Немає активних оголошень",
    "carpool.badge.pending": "Очікує",
    "carpool.badge.confirmed": "Підтверджено",
    "carpool.badge.boarding": "Посадка",
    "carpool.badge.progress": "В дорозі",
    "carpool.badge.completed": "Завершено",
    "carpool.badge.cancelled": "Скасовано",
    "carpool.menu.home": "Дім",
    "carpool.menu.explore": "Огляд",
    "carpool.menu.fav": "Обране",
    "carpool.menu.chats": "Чати",
    "carpool.menu.history": "Історія",

    "carpool.explore.title": "Пошук підсадки",
    "carpool.explore.form.from": "Звідки",
    "carpool.explore.form.to": "Куди",
    "carpool.explore.form.date": "Дата",
    "carpool.explore.form.time": "Час",
    "carpool.explore.form.seats": "Кількість місць",
    "carpool.explore.role.passenger": "Я — пасажир",
    "carpool.explore.role.driver": "Я — водій",
    "carpool.explore.cta.search": "Знайти поїздку",
    "carpool.explore.cta.create": "Створити поїздку",
    "carpool.explore.quick.todayEvening": "Сьогодні ввечері",
    "carpool.explore.quick.tomorrowMorning": "Завтра зранку",
    "carpool.explore.recent.title": "Нещодавні маршрути",
    "carpool.explore.saved.title": "Збережені маршрути",
    "carpool.explore.suggested.title": "Рекомендовані маршрути",

    "sys.applicant.created": "Новий запит від {user} (місць: {seats}).",
    "sys.applicant.cancelled": "{user} скасував(ла) свою заявку.",
    "sys.applicant.approved": "Вашу заявку підтверджено. (місць: {seats})",
    "sys.applicant.declined": "На жаль, вашу заявку відхилено.",

    "sys.booking.created": "Бронювання створено. Поїздка #{rideId}.",
    "sys.booking.cancelled.by_driver": "Водій скасував поїздку #{rideId}.",
    "sys.booking.cancelled.by_passenger": "{user} скасував(ла) участь у поїздці.",

    "sys.seats.updated": "Кількість місць змінено: {old} → {new}.",

    "sys.payment.requested": "Підтвердьте оплату для поїздки #{rideId}.",
    "sys.payment.succeeded": "Оплату отримано (ID: {paymentId}).",
    "sys.payment.failed": "Оплата не пройшла. Спробуйте інший метод.",
    "sys.payment.refunded": "Гроші повернуто (ID: {paymentId}).",
    "sys.payment.timeout.autocancel": "Не сплачено вчасно — бронювання скасовано.",

    "sys.ride.time.changed": "Час поїздки змінено: {old} → {new}.",
    "sys.ride.date.changed": "Дата поїздки змінена: {old} → {new}.",
    "sys.ride.route.changed": "Маршрут оновлено: {route}.",
    "sys.ride.stop.added": "Додано зупинку: {pickup}.",
    "sys.ride.stop.removed": "Видалено зупинку: {pickup}.",
    "sys.ride.pickup.changed_for_passenger": "Місце пікапу оновлено: {pickup}.",
    "sys.ride.price.changed": "Ціну змінено: {old} → {new}.",
    "sys.ride.started": "Поїздку розпочато.",
    "sys.ride.paused": "Тимчасова зупинка: {reason}.",
    "sys.ride.resumed": "Поїздку відновлено.",
    "sys.ride.no_show.passenger": "Відмічено як No-show.",
    "sys.ride.no_show.driver": "Водій не з’явився (No-show).",
    "sys.ride.completed": "Поїздку завершено.",
    "sys.ride.locked": "Редагування закрито: поїздка починається через {when}.",

    "sys.driver.on_the_way": "Водій у дорозі. ETA: {when}.",
    "sys.driver.arrived": "Водій на місці пікапу: {pickup}.",
    "sys.driver.delay": "Водій затримується на {when}.",

    "sys.passenger.at_pickup": "{user} вже на місці пікапу.",
    "sys.passenger.delay": "{user} затримується на {when}.",

    "sys.checklist.required": "Підготуйте: {items}. Перевірка на пікапі.",

    "sys.review.request.driver": "Оцініть водія та поїздку.",
    "sys.review.request.passenger": "Оцініть {user}.",

    "sys.tip.requested": "Залишити чайові водієві?",
    "sys.receipt.issued": "Квитанцію надіслано на email.",

    "sys.chat.system.info": "Системне повідомлення: {text}.",
    "sys.chat.attachment.shared": "Додано вкладення: {filename}.",

    "sys.askall.created": "Опитування: {title}. Відповідайте у картці.",
    "sys.askall.response_received": "{user} відповів(ла): {summary}.",
    "sys.askall.reminder_sent": "Нагадування: опитування «{title}».",
    "sys.askall.closed": "Опитування «{title}» закрито.",

    "sys.security.phone.verified": "Телефон підтверджено.",
    "sys.security.id.verified": "Особу верифіковано.",
    "sys.security.safety.alert": "Сповіщення безпеки: {text}.",
    "sys.security.report.submitted": "Ваш звіт прийнято. Ticket: #{id}.",

    "sys.capacity.full": "Всі місця зайнято.",
    "sys.waitlist.updated": "Список очікування оновлено: {count}.",

    "sys.system.error.payment": "Помилка оплати: {reason}.",
    "sys.system.error.routing": "Не вдалось оновити маршрут. Спробуйте знову.",
    "sys.system.retry": "Повторюємо спробу…",
    "sys.system.resolved": "Проблему усунуто.",
  },

  en: {
    "go.nowOrPlan": "Go now / schedule",
    "go.hint": "Set from/to, date & time — we’ll build a route and suggest parking.",
    from: "From?",
    to: "To?",
    "use.my.location": "My location",
    swap: "Swap",
    date: "Date",
    time: "Time",
    "build.route": "Build",
    "choose.mode": "Choose mode",
    "share.tip": "Ride sharing is usually scheduled for future time",
    "mode.drive": "Drive myself",
    "mode.drive.sub": "Route & parking",
    "mode.share": "Share ride",
    "mode.share.sub": "Planned rideshare",
    "mode.taxi": "Taxi request",
    "mode.taxi.sub": "Request a car",
    "mode.scooter": "Scooter",
    "mode.scooter.sub": "Fast around the city",
    "parking.near": "Parking near",
    recommended: "Recommended",
    "choose.parking": "Choose parking",
    "profile.language": "Interface language",
    "choose.transport.title": "How do you want to go?",
    "choose.transport.desc": "Choose a mode — availability depends on your route.",
    continue: "Continue",
    "availability.available": "Available",
    "availability.limited": "Limited",
    "availability.na": "Not available",
    "availability.checking": "Checking…",

    "notes.set_destination": "Set destination",
    "notes.scooters_night": "Scooters inactive at night",
    "notes.scooters_too_long": "Too long for scooters",
    "notes.share_night_few_drivers": "Fewer rideshare drivers at night",
    "notes.taxi_night_longer_eta": "Longer taxi ETA at night",

    "carpool.title": "Carpool",
    "carpool.actions.find": "Find a ride",
    "carpool.actions.create": "Create ride",
    "carpool.sections.passenger": "My trips",
    "carpool.sections.driver": "My offers",
    "carpool.sections.saved": "Saved routes",
    "carpool.sections.suggested": "Suggested",
    "carpool.empty.passenger": "No active trips",
    "carpool.empty.driver": "No active offers",
    "carpool.badge.pending": "Pending",
    "carpool.badge.confirmed": "Confirmed",
    "carpool.badge.boarding": "Boarding",
    "carpool.badge.progress": "In progress",
    "carpool.badge.completed": "Completed",
    "carpool.badge.cancelled": "Cancelled",
    "carpool.menu.home": "Home",
    "carpool.menu.explore": "Explore",
    "carpool.menu.fav": "Favourite",
    "carpool.menu.chats": "Chats",
    "carpool.menu.history": "History",

    "carpool.explore.title": "Carpool search",
    "carpool.explore.form.from": "From",
    "carpool.explore.form.to": "To",
    "carpool.explore.form.date": "Date",
    "carpool.explore.form.time": "Time",
    "carpool.explore.form.seats": "Seats",
    "carpool.explore.role.passenger": "I’m a passenger",
    "carpool.explore.role.driver": "I’m a driver",
    "carpool.explore.cta.search": "Find a ride",
    "carpool.explore.cta.create": "Create ride",
    "carpool.explore.quick.todayEvening": "Today evening",
    "carpool.explore.quick.tomorrowMorning": "Tomorrow morning",
    "carpool.explore.recent.title": "Recent routes",
    "carpool.explore.saved.title": "Saved routes",
    "carpool.explore.suggested.title": "Suggested routes",

    "sys.applicant.created": "New request from {user} (seats: {seats}).",
    "sys.applicant.cancelled": "{user} canceled their request.",
    "sys.applicant.approved": "Your request was approved. (seats: {seats})",
    "sys.applicant.declined": "Unfortunately, your request was declined.",

    "sys.booking.created": "Booking created. Ride #{rideId}.",
    "sys.booking.cancelled.by_driver": "The driver canceled ride #{rideId}.",
    "sys.booking.cancelled.by_passenger": "{user} canceled participation in the ride.",

    "sys.seats.updated": "Seats updated: {old} → {new}.",

    "sys.payment.requested": "Please confirm payment for ride #{rideId}.",
    "sys.payment.succeeded": "Payment received (ID: {paymentId}).",
    "sys.payment.failed": "Payment failed. Please try another method.",
    "sys.payment.refunded": "Payment refunded (ID: {paymentId}).",
    "sys.payment.timeout.autocancel": "Not paid on time — booking canceled.",

    "sys.ride.time.changed": "Ride time changed: {old} → {new}.",
    "sys.ride.date.changed": "Ride date changed: {old} → {new}.",
    "sys.ride.route.changed": "Route updated: {route}.",
    "sys.ride.stop.added": "Stop added: {pickup}.",
    "sys.ride.stop.removed": "Stop removed: {pickup}.",
    "sys.ride.pickup.changed_for_passenger": "Pickup location updated: {pickup}.",
    "sys.ride.price.changed": "Price changed: {old} → {new}.",
    "sys.ride.started": "Ride started.",
    "sys.ride.paused": "Temporary stop: {reason}.",
    "sys.ride.resumed": "Ride resumed.",
    "sys.ride.no_show.passenger": "Marked as no-show.",
    "sys.ride.no_show.driver": "Driver did not show up (no-show).",
    "sys.ride.completed": "Ride completed.",
    "sys.ride.locked": "Editing locked: ride starts in {when}.",

    "sys.driver.on_the_way": "Driver is on the way. ETA: {when}.",
    "sys.driver.arrived": "Driver is at pickup: {pickup}.",
    "sys.driver.delay": "Driver is delayed by {when}.",

    "sys.passenger.at_pickup": "{user} is at the pickup.",
    "sys.passenger.delay": "{user} is delayed by {when}.",

    "sys.checklist.required": "Prepare: {items}. Check at pickup.",

    "sys.review.request.driver": "Rate the driver and the ride.",
    "sys.review.request.passenger": "Rate {user}.",

    "sys.tip.requested": "Leave a tip for the driver?",
    "sys.receipt.issued": "Receipt has been sent to your email.",

    "sys.chat.system.info": "System message: {text}.",
    "sys.chat.attachment.shared": "Attachment added: {filename}.",

    "sys.askall.created": "Survey: {title}. Please respond in the card.",
    "sys.askall.response_received": "{user} responded: {summary}.",
    "sys.askall.reminder_sent": "Reminder: survey “{title}”.",
    "sys.askall.closed": "Survey “{title}” closed.",

    "sys.security.phone.verified": "Phone number verified.",
    "sys.security.id.verified": "Identity verified.",
    "sys.security.safety.alert": "Safety alert: {text}.",
    "sys.security.report.submitted": "Your report has been received. Ticket: #{id}.",

    "sys.capacity.full": "All seats are taken.",
    "sys.waitlist.updated": "Waitlist updated: {count}.",

    "sys.system.error.payment": "Payment error: {reason}.",
    "sys.system.error.routing": "Could not update route. Please try again.",
    "sys.system.retry": "Retrying…",
    "sys.system.resolved": "Issue resolved.",
  },
};

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);
const LS_KEY = "ru_lang";

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved =
      (typeof window !== "undefined" && (localStorage.getItem(LS_KEY) as Lang)) || null;
    if (saved === "uk" || saved === "en") return saved;
    if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("uk"))
      return "uk";
    return "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, l);
    if (typeof document !== "undefined") document.documentElement.setAttribute("lang", l);
  };

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = dictionaries[lang] || {};
    return (key: string) => dict[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
