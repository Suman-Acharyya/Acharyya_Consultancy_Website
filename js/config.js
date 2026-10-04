/* ===========================================================
   SITE SETTINGS  (the only file you need to edit)
   =========================================================== */
window.SITE = {
  email: 'pradip.acharyya@outlook.com',          // where enquiries and ratings are delivered
  endpoint: 'https://formsubmit.co/ajax/'        // free form-to-email service (see README)
};

/* Real customer reviews you want to show on the website.
   Leave empty [] to show none. Example:
   {name:'Customer Name', rating:5, text:'Their feedback here.', date:'Oct 2026'} */
window.REVIEWS = [];

/* Sends the form data to your email. */
window.sendMail = function (fields) {
  var c = new AbortController(), t = setTimeout(function () { c.abort(); }, 15000);
  var body = Object.assign({ _captcha: 'false', _template: 'table' }, fields);
  return fetch(window.SITE.endpoint + window.SITE.email, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body),
    signal: c.signal
  }).then(function (r) {
    return r.json().catch(function () { return {}; }).then(function (d) {
      clearTimeout(t);
      if (r.ok && (d.success === true || d.success === 'true')) return d;
      throw new Error(d.message || 'failed');
    });
  }, function (e) { clearTimeout(t); throw e; });
};

/* Checks every field marked data-v. Returns the first invalid field (or null). */
window.checkForm = function (form) {
  var first = null;
  form.querySelectorAll('[data-v]').forEach(function (el) {
    var v = el.value.trim(), t = el.getAttribute('data-v'), m = '';
    if (t === 'name' && v.length < 2) m = 'Please enter your name';
    else if (t === 'phone' && !/^(?:\+?91|0)?[6-9]\d{9}$/.test(v.replace(/[\s\-()]/g, ''))) m = 'Enter a valid 10-digit mobile number';
    else if (t === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = 'Enter a valid email address';
    else if (t === 'select' && !v) m = 'Please choose a service';
    else if (t === 'text' && v.length < (+el.getAttribute('data-min') || 1)) m = el.getAttribute('data-msg') || 'This field is required';
    var lab = el.closest('.f'), err = lab && lab.querySelector('.err');
    if (lab) lab.classList.toggle('bad', !!m);
    el.setAttribute('aria-invalid', m ? 'true' : 'false');
    if (err) err.textContent = m;
    if (m && !first) first = el;
  });
  return first;
};
document.addEventListener('input', function (e) {
  var f = e.target.closest && e.target.closest('.f.bad');
  if (f) { f.classList.remove('bad'); var er = f.querySelector('.err'); if (er) er.textContent = ''; }
});
