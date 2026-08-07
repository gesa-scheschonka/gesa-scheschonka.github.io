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
  const privacyPanel = document.querySelector("#privacy-panel");
  const privacyCurrent = document.querySelector("[data-privacy-current]");
  const privacyBlockLabel = document.querySelector("[data-instagram-block-label]");
  const privacy = window.PORTFOLIO_PRIVACY;

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

  const normaliseInstagramPost = (value = "") => {
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      const match = url.pathname.match(/^\/(p|reel)\/([a-z0-9_-]+)\/?$/i);

      if (!["instagram.com", "www.instagram.com"].includes(host) || !match) return null;

      return {
        type: match[1].toLowerCase(),
        code: match[2],
        url: `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/`,
      };
    } catch (_error) {
      return null;
    }
  };

  const instagramPosts = (project) => {
    const extraSlides = Array.isArray(project.instagram?.slides) ? project.instagram.slides : [];
    const values = [project.instagram?.url, ...extraSlides];
    const seen = new Set();

    return values.reduce((posts, value) => {
      const post = normaliseInstagramPost(value);
      if (!post || seen.has(post.url)) return posts;
      seen.add(post.url);
      posts.push(post);
      return posts;
    }, []);
  };

  const hasInstagramPost = (project) => instagramPosts(project).length > 0;

  const safeCropNumber = (value, fallback, minimum, maximum) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
  };

  const instagramCardCropStyle = (project, context) => {
    if (context !== "card") return "";

    const crop = project.instagram?.cardCrop || {};
    const requestedAspect = project.instagram?.detailAspect;
    const aspectWidth = safeCropNumber(requestedAspect?.[0], 4, 1, 100);
    const aspectHeight = safeCropNumber(requestedAspect?.[1], 5, 1, 100);
    const mediaHeight = (100 * aspectHeight) / aspectWidth;
    const scale = safeCropNumber(crop.scale, 1, 1, 1.8);
    const mobileScale = safeCropNumber(crop.mobileScale, scale, 1, 1.8);
    const x = safeCropNumber(crop.x, 0, -8, 8);
    const mobileX = safeCropNumber(crop.mobileX, x, -8, 8);
    const y = safeCropNumber(crop.y, 0, -10, 10);
    const mobileY = safeCropNumber(crop.mobileY, y, -10, 10);

    return ` style="--ig-card-aspect:${aspectWidth} / ${aspectHeight};--ig-card-media-height:${mediaHeight.toFixed(3)}cqw;--ig-card-scale:${scale};--ig-card-mobile-scale:${mobileScale};--ig-card-x:${x}rem;--ig-card-mobile-x:${mobileX}rem;--ig-card-y:${y}rem;--ig-card-mobile-y:${mobileY}rem"`;
  };

  const instagramDialogStyle = (project) => {
    const requestedAspect = project.instagram?.detailAspect;
    const aspectWidth = safeCropNumber(requestedAspect?.[0], 4, 1, 100);
    const aspectHeight = safeCropNumber(requestedAspect?.[1], 5, 1, 100);
    const crop = project.instagram?.detailCrop || {};
    const scale = safeCropNumber(crop.scale, 1, 1, 1.8);
    const mobileScale = safeCropNumber(crop.mobileScale, scale, 1, 1.8);
    const x = safeCropNumber(crop.x, 0, -8, 8);
    const mobileX = safeCropNumber(crop.mobileX, x, -8, 8);
    const y = safeCropNumber(crop.y, -3.375, -10, 2);
    const mobileY = safeCropNumber(crop.mobileY, y, -10, 2);
    const maxWidth = Math.min(54, 48 * (aspectWidth / aspectHeight));
    const viewportWidth = 72 * (aspectWidth / aspectHeight);

    return ` style="--ig-detail-aspect:${aspectWidth} / ${aspectHeight};--ig-detail-max-width:${maxWidth.toFixed(3)}rem;--ig-detail-viewport-width:${viewportWidth.toFixed(3)}svh;--ig-detail-scale:${scale};--ig-detail-mobile-scale:${mobileScale};--ig-detail-x:${x}rem;--ig-detail-mobile-x:${mobileX}rem;--ig-detail-y:${y}rem;--ig-detail-mobile-y:${mobileY}rem"`;
  };

  const instagramGate = (project, requestedPost) => {
    const post = requestedPost || instagramPosts(project)[0];
    if (!post) return "";

    return `
      <div class="instagram-gate">
        <div class="instagram-gate-heading">
          <span>${escapeHTML(project.instagram.label || "Instagram post")}</span>
          <span>${escapeHTML(project.instagram.account || "Instagram")}</span>
        </div>
        <strong>${escapeHTML(project.coverTitle || project.name)}</strong>
        <div class="instagram-gate-copy">
          <p>Instagram content is blocked until you allow it.</p>
          <div class="instagram-gate-actions">
            <button type="button" data-allow-instagram aria-controls="privacy-panel">Review & load</button>
            <a href="${escapeHTML(post.url)}" target="_blank" rel="noopener noreferrer">Open post</a>
          </div>
        </div>
      </div>
    `;
  };

  const instagramVisual = (project, context) => {
    const posts = instagramPosts(project);
    if (!posts.length) return "";

    const hasMultiplePosts = posts.length > 1;
    const hasNativeCarousel = project.instagram?.nativeCarousel === true;
    const isCarousel = hasMultiplePosts || hasNativeCarousel;
    const cardAutoplayMs = safeCropNumber(project.instagram?.autoplayMs, 2000, 800, 15000);
    const detailAutoplayMs = safeCropNumber(
      project.instagram?.detailAutoplayMs,
      5000,
      800,
      15000,
    );
    const autoplayMs = context === "dialog" ? detailAutoplayMs : cardAutoplayMs;
    return `
      <div
        class="instagram-visual instagram-visual--${context}${hasMultiplePosts ? " instagram-carousel" : ""}${hasNativeCarousel ? " instagram-native-carousel" : ""}"
        data-instagram-carousel
        data-instagram-index="0"
        data-instagram-slide-count="${posts.length}"
        data-instagram-autoplay="${autoplayMs}"
        data-instagram-card-autoplay="${cardAutoplayMs}"
        data-instagram-detail-autoplay="${detailAutoplayMs}"
        data-instagram-native-carousel="${hasNativeCarousel}"
        ${isCarousel ? 'role="group" aria-roledescription="carousel"' : ""}
        aria-label="${escapeHTML(`${project.name}${isCarousel ? " carousel" : " Instagram post"}`)}"
        ${instagramCardCropStyle(project, context)}
      >
        ${posts
          .map(
            (post, index) => `<div
              class="instagram-carousel-slide${index === 0 ? " is-active" : ""}"
              data-instagram-embed
              data-instagram-post="${escapeHTML(post.url)}"
              data-instagram-title="${escapeHTML(project.name)}"
              data-instagram-context="${escapeHTML(context)}"
              data-instagram-slide-index="${index}"
              aria-hidden="${index === 0 ? "false" : "true"}"
            >${index === 0 ? instagramGate(project, post) : ""}</div>`,
          )
          .join("")}
      </div>
    `;
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
  // width at its own aspect ratio, and every following row is filled edge to
  // edge. Each row cycles through this plan, so any number of projects — now
  // or later — slots in without leaving a short, ragged row.
  const projectRowPlan = [
    { weights: [1.55, 1], ratio: 16 / 9 },
    { weights: [1, 1.35, 1], ratio: 21 / 9 },
    { weights: [1, 1.7], ratio: 2 / 1 },
    { weights: [1.3, 1, 1.15], ratio: 21 / 9 },
  ];

  const projectRows = (items) => {
    if (!items.length) return [];

    const rows = [{ hero: true, items: [items[0]] }];
    let index = 1;

    while (index < items.length) {
      const plan = projectRowPlan[(rows.length - 1) % projectRowPlan.length];
      const remaining = items.length - index;
      let count = Math.min(plan.weights.length, remaining);
      // Absorb a lone trailing project instead of leaving it stranded.
      if (remaining - count === 1) count = remaining;

      const weights = items
        .slice(index, index + count)
        .map((item, position) => plan.weights[position] || 1);
      const total = weights.reduce((sum, weight) => sum + weight, 0);
      // Widening the row keeps tiles from growing too tall when it holds more
      // projects than the plan expected.
      const ratio = plan.ratio * (count / plan.weights.length);

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
      imagePath.startsWith("assets/images/") &&
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

  const localMediaElement = (item, { context = "card", eager = false, autoplay = false } = {}) => {
    const alt = escapeHTML(item.alt || "Event atmosphere");

    if (item.type === "video") {
      return `<video
        class="project-media-asset project-media-video"
        muted
        loop
        playsinline
        preload="metadata"
        ${autoplay ? "autoplay" : ""}
        ${item.poster ? `poster="${escapeHTML(item.poster)}"` : ""}
        aria-label="${alt}"
      ><source src="${escapeHTML(item.src)}" type="video/mp4" /></video>`;
    }

    return `<img
      class="project-media-asset"
      src="${escapeHTML(item.src)}"
      alt="${alt}"
      loading="${eager ? "eager" : "lazy"}"
      decoding="async"
    />`;
  };

  const localMediaPreview = (project, eager = false) => {
    const items = localProjectMedia(project).filter((item) => item.preview !== false);

    const baseDelay = safeCropNumber(project.mediaAutoplay, 1500, 1000, 10000);
    const panelItems = [
      [items[0], items[3]],
      [items[1], items[4]],
      [items[2], items[5]],
    ];

    const panel = (panelClass, mediaItems, panelIndex) => {
      const validItems = mediaItems.filter(Boolean);
      if (!validItems.length) return "";

      return `<div
        class="project-media-reel project-media-panel project-media-panel--${panelClass}"
        data-project-media-reel
        data-media-index="0"
        data-media-autoplay="${baseDelay + panelIndex * 450}"
        aria-hidden="true"
      >
        ${validItems
          .map(
            (item, index) => `<div
              class="project-media-slide${index === 0 ? " is-active" : ""}"
              aria-hidden="${index === 0 ? "false" : "true"}"
            >${localMediaElement(item, {
              context: "card",
              eager: eager && panelIndex === 0 && index === 0,
            })}</div>`,
          )
          .join("")}
      </div>`;
    };

    return `<div
      class="project-media-collage"
      role="img"
      aria-label="Atmospheric media edit for ${escapeHTML(project.name)}"
    >
      ${panel("primary", panelItems[0], 0)}
      ${panel("secondary", panelItems[1], 1)}
      ${panel("tertiary", panelItems[2], 2)}
    </div>`;
  };

  const declumpVideos = (items) => {
    const videos = items.filter((item) => item.type === "video");
    const rest = items.filter((item) => item.type !== "video");
    if (!videos.length || !rest.length) return items;

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
    return result;
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
                const isVideo = item.type === "video";
                const weight = (plan.weights[position] || 1) * (item.size === "lg" ? 1.3 : 1);
                const eager = itemIndex++ < 4;

                return `<figure
                  class="dialog-private-collage-item dialog-private-collage-item--${item.type}${item === lastItem ? " is-mobile-wide" : ""}"
                  style="--w:${weight.toFixed(3)}"
                >${localMediaElement(item, { context: "dialog", eager, autoplay: isVideo })}</figure>`;
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
      return `<img
        class="project-image${context === "dialog" ? " dialog-image" : ""}"
        src="${escapeHTML(project.image)}"
        alt="${escapeHTML(project.imageAlt || project.name)}"
        ${context === "card" && objectPosition ? `style="object-position:${objectPosition}"` : ""}
        ${context === "card" ? `loading="${eager ? "eager" : "lazy"}"` : ""}
      />`;
    }

    if (hasInstagramPost(project)) {
      return instagramVisual(project, context);
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
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));

      const video = slide.querySelector("video");
      if (!video) return;
      video.muted = true;
      if (!isActive || reel.dataset.mediaInView !== "true") {
        video.pause();
        return;
      }
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  };

  const startProjectMediaReel = (reel) => {
    if (reel.dataset.mediaInView !== "true") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
        { threshold: 0.2, rootMargin: "200px 0px" },
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

  let instagramObserver;
  const instagramCarouselTimers = new Map();
  let borrowedInstagramVisual = null;
  let pendingInstagramProjectId = null;

  const instagramConsent = () => privacy?.getInstagram() ?? null;

  const syncInstagramCarousel = (carousel, requestedIndex) => {
    const slides = [...carousel.querySelectorAll(".instagram-carousel-slide")];
    if (!slides.length) return;

    const index = ((Number(requestedIndex) || 0) % slides.length + slides.length) % slides.length;
    carousel.dataset.instagramIndex = String(index);

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    const figure = carousel.closest(".dialog-visual--instagram");
    const status = figure?.querySelector(".instagram-carousel-status");
    if (status) status.textContent = `${index + 1} / ${slides.length}`;

    const activePost = slides[index].dataset.instagramPost;
    const activeLink = figure?.querySelector("[data-instagram-active-link]");
    if (activeLink && activePost) activeLink.href = activePost;
    if (slides[index].dataset.instagramLoaded !== "true") loadInstagramEmbed(slides[index]);
  };

  const stopInstagramCarousel = (carousel) => {
    const timer = instagramCarouselTimers.get(carousel);
    if (timer) window.clearInterval(timer);
    instagramCarouselTimers.delete(carousel);
  };

  const startInstagramCarousel = (carousel) => {
    if (instagramConsent() !== true) {
      stopInstagramCarousel(carousel);
      return;
    }
    if (Number(carousel.dataset.instagramSlideCount) < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (instagramCarouselTimers.has(carousel)) return;

    const slides = [...carousel.querySelectorAll(".instagram-carousel-slide")];
    if (slides.filter((slide) => slide.dataset.instagramReady === "true").length < 2) return;

    const delay = safeCropNumber(carousel.dataset.instagramAutoplay, 1000, 800, 15000);
    const timer = window.setInterval(() => {
      if (!carousel.isConnected) {
        stopInstagramCarousel(carousel);
        return;
      }
      const currentIndex = Number(carousel.dataset.instagramIndex) || 0;
      const nextIndex = (currentIndex + 1) % slides.length;
      if (slides[nextIndex].dataset.instagramReady !== "true") return;
      syncInstagramCarousel(carousel, nextIndex);
    }, delay);
    instagramCarouselTimers.set(carousel, timer);
  };

  const startInstagramCarousels = (root = document) => {
    root.querySelectorAll("[data-instagram-carousel]").forEach(startInstagramCarousel);
  };

  const stopInstagramCarousels = (root = document) => {
    root.querySelectorAll("[data-instagram-carousel]").forEach(stopInstagramCarousel);
  };

  const moveLoadedInstagramVisual = (sourceCarousel, targetCarousel) => {
    restoreBorrowedInstagramVisual();
    if (!sourceCarousel || !targetCarousel) return;

    stopInstagramCarousel(sourceCarousel);
    const placeholder = document.createComment("Instagram preview returns here");
    sourceCarousel.replaceWith(placeholder);
    targetCarousel.replaceWith(sourceCarousel);
    sourceCarousel.classList.remove("instagram-visual--card");
    sourceCarousel.classList.add("instagram-visual--dialog");
    sourceCarousel.dataset.instagramAutoplay = sourceCarousel.dataset.instagramDetailAutoplay || "5000";
    sourceCarousel.querySelectorAll("[data-instagram-embed]").forEach((slide) => {
      slide.dataset.instagramContext = "dialog";
    });
    sourceCarousel.querySelectorAll(".instagram-embed-frame").forEach((frame) => {
      frame.className = "instagram-embed-frame instagram-embed-frame--dialog";
    });
    borrowedInstagramVisual = { sourceCarousel, placeholder };
    syncInstagramCarousel(sourceCarousel, 0);
  };

  const restoreBorrowedInstagramVisual = () => {
    if (!borrowedInstagramVisual) return;
    const { sourceCarousel, placeholder } = borrowedInstagramVisual;
    sourceCarousel.classList.remove("instagram-visual--dialog");
    sourceCarousel.classList.add("instagram-visual--card");
    sourceCarousel.dataset.instagramAutoplay = sourceCarousel.dataset.instagramCardAutoplay || "2000";
    sourceCarousel.querySelectorAll("[data-instagram-embed]").forEach((slide) => {
      slide.dataset.instagramContext = "card";
    });
    sourceCarousel.querySelectorAll(".instagram-embed-frame").forEach((frame) => {
      frame.className = "instagram-embed-frame instagram-embed-frame--card";
    });
    if (placeholder.isConnected) placeholder.replaceWith(sourceCarousel);
    borrowedInstagramVisual = null;
    startInstagramCarousel(sourceCarousel);
  };

  const loadInstagramEmbed = (container) => {
    if (!container?.isConnected || container.dataset.instagramLoaded === "true") return;
    if (instagramConsent() !== true) return;

    const post = normaliseInstagramPost(container.dataset.instagramPost);
    if (!post) return;

    const context = container.dataset.instagramContext === "dialog" ? "dialog" : "card";
    const iframe = document.createElement("iframe");
    iframe.className = `instagram-embed-frame instagram-embed-frame--${context}`;
    iframe.src = `${post.url}embed/`;
    iframe.title = `Instagram post for ${container.dataset.instagramTitle || "portfolio project"}`;
    // The site-level observer already controls when an embed is created. Once
    // created, load it immediately so browser-native iframe laziness cannot
    // make a gallery appear to depend on hover or another paint trigger.
    iframe.loading = "eager";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = "encrypted-media; picture-in-picture; web-share";
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");

    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");

    iframe.addEventListener("load", () => {
      if (
        instagramConsent() !== true ||
        !iframe.isConnected ||
        container.dataset.instagramLoaded !== "true"
      ) {
        return;
      }
      container.dataset.instagramReady = "true";
      const carousel = container.closest("[data-instagram-carousel]");
      if (!carousel) return;
      startInstagramCarousel(carousel);

      // Continue filling the gallery in the background without letting every
      // hidden Instagram frame compete with the currently visible image.
      const nextUnloadedSlide = [...carousel.querySelectorAll(".instagram-carousel-slide")].find(
        (slide) => slide.dataset.instagramLoaded !== "true",
      );
      if (nextUnloadedSlide) {
        const loadNext = () => loadInstagramEmbed(nextUnloadedSlide);
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(loadNext, { timeout: 1200 });
        } else {
          window.setTimeout(loadNext, 250);
        }
      }
    });

    container.querySelector(".instagram-gate")?.setAttribute("hidden", "");
    container.append(iframe);
    container.dataset.instagramLoaded = "true";

    // A gallery only enters this function after its active card has crossed
    // the prewarm boundary. Prioritize its next image so autoplay can start,
    // while later images are loaded progressively by the load handler above.
    if (container.classList.contains("is-active")) {
      const carousel = container.closest("[data-instagram-carousel]");
      const slides = [...(carousel?.querySelectorAll(".instagram-carousel-slide") || [])];
      const currentIndex = slides.indexOf(container);
      const nextSlide = slides[(currentIndex + 1) % slides.length];
      if (nextSlide && nextSlide !== container) loadInstagramEmbed(nextSlide);
    }
  };

  const ensureInstagramObserver = () => {
    if (instagramObserver || !("IntersectionObserver" in window)) return instagramObserver;

    instagramObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          instagramObserver.unobserve(entry.target);
          loadInstagramEmbed(entry.target);
        });
      },
      { rootMargin: "1200px 0px", threshold: 0.01 },
    );

    return instagramObserver;
  };

  const hydrateInstagramEmbeds = (root = document) => {
    if (instagramConsent() !== true) return;

    root
      .querySelectorAll('[data-instagram-embed]:not([data-instagram-loaded="true"])')
      .forEach((container) => {
        const carousel = container.closest("[data-instagram-carousel]");
        if (carousel && !container.classList.contains("is-active")) return;

        if (container.dataset.instagramContext === "dialog") {
          loadInstagramEmbed(container);
          return;
        }

        const observer = ensureInstagramObserver();
        if (observer) observer.observe(container);
        else loadInstagramEmbed(container);
      });

    root.querySelectorAll("[data-instagram-carousel]").forEach((carousel) => {
      const activeSlide = carousel.querySelector(".instagram-carousel-slide.is-active");
      if (activeSlide?.dataset.instagramReady !== "true") return;
      const slides = [...carousel.querySelectorAll(".instagram-carousel-slide")];
      const currentIndex = slides.indexOf(activeSlide);
      const nextSlide = slides[(currentIndex + 1) % slides.length];
      if (nextSlide?.dataset.instagramLoaded !== "true") loadInstagramEmbed(nextSlide);
    });
    startInstagramCarousels(root);
  };

  const resetInstagramEmbeds = () => {
    instagramObserver?.disconnect();
    instagramObserver = undefined;
    stopInstagramCarousels();

    document.querySelectorAll("[data-instagram-embed]").forEach((container) => {
      container.querySelectorAll(".instagram-embed-frame").forEach((frame) => frame.remove());
      container.querySelector(".instagram-gate")?.removeAttribute("hidden");
      delete container.dataset.instagramLoaded;
      delete container.dataset.instagramReady;
    });

    document.querySelectorAll("[data-instagram-carousel]").forEach((carousel) => {
      syncInstagramCarousel(carousel, 0);
    });
  };

  const updatePrivacyStatus = () => {
    const choice = instagramConsent();
    if (privacyCurrent) {
      privacyCurrent.textContent =
        choice === true
          ? "Current choice: Instagram content is allowed."
          : choice === false
            ? "Current choice: Instagram content remains blocked."
            : "No choice saved yet. Instagram content remains blocked.";
    }
    if (privacyBlockLabel) {
      privacyBlockLabel.textContent = choice === true ? "Withdraw & block" : "Keep blocked";
    }
  };

  const setPrivacyExpanded = (expanded) => {
    document.querySelectorAll("[data-privacy-settings]").forEach((trigger) => {
      trigger.setAttribute("aria-expanded", String(expanded));
    });
  };

  const showPrivacyPanel = (moveFocus = false) => {
    if (!privacyPanel) return;
    updatePrivacyStatus();
    privacyPanel.hidden = false;
    setPrivacyExpanded(true);
    if (moveFocus) {
      privacyPanel.querySelector("button")?.focus({ preventScroll: true });
    }
  };

  const hidePrivacyPanel = () => {
    if (privacyPanel) privacyPanel.hidden = true;
    setPrivacyExpanded(false);
  };

  const setInstagramConsent = (allowed) => {
    privacy?.setInstagram(Boolean(allowed));
    hidePrivacyPanel();
  };

  const setupPrivacyControls = () => {
    privacyPanel?.addEventListener("click", (event) => {
      if (event.target.closest("[data-privacy-close]")) {
        hidePrivacyPanel();
        return;
      }
      const choice = event.target.closest("[data-instagram-consent]");
      if (!choice) return;
      setInstagramConsent(choice.dataset.instagramConsent === "true");
    });

    document.addEventListener("click", (event) => {
      const settings = event.target.closest("[data-privacy-settings]");
      if (settings) {
        event.preventDefault();
        showPrivacyPanel(true);
        return;
      }

      const allowButton = event.target.closest("[data-allow-instagram]");
      if (!allowButton) return;
      event.preventDefault();
      event.stopPropagation();
      if (allowButton.closest("dialog[open]")) {
        pendingInstagramProjectId = dialog.dataset.projectId || null;
        stopInstagramCarousels(dialogContent);
        restoreBorrowedInstagramVisual();
        dialog.close();
      }
      showPrivacyPanel(true);
    });

    window.addEventListener("portfolio:privacychange", (event) => {
      updatePrivacyStatus();
      if (event.detail?.instagram === true) {
        hydrateInstagramEmbeds();
        if (pendingInstagramProjectId) {
          const projectId = pendingInstagramProjectId;
          pendingInstagramProjectId = null;
          openProject(projectId);
        }
      } else {
        pendingInstagramProjectId = null;
        resetInstagramEmbeds();
      }
    });

    if (instagramConsent() === null || window.location.hash === "#privacy-settings") {
      showPrivacyPanel(false);
    } else {
      hidePrivacyPanel();
    }
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
          <span class="project-meta-left">
            <span class="project-count">${String(index + 1).padStart(2, "0")}</span>
            <span>${escapeHTML(projectType(project))}</span>
          </span>
          <span class="project-date">
            ${escapeHTML(formatDate(project.year, project.month))}${project.location ? ` · ${escapeHTML(project.location)}` : ""}
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
    hydrateInstagramEmbeds(projectList);
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
    restoreBorrowedInstagramVisual();

    const projectInstagramPosts = instagramPosts(project);
    const instagramPost = projectInstagramPosts[0];
    const usesLocalMedia = hasLocalProjectMedia(project);
    const usesInstagram = !usesLocalMedia && !hasLicensedImage(project) && Boolean(instagramPost);
    const hasMultipleInstagramPosts = usesInstagram && projectInstagramPosts.length > 1;
    const instagramPostUrls = new Set(projectInstagramPosts.map((post) => post.url));
    const projectSources = (project.sources || []).filter((source) => {
      if (!usesInstagram) return true;
      return !instagramPostUrls.has(normaliseInstagramPost(source.url)?.url);
    });

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

    const instagramGalleryTools = hasMultipleInstagramPosts
      ? `<div class="dialog-instagram-carousel-controls" aria-label="Switch gallery image">
                  <button
                    class="instagram-carousel-button instagram-carousel-button--previous"
                    type="button"
                    data-instagram-carousel-previous
                    aria-label="Previous gallery image"
                  ></button>
                  <span class="instagram-carousel-status" aria-live="polite">1 / ${projectInstagramPosts.length}</span>
                  <button
                    class="instagram-carousel-button instagram-carousel-button--next"
                    type="button"
                    data-instagram-carousel-next
                    aria-label="Next gallery image"
                  ></button>
                </div>`
      : "";

    const visualCaption = usesInstagram
      ? `<figcaption class="dialog-instagram-action">
          ${instagramGalleryTools}
          <a
            class="dialog-instagram-link"
            href="${escapeHTML(instagramPost.url)}"
            target="_blank"
            rel="noopener noreferrer"
            data-instagram-active-link
          >View on Instagram <span class="ui-arrow" aria-hidden="true"></span></a>
        </figcaption>`
      : usesLocalMedia
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
      <figure
        class="dialog-visual${usesInstagram ? " dialog-visual--instagram" : ""}${usesLocalMedia ? " dialog-visual--private-media" : ""}"
        ${usesInstagram ? instagramDialogStyle(project) : ""}
      >
        ${projectVisual(project, "dialog")}
        ${visualCaption}
      </figure>
      <div class="dialog-copy">
        <p class="project-type">
          ${escapeHTML(projectType(project))} · ${escapeHTML(formatDate(project.year, project.month))}
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
    const sourceCarousel = document
      .querySelector(`.project-open[data-project-id="${project.id}"]`)
      ?.closest(".project-card")
      ?.querySelector("[data-instagram-carousel]");
    const targetCarousel = dialogContent.querySelector("[data-instagram-carousel]");
    moveLoadedInstagramVisual(sourceCarousel, targetCarousel);

    const currentIndex = sortedProjects.findIndex((item) => item.id === project.id);
    const previousProject = sortedProjects[(currentIndex - 1 + sortedProjects.length) % sortedProjects.length];
    const nextProject = sortedProjects[(currentIndex + 1) % sortedProjects.length];
    if (dialogIndex) {
      dialogIndex.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(sortedProjects.length).padStart(2, "0")}`;
    }
    if (dialogPrevBtn) dialogPrevBtn.dataset.projectId = previousProject.id;
    if (dialogNextBtn) dialogNextBtn.dataset.projectId = nextProject.id;

    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-is-open");
    hydrateInstagramEmbeds(dialogContent);

    const motionVideos = [...dialogContent.querySelectorAll("video")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motionVideos.forEach((video) => {
      video.muted = true;
      if (reduceMotion) video.pause();
      else video.play().catch(() => {});
    });

    const dialogCarousel = dialogContent.querySelector("[data-instagram-carousel]");
    dialogCarousel?.addEventListener("pointerenter", () => stopInstagramCarousel(dialogCarousel));
    dialogCarousel?.addEventListener("pointerleave", () => startInstagramCarousel(dialogCarousel));
    dialogCarousel?.addEventListener("focusin", () => stopInstagramCarousel(dialogCarousel));
    dialogCarousel?.addEventListener("focusout", () => startInstagramCarousel(dialogCarousel));
  };

  const prepareProjectDialogClose = () => {
    stopInstagramCarousels(dialogContent);
    dialogContent.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.removeAttribute("src");
      video.querySelectorAll("source").forEach((source) => source.removeAttribute("src"));
      video.load();
    });
    restoreBorrowedInstagramVisual();
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

  dialogPrevBtn?.addEventListener("click", () => navigateDialog(dialogPrevBtn.dataset.projectId));
  dialogNextBtn?.addEventListener("click", () => navigateDialog(dialogNextBtn.dataset.projectId));

  dialog.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowRight") navigateDialog(dialogNextBtn?.dataset.projectId);
    else if (event.key === "ArrowLeft") navigateDialog(dialogPrevBtn?.dataset.projectId);
  });

  dialogContent.addEventListener("click", (event) => {
    const previous = event.target.closest("[data-instagram-carousel-previous]");
    const next = event.target.closest("[data-instagram-carousel-next]");
    if (!previous && !next) return;

    const carousel = event.target
      .closest(".dialog-visual--instagram")
      ?.querySelector("[data-instagram-carousel]");
    if (!carousel) return;
    const direction = next ? 1 : -1;
    stopInstagramCarousel(carousel);
    syncInstagramCarousel(carousel, Number(carousel.dataset.instagramIndex) + direction);
    startInstagramCarousel(carousel);
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
  setupPrivacyControls();
  renderProjects();
  renderClients();
  renderTimeline();
  observeReveals();
  document.querySelector("#current-year").textContent = new Date().getFullYear();
})();
