export function safeText(value?: string | null) {
  return value?.trim() || "";
}

export function safeUrl(value?: string | null) {
  return value?.trim() || "";
}

export function formatCount(value?: number | null) {
  if (!value) return "0";
  return new Intl.NumberFormat("ro-RO").format(value);
}

export function clampText(value: string, max = 140) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}…`;
}
