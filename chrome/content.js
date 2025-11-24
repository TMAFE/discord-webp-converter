function isDiscordMediaHost(hostname) {
  return /^(media|cdn)\.discord(app)?\.(com|net)$/.test(hostname);
}

function fixImageUrl(img) {
  if (!img || !img.src) return;

  let url;
  try {
    url = new URL(img.src);
  } catch {
    return;
  }

  if (!isDiscordMediaHost(url.hostname)) {
    return;
  }

  let changed = false;


  const currentFormat = url.searchParams.get("format");
  if (currentFormat !== "png") {
    url.searchParams.set("format", "png");
    changed = true;
  }


  if (url.searchParams.has("width") || url.searchParams.has("height")) {
    url.searchParams.delete("width");
    url.searchParams.delete("height");
    changed = true;
  }

  if (changed) {
    const newSrc = url.toString();
    if (newSrc !== img.src) {
      img.src = newSrc;
    }
  }
}

function scanImages(root = document) {
  const imgs = root.querySelectorAll(
    'img[src*="media.discordapp.net/attachments/"], ' +
    'img[src*="cdn.discordapp.com/attachments/"], ' +
    'img[src*="media.discord.com/attachments/"], ' +
    'img[src*="cdn.discord.com/attachments/"]'
  );
  imgs.forEach(fixImageUrl);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => scanImages());
} else {
  scanImages();
}

// feel like I should leave a comment for this one, this one should* (hopefully) check for new images/messages to convert
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (!(node instanceof Element)) continue;

      if (node.tagName === "IMG") {
        fixImageUrl(node);
      } else {
        scanImages(node);
      }
    }
  }
});

if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
