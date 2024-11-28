/**
 * Преобразователь телефонного номера к формату
 *
 * Он принимает строку или число, удаляет все нечисловые символы, разбивает строку на запятые, пробелы
 * и другие символы, а затем возвращает строку с номером телефона в формате +7 (123) 456-78-90 доб. 0000
 * @param {string | number} value - строка | число - значение для анализа.
 */
export default function phoneParse(value: string | number): string {
  if (value) {
    let numbers = (typeof value === "number" ? value.toString() : value)
      .trim()
      .replace(/\) /g, "")
      .replace(/ \(/g, "")
      .replace(/, /g, ",")
      .replace(/[ ]+/g, ",")
      .replace(/[^0-9,]/g, "")
      .split(",");
    numbers = numbers.map((number: string) => number.trim());
    numbers = numbers.join(" ").split(" ");

    numbers = numbers.map((number: string) => {
      const cleaned = number.replace(/\D/g, "");
      const match =
        cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{2})(\d{2})(\d{0,4})?$/) ||
        cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{0,4})?$/);
      if (match && match?.length === 7) {
        const code = match[1] ? `+${match[1]}` : "+7";
        const additional = match[6] ? ` доб. ${match[6]}` : "";
        return `${code} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}${additional}`;
      }
      if (match && match?.length === 5) {
        const code = "+7";
        const additional = match[4] ? ` доб. ${match[4]}` : "";
        return `${code} (---) -${match[1]}-${match[2]}-${match[3]}${additional}`;
      }
      return cleaned;
    });

    return numbers.join(", ");
  }

  return "";
}
