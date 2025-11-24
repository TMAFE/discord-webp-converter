function isDiscordMediaHost(hostname) {
  return /^(media|cdn)\.discord(app)?\.(com|net)$/.test(hostname);
}

function fixImageUrl(img) {
  if (!img || !img.src) return;

  var url;
  try {
    url = new URL(img.src);
  } catch (e) {
    return;
  }

  if (!isDiscordMediaHost(url.hostname)) {
    return;
  }

  var changed = false;

  var format = url.searchParams.get("format");
  if (format !== "png") {
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

  if (changed) {
    var newSrc = url.toString();
    if (newSrc !== img.src) {
      img.src = newSrc;
    }
  }


  if (img.hasAttribute("srcset")) {
    img.removeAttribute("srcset");
  }
  if (img.hasAttribute("data-srcset")) {
    img.removeAttribute("data-srcset");
  }
}

function scanImages(root) {
  if (!root) root = document;

  var selector =
    'img[src*="media.discordapp.net/attachments/"], ' +
    'img[src*="cdn.discordapp.com/attachments/"], ' +
    'img[src*="media.discord.com/attachments/"], ' +
    'img[src*="cdn.discord.com/attachments/"]';

  var imgs = root.querySelectorAll(selector);
  for (var i = 0; i < imgs.length; i++) {
    fixImageUrl(imgs[i]);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    scanImages(document);
  });
} else {
  scanImages(document);
}

var observer = new MutationObserver(function (mutations) {
  for (var i = 0; i < mutations.length; i++) {
    var m = mutations[i];
    for (var j = 0; j < m.addedNodes.length; j++) {
      var node = m.addedNodes[j];
      if (node.nodeType !== 1) continue;

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
