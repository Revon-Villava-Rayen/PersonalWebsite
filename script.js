(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Theme toggle ----------
  const isDark = () =>
    root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );

  // ---------- Nav border on scroll ----------
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Active section highlight ----------
  const links = [...navLinks.querySelectorAll("a")];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("section[id]").forEach((s) => sectionObserver.observe(s));

  // ---------- Reveal on scroll ----------
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    // threshold 0 so tall blocks still reveal on short viewports
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // ---------- Animated stat counters ----------
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  document.querySelectorAll(".stat-num").forEach(animateCount);

  // ---------- Typing effect ----------
  const typed = document.getElementById("typed");
  const phrases = ["LLM tooling", "RAG pipelines", "MCP integrations", ".NET systems", "agentic AI"];
  if (!reduceMotion) {
    let i = 0, j = phrases[0].length, deleting = true;
    const step = () => {
      const word = phrases[i];
      typed.textContent = word.slice(0, j);
      let delay = deleting ? 45 : 85;
      if (deleting && j === 0) {
        deleting = false;
        i = (i + 1) % phrases.length;
        delay = 300;
      } else if (!deleting && j === phrases[i].length) {
        deleting = true;
        delay = 1800;
      }
      j += deleting ? -1 : 1;
      if (!deleting && j > phrases[i].length) j = phrases[i].length;
      setTimeout(step, delay);
    };
    setTimeout(step, 2200);
  }

  // ---------- Footer year ----------
  document.getElementById("year").textContent = new Date().getFullYear();
})();
