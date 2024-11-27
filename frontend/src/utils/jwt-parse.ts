import { Buffer } from 'buffer'

/**
 * Функция принимает токен JWT, разбивает его на три части, декодирует вторую часть и возвращает
 * декодированное значение в виде объекта JavaScript.
 * @param {string | null} token - JWT-токен для анализа.
 * @returns декодированная полезная нагрузка токена JWT.
 */
export default function jwtParse(token: string | null): unknown {
  if (token) {
    const base64Url = token.split('.')[1]
    // ! atob устарел, заменен на Buffer
    // const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // const jsonPayload = decodeURIComponent(
    //   atob(base64)
    //     .split("")
    //     .map((c) => {
    //       const charcode = `00${c.charCodeAt(0).toString(16)}`.slice(-2);
    //       return `%${charcode}`;
    //     })
    //     .join("")
    // );

    const base64 = Buffer.from(base64Url, 'base64').toString()
    return JSON.parse(base64)
  }

  return null
}
