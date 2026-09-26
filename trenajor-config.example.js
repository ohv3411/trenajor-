/* Տրենաժորի ընտրովի կարգավորում.
   1) Պատճենիր այս ֆայլը index.html-ի կողքին՝ trenajor-config.js անունով։
   2) Լրացրու reportUrl-ը (Apps Script-ի հասցե, տես docs/ՀԱՇՎԵՏՎՈՒԹՅՈՒՆ_ԵՎ_ԼՈԳԻՆ.md)։
   Առանց այս ֆայլի տրենաժորը աշխատում է սովորական ռեժիմով (առանց լոգինի և հաշվետվության)։ */
window.TRENAJOR_CONFIG = {
  reportUrl: "",          // օր. "https://script.google.com/macros/s/XXXX/exec"
  loginRequired: false    // true → աշակերտը պետք է մտնի մուտքանունով և գաղտնաբառով
};
