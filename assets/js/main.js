// ==========================================================================
// Aisha Rahman — Portfolio bootstrap
// Content is loaded from /data/*.json; static <head> + <noscript> keep the
// page meaningful for crawlers and no-JS visitors.
// ==========================================================================

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Small helpers -------------------------------------------------------------
async function getJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

/** Open external links safely (no reverse-tabnabbing). */
function externalAttrs(anchor) {
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
}

function escapeHtml(str = "") {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ==========================================================================
// Meta / site config
// ==========================================================================
async function loadSiteConfig() {
  const config = await getJSON("data/site-config.json");
  // Static head already carries good defaults; only override if data provides them.
  if (config?.meta?.title) document.title = config.meta.title;
}

// ==========================================================================
// Navigation
// ==========================================================================
async function loadNavigation() {
  const navData = await getJSON("data/navigation.json");

  const navBrand = document.querySelector(".nav-brand a");
  if (navBrand && navData.brand) {
    navBrand.textContent = navData.brand.name;
    navBrand.setAttribute("href", navData.brand.href);
  }

  const navMenu = document.getElementById("navMenu");
  if (navMenu) {
    navMenu.innerHTML = "";
    navData.menuItems.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.href;
      a.className = "nav-link";
      a.textContent = item.label;
      li.appendChild(a);
      navMenu.appendChild(li);
    });
  }
}

// ==========================================================================
// Hero
// ==========================================================================
async function loadHero() {
  const hero = await getJSON("data/hero.json");

  const set = (id, value, asHtml = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (asHtml) el.innerHTML = value;
    else el.textContent = value;
  };

  set("heroGreeting", hero.greeting);
  set("heroName", hero.name);
  set("heroTitle", hero.title);
  set("heroSummary", hero.summary, true);

  const highlights = document.getElementById("heroHighlights");
  if (highlights) {
    highlights.innerHTML = "";
    (hero.highlights || []).forEach((h) => {
      const div = document.createElement("div");
      div.className = "highlight-item";
      div.innerHTML = `<i class="${escapeHtml(h.icon)}" aria-hidden="true"></i><span>${escapeHtml(
        h.text
      )}</span>`;
      highlights.appendChild(div);
    });
  }

  const cta = document.getElementById("heroCTA");
  if (cta) {
    cta.innerHTML = "";
    (hero.cta?.buttons || []).forEach((b) => {
      const a = document.createElement("a");
      a.href = b.href;
      a.className = `btn btn-${b.type}`;
      if (b.external) externalAttrs(a);
      a.innerHTML = b.icon ? `<i class="${escapeHtml(b.icon)}" aria-hidden="true"></i> ${escapeHtml(b.text)}` : escapeHtml(b.text);
      cta.appendChild(a);
    });
  }

  const social = document.getElementById("heroSocial");
  if (social) {
    social.innerHTML = "";
    (hero.socialLinks || []).forEach((s) => {
      const a = document.createElement("a");
      a.href = s.url;
      a.setAttribute("aria-label", s.platform);
      if (!s.url.startsWith("mailto:") && !s.url.startsWith("tel:")) externalAttrs(a);
      a.innerHTML = `<i class="${escapeHtml(s.icon)}" aria-hidden="true"></i>`;
      social.appendChild(a);
    });
  }
}

// ==========================================================================
// About
// ==========================================================================
async function loadAbout() {
  const about = await getJSON("data/about.json");

  const title = document.querySelector("#about .section-title");
  if (title) title.textContent = about.sectionTitle;

  const text = document.getElementById("aboutText");
  if (text) {
    text.innerHTML = "";
    (about.paragraphs || []).forEach((p) => {
      const el = document.createElement("p");
      el.textContent = p;
      text.appendChild(el);
    });
  }

  const stats = document.getElementById("aboutStats");
  if (stats) {
    stats.innerHTML = "";
    (about.statistics || []).forEach((s) => {
      const div = document.createElement("div");
      div.className = "stat-item";
      div.innerHTML = `<h3>${escapeHtml(s.value)}</h3><p>${escapeHtml(s.label)}</p>`;
      stats.appendChild(div);
    });
  }
}

// ==========================================================================
// Experience
// ==========================================================================
async function loadExperience() {
  const data = await getJSON("data/experience.json");

  const title = document.querySelector("#experience .section-title");
  if (title) title.textContent = data.sectionTitle;

  const timeline = document.getElementById("experienceTimeline");
  if (!timeline) return;
  timeline.innerHTML = "";

  const experiences = Array.isArray(data.experiences) ? data.experiences : [];
  experiences
    .filter((exp) => !exp._instructions)
    .forEach((exp) => {
      const item = document.createElement("div");
      item.className = "timeline-item";

      // Prefer the bulleted responsibilities; only fall back to the prose
      // description when no bullets exist (the source data duplicates them).
      let body = "";
      if (Array.isArray(exp.responsibilities) && exp.responsibilities.length) {
        body = `<ul>${exp.responsibilities.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul>`;
      } else if (exp.description) {
        body = exp.description
          .split("\n")
          .filter(Boolean)
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join("");
      }

      item.innerHTML = `
        <div class="timeline-header">
          <div>
            <h3 class="timeline-title">${escapeHtml(exp.title)}</h3>
            <p class="timeline-company">${escapeHtml(exp.company)}</p>
          </div>
          <span class="timeline-period">${escapeHtml(exp.period)}</span>
        </div>
        <div class="timeline-description">${body}</div>`;
      timeline.appendChild(item);
    });
}

