import { themeConfig } from "./config";

// Runs before first paint so dark-mode visitors never see a white flash. Mirrors ThemeManager in plain JS.
export const themeScript = `(function(){try{
var c=${JSON.stringify({
  key: themeConfig.storageKey,
  attr: themeConfig.attribute,
  query: themeConfig.darkQuery,
  themes: themeConfig.themes,
  fallback: themeConfig.fallbackTheme,
})};
var p=localStorage.getItem(c.key)||"system";
var t=p==="system"?(matchMedia(c.query).matches?"dark":"light"):p;
if(c.themes.indexOf(t)<0)t=c.fallback;
document.documentElement.setAttribute(c.attr,t);
}catch(e){}})();`;
