import { decode } from "js-base64";
import { z } from "zod";
import { DateTime as luxon } from "luxon";

const ZToken = z.object({
  sub: z.string(),
  jti: z.string().uuid(),
  iat: z.coerce
    .number()
    .transform((value) => luxon.fromSeconds(value).toJSDate()),
  UserId: z.coerce.number(),
  UserName: z.string(),
  UserLogin: z.string(),
  exp: z.number().transform((value) => luxon.fromSeconds(value).toJSDate()),
  iss: z.string(),
  aud: z.string(),
});

export type TToken = z.infer<typeof ZToken>;

/**
 * Функция принимает токен JWT, разбивает его на три части, декодирует вторую часть и возвращает
 * декодированное значение в виде объекта JavaScript.
 * @param {string | null} token - JWT-токен для анализа.
 * @returns декодированная полезная нагрузка токена JWT.
 */
export default function jwtParse(token: string | null): TToken | null {
  if (token) {
    const base64UrlText = token.split(".")[1];

    const base64 = decode(base64UrlText);

    const parsedB64 = JSON.parse(base64);

    return ZToken.parse(parsedB64);
  }

  return null;
}
