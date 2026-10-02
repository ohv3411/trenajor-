/* Տրենաժորի ընտրովի կարգավորում.
   1) Պատճենիր այս ֆայլը index.html-ի կողքին՝ trenajor-config.js անունով։
   2) Լրացրու reportUrl-ը (Apps Script-ի հասցե, տես docs/ՀԱՇՎԵՏՎՈՒԹՅՈՒՆ_ԵՎ_ԼՈԳԻՆ.md)։
   Առանց այս ֆայլի տրենաժորը աշխատում է սովորական ռեժիմով (առանց լոգինի և հաշվետվության)։ */
window.TRENAJOR_CONFIG = {
  reportUrl: "https://script.google.com/macros/s/AKfycbywoj_jQazwvPxgRPYF8_TSTgMgfcBmrgkuMWHbTKm45rb_792ASR66cm4zsS8cA4Zw/exec",          // օր. "https://script.google.com/macros/s/XXXX/exec"
  loginRequired: true    // true → աշակերտը պետք է մտնի մուտքանունով և գաղտնաբառով
};
