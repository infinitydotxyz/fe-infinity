export function toTwitterHandle(url: string) {
  return url.split('/').pop();
}
