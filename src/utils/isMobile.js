const iphone = /iPhone/i;
const ipod = /iPod/i;
const ipad = /iPad/i;
const android = /Android/i;
const mobile_opera = /Opera Mini/i;
const mobile_chrome = /(CriOS|Chrome)(?=.*\bMobile\b)/i;
const mobile_firefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i;

const isMobile = ua => {
  return (
    iphone.test(ua) ||
    ipod.test(ua) ||
    ipad.test(ua) ||
    android.test(ua) ||
    mobile_opera.test(ua) ||
    mobile_chrome.test(ua) ||
    mobile_firefox.test(ua)
  );
};

export default isMobile;
