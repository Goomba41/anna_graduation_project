import * as sr from "seedrandom";

// формируем список названий для техники
const naming = [
  "Куница",
  "Бобёр",
  "Боров",
  "Выхухоль",
  "Вымпел",
  "Компас",
  "Огниво",
  "Дуб",
  "Бук",
  "Кедр",
  "Дубрава",
  "Поле",
  "Витязь",
  "Богатырь",
  "Елабуга",
  "Мацеста",
  "Тольятти",
  "Былина",
  "Яков",
  "Изба",
  "Сани",
  "Горница",
  "Тройка",
  "Клевер",
  "Самоцвет",
  "Яхонт",
  "Городничий",
  "Лаванда",
  "Костёр",
  "Скиф",
  "Сказ",
  "Хорунжий",
  "Кушак",
  "Светлица",
  "Луч",
  "Ракета",
  "Знак",
  "Синь",
  "Помощник",
  "Заря",
  "Закат",
  "Буран",
  "Сегмент",
  "Гусли",
  "Лиана",
  "Лань",
  "Скороход",
  "Жимолость",
  "Зубр",
  "Замок",
  "Рапира",
  "Редут",
  "Улей",
  "Пасека",
  "Целина",
  "Полёт",
  "Искра",
  "Старт",
  "Оберег",
  "Блик",
  "Астра",
  "Вега",
  "Красная Звезда",
  "Ленинград",
  "Ода",
  "Амфитон",
  "Радиотехника",
  "Нева",
  "Корвет",
  "Каравелла",
  "Бриг",
  "Барк",
  "Лорта",
  "Кумир",
  "Днепр",
  "Чайка",
  "Мрiя",
  "Ласточка",
  "Сатурн",
  "Юпитер",
  "Спорт",
  "Орион",
  "Пульсар",
  "Феникс",
  "Эстония",
  "Рига",
  "Электрон",
  "Прибой",
  "Орфей",
  "Сириус",
  "Романтика",
  "Электроника",
  "Кливер",
  "Нота",
  "Комета",
  "Илеть",
  "Идель",
  "Сокол",
  "Союз",
  "Олимп",
  "Рапри",
  "Ростов",
  "Орбита",
  "Яуза",
  "Кировец",
  "Абаим-Абанат",
  "Абакан",
  "Абзац",
  "Абонент",
  "Абрикос",
  "Абрис",
  "Абхазия",
  "Авангард",
  "Авария",
  "Август",
  "Авдотка",
  "Аврора",
  "Автобаза",
  "Автограф",
  "Автомат",
  "Автоматизация",
  "Автоматизм",
  "Автономия",
  "Автопокрышка",
  "Автострада",
  "Агава",
  "Агат",
  "Агент",
  "Аглень",
  "Адмиралец",
  "Агона",
  "Адонис",
  "Адрос",
  "Адунок",
  "Адъютант",
  "Азалия",
  "Азарт",
  "Азбука",
  "Азид",
  "Азимут",
  "Азов",
  "Азур",
  "Аист",
  "Аистёнок",
  "Айболит",
  "Айва",
  "Айнет",
  "Айсберг",
  "Айсберг-Разрез",
  "Акация",
  "Аква",
  "Акваланг",
  "Аквамарин",
  "Акваторий",
  "Акватория",
  "Акведук",
  "Аквилон",
  "Акела",
  "Аккорд",
  "Аккумулятор",
  "Аксон",
  "Актай",
  "Актиния",
  "Акула",
  "Акцент",
  "Акция",
  "Акция-П",
  "Алазань",
  "Алан",
  "Алатау",
  "Алдан",
  "Аллея",
  "Аллигатор",
  "Алмаз",
  "Алтаец",
  "Алтаит",
  "Алтай",
  "Алтек",
  "Алтын",
  "Алфавит",
  "Альбатрос",
  "Альт",
  "Альтаир",
  "Альтернатива",
  "Альтиус",
  "Альфа",
  "Альянс",
  "Алыча",
  "Аляй",
  "Амазонка",
  "Амга",
  "Амёба",
  "Аметист",
  "Амулет",
  "Амур",
  "Анабар",
  "Анаконда",
  "Аналог",
  "Анапа",
  "Ангара",
  "Англия",
  "Ангстрем",
  "Андога",
  "Андромеда",
  "Анива",
  "Анис",
  "Анкер",
  "Анод",
  "Анонс",
  "Ансат",
  "Антарес",
  "Антарктида",
  "Антей",
  "Антисвид",
  "Антиснайпер",
  "Антракт",
  "Анчар",
  "Аолл",
  "Аппассионата",
  "Арагви",
  "Аракс",
  "Арал",
  "Арахис",
  "Арбалет",
  "Арбат",
  "Аргон",
  "Аргон-Фтор",
  "Аргонавт",
  "Аргумент",
  "Аргунь",
  "Аргус",
  "Арена",
  "Арка",
  "Аркан",
  "Аркон",
  "Арктика",
  "Армавир",
  "Армат",
  "Армата",
  "Армерия",
  "Арон",
  "Арс",
  "Артек",
  "Артек-Гелиос",
  "Артек-Сириус",
  "Артиллерист",
  "Арфа",
  "Архипелаг",
  "Аспект",
  "Астероид",
  "Астролог",
  "Асфальт",
  "Атака",
  "Атлант",
  "Атлантида",
  "Атлас",
  "Атлет",
  "Атолл",
  "Атом",
  "Аттракцион",
  "Аут",
  "Афалина",
  "Афганит",
  "Ахиллес",
  "Аэробус",
  "Аэрокосмос",
  "Аэрон",
  "Аэрофон",
  "Аякс",
  "Бабочка",
  "Багарий",
  "Багет",
  "Багира",
  "Багульник",
  "База",
  "Базальт",
  "Байгыш",
  "Байкал",
  "Байконур",
  "Байонет",
  "Баклан",
  "Баксанец",
  "Баку",
  "Бал",
  "Балансир",
  "Балашов",
  "Балеринка",
  "Балкан",
  "Балканы",
  "Баллада",
  "Баллиста",
  "Балтика",
  "Балхаш",
  "Бамбук",
  "Банан",
  "Банкер",
  "Бант",
  "Бард",
  "Баргузин",
  "Барий",
  "Баркас",
  "Бармица",
  "Барнаул",
  "Барракуда",
  "Баррикада",
  "Барс",
  "Барсук",
  "Бархан",
  "Барьер",
  "Басня",
  "Бастион",
  "Басурманин",
  "Батрак",
  "Баттерфляй",
  "Бахча",
  "Бахча-У",
  "Баян",
  "Беглянка",
  "Безмолвие",
  "Бейсур",
  "Бекас",
  "Белград",
  "Белка",
  "Белозер",
  "Бентос",
  "Бердыш",
  "Берег",
  "Бережок",
  "Берёза",
  "Берёза-Катанная",
  "Березина",
  "Береста",
  "Берилл",
  "Бериллий",
  "Беркут",
  "Берлога",
  "Берта",
  "Бесстрашие",
  "Бестер",
  "Бета",
  "Бехонда",
  "Бетаир",
  "Бизань",
  "Бинокль",
  "Бизон",
  "Бином",
  "Бион",
  "Бирюза",
  "Бирюса",
  "Битта",
  "Блеск",
  "Блесна",
  "Блок",
  "Блокировка",
  "Бобр",
  "Богомол",
  "Боек",
  "Боец",
  "Бозон",
  "Боксёр",
  "Болид",
  "Большевик",
  "Бомбарда",
  "Бор",
  "Борей",
  "Борец",
  "Борисполь",
  "Борисфен",
  "Борит",
  "Бородач",
  "Борт",
  "Бот",
  "Ботинок",
  "Бра",
  "Брамос",
  "Браслет",
  "Брасс",
  "Брат",
  "Брелок",
  "Брест",
  "Бригантина",
  "Бриз",
  "Бриза",
  "Бриллиант",
  "Брод",
  "Бронза",
  "Броня",
  "Бросок",
  "Брусника",
  "Брусок",
  "Буг",
  "Будка",
  "Буйвол",
  "Буйность",
  "Буквица",
  "Букет",
  "Буклет",
  "Буксир",
  "Булава",
  "Булат",
  "Бумеранг",
  "Бункер",
  "Бункеровка",
  "Бунтарь",
  "Бунтовщик",
  "Бур",
  "Буратино",
  "Буревестник",
  "Бурея",
  "Бурлак",
  "Бурлаки",
  "Бурун",
  "Бурундук",
  "Буря",
  "Буссоль",
  "Бустер",
  "Бутон",
  "Бухта",
  "Буян",
  "Буча",
  "Бычок",
  "Ваза",
  "Вагон",
  "Вайгач",
  "Вал",
  "Валар",
  "Валерия",
  "Вальщик",
  "Вампир",
  "Вант",
  "Ваня",
  "Варан",
  "Варево",
  "Вариант",
  "Варна",
  "Варта",
  "Варшавянка",
  "Варяг",
  "Вахта",
  "Василёк",
  "Веер",
  "Вездесущий",
  "Вездеход",
  "Везувий",
  "Веко",
  "Вектор",
  "Великан",
  "Вена",
  "Венец",
  "Веник",
  "Вепрь",
  "Верба",
  "Вереница",
  "Вереск",
  "Верп",
  "Вертикаль",
  "Вертун",
  "Верхушка",
  "Вершина",
  "Весна",
  "Веста",
  "Вест",
  "Вестерн",
  "Ветер",
  "Ветка",
  "Вето",
  "Веха",
  "Вечный",
  "Вешка",
  "Взлёт",
  "Взломщик",
  "Взмах",
  "Виварий",
  "Видеолокатор-Дозор",
  "Видимость",
  "Визави",
  "Визит",
  "Визир",
  "Викинг",
  "Виконт",
  "Винт",
  "Винторез",
  "Винтук",
  "Виньетка",
  "Виола",
  "Вираж",
  "Вискоза",
  "Висла",
  "Витебск",
  "Витим",
  "Виток",
  "Витрина",
  "Витязь-2000",
  "Вихрь",
  "Вишня",
  "Владимир",
  "Водичка",
  "Водник",
  "Водолей",
  "Водопад",
  "Воевода",
  "Возгонка",
  "Воздух",
  "Воздушный старт",
  "Воин",
  "Вокзал",
  "Волан",
  "Волат",
  "Волга",
  "Волк",
  "Волна",
  "Волнение",
  "Волхов",
  "Вольфрам",
  "Воркута",
  "Ворон",
  "Воронеж",
  "Ворох",
  "Ворчун",
  "Восток",
  "Восторг",
  "Восход",
  "Вощина",
  "Вояж",
  "Впрыск",
  "Вспышка",
  "Встреча",
  "Всход",
  "Вуаль",
  "Вул",
  "Вулкан",
  "Выбор",
  "Выдра",
  "Вызов",
  "Выпь",
  "Вырез",
  "Выруб",
  "Высота",
  "Выстрел",
  "Выхлоп",
  "Вычегда",
  "Вьюга",
  "Вьюн",
  "Вьюшка",
  "Вяз",
  "Гавот",
  "Гагара",
  "Газель",
  "Газетчик",
  "Газон",
  "Гайдук",
  "Гал",
  "Галантерея",
  "Галерея",
  "Галл",
  "Галс",
  "Гамбринус",
  "Гамма",
  "Ганг",
  "Гангутец",
  "Ганимед",
  "Гардения",
  "Гардиан",
  "Гардина",
  "Гармонь",
  "Гарпия",
  "Гарпун",
  "Гарпун-Бал",
  "Гваюла",
  "Гвоздика",
  "Гвоздь",
  "Гейзер",
  "Гектор",
  "Гелий",
  "Генератор",
  "Генетика",
  "Гео",
  "Георгин",
  "Геотон",
  "Геофизика",
  "Геофил",
  "Гепард",
  "Геракл",
  "Герань",
  "Герб",
  "Гербицид",
  "Геркулес",
  "Гермес",
  "Гжель",
  "Гиацинт",
  "Гибка",
  "Гибрид",
  "Гидрограф",
  "Гильза",
  "Гиндукуш",
  "Гиперон",
  "Гиря",
  "Глаз",
  "Глет",
  "Глобус",
  "Глубина",
  "Гневный",
  "Гнейс",
  "Гном",
  "Гоби",
  "Гоблин",
  "Гобой",
  "Годограф",
  "Голец",
  "Голиаф",
  "Голотурия",
  "Голубая акула",
  "Гонец",
  "Горбач",
  "Горгона",
  "Горец",
  "Гориец",
  "Горизонт",
  "Горностай",
  "Горьковчанин",
  "Горка",
  "Горн",
  "Горнист",
  "Город",
  "Горчак",
  "Госпиталь",
  "Граб",
  "Гравий",
  "Град",
  "Градус",
  "Гранат",
  "Гранильщик",
  "Гранит",
  "Граница",
  "Грант",
  "Грань",
  "График",
  "Графит",
  "Грация",
  "Грач",
  "Гребень",
  "Гребешок",
  "Грезы",
  "Гремящий",
  "Гренадер",
  "Гринда",
  "Гриф",
  "Грифель",
  "Грифон",
  "Гроза",
  "Гроздь",
  "Грозный",
  "Гром",
  "Грот",
  "Груша",
  "Губка",
  "Гукол",
  "Гуммит",
  "Гурзуф",
  "Гусар",
  "Гусеница",
  "Гусь",
  "Гюйс",
  "Гюрза",
  "Даль",
  "Дальномер",
  "Дальность",
  "Дамба",
  "Данко",
  "Дань",
  "Дарьял",
  "Даугава",
  "Даурия",
  "Двина",
  "Дебаркадер",
  "Дева",
  "Девиз",
  "Деймос",
  "Дейтерий",
  "Дека",
  "Дельта",
  "Дельфин",
  "Демонстратор",
  "Десерт",
  "Десна",
  "Джейран",
  "Джета",
  "Джиггер",
  "Джигит",
  "Дзержинский",
  "Диабазол",
  "Диагноз",
  "Диагональ",
  "Диалог",
  "Диамант",
  "Диаметр",
  "Диана",
  "Диана-Бурлак",
  "Диез",
  "Диксон",
  "Дилемма",
  "Дилемма-Мста",
  "Дипломант",
  "Дипломат",
  "Дирижёр",
  "Дискрет",
  "Диспетчер",
  "Дистанция",
  "Днестр",
  "Дог",
  "Дождь",
  "Дозор",
  "Дозор-Тюльпан",
  "Долина",
  "Доминанта",
  "Дон-2Н",
  "Дон",
  "Донец",
  "Доспехи",
  "Драгун",
  "Дракон",
  "Дрейф",
  "Дрель",
  "Дренаж",
  "Дрозд",
  "Дротик",
  "Друг",
  "Дружба",
  "Дублёр",
  "Дублон",
  "Дубна",
  "Дуга",
  "Дукат",
  "Дунай",
  "Дуплет",
  "Дурак",
  "Дуск",
  "Дуэль",
  "Дуэт",
  "Дым",
  "Дюгонь",
  "Дюза",
  "Дюна",
  "Дюраль",
  "Дятел",
  "Евразия",
  "Егерь",
  "Егоза",
  "Егорлык",
  "Егорьевск",
  "Единорог",
  "Ежевика",
  "Ёлка",
  "Ель",
  "Енисей",
  "Енот",
  "Ермак",
  "Есаул",
  "Ёж",
  "Ёрш",
  "Жаворонок",
  "Жало",
  "Жасмин",
  "Жгут",
  "Желудь",
  "Жемчуг",
  "Жесть",
  "Жетон",
  "Жизнь",
  "Житель",
  "Житомирец",
  "Жук",
  "Журавль",
  "Журналист",
  "Забайкалье",
  "Забоина",
  "Забой",
  "Забор",
  "Забрало",
  "Завеса",
  "Загадка",
  "Загон",
  "Заколка",
  "Залп",
  "Залив",
  "Залом",
  "Занос",
  "Запад",
  "Запев",
  "Запор-Лиана",
  "Запорожье",
  "Запуск",
  "Зарево",
  "Заречье",
  "Зарница",
  "Заслон",
  "Застава",
  "Затравщик",
  "Захват",
  "Защита",
  "Заявка",
  "Звезда",
  "Звездочка",
  "Звено",
  "Зверобой",
  "Звук",
  "Зебра",
  "Зевс",
  "Земледелие",
  "Земля",
  "Земляника",
  "Зенит",
  "Зеница",
  "Зефир",
  "Зея",
  "Зима",
  "Змея",
  "Зодиак",
  "Зодчий",
  "Зола",
  "Золотой Рог",
  "Зона",
  "Зонд",
  "Зонт",
  "Зонтик",
  "Зоопарк",
  "Зоркий",
  "ЗОТИК",
  "Зрачок",
  "Зуммер",
  "Зыбь",
  "Зяблик",
  "Ива",
  "Иван",
  "Иволга",
  "Игла",
  "Игрушка",
  "Изотоп",
  "Изумруд",
  "Изъятие",
  "Икар",
  "Илим",
  "Иллюминация",
  "Имбирь",
  "Импульс",
  "Инвар",
  "Ингибитор",
  "Ингода",
  "Ингул",
  "Иней",
  "Инжир",
  "Инициатива",
  "Инкас",
  "Инкубатор",
  "Иноходец",
  "Инспектор",
  "Интеграл",
  "Интегратор",
  "Интерьер",
  "Инфауна",
  "Информатор",
  "Иня",
  "Ирбис",
  "Ирис",
  "Иркут",
  "Иркутянин",
  "Иртыш",
  "Иртыш-Амфора",
  "Исеть",
  "Искандер",
  "Искатель",
  "Искорка",
  "Ислочь",
  "Испанка",
  "Исполком",
  "Истра",
  "Исток",
  "Историк",
  "Итиль",
  "Ицыл",
  "Ишим",
  "Кабан",
  "Кабарга",
  "Кабина",
  "Кабрис",
  "Кавказ",
  "Кадмий",
  "Кадр",
  "Казак",
  "Казарка",
  "Казбек",
  "Казуар",
  "Кайман",
  "Кайра",
  "Кактус",
  "Калам",
  "Калибр",
  "Калибровщик",
  "Калина",
  "Калитка",
  "Калкан",
  "Калуга",
  "Кальмар",
  "Кама",
  "Камбала",
  "Камелия",
  "Камера",
  "Камергер",
  "Камчатка",
  "Кан",
  "Канадит",
  "Канал",
  "Канарейка",
  "Канат",
  "Каноэ",
  "Кант",
  "Кантата",
  "Капля",
  "Капрал",
  "Капсула",
  "Капустник",
  "Каралон",
  "Карандашик",
  "Карантин",
  "Карат",
  "Каратель",
  "Каркас",
  "Кармин",
  "Карпаты",
  "Картаун",
  "Картечь",
  "Карусель",
  "Касание",
  "Касательная",
  "Касатка",
  "Каскад",
  "Каста",
  "Кастет",
  "Катер",
  "Катран",
  "Каунас",
  "Каур",
  "Кашалот",
  "Каштан",
  "Квадрат",
  "Квакер",
  "Квант",
  "Кварк",
  "Кварта",
  "Квартал",
  "Квартет",
  "Кварц",
  "Квиток",
  "Кедрач",
  "Кемь",
  "Кентавр",
  "Керамика",
  "Керн",
  "Кернер",
  "Кетмень",
  "Керчь",
  "Кефаль",
  "Кивач",
  "Кивер",
  "Киев",
  "Киль",
  "Кинетика",
  "Кинжал",
  "Кипарис",
  "Кираса",
  "Киров",
  "Кировоград",
  "Кит",
  "Китобой",
  "Китолов",
  "Клаб",
  "Класс",
  "Клевок",
  "Клещ",
  "Клещевина",
  "Клён",
  "Клёст",
  "Климат",
  "Клин",
  "Клинок",
  "Клипер",
  "Клистрон",
  "Клот",
  "Клюква",
  "Ключ",
  "Клякса",
  "Коалиция",
  "Кобальт",
  "Кобра",
  "Кобчик",
  "Ковбой",
  "Кодак",
  "Кодер",
  "Кожимит",
  "Козлик",
  "Кокон",
  "Кола",
  "Колеоптер",
  "Колибри",
  "Колокол",
  "Колокольчик",
  "Колонка",
  "Колос",
  "Колпак",
  "Колчан",
  "Колье",
  "Кольцо",
  "Кольчуга",
  "Колывань",
  "Комар",
  "Комбат",
  "Комдив",
  "Компарус",
  "Комплект",
  "Комплекс",
  "Компонент",
  "Комсомолец",
  "Комфорт",
  "Конверсия",
  "Конденсатор",
  "Конденсор",
  "Кондор",
  "Конкурс",
  "Конотоп",
  "Консоль",
  "Консул",
  "Контакт",
  "Контейнер",
  "Контраст",
  "Контроль",
  "Контур",
  "Конус",
  "Координата",
  "Копьё",
  "Кора",
  "Коралл",
  "Корвет-Севан",
  "Корд",
  "Кордон",
  "Корень",
  "Корзина",
  "Корма",
  "Корнет",
  "Коррида",
  "Корсар",
  "Корт",
  "Кортик",
  "Корунд",
  "Корчага",
  "Коршун",
  "Коршун-Кайра",
  "Косинус",
  "Космос",
  "Космоплан",
  "Космополис",
  "Космотэн",
  "Кочевник",
  "Кочкарь",
  "Кошка",
  "Краб",
  "Крапива",
  "Красавица",
  "Красная звезда",
  "Краснополь",
  "Красуха",
  "Кратер",
  "Креветка",
  "Кредо",
  "Крейсер",
  "Кремний",
  "Кремница",
  "Крестец",
  "Кречет",
  "Крильон",
  "Криптон",
  "Криптоплата",
  "Кристалл",
  "Критик",
  "Крокус",
  "Кромка",
  "Крона",
  "Кронштадт",
  "Кроссинг",
  "Крот",
  "Круг",
  "Крылатый",
  "Крыло",
  "Крым",
  "Крюк",
  "Ксенон",
  "Куб",
  "Кубрик",
  "Кудесник",
  "Кузнечик",
  "Кузов",
  "Кукла",
  "Кукушка",
  "Кулик",
  "Кунашир",
  "Купол",
  "Курган",
  "Курс",
  "Курс-1",
  "Курс-Стрела",
  "Курточка",
  "Курьер",
  "Куст",
  "Кушетка",
  "Лавина",
  "Лавина-Ураган",
  "Лагуна",
  "Лада",
  "Ладога",
  "Ладья",
  "Лаз",
  "Лазурит",
  "Лазурь",
  "Лайнер",
  "Лан",
  "Лангуст",
  "Лангуст-Щука",
  "Ландыш",
  "Ларец",
  "Лариса",
  "Ларри",
  "Ласка",
  "Ласта",
  "Латуш",
  "Лебедка",
  "Лебедь",
  "Лев",
  "Левкой",
  "Легат",
  "Легенда",
  "Ледоруб",
  "Лейка",
  "Лекало",
  "Лена",
  "Ленок",
  "Лента",
  "Леопард",
  "Лесоруб",
  "Леший",
  "Лещ",
  "Ливадия",
  "Ливень",
  "Лига",
  "Лидер",
  "Лидия",
  "Лилипут",
  "Лилия",
  "Линарит",
  "Линда",
  "Линейка",
  "Линза",
  "Линкей",
  "Линь",
  "Лиман",
  "Лимб",
  "Лимонад",
  "Липа",
  "Лира",
  "Лиса",
  "Лист",
  "Лиственница",
  "Листик",
  "Литий",
  "Лифт",
  "Лифтер",
  "Лодка",
  "Лоза",
  "Лоран",
  "Лось",
  "Лот",
  "Лотос",
  "Лохматка",
  "Лоция",
  "Лоцман",
  "Лубок",
  "Луга",
  "Лук",
  "Луна",
  "Лунь",
  "Лучеграф",
  "Люмен",
  "Люнет",
  "Люстра",
  "Лютик",
  "Лягушка",
  "Ляпис",
  "Мавр",
  "Маг",
  "Магистраль",
  "Магма",
  "Магнетит",
  "Магний",
  "Магнит",
  "Магнолия",
  "Магнус",
  "Маис",
  "Майданак",
  "Мак",
  "Маковка",
  "Макрель",
  "Макс",
  "Малахит",
  "Малиновка",
  "Малка",
  "Малолеток",
  "Малыш",
  "Малютка",
  "Манго",
  "Мангуст",
  "Мандат",
  "Манёвр",
  "Манометр",
  "Манта",
  "Манчак",
  "Марал",
  "Марат",
  "Марина",
  "Мария",
  "Марк",
  "Маркер",
  "Марс",
  "Марс-Пассат",
  "Маршрут",
  "Маска",
  "Масштаб",
  "Материк",
  "Маугли",
  "Маховик",
  "Мачта",
  "Машина",
  "Машук",
  "Маяк",
  "Медведица",
  "Медведка",
  "Медведь",
  "Медвежонок",
  "Медея",
  "Межа",
  "Мезень",
  "Мезотрон",
  "Мезофил",
  "Мельник",
  "Метка",
  "Метроном",
  "Меридиан",
  "Мерка",
  "Меркурий",
  "Металлист",
  "Метель",
  "Метелица",
  "Метео",
  "Метеор",
  "Метеорит",
  "Метис",
  "Механизатор",
  "Механизм",
  "Меч",
  "Мечта",
  "Микрон",
  "Мимоза",
  "Мина",
  "Миндаль",
  "Минерал",
  "Минитор",
  "Минотавр",
  "Минск",
  "Минута",
  "Мираж",
  "Мираж-2002",
  "Миротворец",
  "Миус",
  "Миф",
  "Мобот",
  "Модель",
  "Модерн",
  "Модуль",
  "Модуляция",
  "Можаец",
  "Молибден",
  "Молния",
  "Молодец",
  "Молот",
  "Момент",
  "Монерон",
  "Монитор",
  "Монолит",
  "Монолог",
  "Монорельс",
  "Монумент",
  "Море",
  "Морж",
  "Морион",
  "Морской дьявол",
  "Морской змей",
  "Морской лев",
  "Морской старт",
  "Морфей",
  "Моряна",
  "Москва",
  "Москвич",
  "Москит",
  "Мост",
  "Мотив",
  "Мотовоз",
  "Мошкара",
  "Мошкарец",
  "Мрия",
  "Мста-Б",
  "Мста-К",
  "Мста-С",
  "Мулат",
  "Мумия",
  "Мундштук",
  "Муравей",
  "Мурена",
  "Мурена-М",
  "Мурманск",
  "Мурмон",
  "Муссон",
  "Мустанг",
  "Муфлон",
  "Муха",
  "Мыс",
  "Мята",
  "Набла",
  "Наблюдатель",
  "Навага",
  "Навстар",
  "Нагар",
  "Наглазник",
  "Надежда",
  "Надежность",
  "Надфиль",
  "Накат",
  "Накидка",
  "Накладчик",
  "Наклон",
  "Налим",
  "Намётка",
  "Напалм",
  "Напев",
  "Напряжение",
  "Нард",
  "Нарцисс",
  "Наряд",
  "Насадка",
  "Наташа",
  "Натиск",
  "Натурщик",
  "Наука",
  "Нахимовец",
  "Находка",
  "Наяда",
  "Небо",
  "Невидимка",
  "Нежность",
  "Незабудка",
  "Нейтрон",
  "Нельма",
  "Неман",
  "Немезида",
  "Необитаемость",
  "Неон",
  "Непрядва",
  "Нептун",
  "Нерей",
  "Нерка",
  "Нерпа",
  "Нерчинск",
  "Нетто",
  "Неустрашимый",
  "Неясыть",
  "Нива",
  "Нивелир",
  "Низина",
  "Ника",
  "Никель",
  "Нина",
  "Ниобий",
  "Нить",
  "Нихром",
  "Новик",
  "Новелла",
  "Нож",
  "Нокаут",
  "Ноктюрн",
  "Нона",
  "Нора",
  "Норд",
  "Норден",
  "Норматив",
  "Норов",
  "Носитель",
  "Носорог",
  "Ночная фея",
  "Ночной охотник",
  "Ночь",
  "Нурек",
  "Обвалование",
  "Обжимка",
  "Обзор",
  "Облако",
  "Облик",
  "Оболочка",
  "Оборона",
  "Оборотень",
  "Обсерватория",
  "Обувка",
  "Обь",
  "Овал",
  "Овод",
  "Огневой",
  "Огонёк",
  "Огонь",
  "Ограда",
  "Ожерелье",
  "Озеро",
  "Озокерит",
  "Ока",
  "Окаменелость",
  "Океан",
  "Око",
  "Околыш",
  "Окно",
  "Округ",
  "Окружность",
  "Октава",
  "Октан",
  "Окунь",
  "Окуляр",
  "Олень",
  "Оливия",
  "Ольха",
  "Ольхон-СМ",
  "Омар",
  "Омега",
  "Омнибус",
  "Омуль",
  "Онега",
  "Оникс",
  "Опал",
  "Оператор",
  "Оплот",
  "Опушка",
  "Опытный",
  "Орден",
  "Ордер",
  "Оредеж",
  "Орёл",
  "Оренбург",
  "Орех",
  "Орлан",
  "Орлёнок",
  "Орлец",
  "Ороин",
  "Ортопед",
  "Орша",
  "Оса",
  "Осень",
  "Оскол",
  "Осколок",
  "Основа",
  "Осьминог",
  "Ось",
  "Отбор",
  "Отведок-Раскрепощение",
  "Ответ",
  "Отклик",
  "Открытое небо",
  "Отпор",
  "Отрада",
  "Отражатель",
  "Отцепка",
  "Отшельник",
  "Охота",
  "Охотник",
  "Охотск",
  "Охра",
  "Охта",
  "Оценка",
  "Пагода",
  "Пакет",
  "Пал",
  "Палаш",
  "Палинас",
  "Паллада",
  "Палладий",
  "Палтус",
  "Пальма",
  "Памир",
  "Память",
  "Панда",
  "Панорама",
  "Пантера",
  "Пантомима",
  "Панцирь",
  "Папилон",
  "Папуас",
  "Параван",
  "Парашютист",
  "Парис",
  "Пароль",
  "Парсек",
  "Партизан",
  "Партнёр",
  "Парус",
  "Пастель",
  "Пастух",
  "Пат",
  "Патруль",
  "Патрульный",
  "Пахра",
  "Паук",
  "Певек",
  "Пегас",
  "Пегматит",
  "Пекин",
  "Пеламида",
  "Пелена",
  "Пеленг",
  "Пеликан",
  "Пенал",
  "Пение",
  "Перевал",
  "Перевозчик",
  "Периметр",
  "Перископ",
  "Перманент",
  "Пермячка",
  "Пернач",
  "Перо",
  "Персей",
  "Персона",
  "Перунит",
  "Перфоратор",
  "Перчик",
  "Пестунья",
  "Печенег",
  "Печора",
  "Пика",
  "Пилон",
  "Пилот",
  "Пингвин",
  "Пион",
  "Пионер",
  "Пирамида",
  "Пиранья",
  "Пирит",
  "Пировидикон",
  "Пирс",
  "Пихта",
  "Пицунда",
  "Пищаль",
  "Плавник",
  "Плавск",
  "Плазма",
  "Пламенный",
  "Пламя",
  "Планер",
  "Планета",
  "Планшет",
  "Пласт",
  "Пластун",
  "Платан",
  "Платина",
  "Платформа",
  "Плахпет",
  "Плед",
  "Плиса",
  "Плитка",
  "Плот",
  "Плутон",
  "Плутоний",
  "Победа",
  "Побратим",
  "Повозка",
  "Погода",
  "Погреб",
  "Подача",
  "Подберёзовик",
  "Подвал",
  "Подвязка",
  "Подгруппа",
  "Подзаголовок",
  "Подкат",
  "Подкидыш",
  "Поднос",
  "Подснежник",
  "Подснежник—Ветер",
  "Подсолнух",
  "Подъём",
  "Позитив",
  "Позитрон",
  "Позумент",
  "Поиск",
  "Пойма",
  "Полигон",
  "Полином",
  "Полимент",
  "Полоса",
  "Полуфинал",
  "Полюс",
  "Поляна",
  "Поморник",
  "Пончо",
  "Попадание",
  "Поплавок",
  "Попрыгунья",
  "Пори",
  "Поручик",
  "Посадка",
  "Пословица",
  "Пособие",
  "Посол",
  "Посох",
  "Посредник",
  "Посыльной",
  "Поток",
  "Пояс",
  "Президент",
  "Премьер",
  "Прибор",
  "Привет",
  "Привод",
  "Приз",
  "Призма",
  "Призыв",
  "Прикол",
  "Прима",
  "Приморец",
  "Приоритет",
  "Припять",
  "Природа",
  "Приставка",
  "Приток",
  "Притон",
  "Прицеп",
  "Причал",
  "Проба",
  "Проворный",
  "Прогноз",
  "Программа",
  "Прогрев",
  "Прогресс",
  "Прожектор",
  "Прозаик",
  "Пролив",
  "Прометей",
  "Проминь",
  "Проня",
  "Проран",
  "Прорыв",
  "Просвет",
  "Просветитель",
  "Простор",
  "Протва",
  "Противник",
  "Протей",
  "Протектор",
  "Протон",
  "Прыжок",
  "Пузырь",
  "Пума",
  "Пурга",
  "Пурпур",
  "Путанка",
  "Путь",
  "Пчела",
  "Пчёлка",
  "Пятёрка",
  "Равелин",
  "Равнодушие",
  "Радаль",
  "Радар",
  "Радиан",
  "Радий",
  "Радикал",
  "Радиобарьер",
  "Радиоград",
  "Радиолуч",
  "Радиус",
  "Радон",
  "Радуга",
  "Радуга-Борт",
  "Разбег",
  "Разбежка",
  "Разрыв",
  "Ракита",
  "Ракурс",
  "Ракушка",
  "Рама",
  "Рамка",
  "Рампа",
  "Рангоут",
  "Ранец",
  "Ранжир",
  "Рапан",
  "Раскат",
  "Рассвет",
  "Рассказ",
  "Раструб",
  "Ратник",
  "Рвя",
  "Реактавр",
  "Реалия",
  "Ребекка",
  "Ребус",
  "Ревень",
  "Регата",
  "Редан",
  "Редут (Редут-40, Редут-41)",
  "Режим",
  "Резвый",
  "Резеда",
  "Резистор",
  "Резонанс",
  "Резонер",
  "Резчик",
  "Резюме",
  "Рейд",
  "Рейд-И",
  "Рейс",
  "Река",
  "Рекорд",
  "Рекордсмен",
  "Рекрут",
  "Реликвия",
  "Реликт",
  "Рельеф",
  "Реостат",
  "Репер",
  "Репетитор",
  "Репетиция",
  "Ресурс",
  "Рефлекс",
  "Рефрен",
  "Речник",
  "Речь",
  "Рея",
  "Ривьера",
  "Рикша",
  "Ринг",
  "Рион",
  "Риони",
  "Рист",
  "Ритм",
  "Риф",
  "Рица",
  "Робот",
  "Рогатка",
  "Роговица",
  "Родон",
  "Родонит",
  "Родина",
  "Родиола",
  "Родник",
  "Роза",
  "Рой",
  "Рокот",
  "Роман",
  "Ромашка",
  "Ромб",
  "Россиянка",
  "Росомаха",
  "Росток",
  "Роса",
  "Росич",
  "Рось",
  "Ротор",
  "Роульс",
  "Ртуть",
  "Рубеж",
  "Рубероид",
  "Рубин",
  "Рубидий",
  "Рубикон",
  "Рубка",
  "Руза",
  "Руина",
  "Румб",
  "Русалка",
  "Русич",
  "Руслан",
  "Русь",
  "Рута",
  "Ручей",
  "Рым",
  "Рысак",
  "Рысь",
  "Рычаг",
  "Рябина",
  "Сабля",
  "Саван",
  "Садко",
  "Садовница",
  "Сажем",
  "Саженец",
  "Сажень",
  "Сазан",
  "Сайга",
  "Сайгак",
  "Салгир",
  "Салют",
  "Саман",
  "Самодержец",
  "Самум",
  "Самшит",
  "Сангвин",
  "Сандал",
  "Санитар",
  "Сантиметр",
  "Саня",
  "Сапер",
  "Сапсан",
  "Сапфир",
  "Сарган",
  "Сармат",
  "Сарыч",
  "Сафари",
  "Сахалин",
  "Сахароза",
  "Сачок",
  "Саяны",
  "Сбор",
  "Сборка",
  "Свет",
  "Светлана",
  "Светляк",
  "Светоч",
  "Свеча",
  "Свинец",
  "Свиристелка",
  "Свирь",
  "Свитязь",
  "Свияга",
  "Свод",
  "Свод-Встреча",
  "Связка",
  "Сдвиг",
  "Сдержанный",
  "Север",
  "Северок",
  "Северянка",
  "Сезон",
  "Секрет",
  "Секунда",
  "Секция",
  "Селен",
  "Селена",
  "Селигер",
  "Сельсин",
  "Сёмга",
  "Сенеж",
  "Серия",
  "Серна",
  "Серпей",
  "Сетка",
  "Сеть",
  "Сжатие",
  "Сибирь",
  "Сибиряк",
  "Сиваш",
  "Сивуч",
  "Сигма",
  "Сигнал",
  "Сизяк",
  "Сила",
  "Силуэт",
  "Симбир",
  "Символ",
  "Символизм",
  "Симфония",
  "Синева",
  "Синица",
  "Синичка",
  "Синтез",
  "Синус",
  "Синяя птица",
  "Сирена",
  "Сирень",
  "Система",
  "Сич",
  "Скала",
  "Скальп",
  "Скальпель",
  "Скаляр",
  "Скат",
  "Скафандр",
  "Скворец",
  "Скип",
  "Скоба",
  "Скол",
  "Скопа",
  "Скорость",
  "Скорпион",
  "Скосок",
  "Скрежет",
  "Скрытность",
  "Скумбрия",
  "Славутич",
  "Славянка",
  "Сланец",
  "След",
  "Слепень",
  "Слепок",
  "Слива",
  "Слойка",
  "Слон",
  "Смальта",
  "Смежник",
  "Смельчак",
  "Смелый",
  "Смерч",
  "Смерш",
  "Смета",
  "Смоква",
  "Смола",
  "Снайпер",
  "Снег",
  "Снегирь",
  "Снежинка",
  "Соболь",
  "Соболятник",
  "Сова",
  "Совершенствование",
  "Советник",
  "Сода",
  "Согжой",
  "Сож",
  "Созвездие",
  "Созидание",
  "Сойка",
  "Сокол-М",
  "Солнце",
  "Солнцепёк",
  "Соловей",
  "Сом",
  "Соната",
  "Сопка",
  "Сорбция",
  "Сорока",
  "Сосна",
  "Сосник",
  "Сотка",
  "Спасатель",
  "Спектр",
  "Спин",
  "Спираль",
  "Спичка",
  "Сплав",
  "Спринт",
  "Спринтер",
  "Спрут",
  "Спрут-Тунец",
  "Спутник",
  "Ставрополь",
  "Стадион",
  "Сталинград",
  "Сталкер",
  "Стандарт",
  "Статор",
  "Статус",
  "Стационар",
  "Створ",
  "Стеллит",
  "Степь",
  "Стерегущий",
  "Стереоскоп",
  "Стерх",
  "Стефанит",
  "Стилет",
  "Столб",
  "Страж",
  "Стражник",
  "Стратосфера",
  "Стрекоза",
  "Стрела",
  "Стрелец",
  "Стрелка",
  "Стрелок",
  "Стремнина",
  "Стриж",
  "Строй",
  "Структура",
  "Струна",
  "Стугна",
  "Стукалка",
  "Судья",
  "Сумрак",
  "Суперкопье",
  "Сура",
  "Сургут",
  "Сурок",
  "Сухогруз",
  "Сухожилие",
  "Сухона",
  "Суша",
  "Сфера",
  "Сыч",
  "Сюжет",
  "Сюрприз",
  "Табор",
  "Табун",
  "Таволга",
  "Тавр",
  "Тайга",
  "Тайфун",
  "Талас",
  "Таллин",
  "Тамань-База",
  "Тамир",
  "Танаис",
  "Тангаж",
  "Тандем",
  "Танин",
  "Танкер",
  "Танкист",
  "Тантал",
  "Тапир",
  "Таран",
  "Тарантул",
  "Тарзан",
  "Тарту",
  "Татра",
  "Татьяна",
  "Тверь",
  "Текон",
  "Телескоп",
  "Тембр",
  "Темп",
  "Темп-С",
  "Темп-2С",
  "Темрюк",
  "Тендер",
  "Тепло",
  "Терек",
  "Терилен",
  "Терм",
  "Терминатор",
  "Термит",
  "Термостат",
  "Терра",
  "Терра-3",
  "Терция",
  "Терьер",
  "Тесла",
  "Тестер",
  "Тетис",
  "Тетра",
  "Тигр",
  "Тинтро",
  "Типчак",
  "Тиски",
  "Тисс",
  "Титан",
  "Титанит",
  "Тишина",
  "Тобол",
  "Ток",
  "Тон",
  "Тонус",
  "Топаз",
  "Топограф",
  "Тополь",
  "Тор",
  "Торец",
  "Торий",
  "Торнадо",
  "Торос",
  "Торф",
  "Тотем",
  "Точка",
  "Травматизм",
  "Тракт",
  "Трал",
  "Транспорт",
  "Трансформатор",
  "Трап",
  "Трапеция",
  "Трасса",
  "Траст",
  "Требование",
  "Тревога",
  "Трезубец",
  "Трезубка",
  "Трель",
  "Треугольник",
  "Триада",
  "Тритон",
  "Триумф",
  "Тройник",
  "Трон",
  "Трона",
  "Тропа",
  "Тропик",
  "Трос",
  "Тростник",
  "Труба",
  "Трюм",
  "Тубус",
  "Тукан",
  "Тулей",
  "Тулома",
  "Тулумбас",
  "Туляк",
  "Туман",
  "Тунгуска",
  "Тунджа",
  "Тундра",
  "Тур",
  "Тура",
  "Турболёт",
  "Турель",
  "Туча",
  "Тюлень",
  "Тюльпан",
  "Тюльпанчик",
  "Угломер",
  "Угол",
  "Угорь",
  "Угра",
  "Угроза",
  "Уда",
  "Удав",
  "Удар",
  "Уж",
  "Ужгородец",
  "Узел",
  "Узор",
  "Укол",
  "Украина",
  "Украшение",
  "Улан",
  "Улыбка",
  "Улугбек",
  "Унжа",
  "Универсал",
  "Унисон",
  "Ураган",
  "Ураган-Торнадо",
  "Урал",
  "Уралец",
  "Уран",
  "Урга",
  "Уренгой",
  "Уровень",
  "Успех",
  "Устойчивость",
  "Утёс",
  "Утес",
  "Утка",
  "Утро",
  "Уфа",
  "Ушат",
  "Уют",
  "Фаворит",
  "Фагот",
  "Фаза",
  "Фазан",
  "Фазом",
  "Факел",
  "Фактория",
  "Фаланга",
  "Фальцет",
  "Фантасмагория",
  "Фантаст",
  "Фара",
  "Фараон",
  "Фартук",
  "Фасоль",
  "Фаста",
  "Фата",
  "Фауна",
  "Фиалка",
  "Фианит",
  "Фидин",
  "Физик",
  "Фикус",
  "Филин",
  "Фильтр",
  "Финист",
  "Фитафтора",
  "Флаг",
  "Флагман",
  "Фламинго",
  "Флейта",
  "Флер",
  "Флокс",
  "Фобос",
  "Фон",
  "Фонтан",
  "Формат",
  "Форос",
  "Форпост",
  "Форт",
  "Фортуна",
  "Форум",
  "Фосфор",
  "Фот",
  "Фотон",
  "Фотохроника",
  "Фракция",
  "Фрам",
  "Фрегат",
  "Фрегат-Корвет",
  "Фтор",
  "Фугас",
  "Фуи",
  "Фундамент",
  "Фуникулер",
  "Фургон",
  "Фуркс",
  "Фуркэ",
  "Фурнитура",
  "Фут",
  "Халзан",
  "Харза",
  "Хариус",
  "Харьковчанка",
  "Хашим",
  "Хвоя",
  "Херсон",
  "Хибины",
  "Хитин",
  "Хищник",
  "Хмель",
  "Хобот",
  "Ход",
  "Холм",
  "Холод",
  "Хоста",
  "Хризантема",
  "Хром",
  "Хрусталь",
  "Цвет",
  "Цезарь",
  "Цезий",
  "Цейхвахтер",
  "Целик",
  "Центавр",
  "Центр",
  "Центурион",
  "Цербер",
  "Цех",
  "Цикада",
  "Циклоида",
  "Циклон",
  "Циклоп",
  "Цилиндр",
  "Циния",
  "Циркон",
  "Цитадель",
  "Цитран",
  "Цифра",
  "Цунами",
  "Чажма",
  "Чайка-М",
  "Чайка-Стремнина",
  "Чакра",
  "Чардаш",
  "Чародейка",
  "Чебак",
  "Челнок",
  "Черёмуха",
  "Черешня",
  "Чёрная акула",
  "Черника",
  "Чернила",
  "Черноморец",
  "Чернослив",
  "Чёрный орёл",
  "Чибис",
  "Чилим",
  "Чинара",
  "Чирок",
  "Чита",
  "Чукотка",
  "Чусовая",
  "Шайба",
  "Шайтан",
  "Шалаш",
  "Шалун",
  "Шаман",
  "Шар",
  "Шатер",
  "Шахин",
  "Шахматист",
  "Шексна",
  "Шелонь",
  "Шельф",
  "Шептало",
  "Шест",
  "Шилка",
  "Шилд",
  "Шиповник",
  "Шиповник-Аэро",
  "Ширас",
  "Широта",
  "Шишок",
  "Шквал",
  "Шкерт",
  "Шкот",
  "Шлагбаум",
  "Шланг",
  "Шлем",
  "Шлюз",
  "Шмель",
  "Шнур",
  "Шойга",
  "Шомпол",
  "Шорох",
  "Шпага",
  "Шпиль",
  "Шрапнель",
  "Штаг",
  "Штиль",
  "Штопор",
  "Штора",
  "Штурвал",
  "Шторм",
  "Штурм",
  "Штык",
  "Штырь",
  "Шушун",
  "Щель",
  "Щит",
  "Щука",
  "Эвкалипт",
  "Эврика",
  "Эдельвейс",
  "Экватор",
  "Экран",
  "Эксперт",
  "Экспресс",
  "Элерон",
  "Элерон-3",
  "Элерон-10",
  "Эллипс",
  "Эллипсоид",
  "Эльбрус",
  "Эльф",
  "Эмба",
  "Эмблема",
  "Энвис",
  "Эней",
  "Энергия",
  "Эполет",
  "Эпос",
  "Эпрон",
  "Эра",
  "Эрдоган",
  "Эрика",
  "Эрстед",
  "Эспадрон",
  "Эсса",
  "Эталон",
  "Этнография",
  "Эфа",
  "Эфир",
  "Эхо",
  "Эшелон",
  "Юг",
  "Юкон",
  "Юла",
  "Юлия",
  "Юнга",
  "Яблоко",
  "Яблоня",
  "Явор",
  "Ягуар",
  "Яд",
  "Ядро",
  "Як",
  "Якорь",
  "Ямайка",
  "Ямал",
  "Яна",
  "Январец",
  "Янтарь",
  "Яр",
  "Ярославец",
  "Ярс",
  "Ярус",
  "Ясень",
  "Ястреб",
  "Ястреб-Топаз",
  "Ястребок",
  "Ятаган",
  "Яхта",
  "Ячмень",
  "Яшма",
  "Ящерица",
];

