(function () {
  const pubmedURL = "/webr/pubmed-wordcloud/";
  const pubmedTitle = "PubMed wordcloud";
  const pubmedImage = "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/webr/advanced_pubmed.png";

  function hasPubMedLink(root) {
    return !!root.querySelector(`a[href="${pubmedURL}"], [url="${pubmedURL}"]`);
  }

  function makeDesktopItem() {
    const ul = document.createElement("ul");
    ul.className = "my-4 space-y-4";

    const li = document.createElement("li");
    li.className = "w-full";

    const link = document.createElement("a");
    link.href = pubmedURL;
    link.className = "flex flex-col justify-center items-center px-4 py-2 w-full hover:border hover:border-blue-300 hover:bg-blue-100";

    const img = document.createElement("img");
    img.src = pubmedImage;
    img.alt = pubmedTitle;
    img.className = "object-scale-down h-[80px] w-[120px] max-w-full mb-2";

    const text = document.createTextNode(pubmedTitle);
    link.appendChild(img);
    link.appendChild(text);
    li.appendChild(link);
    ul.appendChild(li);
    return ul;
  }

  function makeMobileItem() {
    const row = document.createElement("div");
    row.className = "flex justify-center items-start w-full h-[40px] cursor-pointer hover:bg-blue-100 px-[20px]";
    row.setAttribute("data-webr-pubmed-menu", "1");
    row.addEventListener("click", () => {
      location.href = pubmedURL;
    });

    const span = document.createElement("span");
    span.className = "flex flex-row w-full";
    span.textContent = pubmedTitle;
    row.appendChild(span);
    return row;
  }

  function patchDesktopMenu() {
    const menu = document.getElementById("div_megamenu_webr");
    if (!menu || hasPubMedLink(menu)) return false;

    const grid = menu.querySelector("div");
    if (!grid) return false;

    grid.className = grid.className
      .replace("grid-cols-3", "grid-cols-4")
      .replace("space-x-12", "")
      .replace("flex justify-center", "grid grid-cols-4");

    const columns = Array.from(grid.querySelectorAll(":scope > ul"));
    const memberColumn = columns.find((ul) => (ul.textContent || "").includes("정회원 서버 접속"));
    if (memberColumn && memberColumn.nextSibling) {
      grid.insertBefore(makeDesktopItem(), memberColumn.nextSibling);
    } else {
      grid.appendChild(makeDesktopItem());
    }
    return true;
  }

  function patchMobileMenu() {
    const menu = document.getElementById("div_menu_mobile_webr");
    if (!menu || hasPubMedLink(menu)) return false;

    const rows = Array.from(menu.children);
    const memberRow = rows.find((row) => (row.textContent || "").includes("정회원 서버 접속"));
    if (memberRow && memberRow.nextSibling) {
      menu.insertBefore(makeMobileItem(), memberRow.nextSibling);
    } else {
      menu.appendChild(makeMobileItem());
    }
    return true;
  }

  function patchMenus() {
    const desktopDone = patchDesktopMenu() || !!document.querySelector(`#div_megamenu_webr a[href="${pubmedURL}"]`);
    const mobileDone = patchMobileMenu() || !!document.querySelector(`#div_menu_mobile_webr [data-webr-pubmed-menu="1"]`);
    return desktopDone && mobileDone;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", patchMenus);
  } else {
    patchMenus();
  }

  let attempts = 0;
  const observer = new MutationObserver(() => {
    attempts += 1;
    if (patchMenus() || attempts > 40) {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
