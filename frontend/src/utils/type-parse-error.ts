import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

import toast from "./toast";

export default function callParseErrorToast(
  error: unknown,
  style: "warn" | "error" = "error",
): void {
  if (error instanceof ZodError) {
    const validationError = fromError(error);
    toast("Невозможно проверить данные", validationError.toString(), style);
    console.error(validationError.toString());
  } else if (error instanceof Error) {
    toast("Ошибка", error.message, "error");
  } else if (typeof error === "string") {
    toast("Ошибка", error, "error");
  } else {
    toast("Ошибка", "Неизвестная ошибка", "error");
  }
}
