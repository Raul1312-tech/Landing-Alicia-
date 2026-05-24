const revealElements = document.querySelectorAll(".reveal");
const form = document.querySelector("#lead-form");
const formNote = document.querySelector("#form-note");
const compareSliders = document.querySelectorAll("[data-compare]");
const thankYouUrl = "thank-you.html";
const leadEndpoint = window.IKIGAI_LEAD_ENDPOINT || "";

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (compareSliders.length) {
  compareSliders.forEach((slider) => {
    const input = slider.querySelector(".compare-range");
    if (!input) {
      return;
    }

    const syncSlider = () => {
      slider.style.setProperty("--position", `${input.value}%`);
    };

    syncSlider();
    input.addEventListener("input", syncSlider);
    input.addEventListener("change", syncSlider);
  });
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      formNote.textContent = "Revisa los campos obligatorios antes de continuar.";
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    if (formData.get("website")) {
      return;
    }

    const leadData = Object.fromEntries(formData.entries());
    const payload = {
      ...leadData,
      source: form.dataset.source || "landing-alicia",
      submittedAt: new Date().toISOString(),
    };

    formNote.textContent = "Enviando solicitud...";

    if (leadEndpoint) {
      try {
        const response = await fetch(leadEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Lead endpoint failed");
        }
      } catch (error) {
        formNote.textContent =
          "No hemos podido enviar la solicitud ahora mismo. Intentalo de nuevo en unos minutos.";
        return;
      }
    }

    localStorage.setItem("ikigaiLeadDraft", JSON.stringify(payload));
    formNote.textContent = "Solicitud enviada. Redirigiendo...";

    window.setTimeout(() => {
      window.location.href = thankYouUrl;
    }, 500);
  });
}
