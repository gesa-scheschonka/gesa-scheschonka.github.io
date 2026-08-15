(() => {
  "use strict";

  const content = window.PORTFOLIO_CONTENT;

  if (!content) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<p class="content-error">The content file could not be loaded.</p>',
    );
    return;
  }

  const { site, projects, clients = [] } = content;
  const assetVersion = String(window.PORTFOLIO_ASSET_VERSION || "");
  const versionedAssetSource = (source) => {
    const path = String(source || "");
    if (!assetVersion || !path.startsWith("assets/")) return path;
    return `${path}${path.includes("?") ? "&" : "?"}v=${encodeURIComponent(assetVersion)}`;
  };
  const cv = window.PORTFOLIO_CV || [];
  const projectList = document.querySelector("#project-list");
  const projectCount = document.querySelector("#project-count");
  const clientGrid = document.querySelector("#client-grid");
  const timeline = document.querySelector("#timeline");
  const dialog = document.querySelector("#project-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  const dialogIndex = document.querySelector("#dialog-index");
  const dialogPrevBtn = document.querySelector("[data-dialog-prev]");
  const dialogNextBtn = document.querySelector("[data-dialog-next]");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const escapeHTML = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatDate = (year, month) => {
    if (!month) return String(year);
    const date = new Date(Number(year), Number(month) - 1, 1);
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const projectDate = (project) => project.dateLabel || formatDate(project.year, project.month);

  const safeCropNumber = (value, fallback, minimum, maximum) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
  };

  const applySiteContent = () => {
    if (/^#[0-9a-f]{6}$/i.test(site.accentColor || "")) {
      document.documentElement.style.setProperty("--accent", site.accentColor);
    }

    Object.entries(site).forEach(([key, value]) => {
      document.querySelectorAll(`[data-site="${key}"]`).forEach((element) => {
        element.textContent = value;
      });
    });

    document.title = `${site.firstName} ${site.lastName} — PR & Communications`;

    document.querySelectorAll("[data-site-link]").forEach((element) => {
      const key = element.dataset.siteLink;
      const value = site[key];
      if (!value) return;
      element.href = key === "email" ? `mailto:${value}` : value;
      element.hidden = false;
    });

    const socialLinks = document.querySelector("#social-links");
    socialLinks.innerHTML = (site.socials || [])
      .map(
        ({ label, url }) =>
          `<a href="${escapeHTML(url)}" target="_blank" rel="noreferrer">${escapeHTML(label)} <span class="ui-arrow" aria-hidden="true"></span></a>`,
      )
      .join("");
  };

  const sortedProjects = projects
    .filter((project) => !project.hidden)
    .sort((a, b) => Number(b.year) - Number(a.year) || Number(b.month) - Number(a.month));

  // The overview is laid out as justified rows: the first project runs full
  // width, then desktop alternates between two- and three-project rows. One
  // project remains dominant in every row, while a hard cap of three prevents
  // the later cases from shrinking into four-column thumbnails.
  const projectRowPlan = [
    { weights: [1.55, 1], ratio: 16 / 9 },
    { weights: [1, 1.7, 1], ratio: 21 / 9 },
    { weights: [1.35, 1], ratio: 2 / 1 },
    { weights: [1.65, 1, 1], ratio: 21 / 9 },
  ];

  const projectRows = (items) => {
    if (!items.length) return [];

    const rows = [{ hero: true, items: [items[0]] }];
    let index = 1;

    while (index < items.length) {
      const plan = projectRowPlan[(rows.length - 1) % projectRowPlan.length];
      const remaining = items.length - index;
      const count = Math.min(3, plan.weights.length, remaining);
      const weights = items
        .slice(index, index + count)
        .map((item, position) => plan.weights[position] || 1);
      const total = weights.reduce((sum, weight) => sum + weight, 0);
      // A trailing single project becomes another generous full-width feature.
      const ratio = count === 1 ? 16 / 9 : plan.ratio;

      rows.push({
        items: items.slice(index, index + count),
        // Each tile's aspect ratio is its share of the row width over the
        // shared row height, so every image in the row lines up exactly.
        cards: weights.map((weight) => ({ weight, aspect: (weight / total) * ratio })),
      });
      index += count;
    }

    return rows;
  };

  const projectType = (project) => project.category || "Portfolio case";

  const hasLicensedImage = (project) => {
    const imagePath = String(project.image || "");
    const isLocalImage =
      imagePath.startsWith("assets/projects/") &&
      !imagePath.includes("..") &&
      !imagePath.includes(":");
    const supportedRights = ["cleared", "licensed", "editorial"].includes(project.imageRights);
    const hasRequiredSource = project.imageRights !== "editorial" || Boolean(project.imageSource);

    return Boolean(isLocalImage && supportedRights && hasRequiredSource && project.imageCredit);
  };

  const localProjectMedia = (project) =>
    (Array.isArray(project.media) ? project.media : []).filter((item) => {
      const type = String(item?.type || "").toLowerCase();
      const source = String(item?.src || "");
      return ["image", "video"].includes(type) && source.startsWith("assets/") && !source.includes("..");
    });

  const hasLocalProjectMedia = (project) => localProjectMedia(project).length > 0;

  const cardImageSource = (source) => {
    const path = String(source || "");
    const lastSlash = path.lastIndexOf("/");
    if (lastSlash < 0 || !/\.jpe?g$/i.test(path)) return path;
    return `${path.slice(0, lastSlash)}/previews/${path.slice(lastSlash + 1)}`;
  };

  const cardVideoSource = (source) => {
    const path = String(source || "");
    const lastSlash = path.lastIndexOf("/");
    if (lastSlash < 0 || !/\.mp4$/i.test(path)) return path;
    return `${path.slice(0, lastSlash)}/previews/${path.slice(lastSlash + 1)}`;
  };

  const localMediaElement = (
    item,
    { context = "card", eager = false, defer = false } = {},
  ) => {
    const alt = escapeHTML(item.alt || "Event atmosphere");
    const deferSource = context === "card" ? defer : !eager;

    if (item.type === "video") {
      const videoSource = context === "card" ? cardVideoSource(item.src) : item.src;
      const posterSource =
        context === "card" && item.poster ? cardImageSource(item.poster) : item.poster;
      const deferPoster = context === "card" && defer;
      return `<video
        class="project-media-asset project-media-video"
        muted
        loop
        playsinline
        preload="none"
        ${
          posterSource
            ? `${deferPoster ? "data-poster" : "poster"}="${escapeHTML(posterSource)}"`
            : ""
        }
        aria-label="${alt}"
      ><source data-src="${escapeHTML(versionedAssetSource(videoSource))}" type="video/mp4" /></video>`;
    }

    const imageSource = context === "card" ? cardImageSource(item.src) : item.src;

    return `<img
      class="project-media-asset"
      ${deferSource ? `data-src="${escapeHTML(imageSource)}"` : `src="${escapeHTML(imageSource)}"`}
      alt="${alt}"
      loading="${eager ? "eager" : "lazy"}"
      decoding="async"
      fetchpriority="${eager ? "high" : "low"}"
    />`;
  };

  // Card previews used to be one fixed collage — a large panel left, two small
  // right — for every project. These layouts vary that, including a single
  // panel that simply cycles through the whole set.
  const previewLayouts = [
    { name: "feature", panels: 3 },   // large left, two stacked right
    { name: "single", panels: 1 },    // one frame cycling all images
    { name: "mirror", panels: 3 },    // two stacked left, large right
    { name: "duo", panels: 2 },       // two equal columns
    { name: "single", panels: 1 },
    { name: "triptych", panels: 3 },  // three equal columns
    { name: "stack", panels: 3 },     // wide top, two below
  ];

  // Walk the projects that carry media and deal the layouts out in order, so
  // neighbouring cards never repeat one. Hashing the id spread them unevenly —
  // one layout landed on half the cards.
  const assignedPreviewLayouts = new Map(
    sortedProjects
      .filter(hasLocalProjectMedia)
      .map((project, index) => [project.id, previewLayouts[index % previewLayouts.length]]),
  );

  const previewLayoutFor = (project) => {
    const requested = String(project.previewLayout || "").toLowerCase();
    return (
      previewLayouts.find((layout) => layout.name === requested) ||
      assignedPreviewLayouts.get(project.id) ||
      previewLayouts[0]
    );
  };

  // Round-robin, so each panel cycles through its own share of the images
  // rather than repeating whatever sits at a fixed index.
  const dealIntoPanels = (items, count) => {
    const panels = Array.from({ length: count }, () => []);
    items.forEach((item, index) => panels[index % count].push(item));
    return panels.filter((panel) => panel.length);
  };

  const localMediaPreview = (project, eager = false) => {
    const items = localProjectMedia(project).filter(
      (item) => item.preview !== false && (!project.previewMediaType || item.type === project.previewMediaType),
    );
    if (!items.length) return "";

    const layout = previewLayoutFor(project);
    const baseDelay = safeCropNumber(project.mediaAutoplay, 1500, 1000, 10000);
    const panels = dealIntoPanels(items, Math.min(layout.panels, items.length));

    const panel = (mediaItems, panelIndex) => `<div
        class="project-media-reel project-media-panel project-media-panel--${panelIndex + 1}"
        data-project-media-reel
        data-media-index="0"
        data-media-autoplay="${baseDelay + panelIndex * 450}"
        aria-hidden="true"
      >
        ${mediaItems
          .map(
            (item, index) => `<div
              class="project-media-slide${index === 0 ? " is-active" : ""}"
              aria-hidden="${index === 0 ? "false" : "true"}"
            >${localMediaElement(item, {
              context: "card",
              eager: eager && panelIndex === 0 && index === 0,
              defer: index !== 0,
            })}</div>`,
          )
          .join("")}
      </div>`;

    return `<div
      class="project-media-collage project-media-collage--${layout.name}"
      role="img"
      aria-label="Atmospheric media edit for ${escapeHTML(project.name)}"
    >
      ${panels.map(panel).join("")}
    </div>`;
  };

  const declumpVideos = (items) => {
    const featuredVideos = items.filter((item) => item.type === "video" && item.size === "xl");
    const remainingItems = items.filter((item) => !featuredVideos.includes(item));
    const videos = remainingItems.filter((item) => item.type === "video");
    const rest = remainingItems.filter((item) => item.type !== "video");
    if (!videos.length || !rest.length) return [...featuredVideos, ...remainingItems];

    // Tall video tiles unbalance a masonry layout's trailing columns, so keep
    // a buffer of shorter images after the last one instead of spreading
    // videos all the way to the end.
    const result = [...rest];
    const usableLength = Math.max(1, result.length - 2);
    const step = usableLength / (videos.length + 1);
    videos.forEach((video, index) => {
      const position = Math.min(usableLength, Math.round(step * (index + 1)));
      result.splice(position, 0, video);
    });
    return [...featuredVideos, ...result];
  };

  // Every source photo here is 3:4 and every clip 9:16, so a layout driven by
  // natural ratios renders them all the same size. Instead each row is
  // justified to the full width, and varying row heights plus per-item width
  // weights create the size hierarchy.
  const collageRowPlan = [
    { weights: [1.7, 1], ratio: "4 / 3" },
    { weights: [1, 1.3, 1], ratio: "21 / 9" },
    { weights: [1, 1.55], ratio: "16 / 9" },
    { weights: [1.35, 1, 1.15], ratio: "2 / 1" },
  ];

  const collageRows = (items) => {
    const rows = [];
    let index = 0;

    while (index < items.length) {
      if (items[index].size === "xl") {
        rows.push({ plan: { weights: [1], ratio: "16 / 9" }, items: [items[index]] });
        index += 1;
        continue;
      }

      const plan = collageRowPlan[rows.length % collageRowPlan.length];
      const remaining = items.length - index;
      let count = Math.min(plan.weights.length, remaining);
      // Absorb a would-be orphan rather than leaving a lone full-width tile.
      if (remaining - count === 1) count = remaining;
      rows.push({ plan, items: items.slice(index, index + count) });
      index += count;
    }

    return rows;
  };

  const localMediaHero = (project) => {
    const allItems = localProjectMedia(project);
    const selectedItems = allItems.filter((item) => item.hero);
    const heroItems = declumpVideos(selectedItems.length ? selectedItems : allItems);
    if (!heroItems.length) return "";

    let itemIndex = 0;
    // The mobile fallback is a 2-up grid, so an odd count would leave a half
    // empty final row unless the last tile spans both columns.
    const lastItem = heroItems.length % 2 === 1 ? heroItems[heroItems.length - 1] : null;

    return `<div class="dialog-private-collage" aria-label="Selected event atmosphere">
      ${collageRows(heroItems)
        .map(
          ({ plan, items }) => `<div class="dialog-private-collage-row" style="--row-ratio:${plan.ratio}">
            ${items
              .map((item, position) => {
                const sizeMultiplier = item.size === "xl" ? 1.85 : item.size === "lg" ? 1.3 : 1;
                const weight = (plan.weights[position] || 1) * sizeMultiplier;
                const eager = itemIndex++ < 4;
                const orientationClass =
                  item.type === "video"
                    ? item.orientation === "landscape" || item.size === "xl"
                      ? " is-landscape"
                      : " is-portrait"
                    : "";

                return `<figure
                  class="dialog-private-collage-item dialog-private-collage-item--${item.type}${orientationClass}${item === lastItem ? " is-mobile-wide" : ""}"
                  style="--w:${weight.toFixed(3)}"
                >${localMediaElement(item, { context: "dialog", eager, defer: !eager })}</figure>`;
              })
              .join("")}
          </div>`,
        )
        .join("")}
    </div>`;
  };

  const projectVisual = (project, context = "card", eager = false) => {
    if (hasLocalProjectMedia(project)) {
      if (context === "card") return localMediaPreview(project, eager);
      return localMediaHero(project);
    }

    if (hasLicensedImage(project)) {
      const objectPosition = String(project.imagePosition || "").match(
        /^\d{1,3}(?:\.\d+)?%\s+\d{1,3}(?:\.\d+)?%$/,
      )?.[0];
      // Licensed press images have already been prepared and compressed by
      // their publisher. Use that cleared original in the grid as well as the
      // detail view so it never goes through a second lossy JPEG pass.
      const imageSource = project.image;
      return `<img
        class="project-image${context === "dialog" ? " dialog-image" : ""}"
        src="${escapeHTML(imageSource)}"
        alt="${escapeHTML(project.imageAlt || project.name)}"
        ${context === "card" && objectPosition ? `style="object-position:${objectPosition}"` : ""}
        ${
          context === "card"
            ? `loading="${eager ? "eager" : "lazy"}" decoding="async" fetchpriority="${eager ? "high" : "low"}"`
            : ""
        }
      />`;
    }

    const theme = String(project.coverTheme || "cobalt").replace(/[^a-z0-9-]/gi, "");
    const variant = Math.min(6, Math.max(1, Number(project.coverVariant) || 1));

    return `
      <div
        class="case-cover case-cover--${theme} case-cover--v${variant}"
        role="img"
        aria-label="${escapeHTML(project.imageAlt || `Original graphic cover for ${project.name}`)}"
      >
        <span class="case-cover-grid" aria-hidden="true"></span>
        <span class="case-cover-shape case-cover-shape-a" aria-hidden="true"></span>
        <span class="case-cover-shape case-cover-shape-b" aria-hidden="true"></span>
        <span class="case-cover-kicker">${escapeHTML(project.client || "Portfolio case")}</span>
        <strong>${escapeHTML(project.coverTitle || project.name)}</strong>
        <span class="case-cover-meta">
          <span>${escapeHTML(String(project.year))}</span>
          ${project.location ? `<span>${escapeHTML(project.location)}</span>` : ""}
        </span>
        <span class="case-cover-monogram" aria-hidden="true">GS</span>
      </div>
    `;
  };

  const projectMediaReelTimers = new Map();
  let projectMediaReelObserver;
  let dialogMediaObserver;

  const connectionPrefersLessData = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return Boolean(
      connection?.saveData ||
        ["slow-2g", "2g"].includes(String(connection?.effectiveType || "").toLowerCase()),
    );
  };

  const loadProjectImage = (image) => {
    if (!image?.dataset.src) return;
    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  };

  const loadProjectVideoPoster = (video) => {
    if (!video?.dataset.poster) return;
    video.poster = video.dataset.poster;
    video.removeAttribute("data-poster");
  };

  const loadProjectVideo = (video, preload = "auto") => {
    if (!video) return;
    if (preload) video.preload = preload;
    const source = video.querySelector("source[data-src]");
    if (!source) return;
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
    video.load();
  };

  const prepareProjectMediaSlide = (slide, { play = false } = {}) => {
    const image = slide?.querySelector("img[data-src]");
    if (image) loadProjectImage(image);

    const video = slide?.querySelector("video");
    if (!video) return;
    loadProjectVideoPoster(video);
    if (play) loadProjectVideo(video);
  };

  const stopProjectMediaReel = (reel) => {
    const timer = projectMediaReelTimers.get(reel);
    if (timer) window.clearInterval(timer);
    projectMediaReelTimers.delete(reel);
  };

  const syncProjectMediaReel = (reel, requestedIndex) => {
    const slides = [...reel.querySelectorAll(".project-media-slide")];
    if (!slides.length) return;

    const index = ((Number(requestedIndex) || 0) % slides.length + slides.length) % slides.length;
    reel.dataset.mediaIndex = String(index);

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      if (isActive) {
        prepareProjectMediaSlide(slide, {
          play: reel.dataset.mediaInView === "true" && !connectionPrefersLessData(),
        });
      }
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));

      const video = slide.querySelector("video");
      if (!video) return;
      video.muted = true;
      if (!isActive || reel.dataset.mediaInView !== "true") {
        video.pause();
        return;
      }
      loadProjectVideo(video);
      video.currentTime = 0;
      video.play().catch(() => {});
    });

    // Prepare one slide ahead while the current slide is visible. Card videos
    // use short 720p preview files, so preloading the next one keeps the cross-
    // fade smooth without pulling the much larger detail encode into the grid.
    const nextSlide = slides[(index + 1) % slides.length];
    const nextImage = nextSlide?.querySelector("img[data-src]");
    if (nextImage) loadProjectImage(nextImage);
    const nextVideo = nextSlide?.querySelector("video");
    if (nextVideo && reel.dataset.mediaInView === "true" && !connectionPrefersLessData()) {
      loadProjectVideoPoster(nextVideo);
      loadProjectVideo(nextVideo, "auto");
    }
  };

  const startProjectMediaReel = (reel) => {
    if (reel.dataset.mediaInView !== "true") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (connectionPrefersLessData()) return;
    if (projectMediaReelTimers.has(reel)) return;

    const slides = reel.querySelectorAll(".project-media-slide");
    if (slides.length < 2) return;

    const delay = safeCropNumber(reel.dataset.mediaAutoplay, 2200, 1200, 10000);
    const timer = window.setInterval(() => {
      syncProjectMediaReel(reel, Number(reel.dataset.mediaIndex) + 1);
    }, delay);
    projectMediaReelTimers.set(reel, timer);
  };

  const setupProjectMediaReels = (root = document) => {
    const reels = root.querySelectorAll("[data-project-media-reel]");
    if (!reels.length) return;

    if (!projectMediaReelObserver && "IntersectionObserver" in window) {
      projectMediaReelObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const reel = entry.target;
            reel.dataset.mediaInView = String(entry.isIntersecting);
            if (entry.isIntersecting) {
              syncProjectMediaReel(reel, Number(reel.dataset.mediaIndex));
              startProjectMediaReel(reel);
            } else {
              stopProjectMediaReel(reel);
              reel.querySelectorAll("video").forEach((video) => video.pause());
            }
          });
        },
        { threshold: 0.2, rootMargin: "80px 0px" },
      );
    }

    reels.forEach((reel) => {
      if (reel.dataset.mediaReelReady === "true") return;
      reel.dataset.mediaReelReady = "true";
      reel.addEventListener("pointerenter", () => stopProjectMediaReel(reel));
      reel.addEventListener("pointerleave", () => startProjectMediaReel(reel));
      reel.addEventListener("focusin", () => stopProjectMediaReel(reel));
      reel.addEventListener("focusout", () => startProjectMediaReel(reel));

      if (projectMediaReelObserver) projectMediaReelObserver.observe(reel);
      else {
        reel.dataset.mediaInView = "true";
        syncProjectMediaReel(reel, 0);
        startProjectMediaReel(reel);
      }
    });
  };

  const stopDialogMedia = () => {
    dialogMediaObserver?.disconnect();
    dialogMediaObserver = undefined;
    dialogContent.querySelectorAll("video").forEach((video) => video.pause());
  };

  const setupDialogMedia = () => {
    stopDialogMedia();

    const media = [...dialogContent.querySelectorAll("img[data-src], video")];
    if (!media.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const allowVideo = !reduceMotion && !connectionPrefersLessData();

    if (!("IntersectionObserver" in window)) {
      media.forEach((item) => {
        if (item.matches("img")) loadProjectImage(item);
        else if (allowVideo) {
          loadProjectVideo(item);
          item.muted = true;
          item.play().catch(() => {});
        }
      });
      return;
    }

    dialogMediaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target;
          if (item.matches("img")) {
            if (entry.isIntersecting) {
              loadProjectImage(item);
              dialogMediaObserver?.unobserve(item);
            }
            return;
          }

          if (!entry.isIntersecting || !allowVideo) {
            item.pause();
            return;
          }

          loadProjectVideo(item);
          item.muted = true;
          item.play().catch(() => {});
        });
      },
      { threshold: 0.05, rootMargin: "120px 0px" },
    );

    media.forEach((item) => dialogMediaObserver.observe(item));
  };

  const projectCard = (project, index, card) => `
    <article
      class="project-card${card ? "" : " project-card--hero"} reveal"
      ${card ? `style="--w:${card.weight};--card-aspect:${card.aspect.toFixed(4)}"` : ""}
    >
      <button
        class="project-open"
        type="button"
        data-project-id="${escapeHTML(project.id)}"
        aria-haspopup="dialog"
        aria-label="Open ${escapeHTML(project.name)}"
      ></button>
      <figure class="project-image-wrap">
        ${projectVisual(project, "card", index < 2)}
        ${
          hasLicensedImage(project)
            ? `<span class="project-image-credit">${escapeHTML(project.imageCredit)}</span>`
            : ""
        }
      </figure>
      <div class="project-info">
        <p class="project-meta">
          <span class="project-count">${String(index + 1).padStart(2, "0")}</span>
          <span class="project-date">
            ${escapeHTML(projectDate(project))}${project.location ? ` · ${escapeHTML(project.location)}` : ""}
          </span>
        </p>
        <h3>${escapeHTML(project.name)} <span class="ui-arrow ui-arrow--se" aria-hidden="true"></span></h3>
      </div>
    </article>
  `;

  const renderProjects = () => {
    projectCount.textContent = String(sortedProjects.length).padStart(2, "0");

    let index = 0;
    projectList.innerHTML = projectRows(sortedProjects)
      .map(
        (row) => `<div class="project-row${row.hero ? " project-row--hero" : ""}">
          ${row.items
            .map((project, position) => projectCard(project, index++, row.cards?.[position]))
            .join("")}
        </div>`,
      )
      .join("");

    observeReveals();
    setupProjectMediaReels(projectList);
  };

  const renderClients = () => {
    clientGrid.innerHTML = clients
      .map((client) => {
        const entry = typeof client === "string" ? { name: client } : client;
        const logoClasses = [
          "client-logo-image",
          entry.invertLogo ? "is-inverted" : "",
          entry.blendLogo ? "is-blended" : "",
          entry.logoVariant ? `is-${entry.logoVariant}` : "",
        ]
          .filter(Boolean)
          .join(" ");
        const mark = entry.logo
          ? `<img
              class="${logoClasses}"
              src="${escapeHTML(entry.logo)}"
              alt="${escapeHTML(entry.name)}"
              loading="lazy"
            />`
          : `<span class="client-logo-fallback${entry.wordmarkClass ? ` is-${escapeHTML(entry.wordmarkClass)}` : ""}">${escapeHTML(entry.name)}</span>`;

        return `
          <div class="client-tile reveal">
            ${mark}
            ${
              entry.descriptor
                ? `<span class="client-logo-detail" aria-hidden="true">${escapeHTML(entry.descriptor)}</span>`
                : ""
            }
          </div>
        `;
      })
      .join("");
  };

  const renderTimeline = () => {
    const orderedCV = [...cv].sort(
      (a, b) => Number(b.sortYear || b.startYear) - Number(a.sortYear || a.startYear),
    );

    const entryMarkup = (entry, index) => {
          const detailId = `cv-details-${index}`;
          const hasDetails = entry.details?.length;

          return `
          <article class="timeline-row reveal">
            <p class="timeline-period">${escapeHTML(entry.period)}</p>
            <div class="timeline-role">
              <h3>${escapeHTML(entry.role)}</h3>
              <p>
                ${escapeHTML(entry.organization)}
                ${entry.location ? `<span>· ${escapeHTML(entry.location)}</span>` : ""}
              </p>
            </div>
            <span class="timeline-type">${escapeHTML(entry.type)}</span>
            ${
              hasDetails
                ? `<button
                    class="timeline-toggle"
                    type="button"
                    aria-expanded="false"
                    aria-controls="${detailId}"
                    aria-label="Show details for ${escapeHTML(entry.role)} at ${escapeHTML(entry.organization)}"
                  >
                    <span class="ui-arrow ui-arrow--se" aria-hidden="true"></span>
                  </button>
                  <div class="timeline-details" id="${detailId}" hidden>
                    <ol>
                      ${entry.details.map((detail) => `<li>${escapeHTML(detail)}</li>`).join("")}
                    </ol>
                  </div>`
                : '<span class="timeline-toggle-placeholder" aria-hidden="true"></span>'
            }
          </article>
        `;
    };

    const groups = ["Experience", "Education"];
    timeline.innerHTML = groups
      .map((type, groupIndex) => {
        const entries = orderedCV.filter((entry) => entry.type === type);
        if (!entries.length) return "";

        return `
          <section class="timeline-group timeline-group-${type.toLowerCase()}" aria-labelledby="cv-group-${type.toLowerCase()}">
            <div class="timeline-group-heading reveal">
              <p>${String(groupIndex + 1).padStart(2, "0")}</p>
              <h3 id="cv-group-${type.toLowerCase()}">${type}</h3>
              <span>${String(entries.length).padStart(2, "0")}</span>
            </div>
            ${entries.map((entry) => entryMarkup(entry, orderedCV.indexOf(entry))).join("")}
          </section>
        `;
      })
      .join("");
  };

  const openProject = (id) => {
    const project = projects.find((item) => item.id === id);
    if (!project) return;

    const usesLocalMedia = hasLocalProjectMedia(project);
    const projectSources = project.sources || [];

    const referenceLinks = projectSources.length
      ? `<div class="dialog-sources">
          <p>Project references</p>
          <div>
            ${projectSources
              .map(
                ({ label, url }) =>
                  `<a href="${escapeHTML(url)}" target="_blank" rel="noreferrer">${escapeHTML(label)} <span class="ui-arrow" aria-hidden="true"></span></a>`,
              )
              .join("")}
          </div>
        </div>`
      : "";

    const rightsDetails = project.rightsNote
      ? `<div class="dialog-rights-note">
          <p>Image rights note</p>
          <span>${escapeHTML(project.rightsNote)}</span>
          ${
            project.rightsLinks?.length
              ? `<div>${project.rightsLinks
                  .map(
                    ({ label, url }) =>
                      `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} <span class="ui-arrow" aria-hidden="true"></span></a>`,
                  )
                  .join("")}</div>`
              : ""
          }
        </div>`
      : "";

    const visualCaption = usesLocalMedia
      ? ""
      : hasLicensedImage(project)
        ? `<figcaption class="dialog-image-credit">
            <span class="dialog-image-credit-copy">
              <strong>${escapeHTML(project.imageCredit)}</strong>
              ${project.imageUsage ? `<small>${escapeHTML(project.imageUsage)}</small>` : ""}
            </span>
            <span class="dialog-image-credit-links">
              ${
                project.imageSource
                  ? `<a href="${escapeHTML(project.imageSource)}" target="_blank" rel="noopener noreferrer">Source & usage terms</a>`
                  : ""
              }
              ${
                project.imageLicenseUrl
                  ? `<a href="${escapeHTML(project.imageLicenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.imageLicenseLabel || "Licence")}</a>`
                  : ""
              }
            </span>
          </figcaption>`
        : `<figcaption>Original portfolio case cover · linked references below</figcaption>`;

    dialogContent.innerHTML = `
      <figure class="dialog-visual${usesLocalMedia ? " dialog-visual--private-media" : ""}">
        ${projectVisual(project, "dialog")}
        ${visualCaption}
      </figure>
      <div class="dialog-copy">
        <p class="project-type">
          ${escapeHTML(projectType(project))} · ${escapeHTML(projectDate(project))}
          ${project.location ? ` · ${escapeHTML(project.location)}` : ""}
        </p>
        <h2 id="dialog-project-title">${escapeHTML(project.name)}</h2>
        <p id="dialog-project-description">${escapeHTML(project.description)}</p>
        ${
          project.services?.length
            ? `<ul>${project.services.map((service) => `<li>${escapeHTML(service)}</li>`).join("")}</ul>`
            : ""
        }
        ${referenceLinks}
        ${rightsDetails}
      </div>
    `;
    dialog.setAttribute("aria-labelledby", "dialog-project-title");
    dialog.setAttribute("aria-describedby", "dialog-project-description");
    dialog.dataset.projectId = project.id;

    const currentIndex = sortedProjects.findIndex((item) => item.id === project.id);
    const previousProject = sortedProjects[(currentIndex - 1 + sortedProjects.length) % sortedProjects.length];
    const nextProject = sortedProjects[(currentIndex + 1) % sortedProjects.length];
    if (dialogIndex) {
      dialogIndex.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(sortedProjects.length).padStart(2, "0")}`;
    }
    if (dialogPrevBtn) dialogPrevBtn.dataset.projectId = previousProject.id;
    if (dialogNextBtn) dialogNextBtn.dataset.projectId = nextProject.id;

    if (!dialog.open) dialog.showModal();
    // showModal() focuses the first control in the dialog, which left "Prev"
    // looking pressed. Focus the body instead so no control appears active.
    dialogContent.focus({ preventScroll: true });
    document.body.classList.add("dialog-is-open");
    setupDialogMedia();
  };

  const prepareProjectDialogClose = () => {
    stopDialogMedia();
    dialogContent.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.removeAttribute("src");
      video.querySelectorAll("source").forEach((source) => source.removeAttribute("src"));
      video.load();
    });
  };

  document.querySelector(".dialog-close").addEventListener("click", () => {
    prepareProjectDialogClose();
    dialog.close();
  });
  dialog.addEventListener("cancel", prepareProjectDialogClose);
  dialog.addEventListener("close", () => {
    if (!dialog.open) document.body.classList.remove("dialog-is-open");
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      prepareProjectDialogClose();
      dialog.close();
    }
  });

  const navigateDialog = (projectId) => {
    if (!projectId) return;
    prepareProjectDialogClose();
    openProject(projectId);
  };

  // iOS Safari does not apply :active to these buttons on tap, so the fill and
  // rotation never appeared on touch. Hold a class for the transition's length
  // so the feedback is actually visible, however brief the tap.
  const pressFeedback = (event) => {
    const button = event.target.closest(".dialog-nav-btn, .dialog-close");
    if (!button) return;
    button.classList.add("is-pressed");
    window.setTimeout(() => button.classList.remove("is-pressed"), 280);
  };

  document
    .querySelector(".dialog-toolbar")
    ?.addEventListener("pointerdown", pressFeedback);

  dialogPrevBtn?.addEventListener("click", () => navigateDialog(dialogPrevBtn.dataset.projectId));
  dialogNextBtn?.addEventListener("click", () => navigateDialog(dialogNextBtn.dataset.projectId));

  dialog.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowRight") navigateDialog(dialogNextBtn?.dataset.projectId);
    else if (event.key === "ArrowLeft") navigateDialog(dialogPrevBtn?.dataset.projectId);
  });

  projectList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-id]");
    if (button) openProject(button.dataset.projectId);
  });

  timeline.addEventListener("click", (event) => {
    const button = event.target.closest(".timeline-toggle");
    if (!button) return;

    const details = document.querySelector(`#${button.getAttribute("aria-controls")}`);
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.setAttribute(
      "aria-label",
      button.getAttribute("aria-label").replace(isOpen ? "Hide" : "Show", isOpen ? "Show" : "Hide"),
    );
    details.hidden = isOpen;
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (!event.target.matches("a")) return;
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-is-open");
  });

  let revealObserver;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
      );
    }

    document.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => revealObserver.observe(item));
  }

  applySiteContent();
  renderProjects();
  renderClients();
  renderTimeline();
  observeReveals();
  document.querySelector("#current-year").textContent = new Date().getFullYear();
})();
