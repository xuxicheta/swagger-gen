export function dashToCamel(str: string|undefined): string {
  return str ?
    str
    .replace(/(-[a-z])/g, $1 => $1.toUpperCase().replace('-', ''))
    .replace(/^[a-z]/, s => s.toUpperCase())
    : '';
}
