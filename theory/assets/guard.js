/* Ուղեցույցների մուտքի պահակ և գրանցում (Տրենաժոր 2.0)
   - Աշխատում է միայն եթե ../trenajor-config.js-ում կա reportUrl (այլապես՝ ոչինչ չի անում)
   - loginRequired=true և աշակերտը մուտք չի գործել → պարունակությունը թաքցվում է, առաջարկվում է մուտք տրենաժորից
   - Մուտք գործածի դեպքում գրանցվում է. ուղեցույցի բացում (theory) և տպում/PDF պահում (print)
   ⚠ Սա ինտերֆեյսի մակարդակի պաշտպանություն է. իրական փակում՝ Cloudflare Access (տես ՀԱՇՎԵՏՎՈՒԹՅՈՒՆ_ԵՎ_ԼՈԳԻՆ.md) */
(function () {
  var cfg = window.TRENAJOR_CONFIG || {};
  if (!cfg.reportUrl) return;
  var user = null; try { user = JSON.parse(localStorage.getItem('trenajor_user_v1')); } catch (e) {}
  var page = (location.pathname.split('/').pop() || '').replace('.html', '');
  function send(type) {
    if (!user || !user.token) return;
    var body = JSON.stringify({ action: 'log', login: user.login, token: user.token,
      events: [{ ts: new Date().toISOString(), type: type, topic: 'theory:' + page }] });
    try { if (navigator.sendBeacon) navigator.sendBeacon(cfg.reportUrl, body); else fetch(cfg.reportUrl, { method: 'POST', body: body, keepalive: true }); } catch (e) {}
  }
  if (cfg.loginRequired && !user) {
    document.documentElement.classList.add('tj-locked');
    var st = document.createElement('style');
    st.textContent = 'html.tj-locked body > *:not(#tj-lock){display:none !important}' +
      '#tj-lock{max-width:520px;margin:15vh auto;padding:28px;font-family:system-ui,Arial,sans-serif;text-align:center;border:1px solid #ddd;border-radius:14px}' +
      '#tj-lock a{display:inline-block;margin-top:14px;padding:10px 18px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none}';
    document.head.appendChild(st);
    document.addEventListener('DOMContentLoaded', function () {
      var d = document.createElement('div'); d.id = 'tj-lock';
      d.innerHTML = '<h2>🔒 Նյութը հասանելի է միայն մուտք գործած աշակերտներին</h2><p>Մտիր տրենաժոր քո մուտքանունով և գաղտնաբառով, հետո բաց այս ուղեցույցը «📖 Տեսություն» կոճակից։</p><a href="../index.html">Մուտք տրենաժոր</a>';
      document.body.appendChild(d);
    });
    return;
  }
  send('theory');
  window.addEventListener('beforeprint', function () { send('print'); });
})();
