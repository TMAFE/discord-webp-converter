(function () {
  try {
    var url = new URL(window.location.href);
    if (!/^(media|cdn)\.discord(app)?\.(com|net)$/.test(url.hostname)) {
      return;
    }

    var changed = false;
    var format = url.searchParams.get("format");

    if (format === "webp" || format === null) {
      url.searchParams.set("format", "png");
      changed = true;
    }

    if (url.searchParams.has("width")) {
      url.searchParams.delete("width");
      changed = true;
    }
    if (url.searchParams.has("height")) {
      url.searchParams.delete("height");
      changed = true;
    }

    if (!changed) {
      return;
    }

    var newUrl = url.toString();
    if (newUrl !== window.location.href) {
      window.location.replace(newUrl);
    }
  } catch (e) {
  }
})();
