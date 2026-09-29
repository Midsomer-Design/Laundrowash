/* Laundrowash — site behaviour (no dependencies) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ------------------------------------------------------------------
     Opening hours — keep in sync with the hours tables in the HTML.
     24h times, keyed by JS day number (0 = Sunday). null = closed.
     ------------------------------------------------------------------ */
  var HOURS = {
    0: null,
    1: [8, 17],
    2: [8, 12],
    3: [8, 17],
    4: [8, 17],
    5: [8, 17],
    6: [8, 14]
  };
  var TIMEZONE = 'Australia/Sydney';
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function sydneyNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-AU', {
        timeZone: TIMEZONE, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var hour = parseInt(map.hour, 10) % 24;
      return { day: days[map.weekday], time: hour + parseInt(map.minute, 10) / 60 };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), time: d.getHours() + d.getMinutes() / 60 };
    }
  }

  function fmt(h) {
    var hr = Math.floor(h);
    var min = Math.round((h - hr) * 60);
    var suffix = hr >= 12 ? 'pm' : 'am';
    var h12 = hr % 12 === 0 ? 12 : hr % 12;
    return h12 + (min ? ':' + String(min).padStart(2, '0') : '') + suffix;
  }

  function openStatus() {
    var now = sydneyNow();
    var today = HOURS[now.day];
    if (today && now.time >= today[0] && now.time < today[1]) {
      return { state: 'open', text: 'Open now · until ' + fmt(today[1]) };
    }
    if (today && now.time < today[0]) {
      return { state: 'closed', text: 'Closed · opens today ' + fmt(today[0]) };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) {
        var label = i === 1 ? 'tomorrow' : DAY_NAMES[d].slice(0, 3);
        return { state: 'closed', text: 'Closed · opens ' + label + ' ' + fmt(HOURS[d][0]) };
      }
    }
    return { state: 'closed', text: 'Closed' };
  }

  function renderStatus() {
    var s = openStatus();
    document.querySelectorAll('[data-open-status]').forEach(function (el) {
      el.setAttribute('data-state', s.state);
      var t = el.querySelector('.status__text');
      if (t) t.textContent = s.text;
    });
    var day = sydneyNow().day;
    document.querySelectorAll('.hours tr[data-day]').forEach(function (row) {
      row.classList.toggle('is-today', parseInt(row.getAttribute('data-day'), 10) === day);
    });
  }
  renderStatus();
  setInterval(renderStatus, 60 * 1000);

  /* ------------------------------------------------------------------
     Header: shadow on scroll + mobile menu
     ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    document.documentElement.classList.toggle('menu-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      var label = toggle.querySelector('.menu-toggle__label');
      if (label) label.textContent = open ? 'Close' : 'Menu';
    }
    if (menu) {
      if (open) { menu.removeAttribute('inert'); } else { menu.setAttribute('inert', ''); }
    }
  }
  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.documentElement.classList.contains('menu-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ------------------------------------------------------------------
     Enquiry / pickup form
     If the form has a data-endpoint (e.g. a Formspree URL) it posts
     there; otherwise it opens the visitor's email app with the details
     filled in, so it works with no backend at all.
     ------------------------------------------------------------------ */
  var form = document.querySelector('form[data-enquiry]');
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var preset = params.get('service');
    if (preset) {
      var sel = form.querySelector('select[name="service"]');
      var opt = sel && sel.querySelector('option[data-key="' + preset + '"]');
      if (opt) sel.value = opt.value;
      var radio = form.querySelector('input[name="customer_type"][data-key="' + preset + '"]');
      if (radio) radio.checked = true;
    }

    var statusEl = form.querySelector('.form-status');
    function showStatus(ok, msg) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = 'form-status is-visible ' + (ok ? 'form-status--ok' : 'form-status--err');
    }

    function validate() {
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (field) {
        var ok = field.value.trim() !== '' && (!field.checkValidity || field.checkValidity());
        field.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstBad) firstBad = field;
      });
      var email = form.querySelector('input[type="email"]');
      var phone = form.querySelector('input[type="tel"]');
      if (email && phone && !email.value.trim() && !phone.value.trim()) {
        phone.setAttribute('aria-invalid', 'true');
        firstBad = firstBad || phone;
      }
      if (firstBad) firstBad.focus();
      return !firstBad;
    }

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim() !== '') {
        e.target.setAttribute('aria-invalid', 'false');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('.hp input') && form.querySelector('.hp input').value) return;
      if (!validate()) {
        showStatus(false, 'Please fill in the highlighted fields so we can get back to you.');
        return;
      }

      var data = new FormData(form);
      var endpoint = form.getAttribute('data-endpoint');
      var btn = form.querySelector('button[type="submit"]');

      if (endpoint) {
        if (btn) { btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.textContent = 'Sending…'; }
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error('Request failed');
            form.reset();
            showStatus(true, 'Thanks! Your request has been sent. We’ll be in touch shortly (usually the same business day).');
          })
          .catch(function () {
            showStatus(false, 'Sorry, something went wrong. Please call us on (02) 4272 4433 or email info@laundrowash.com.au.');
          })
          .finally(function () {
            if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.label; }
          });
        return;
      }

      var to = form.getAttribute('data-mailto') || 'info@laundrowash.com.au';
      var labels = {
        customer_type: 'Customer type', name: 'Name', phone: 'Phone', email: 'Email',
        suburb: 'Suburb', service: 'Service', pickup_day: 'Preferred pickup/drop-off day', message: 'Message'
      };
      var lines = [];
      data.forEach(function (value, key) {
        if (labels[key] && String(value).trim()) lines.push(labels[key] + ': ' + value);
      });
      var subject = 'Website enquiry: ' + (data.get('service') || 'Laundry') + ' (' + (data.get('name') || '') + ')';
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      showStatus(true, 'Your email app should now open with your details filled in. Just press send. Or call us on (02) 4272 4433.');
    });
  }
})();
