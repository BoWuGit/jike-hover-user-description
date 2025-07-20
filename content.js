function getJikeToken() {
  return localStorage.getItem('JK_ACCESS_TOKEN');
}

function getUsernameFromAvatar(img) {
  let el = img;
  while (el && el !== document.body) {
    if (el.tagName === "A" && el.href && el.href.includes("/u/")) {
      const match = el.href.match(/\/u\/([^/?#]+)/);
      if (match) return match[1];
    }
    el = el.parentElement;
  }
  return null;
}

function getUsernameFromAnyElement(el) {
  let cur = el;
  while (cur && cur !== document.body) {
    if (cur.tagName === "A" && cur.href && cur.href.includes("/u/")) {
      const match = cur.href.match(/\/u\/([^/?#]+)/);
      if (match) return match[1];
    }
    cur = cur.parentElement;
  }
  return null;
}

function createProfilePopup(user, x, y) {
  const popup = document.createElement("div");
  popup.className = "jike-profile-popup";
  popup.style.position = "fixed";
  popup.style.left = x + 10 + "px";
  popup.style.top = y + 10 + "px";
  popup.style.background = "white";
  popup.style.border = "1px solid #eee";
  popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  popup.style.padding = "16px";
  popup.style.borderRadius = "8px";
  popup.style.zIndex = 9999;
  popup.style.minWidth = "240px";
  popup.style.maxWidth = "340px";
  popup.style.fontSize = "14px";

  let statsHtml = '';
  if (user.statsCount) {
    statsHtml = `
      <div style="display:flex;gap:18px;margin-top:10px;color:#555;">
        <span>关注 <b>${user.statsCount.followingCount ?? '-'}</b></span>
        <span>粉丝 <b>${user.statsCount.followedCount ?? user.statsCount.followerCount ?? '-'}</b></span>
      </div>
    `;
  }

  popup.innerHTML = `
    <div style="display:flex;align-items:center;">
      <img src="${user.avatarImage?.thumbnailUrl || user.profileImageUrl || ""}" style="width:48px;height:48px;border-radius:50%;margin-right:12px;">
      <div>
        <div style="font-weight:bold;font-size:16px;">${user.screenName || ""}</div>
      </div>
    </div>
    <div style="margin-top:10px;white-space:pre-line;color:#333;">${user.bio || user.briefIntro || "暂无简介"}</div>
    ${statsHtml}
    ${user.wechatUserName ? `<div style="margin-top:10px;color:#888;font-size:13px;">WeChat: <b>${user.wechatUserName}</b></div>` : ""}
  `;
  document.body.appendChild(popup);
  return popup;
}

function removeProfilePopup() {
  const popup = document.querySelector(".jike-profile-popup");
  if (popup) popup.remove();
}

let popupTimeout = null;
let lastTarget = null;
const userProfileCache = {};

function handleProfileHover(target, username, x, y) {
  if (target.dataset.jikePopup) return;
  target.dataset.jikePopup = "1";
  lastTarget = target;

  if (userProfileCache[username]) {
    showProfilePopup(userProfileCache[username], target, x, y);
    return;
  }

  const token = getJikeToken();
  if (!token) {
    removeProfilePopup();
    if (target) delete target.dataset.jikePopup;
    return;
  }

  fetch(`https://api.ruguoapp.com/1.0/users/profile?username=${username}`, {
    headers: {
      'X-Jike-Access-Token': token
    }
  })
    .then(resp => {
      if (!resp.ok) throw new Error("API请求失败");
      return resp.json();
    })
    .then(data => {
      const user = data.user;
      if (!user) throw new Error("无用户数据");
      userProfileCache[username] = user;
      showProfilePopup(user, target, x, y);
    })
    .catch(() => {
      removeProfilePopup();
      if (target) delete target.dataset.jikePopup;
    });
}

function showProfilePopup(user, target, x, y) {
  removeProfilePopup();
  const popup = createProfilePopup(user, x, y);

  popup.addEventListener("mouseenter", () => {
    clearTimeout(popupTimeout);
  });
  popup.addEventListener("mouseleave", () => {
    removeProfilePopup();
    if (lastTarget) delete lastTarget.dataset.jikePopup;
  });

  target.addEventListener("mouseleave", function onLeave() {
    popupTimeout = setTimeout(() => {
      removeProfilePopup();
      if (target) delete target.dataset.jikePopup;
    }, 200);
    target.removeEventListener("mouseleave", onLeave);
  });
}

// 统一监听，适配所有元素
document.body.addEventListener("mouseover", function (e) {
  const el = e.target;
  // 头像
  if (el.tagName === "IMG") {
    const username = getUsernameFromAvatar(el);
    if (username) {
      handleProfileHover(el, username, e.clientX, e.clientY);
      return;
    }
  }
  // 其它元素（如用户名span/div等）
  const username = getUsernameFromAnyElement(el);
  if (username) {
    handleProfileHover(el, username, e.clientX, e.clientY);
  }
});

document.body.addEventListener("mousemove", function (e) {
  const popup = document.querySelector(".jike-profile-popup");
  if (popup) {
    popup.style.left = e.clientX + 10 + "px";
    popup.style.top = e.clientY + 10 + "px";
  }
});

(function injectStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    .jike-profile-popup {
      transition: opacity 0.15s;
      opacity: 1;
      pointer-events: auto;
      font-family: system-ui, sans-serif;
    }
    .jike-profile-popup b {
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
})();
