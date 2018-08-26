export function dns1123 (string) {
  return string.toLowerCase().replace(/[^a-z0-9]/g, "-").substring(0, 63);
}
