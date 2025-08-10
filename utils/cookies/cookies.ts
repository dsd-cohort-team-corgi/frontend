// ############## set cookie ##############

export function setCookie(
  name: string,
  value: string,
  days?: number,
  path: string = "/",
) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=${path}`;
}

// ############## get cookie ##############

export function getCookie(name: string): string | undefined {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(nameEQ));

  return match ? decodeURIComponent(match.substring(nameEQ.length)) : undefined;
}

// ############## delete  cookie ##############

export function removeCookie(name: string, path: string = "/") {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}
