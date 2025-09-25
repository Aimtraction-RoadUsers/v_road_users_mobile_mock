import { jsx as _jsx } from "react/jsx-runtime";
// src/i18n/I18nProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState, } from "react";
const dictionaries = {
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
        sys: {
            applicant: {
                created: "Новий запит від {user} (місць: {seats}).",
                cancelled: "{user} скасував(ла) свою заявку.",
                approved: "Вашу заявку підтверджено. (місць: {seats})",
                declined: "На жаль, вашу заявку відхилено.",
            },
            booking: {
                created: "Бронювання створено. Поїздка #{rideId}.",
                cancelled: {
                    by_driver: "Водій скасував поїздку #{rideId}.",
                    by_passenger: "{user} скасував(ла) участь у поїздці.",
                },
            },
            seats: {
                updated: "Кількість місць змінено: {old} → {new}.",
            },
            payment: {
                requested: "Підтвердьте оплату для поїздки #{rideId}.",
                succeeded: "Оплату отримано (ID: {paymentId}).",
                failed: "Оплата не пройшла. Спробуйте інший метод.",
                refunded: "Гроші повернуто (ID: {paymentId}).",
                timeout: {
                    autocancel: "Не сплачено вчасно — бронювання скасовано.",
                },
            },
            ride: {
                time: {
                    changed: "Час поїздки змінено: {old} → {new}.",
                },
                date: {
                    changed: "Дата поїздки змінена: {old} → {new}.",
                },
                route: { changed: "Маршрут оновлено: {route}." },
                stop: {
                    added: "Додано зупинку: {pickup}.",
                    removed: "Видалено зупинку: {pickup}.",
                },
                pickup: {
                    changed_for_passenger: "Місце пікапу оновлено: {pickup}.",
                },
                price: { changed: "Ціну змінено: {old} → {new}." },
                started: "Поїздку розпочато.",
                paused: "Тимчасова зупинка: {reason}.",
                resumed: "Поїздку відновлено.",
                no_show: {
                    passenger: "Відмічено як No-show.",
                    driver: "Водій не з’явився (No-show).",
                },
                completed: "Поїздку завершено.",
                locked: "Редагування закрито: поїздка починається через {when}.",
            },
            driver: {
                on_the_way: "Водій у дорозі. ETA: {when}.",
                arrived: "Водій на місці пікапу: {pickup}.",
                delay: "Водій затримується на {when}.",
            },
            passenger: {
                at_pickup: "{user} вже на місці пікапу.",
                delay: "{user} затримується на {when}.",
            },
            checklist: {
                required: "Підготуйте: {items}. Перевірка на пікапі.",
            },
            review: {
                request: {
                    driver: "Оцініть водія та поїздку.",
                    passenger: "Оцініть {user}.",
                },
            },
            tip: { requested: "Залишити чайові водієві?" },
            receipt: { issued: "Квитанцію надіслано на email." },
            chat: {
                system: { info: "Системне повідомлення: {text}." },
                attachment: { shared: "Додано вкладення: {filename}." },
            },
            askall: {
                created: "Опитування: {title}. Відповідайте у картці.",
                response_received: "{user} відповів(ла): {summary}.",
                reminder_sent: "Нагадування: опитування «{title}».",
                closed: "Опитування «{title}» закрито.",
            },
            security: {
                phone: { verified: "Телефон підтверджено." },
                id: { verified: "Особу верифіковано." },
                safety: { alert: "Сповіщення безпеки: {text}." },
                report: {
                    submitted: "Ваш звіт прийнято. Ticket: #{id}.",
                },
            },
            capacity: { full: "Всі місця зайнято." },
            waitlist: {
                updated: "Список очікування оновлено: {count}.",
            },
            system: {
                error: {
                    payment: "Помилка оплати: {reason}.",
                    routing: "Не вдалось оновити маршрут. Спробуйте знову.",
                },
                retry: "Повторюємо спробу…",
                resolved: "Проблему усунуто.",
            },
        },
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
        sys: {
            applicant: {
                created: "New request from {user} (seats: {seats}).",
                cancelled: "{user} canceled their request.",
                approved: "Your request was approved. (seats: {seats})",
                declined: "Unfortunately, your request was declined.",
            },
            booking: {
                created: "Booking created. Ride #{rideId}.",
                cancelled: {
                    by_driver: "The driver canceled ride #{rideId}.",
                    by_passenger: "{user} canceled participation in the ride.",
                },
            },
            seats: {
                updated: "Seats updated: {old} → {new}.",
            },
            payment: {
                requested: "Please confirm payment for ride #{rideId}.",
                succeeded: "Payment received (ID: {paymentId}).",
                failed: "Payment failed. Please try another method.",
                refunded: "Payment refunded (ID: {paymentId}).",
                timeout: {
                    autocancel: "Not paid on time — booking canceled.",
                },
            },
            ride: {
                time: { changed: "Ride time changed: {old} → {new}." },
                date: { changed: "Ride date changed: {old} → {new}." },
                route: { changed: "Route updated: {route}." },
                stop: {
                    added: "Stop added: {pickup}.",
                    removed: "Stop removed: {pickup}.",
                },
                pickup: {
                    changed_for_passenger: "Pickup location updated: {pickup}.",
                },
                price: { changed: "Price changed: {old} → {new}." },
                started: "Ride started.",
                paused: "Temporary stop: {reason}.",
                resumed: "Ride resumed.",
                no_show: {
                    passenger: "Marked as no-show.",
                    driver: "Driver did not show up (no-show).",
                },
                completed: "Ride completed.",
                locked: "Editing locked: ride starts in {when}.",
            },
            driver: {
                on_the_way: "Driver is on the way. ETA: {when}.",
                arrived: "Driver is at pickup: {pickup}.",
                delay: "Driver is delayed by {when}.",
            },
            passenger: {
                at_pickup: "{user} is at the pickup.",
                delay: "{user} is delayed by {when}.",
            },
            checklist: {
                required: "Prepare: {items}. Check at pickup.",
            },
            review: {
                request: {
                    driver: "Rate the driver and the ride.",
                    passenger: "Rate {user}.",
                },
            },
            tip: { requested: "Leave a tip for the driver?" },
            receipt: {
                issued: "Receipt has been sent to your email.",
            },
            chat: {
                system: { info: "System message: {text}." },
                attachment: { shared: "Attachment added: {filename}." },
            },
            askall: {
                created: "Survey: {title}. Please respond in the card.",
                response_received: "{user} responded: {summary}.",
                reminder_sent: "Reminder: survey “{title}”.",
                closed: "Survey “{title}” closed.",
            },
            security: {
                phone: { verified: "Phone number verified." },
                id: { verified: "Identity verified." },
                safety: { alert: "Safety alert: {text}." },
                report: {
                    submitted: "Your report has been received. Ticket: #{id}.",
                },
            },
            capacity: { full: "All seats are taken." },
            waitlist: { updated: "Waitlist updated: {count}." },
            system: {
                error: {
                    payment: "Payment error: {reason}.",
                    routing: "Could not update route. Please try again.",
                },
                retry: "Retrying…",
                resolved: "Issue resolved.",
            },
        },
    },
};
const I18nContext = createContext(null);
const LS_KEY = "ru_lang";
export const I18nProvider = ({ children }) => {
    const [lang, setLangState] = useState(() => {
        const saved = (typeof window !== "undefined" &&
            localStorage.getItem(LS_KEY)) ||
            null;
        if (saved === "uk" || saved === "en")
            return saved;
        // стартова евристика: якщо браузер український — uk, інакше en
        if (typeof navigator !== "undefined" &&
            navigator.language.toLowerCase().startsWith("uk"))
            return "uk";
        return "en";
    });
    const setLang = (l) => {
        setLangState(l);
        if (typeof window !== "undefined")
            localStorage.setItem(LS_KEY, l);
        // опціонально: оновлюємо <html lang="">
        if (typeof document !== "undefined")
            document.documentElement.setAttribute("lang", l);
    };
    useEffect(() => {
        if (typeof document !== "undefined")
            document.documentElement.setAttribute("lang", lang);
    }, [lang]);
    const t = useMemo(() => {
        const dict = dictionaries[lang] || {};
        return (key) => dict[key] ?? key;
    }, [lang]);
    const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
    return _jsx(I18nContext.Provider, { value: value, children: children });
};
export const useI18n = () => {
    const ctx = useContext(I18nContext);
    if (!ctx)
        throw new Error("useI18n must be used within I18nProvider");
    return ctx;
};
