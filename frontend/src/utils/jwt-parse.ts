import { decode } from "js-base64";

/**
 * Функция принимает токен JWT, разбивает его на три части, декодирует вторую часть и возвращает
 * декодированное значение в виде объекта JavaScript.
 * @param {string | null} token - JWT-токен для анализа.
 * @returns декодированная полезная нагрузка токена JWT.
 */
export default function jwtParse(token: string | null): unknown {
  if (token) {
    const base64UrlText = token.split(".")[1];

    const base64 = decode(base64UrlText);
    return JSON.parse(base64);
  }

  return null;
}