// ==========================================================================
// Skills
// ==========================================================================
async function loadSkills() {
  const data = await getJSON("data/skills.json");

  const title = document.querySelector("#skills .section-title");
  if (title) title.textContent = data.sectionTitle;

  const grid = document.getElementById("skillsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  (data.categories || [])
    .filter((c) => !c._instructions && Array.isArray(c.skills))
    .forEach((category) => {
      const el = document.createElement("div");
      el.className = "skill-category";
      const tags = category.skills.map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("");
      el.innerHTML = `
        <h3><i class="${escapeHtml(category.icon)}" aria-hidden="true"></i> ${escapeHtml(
        category.category
      )}</h3>
        <div class="skill-list">${tags}</div>`;
      grid.appendChild(el);
    });
}

// ==========================================================================
// Projects
// ==========================================================================
async function loadProjects() {
  const data = await getJSON("data/projects.json");

  const title = document.querySelector("#projects .section-title");
  if (title) title.textContent = data.sectionTitle;

  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  (data.projects || [])
    .filter((p) => !p._instructions)
    .forEach((project) => {
      const card = document.createElement("div");
      card.className = "project-card";

      const tech = (project.technologies || [])
        .map((t) => `<span class="tech-badge">${escapeHtml(t)}</span>`)
        .join("");

      const links = [];
      if (project.github) {
        links.push(
          `<a href="${escapeHtml(project.github)}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fab fa-github" aria-hidden="true"></i> Code</a>`
        );
      }
      // Only show a separate "Live Demo" when it differs from the repo link.
      if (project.demo && project.demo !== project.github) {
        links.push(
          `<a href="${escapeHtml(project.demo)}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fas fa-external-link-alt" aria-hidden="true"></i> Demo</a>`
        );
      }

      const media = project.image
        ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(
            project.title
          )} — project thumbnail" loading="lazy" decoding="async" onerror="this.remove()" />`
        : `<i class="${escapeHtml(project.icon || "fas fa-code")}" aria-hidden="true"></i>`;

      card.innerHTML = `
        <div class="project-image">${media}</div>
        <div class="project-content">
          <h3 class="project-title">${escapeHtml(project.title)}</h3>
          <p class="project-description">${escapeHtml(project.description)}</p>
          ${tech ? `<div class="project-tech">${tech}</div>` : ""}
          ${links.length ? `<div class="project-links">${links.join("")}</div>` : ""}
        </div>`;
      grid.appendChild(card);
    });
}

// ==========================================================================
// Education
// ==========================================================================
async function loadEducation() {
  const data = await getJSON("data/education.json");

  const title = document.querySelector("#education .section-title");
  if (title) title.textContent = data.sectionTitle;

  const grid = document.getElementById("educationGrid");
  if (grid) {
    grid.innerHTML = "";
    (data.education || [])
      .filter((e) => !e._instructions)
      .forEach((edu) => {
        const el = document.createElement("div");
        el.className = "education-item";
        el.innerHTML = `
          <div class="education-header">
            <div>
              <h3 class="education-degree">${escapeHtml(edu.degree)}</h3>
              <p class="education-school">${escapeHtml(edu.school)}</p>
            </div>
            <span class="education-period">${escapeHtml(edu.period)}</span>
          </div>
          ${edu.details ? `<p class="education-detail">${escapeHtml(edu.details)}</p>` : ""}`;
        grid.appendChild(el);
      });
  }

  // Hide the certifications block entirely when there are none, rather than
  // leaving a dangling heading.
  const certs = (data.certifications || []).filter((c) => !c._instructions);
  const certBlock = document.querySelector("#education .certifications");
  if (!certs.length) {
    if (certBlock) certBlock.style.display = "none";
    return;
  }
  const certTitle = document.querySelector("#education .certifications h3");
  if (certTitle) certTitle.textContent = data.certificationsTitle || "Certifications";

  const certGrid = document.getElementById("certGrid");
  if (certGrid) {
    certGrid.innerHTML = "";
    certs.forEach((cert) => {
      const el = document.createElement("div");
      el.className = "cert-item";
      el.innerHTML = `<strong>${escapeHtml(cert.name)}</strong>${
        cert.issuer ? `<p class="cert-issuer">${escapeHtml(cert.issuer)}</p>` : ""
      }`;
      certGrid.appendChild(el);
    });
  }
}

