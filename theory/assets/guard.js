/* Ուղեցույցների մուտքի պահակ և գրանցում (Տրենաժոր 2.0)
   - Աշխատում է միայն եթե ../trenajor-config.js-ում կա reportUrl (այլապես՝ ոչինչ չի անում)
   - loginRequired=true և աշակերտը մուտք չի գործել → պարունակությունը թաքցվում է, առաջարկվում է մուտք տրենաժորից
   - Մուտք գործածի դեպքում գրանցվում է. ուղեցույցի բացում (theory) և տպում/PDF պահում (print)
   ⚠ Սա ինտերֆեյսի մակարդակի պաշտպանություն է. իրական փակում՝ Cloudflare Access (տես ՀԱՇՎԵՏՎՈՒԹՅՈՒՆ_ԵՎ_ԼՈԳԻՆ.md) */
(function () {
  var cfg = window.TRENAJOR_CONFIG || {};
  var user = null; try { user = JSON.parse(localStorage.getItem('trenajor_user_v1')); } catch (e) {}

  /* --- Ուսուցչի նշումները՝ միայն ադմինի համար («Դեր» = admin «Աշակերտներ» թերթում) ---
     ⚠ Սա ինտերֆեյսի թաքցում է. նշումների տեքստը մնում է ֆայլում (տես ՀԱՇՎԵՏՎՈՒԹՅՈՒՆ_ԵՎ_ԼՈԳԻՆ.md)։ */
  var isAdmin = !!(user && user.role === 'admin');
  if (!isAdmin) {
    var ts = document.createElement('style'); ts.id = 'tj-teacher-lock';
    ts.textContent = '#tj-teacher,.teacher-corner,.tc-title{display:none !important}';
    document.head.appendChild(ts);
    try { localStorage.removeItem('trenajor_teacher_mode'); } catch (e) {}
    document.documentElement.classList.remove('teacher-mode');
  }

  /* --- Անցանց ծանուցում (բանաձևերի գրադարանը չի բեռնվել կամ կապը կտրվել է) --- */
  function offline() {
    function put() {
      if (document.getElementById('tj-offline')) return;
      var d = document.createElement('div'); d.id = 'tj-offline'; d.setAttribute('role', 'alert');
      d.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#b45309;color:#fff;padding:10px 14px;font:15px/1.4 system-ui,Arial,sans-serif;text-align:center';
      d.textContent = '⚠️ Ինտերնետ կապ չկա կամ թույլ է. բանաձևերը կարող են ճիշտ չցուցադրվել։ Միացիր ինտերնետին և թարմացրու էջը։';
      document.body.appendChild(d);
    }
    if (document.body) put(); else document.addEventListener('DOMContentLoaded', put);
  }
  window.addEventListener('error', function (e) {
    var t = e && e.target; if (t && t.tagName === 'SCRIPT' && /^https?:/.test(t.src || '')) offline();
  }, true);
  window.addEventListener('offline', offline);
  window.addEventListener('online', function () { var d = document.getElementById('tj-offline'); if (d) d.remove(); });
  if (navigator.onLine === false) offline();

  if (!cfg.reportUrl) return;
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

  /* --- «Հայտնել ուսուցչին»՝ սխալ կամ անհասկանալի տեղ ուղեցույցում --- */
  if (!user || !user.token) return;
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('button'); b.type = 'button'; b.id = 'tj-report';
    b.textContent = '⚑ Հայտնել սխալի մասին';
    b.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:900;background:#fff;color:#334155;border:1px solid #cbd5e1;border-radius:20px;padding:6px 12px;font:13px system-ui,Arial,sans-serif;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.12)';
    b.onclick = function () {
      if (document.getElementById('tj-fb')) return;
      var sel = ''; try { sel = String(window.getSelection() || '').slice(0, 600); } catch (e) {}
      var o = document.createElement('div'); o.id = 'tj-fb';
      o.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px';
      o.innerHTML = '<div style="background:#fff;border-radius:14px;padding:20px;max-width:440px;width:100%;font:15px/1.5 system-ui,Arial,sans-serif;color:#0f172a">' +
        '<b style="font-size:17px">⚑ Հայտնել ուսուցչին</b><p style="color:#64748b;font-size:13px;margin:6px 0 10px">Ի՞նչն է սխալ կամ անհասկանալի։ Եթե նախապես նշես (ընտրես) տեքստի հատվածը, այն էլ կուղարկվի։</p>' +
        '<textarea id="tj-fb-t" rows="4" maxlength="1000" style="width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font:inherit"></textarea>' +
        '<div id="tj-fb-m" style="min-height:20px;font-size:13px;margin:6px 0"></div>' +
        '<div style="text-align:right"><button id="tj-fb-c" type="button" style="padding:7px 14px;border:0;border-radius:8px;background:#f1f5f9;margin-right:6px;cursor:pointer">Չեղարկել</button>' +
        '<button id="tj-fb-s" type="button" style="padding:7px 14px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-weight:bold;cursor:pointer">Ուղարկել</button></div></div>';
      document.body.appendChild(o);
      document.getElementById('tj-fb-c').onclick = function () { o.remove(); };
      document.getElementById('tj-fb-s').onclick = function () {
        var c = document.getElementById('tj-fb-t').value.trim(), m = document.getElementById('tj-fb-m');
        if (c.length < 3) { m.style.color = '#dc2626'; m.textContent = 'Գրիր մի քանի բառ'; return; }
        m.style.color = '#64748b'; m.textContent = 'Ուղարկում…';
        fetch(cfg.reportUrl, { method: 'POST', body: JSON.stringify({ action: 'feedback', login: user.login, token: user.token,
          where: 'theory', topic: page, subtopic: '', question: sel, comment: c }) })
          .then(function (r) { return r.json(); })
          .then(function (r) {
            if (r && r.ok) { m.style.color = '#15803d'; m.textContent = 'Շնորհակալություն, ուղարկված է ✅'; setTimeout(function () { o.remove(); }, 1200); }
            else { m.style.color = '#dc2626'; m.textContent = r && r.reauth ? 'Մուտքը հնացել է. մտիր տրենաժոր նորից' : 'Չհաջողվեց ուղարկել'; }
          })
          .catch(function () { m.style.color = '#dc2626'; m.textContent = 'Կապ չկա. ստուգիր ինտերնետը'; });
      };
    };
    document.body.appendChild(b);
  });
})();
