// ФОРМУЛА ПРОВЕРКИ ИНН ПО КОНТРОЛЬНОМУ ЧИСЛУ (для юридических лиц 10 знаков)
// n10 == (((2*n1 + 4*n2 + 10*n3 + 3*n4 + 5*n5 + 9*n6 + 4*n7 + 6*n8 + 8*n9) mod 11) mod 10)
export default function taxIdCheck(id: string): boolean {
  let idNumbers: number[] = []

  try {
    idNumbers = id.split('').map((item) => parseInt(item, 10))
  } catch (er) {
    console.error(er)
    return false
  }

  if (idNumbers.length !== 10) return false

  const magicNumber =
    ((2 * idNumbers[0] +
      4 * idNumbers[1] +
      10 * idNumbers[2] +
      3 * idNumbers[3] +
      5 * idNumbers[4] +
      9 * idNumbers[5] +
      4 * idNumbers[6] +
      6 * idNumbers[7] +
      8 * idNumbers[8]) %
      11) %
    10
  if (magicNumber === idNumbers[9]) {
    return true
  }

  return false
}
