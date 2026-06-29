/** WanderLens UI Prototypes — shared interactions */
(function () {
  function initNotes() {
    var toggle = document.getElementById('toggleNotes');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('notes-open');
      toggle.classList.toggle('active');
      toggle.textContent = document.body.classList.contains('notes-open') ? '隱藏設計說明' : '設計說明';
    });
  }

  function initDeviceToggle() {
    var wrap = document.getElementById('previewWrap');
    var btnDesktop = document.getElementById('viewDesktop');
    var btnMobile = document.getElementById('viewMobile');
    if (!wrap || !btnDesktop || !btnMobile) return;

    btnDesktop.addEventListener('click', function () {
      wrap.classList.remove('mobile-preview');
      btnDesktop.classList.add('active');
      btnMobile.classList.remove('active');
    });
    btnMobile.addEventListener('click', function () {
      wrap.classList.add('mobile-preview');
      btnMobile.classList.add('active');
      btnDesktop.classList.remove('active');
    });
  }

  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy') || '';
        navigator.clipboard.writeText(text).then(function () {
          var orig = btn.textContent;
          btn.textContent = '已複製 ✓';
          setTimeout(function () { btn.textContent = orig; }, 1500);
        });
      });
    });
  }

  function initImageFallbacks() {
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('img-error');
        if (!img.dataset.fallbackApplied) {
          img.dataset.fallbackApplied = '1';
          var label = img.getAttribute('alt') || 'Photo';
          img.alt = label;
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNotes();
    initDeviceToggle();
    initCopyButtons();
    initImageFallbacks();
  });
})();