// список характеристик
const spec_list = [
  "Универсальная",
  "Специальная",
  "Защищённая",
  "Ударостойкая",
  "Всепогодная",
  "Малошумная",
  "Малогабаритная",
  "Скоростная",
  "Криптозащищённая",
  "Базовая",
  "Двухсекционная",
  "Единая",
  "Коммуникационная",
  "Интеграционная",
  "Переносная",
  "Энергоэффективная",
  "Перспективная",
  "Бронированная",
  "Мультикомпонентная",
  "Портативная",
  "Криптостойкая",
  "Экономичная",
  "Документальная",
  "Корпоративная",
  "Поисковая",
  "Автоматизированная",
  "Лингвистическая",
  "Функциональная",
  "Вычислительная",
  "Производственная",
  "Настольная",
  "Распределенная",
  "Файл-серверная",
  "Клиент-серверная",
  "Двухзвенная",
  "Автоматическая",
  "Ручная",
  "Компьютерная",
  "Справочная",
  "Экономическая",
  "Решающая",
  "Персональная",
  "Групповая",
  "Единая",
  "Государственная",
  "Муниципальная",
  "Областная",
  "Федеральная",
  "Налоговая",
  "Технологическая",
];

/**
 * Эта функция TypeScript для генерации уникального русского нейминга.
 * @returns новую строку с именем системы
 */
export default function nameSystem(): string[] {
  const now = new Date();
  const seed = sr.alea(now.toDateString());
  const rn = Math.ceil(seed.quick() * naming.length);

  const name = naming[rn];

  const list = structuredClone(spec_list);

  // переменные для итогового текста и аббревиатуры
  let final = "";
  let final_short = "";

  // случайным образом получаем количество букв в аббревиатуре
  const count_num = Math.ceil(seed.quick() * 4);
  let spec_rands: Set<number> | number[] = [];

  for (let i = 0; i <= count_num; i++) {
    const sseed = sr.alea(`${now.toDateString()} ${i}`);
    const srn = Math.ceil(sseed.quick() * list.length);
    spec_rands.push(srn);
  }

  spec_rands = new Set([...spec_rands]);

  for (const number of spec_rands) {
    // добавляем характеристику с этим номером в список
    final = `${final} ${list[number - 1]}`;
    // добавляем букву к аббревиатуре
    final_short = final_short + Array.from(list[number - 1])[0];
  }

  const number = Math.ceil(seed.quick() * 99);

  return [
    final,
    `${final} информационная система «ИС ${name}-${final_short}-${number}»`,
    `${name}-${final_short}-${number}`,
  ];
}
