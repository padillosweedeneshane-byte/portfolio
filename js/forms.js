(function () {
  function initForms() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
      name: { el: document.getElementById('formName'), errorEl: document.getElementById('formNameError'), validators: [required, minLength(2)] },
      email: { el: document.getElementById('formEmail'), errorEl: document.getElementById('formEmailError'), validators: [required, isEmail] },
      subject: { el: document.getElementById('formSubject'), errorEl: document.getElementById('formSubjectError'), validators: [required, minLength(3)] },
      message: { el: document.getElementById('formMessage'), errorEl: document.getElementById('formMessageError'), validators: [required, minLength(10)] }
    };

    Object.values(fields).forEach(field => {
      if (!field.el) return;
      field.el.addEventListener('blur', () => validateField(field));
      field.el.addEventListener('input', () => {
        if (field.el.classList.contains('error') || field.el.classList.contains('success')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      Object.values(fields).forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) return;

      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<div class="spinner"></div> Sending...';
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');

      try {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        await fakeSend(data);

        showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        Object.values(fields).forEach(f => {
          if (f.el) {
            f.el.classList.remove('success', 'error');
            f.errorEl.textContent = '';
          }
        });
      } catch (err) {
        showToast('Something went wrong. Please try again or email me directly.', 'error');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
      }
    });

    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const email = document.getElementById('contactEmail').textContent;
        try {
          await navigator.clipboard.writeText(email);
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 2000);
        } catch {
          showToast('Could not copy automatically. The email is: ' + email, 'error');
        }
      });
    }
  }

  function validateField(field) {
    if (!field.el) return true;
    const value = field.el.value.trim();
    let error = '';

    for (const validator of field.validators) {
      const result = validator(value);
      if (result !== true) {
        error = result;
        break;
      }
    }

    field.el.classList.remove('error', 'success');
    field.errorEl.textContent = error;

    if (error) {
      field.el.classList.add('error');
      return false;
    } else if (value.length > 0) {
      field.el.classList.add('success');
    }
    return true;
  }

  function required(value) {
    return value.length > 0 || 'This field is required.';
  }

  function minLength(len) {
    return function (value) {
      return value.length >= len || `Minimum ${len} characters required.`;
    };
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address.';
  }

  async function fakeSend(data) {
    return new Promise((resolve) => {
      setTimeout(resolve, 1200);
    });
  }

  function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'alert');

    const iconSvg = type === 'success'
      ? '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
      : '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    toast.innerHTML = iconSvg + '<span>' + message + '</span><button class="toast-close" aria-label="Dismiss">&times;</button>';
    toast.style.animation = 'toast-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards';
    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => toast.remove());

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'toast-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})();
