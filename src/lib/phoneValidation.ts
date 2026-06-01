/**
 * Автоформатирование российского номера телефона.
 * Всегда возвращает строку в формате +7 (XXX) XXX-XX-XX,
 * автоматически подставляя +7 и ограничивая 11 цифрами.
 */
export function formatRussianPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  let cleaned = digits;

  // Если начинается с 8, заменяем на 7 (российский формат)
  if (cleaned.startsWith("8") && cleaned.length > 1) {
    cleaned = "7" + cleaned.slice(1);
  } else if (cleaned.startsWith("8") && cleaned.length === 1) {
    cleaned = "7";
  } else if (!cleaned.startsWith("7")) {
    // Если вводят цифры без 7/8, считаем, что это номер после +7
    cleaned = "7" + cleaned;
  }

  // Ограничиваем 11 цифрами
  cleaned = cleaned.slice(0, 11);

  // Форматируем
  let result = "+7";
  if (cleaned.length > 1) {
    result += " (" + cleaned.slice(1, 4);
  }
  if (cleaned.length >= 4) {
    result += ") " + cleaned.slice(4, 7);
  }
  if (cleaned.length >= 7) {
    result += "-" + cleaned.slice(7, 9);
  }
  if (cleaned.length >= 9) {
    result += "-" + cleaned.slice(9, 11);
  }

  return result;
}

/**
 * Проверяет, что строка содержит валидный российский номер телефона:
 * +7 и ровно 10 цифр после него (всего 11 цифр, начинается с 7).
 */
export function isValidRussianPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("7") && digits.length === 11;
}

/**
 * Нормализует телефон в формат +79998887766 для отправки на сервер.
 */
export function normalizeRussianPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("7") && digits.length === 11 ? "+" + digits : "";
}
