/**
 * Функция получения индексов искомой подстроки в строке для поиска
 *
 * @export
 * @param {string} searchStr - искомая строка
 * @param {string} str - оригинальная строка
 * @param {boolean} [caseSensitive=false] - осуществлять регистронезависимый поиск
 * @returns {number[]} - стартовые индексы в порядке появления искомой подстроки
 */
export default function getIndicesOf(
  searchStr: string,
  str: string,
  caseSensitive: boolean = false,
): number[] {
  const searchStrLen = searchStr.length
  if (searchStrLen == 0) {
    return []
  }
  let startIndex = 0,
    index = 0
  const indices = []
  if (!caseSensitive) {
    str = str.toLowerCase()
    searchStr = searchStr.toLowerCase()
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index)
    startIndex = index + searchStrLen
  }
  return indices
}
