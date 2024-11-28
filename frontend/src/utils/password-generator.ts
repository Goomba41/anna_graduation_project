/* Интерфейс TypeScript. Он используется для определения типа параметра функции. */
interface IPolicies {
  length: number;
  latinLowercase: {
    enabled: boolean;
  };
  latinUppercase: {
    enabled: boolean;
  };
  numericSymbols: {
    enabled: boolean;
  };
  specialSymbols: {
    enabled: boolean;
  };
}

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numeric = "0123456789";
const special = "!@#$%^&*()_+~|}{[]:;?></=";

/**
 * Функция генерирует случайный пароль заданной длины с заданным количеством строчных, прописных, цифровых и
 * специальных символов.
 * @param {IPolicies} policies - Политики для генерации пароля
 * @returns Строка случайных символов.
 */
export default function generate(
  policies: IPolicies = {
    length: 8,
    latinLowercase: {
      enabled: true,
    },
    latinUppercase: {
      enabled: true,
    },
    numericSymbols: {
      enabled: true,
    },
    specialSymbols: {
      enabled: true,
    },
  },
): string {
  let CharacterSet = "";

  if (policies.latinLowercase.enabled) CharacterSet += alphabet;
  if (policies.latinUppercase.enabled) CharacterSet += alphabetUpper;
  if (policies.numericSymbols.enabled) CharacterSet += numeric;
  if (policies.specialSymbols.enabled) CharacterSet += special;

  if (!CharacterSet) CharacterSet = alphabet + alphabetUpper + numeric;

  let passwordSymbols: string[] = [];
  let password = "";

  for (let i = 0; i < policies.length - 4; i += 1) {
    password += CharacterSet.charAt(
      Math.floor(Math.random() * CharacterSet.length),
    );
  }

  password += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  password += alphabetUpper.charAt(
    Math.floor(Math.random() * alphabetUpper.length),
  );
  password += numeric.charAt(Math.floor(Math.random() * numeric.length));
  password += special.charAt(Math.floor(Math.random() * special.length));

  passwordSymbols = password.split("");

  // алгоритм Фишера-Йетса для перемешивания символов
  let temp: string;
  let j: number;
  for (let i = passwordSymbols.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = passwordSymbols[j];
    passwordSymbols[j] = passwordSymbols[i];
    passwordSymbols[i] = temp;
  }

  password = passwordSymbols.join("");

  return password;
}

/**
 * Функция проверяет надежность пароля, проверяя, содержит ли он менее 8 символов, содержит ли он хотя бы
 * одну строчную букву, одну прописную букву, одну цифру и один специальный символ.
 * @param {string} passString - string - строка пароля для проверки
 * @returns Логическое значение (true - слабый пароль).
 */
export function strengthCheck(passString: string) {
  let weak = false;
  const passSymbols = passString.split("");
  const alphabetS = alphabet.split("");
  const alphabetUpperS = alphabetUpper.split("");
  const numericS = numeric.split("");
  const specialS = special.split("");

  if (passSymbols.length < 8) weak = true;
  if (!passSymbols.filter((value) => alphabetS.includes(value)).length)
    weak = true;
  if (!passSymbols.filter((value) => alphabetUpperS.includes(value)).length)
    weak = true;
  if (!passSymbols.filter((value) => numericS.includes(value)).length)
    weak = true;
  if (!passSymbols.filter((value) => specialS.includes(value)).length)
    weak = true;

  return weak;
}