// ==========================================================================
// Contact (real, working mailto submission — no silent drop)
// ==========================================================================
async function loadContact() {
  const contact = await getJSON("data/contact.json");

  const title = document.querySelector("#contact .section-title");
  if (title) title.textContent = contact.sectionTitle;

  const recipient =
    (contact.contactInfo || []).find((i) => i.type === "email")?.value ||
    "aisha.rahman@example.com";

  const info = document.getElementById("contactInfo");
  if (info) {
    info.innerHTML = "";
    (contact.contactInfo || []).forEach((it) => {
      const div = document.createElement("div");
      div.className = "contact-item";
      const value = it.href
        ? `<a href="${escapeHtml(it.href)}"${
            it.href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""
          }>${escapeHtml(it.value)}</a>`
        : `<p>${escapeHtml(it.value)}</p>`;
      div.innerHTML = `<i class="${escapeHtml(it.icon)}" aria-hidden="true"></i><div><h3>${escapeHtml(
        it.label
      )}</h3>${value}</div>`;
      info.appendChild(div);
    });
  }

  const formContainer = document.getElementById("contactFormContainer");
  if (formContainer && contact.form) {
    const form = document.createElement("form");
    form.className = "contact-form";
    form.id = "contactForm";
    form.setAttribute("novalidate", "");

    contact.form.fields.forEach((field) => {
      const group = document.createElement("div");
      group.className = "form-group";
      const labelText = field.placeholder || field.id;
      const control =
        field.type === "textarea"
          ? `<textarea id="${field.id}" name="${field.id}" rows="${field.rows || 5}" placeholder="${escapeHtml(
              field.placeholder || ""
            )}" ${field.required ? "required" : ""}></textarea>`
          : `<input type="${field.type}" id="${field.id}" name="${field.id}" placeholder="${escapeHtml(
              field.placeholder || ""
            )}" ${field.required ? "required" : ""}>`;
      group.innerHTML = `<label for="${field.id}">${escapeHtml(labelText)}</label>${control}`;
      form.appendChild(group);
    });

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = `btn btn-${contact.form.submitButton.type}`;
    submit.textContent = contact.form.submitButton.text;
    form.appendChild(submit);

    const note = document.createElement("p");
    note.className = "form-note";
    note.textContent = "Opens your email client. Prefer direct? " + recipient;
    form.appendChild(note);

    formContainer.innerHTML = "";
    formContainer.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const name = encodeURIComponent(form.name?.value || "");
      const email = encodeURIComponent(form.email?.value || "");
      const message = form.message?.value || "";
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.name?.value || "visitor"}`);
      const body = encodeURIComponent(`${message}\n\n— ${form.name?.value || ""} (${form.email?.value || ""})`);
      // Hand off to the user's mail client with the message pre-filled.
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    });
  }
}

// ==========================================================================
// Footer
// ==========================================================================
async function loadFooter() {
  const footer = await getJSON("data/footer.json");

  const copy = document.getElementById("footerCopyright");
  if (copy && footer.copyright) {
    copy.textContent = `© ${footer.copyright.year} ${footer.copyright.name}. ${footer.copyright.text}`;
  }

  const links = document.getElementById("footerLinks");
  if (links) {
    links.innerHTML = "";
    (footer.links || []).forEach((l) => {
      const a = document.createElement("a");
      a.href = l.url;
      a.textContent = l.text;
      if (l.url.startsWith("http")) externalAttrs(a);
      links.appendChild(a);
    });
  }
}

// ==========================================================================
// Interactions — set up AFTER content is in the DOM
// ==========================================================================
function setupInteractions() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  // Mobile menu toggle with proper aria state
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("active");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navMenu.addEventListener("click", (e) => {
      if (e.target.closest(".nav-link")) {
        navMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scroll for in-page anchors (respects reduced motion)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: REDUCED_MOTION ? "auto" : "smooth" });
    });
  });

  // Navbar elevation — single rAF-throttled scroll handler
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (navbar) navbar.classList.toggle("is-scrolled", window.scrollY > 20);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active nav link via IntersectionObserver (class-based, no inline styles)
  const sections = document.querySelectorAll("main section[id]");
  if (navLinks.length && sections.length) {
    const byId = new Map(navLinks.map((l) => [l.getAttribute("href"), l]));
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = byId.get(`#${entry.target.id}`);
          if (!link) return;
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  // Scroll reveal via IntersectionObserver (no FOUC, no scroll spam)
  const revealTargets = document.querySelectorAll(
    ".timeline-item, .skill-category, .project-card, .education-item, .stat-item, .cert-item"
  );
  if (REDUCED_MOTION) return; // CSS keeps everything visible
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    revealObserver.observe(el);
  });
}

// ==========================================================================
// Boot
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  // Each loader is independent — one failure shouldn't blank the whole page.
  const loaders = [
    loadSiteConfig,
    loadNavigation,
    loadHero,
    loadAbout,
    loadExperience,
    loadSkills,
    loadProjects,
    loadEducation,
    loadContact,
    loadFooter,
  ];
  const results = await Promise.allSettled(loaders.map((fn) => fn()));
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[portfolio] ${loaders[i].name} failed:`, r.reason);
  });

  setupInteractions();
});
