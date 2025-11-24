(function () {
  try {
    const url = new URL(window.location.href);

    if (!/^(media|cdn)\.discord(app)?\.(com|net)$/.test(url.hostname)) {
      return;
    }

    let changed = false;

    const format = url.searchParams.get("format");

    if (format === "webp" || format === null) {
      url.searchParams.set("format", "png");
      changed = true;
    }

    if (url.searchParams.has("width") || url.searchParams.has("height")) {
      url.searchParams.delete("width");
      url.searchParams.delete("height");
      changed = true;
    }

    if (!changed) return;

    const newUrl = url.toString();
    if (newUrl !== window.location.href) {
      window.location.replace(newUrl);
    }
  } catch (e) {

  }
})();
