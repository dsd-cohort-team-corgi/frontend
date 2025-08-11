import { removeCookie, getCookie, setCookie } from "./cookies";
import { cookieMappings } from "@/utils/cookies/CookiesMapFromAuth";

export function deleteUserInfoCookies() {
  cookieMappings.forEach(({ cookieName }) => {
    removeCookie(cookieName);
  });
}

export function getUserInfoFromCookies(): Partial<AuthDetailsType> {
  const userInfo: Partial<AuthDetailsType> = {};

  cookieMappings.forEach(({ key, cookieName }) => {
    const value = getCookie(cookieName);
    if (value !== undefined) {
      switch (key) {
        case "hasCompletedAuthCheck":
          userInfo.hasCompletedAuthCheck = Boolean(value);
          break;
        default:
          // For safety, assign string value for other keys (shouldn't hit here)
          userInfo[key] = value;
          break;
      }
    }
  });

  return userInfo;
}

export function setUserInfoCookies(userInfo: AuthDetailsType, days = 1) {
  // we don't want to use every property in userInfo, since the userInfo object will be updated with company name, firstname, lastname on page load
  // although providerId will also be set up on page load, we need it immediately for the logic to decide whether to use the cookies later, so we'll include it here

  cookieMappings.forEach(({ key, cookieName }) => {
    const value = userInfo[key];
    if (value !== undefined && value !== null) {
      const strValue = String(value);
      setCookie(cookieName, strValue, days);
      console.log(`Cookie set: ${cookieName}`, getCookie(cookieName));
    }
  });
}
