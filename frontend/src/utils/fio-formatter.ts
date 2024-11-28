/**
 * Функция принимает полное имя в качестве входных данных, анализирует его для извлечения имени и
 * фамилии и возвращает отформатированную строку. Если ввод пуст, он
 * возвращает строку по умолчанию.
 * @param {string} fio - Параметр `fio` представляет собой строку, представляющую полное имя человека в
 * формате «Фамилия Имя Отчество».
 * @returns Функция `fioParse` возвращает строку, содержащую второе и третье слова входной строки
 * `fio`, разделенные пробелом. Если входная строка пуста или содержит только одно слово, функция
 * возвращает строку «Безымянный пользователь» (что в переводе с русского означает «Безымянный
 * пользователь»).
 */
export default function fioParse(
  fio: string,
  mode: {
    f: { enabled: boolean; short: boolean };
    i: { enabled: boolean; short: boolean };
    o: { enabled: boolean; short: boolean };
  } = {
    f: { enabled: true, short: false },
    i: { enabled: false, short: true },
    o: { enabled: false, short: true },
  },
) {
  const fioParsed = fio.trim().split(" ");

  let f = "";
  let i = "";
  let o = "";

  if (mode.f.enabled) {
    f = fioParsed[0];

    if (mode.f.short) f = `${f.charAt(0)}.`;
  }

  if (mode.i.enabled || fioParsed[1] !== undefined) {
    i = fioParsed[1];

    if (mode.i.short && i?.length) i = `${i.charAt(0)}.`;
  }

  if (mode.o.enabled || fioParsed[2] !== undefined) {
    o = fioParsed[2];

    if (mode.o.short && o?.length) o = `${o.charAt(0)}.`;
  }

  const result = fioParsed.length
    ? `${f} ${i ?? ""}${mode.i.enabled && mode.i.short && fioParsed[1] !== undefined && mode.o.enabled && mode.o.short && fioParsed[2] !== undefined ? "" : " "}${o ?? ""}`.trim()
    : "Безымянный пользователь";
  return result;
}
