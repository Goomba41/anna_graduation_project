/**
 * Преобразование словаря из параметров и их значений в строку параметров запроса
 * @param query - { [ключ: строка]: любой }
 * @returns Строка параметров запроса вида "?param=value&param=value..."
 */
export default function getQueryString(query: {
  [key: string]: unknown;
}): string {
  let queryString = "";
  const queryParams = Object.keys(query);

  if (queryParams.length) {
    queryString = "";
    let addedCount = 0;

    for (const key of queryParams) {
      const prefix: string = `${addedCount === 0 ? "?" : "&"}`;

      if (query[key] !== null && query[key] !== undefined) {
        queryString += `${prefix}${key}=${query[key]}`;
        addedCount += 1;
      }
    }
  }

  return queryString;
}
