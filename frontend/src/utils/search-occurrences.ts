/**
 * Функция получения индексов искомой подстроки в строке для поиска
 *
 * @export
 * @param searchStr - искомая строка
 * @param str - оригинальная строка
 * @param [caseSensitive=false] - осуществлять регистронезависимый поиск
 * @returns {number[]} - стартовые индексы в порядке появления искомой подстроки
 */
export default function getIndicesOf(
  searchStr: string,
  str: string,
  caseSensitive = false,
): number[] {
  const searchStrLen = searchStr.length;
  if (searchStrLen === 0) {
    return [];
  }
  let startIndex = 0;
  let index = 0;
  const indices = [];

  while (index > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
    index = (!caseSensitive ? str.toLowerCase() : str).indexOf(
      !caseSensitive ? searchStr.toLowerCase() : searchStr,
      startIndex,
    );
  }
  return indices;
}
