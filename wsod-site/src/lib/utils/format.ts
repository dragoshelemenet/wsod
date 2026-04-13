export function formatCount(value?: number | null) {
  if (!value) return "0";
  return new Intl.NumberFormat("ro-RO").format(value);
}

export function safeText(value?: string | null) {
  return value?.trim() || "";
}
