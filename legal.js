(() => {
  "use strict";

  const content = window.PORTFOLIO_CONTENT;
  if (!content?.site) return;

  const { site } = content;
  const legal = site.legal || {};
  const values = {
    ...site,
    ...legal,
    legalEmail: site.email,
  };

  if (/^#[0-9a-f]{6}$/i.test(site.accentColor || "")) {
    document.documentElement.style.setProperty("--accent", site.accentColor);
  }

  Object.entries(values).forEach(([key, value]) => {
    document.querySelectorAll(`[data-legal="${key}"]`).forEach((element) => {
      element.textContent = value;
    });
  });

  // Only used for local preview. In the deployed site the address is already
  // baked into the markup, so there is nothing to fill in here.
  if (site.email) {
    document.querySelectorAll("[data-legal-email]").forEach((element) => {
      element.href = `mailto:${site.email}`;
      element.textContent = site.email;
    });
  }

  document.querySelectorAll("[data-optional-legal]").forEach((element) => {
    const key = element.dataset.optionalLegal;
    element.hidden = !legal[key];
  });

  const incomplete = Object.values(legal).some(
    (value) => typeof value === "string" && value.startsWith("["),
  );
  document.querySelector("[data-legal-warning]")?.toggleAttribute("hidden", !incomplete);
  document.querySelector("[data-year]").textContent = new Date().getFullYear();
})();
