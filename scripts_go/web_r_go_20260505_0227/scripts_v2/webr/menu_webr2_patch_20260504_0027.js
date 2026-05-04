(function() {
  const serviceURL = "/webr/2.0/";
  const serviceTitle = "Web-R 2.0";
  const serviceImage = "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/webr/advanced_webR.png";
  const oldPubMedTitle = "PubMed wordcloud";
  const oldPubMedURL = "/webr/pubmed-wordcloud/";
  const workshopURL = "/workshop/";
  const workshopTitle = "\uC6CC\uD06C\uC0F5";
  const workshopImage = "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_workshop.svg";
  function textOf(node) {
    return (node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasService(root) {
    return Array.from(root.querySelectorAll("[data-webr2-menu], a, div, span")).some((node) => textOf(node) === serviceTitle || node.getAttribute("data-webr2-menu") === "true");
  }
  function removeOldPubMed(root) {
    Array.from(root.querySelectorAll("a, div, ul, li, span")).forEach((node) => {
      const text = textOf(node);
      const href = node.getAttribute && node.getAttribute("href");
      if (href === oldPubMedURL || text === oldPubMedTitle) {
        const removable = node.closest("ul") || node.closest("div") || node;
        if (removable && removable.parentNode && removable.id !== "div_megamenu_webr" && removable.id !== "div_menu_mobile_webr") {
          removable.parentNode.removeChild(removable);
        }
      }
    });
  }
  function findMemberNode(root) {
    return Array.from(root.querySelectorAll("ul, div, li, span")).find((node) => textOf(node) === "\uC815\uD68C\uC6D0 \uC11C\uBC84 \uC811\uC18D") || Array.from(root.querySelectorAll("ul, div, li")).find((node) => textOf(node).includes("\uC815\uD68C\uC6D0 \uC11C\uBC84 \uC811\uC18D"));
  }
  function createDesktopItem() {
    const list = document.createElement("ul");
    list.className = "my-4 space-y-4";
    list.setAttribute("data-webr2-menu", "true");
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = serviceURL;
    link.className = "flex flex-col justify-center items-center px-4 py-2 w-full hover:border hover:border-blue-300 hover:bg-blue-100";
    link.setAttribute("data-webr2-menu-link", "true");
    const img = document.createElement("img");
    img.src = serviceImage;
    img.alt = serviceTitle;
    img.className = "object-scale-down h-[80px] w-[120px] max-w-full mb-2";
    link.appendChild(img);
    link.appendChild(document.createTextNode(serviceTitle));
    item.appendChild(link);
    list.appendChild(item);
    return list;
  }
  function createMobileItem() {
    const item = document.createElement("div");
    item.className = "flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100";
    item.setAttribute("data-webr2-menu", "true");
    item.addEventListener("click", () => {
      location.href = serviceURL;
    });
    const title = document.createElement("span");
    title.className = "flex flex-row w-full";
    title.textContent = `- ${serviceTitle}`;
    item.appendChild(title);
    return item;
  }
  function hasWorkshopItem(root) {
    return Array.from(root.querySelectorAll("[data-workshop-menu], a, div, span")).some((node) => {
      const href = node.getAttribute && node.getAttribute("href");
      return node.getAttribute("data-workshop-menu") === "true" || href === workshopURL || textOf(node) === workshopTitle;
    });
  }
  function createDesktopWorkshopItem() {
    const list = document.createElement("ul");
    list.className = "my-4 space-y-4";
    list.setAttribute("data-workshop-menu", "true");
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = workshopURL;
    link.className = "flex flex-col justify-center items-center px-4 py-2 w-full hover:border hover:border-blue-300 hover:bg-blue-100";
    const img = document.createElement("img");
    img.src = workshopImage;
    img.alt = workshopTitle;
    img.className = "object-scale-down h-[80px] w-[120px] max-w-full mb-2";
    const title = document.createElement("span");
    title.textContent = workshopTitle;
    link.appendChild(img);
    link.appendChild(title);
    item.appendChild(link);
    list.appendChild(item);
    return list;
  }
  function createMobileWorkshopItem() {
    const item = document.createElement("div");
    item.className = "flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100";
    item.setAttribute("data-workshop-menu", "true");
    item.addEventListener("click", () => {
      location.href = workshopURL;
    });
    const title = document.createElement("span");
    title.className = "flex flex-row w-full";
    title.textContent = workshopTitle;
    item.appendChild(title);
    return item;
  }
  function patchDesktopMenu() {
    const menu = document.getElementById("div_megamenu_webr");
    if (!menu)
      return false;
    removeOldPubMed(menu);
    if (hasService(menu))
      return true;
    const grid = menu.querySelector(".grid");
    if (!grid)
      return false;
    grid.classList.remove("grid-cols-3");
    grid.classList.add("grid-cols-4");
    const memberTextNode = findMemberNode(grid);
    const memberList = memberTextNode ? memberTextNode.closest("ul") || memberTextNode : null;
    if (!memberList || !memberList.parentNode)
      return false;
    memberList.parentNode.insertBefore(createDesktopItem(), memberList.nextSibling);
    return true;
  }
  function patchMobileMenu() {
    const menu = document.getElementById("div_menu_mobile_webr");
    if (!menu)
      return false;
    removeOldPubMed(menu);
    if (hasService(menu))
      return true;
    const memberNode = findMemberNode(menu);
    const memberItem = memberNode ? memberNode.closest("div") || memberNode : null;
    if (!memberItem || !memberItem.parentNode)
      return false;
    memberItem.parentNode.insertBefore(createMobileItem(), memberItem.nextSibling);
    return true;
  }
  function patchDesktopWorkshopMenu() {
    const menu = document.getElementById("div_megamenu_workshop");
    if (!menu)
      return false;
    const container = menu.querySelector(".flex, .grid") || menu.firstElementChild;
    if (!container)
      return false;
    container.className = "grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600";
    const columns = Array.from(container.children).filter((node) => node.tagName && node.tagName.toLowerCase() === "ul");
    columns.forEach((node) => node.classList.remove("col-start-2"));
    if (columns.length === 2) {
      columns[0].classList.add("col-start-2");
    }
    if (hasWorkshopItem(menu))
      return true;
    container.appendChild(createDesktopWorkshopItem());
    const updatedColumns = Array.from(container.children).filter((node) => node.tagName && node.tagName.toLowerCase() === "ul");
    updatedColumns.forEach((node) => node.classList.remove("col-start-2"));
    if (updatedColumns.length === 2) {
      updatedColumns[0].classList.add("col-start-2");
    }
    return true;
  }
  function patchMobileWorkshopMenu() {
    const menu = document.getElementById("div_menu_mobile_workshop");
    if (!menu)
      return false;
    if (hasWorkshopItem(menu))
      return true;
    menu.appendChild(createMobileWorkshopItem());
    return true;
  }
  function runPatch() {
    wrapDivMenu();
    const desktopReady = patchDesktopMenu();
    const mobileReady = patchMobileMenu();
    const workshopDesktopReady = patchDesktopWorkshopMenu();
    const workshopMobileReady = patchMobileWorkshopMenu();
    return desktopReady && mobileReady && workshopDesktopReady && workshopMobileReady;
  }
  function wrapDivMenu() {
    if (window.__webr2DivMenuWrapped)
      return;
    if (typeof Div_menu !== "function" || !window.React || !React.useEffect)
      return;
    const originalDivMenu = Div_menu;
    Div_menu = function WebR2DivMenuWrapper() {
      const element = originalDivMenu.apply(this, arguments);
      React.useEffect(() => {
        runPatch();
        window.setTimeout(runPatch, 0);
        window.setTimeout(runPatch, 50);
        window.setTimeout(runPatch, 200);
      }, []);
      return element;
    };
    window.__webr2DivMenuWrapped = true;
  }
  function start() {
    let attempts = 0;
    let scheduled = false;
    const maxAttempts = 80;
    function schedulePatch() {
      if (scheduled)
        return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        runPatch();
      });
    }
    const observer = new MutationObserver(() => {
      attempts += 1;
      schedulePatch();
      if (attempts >= maxAttempts) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    runPatch();
    document.addEventListener("mouseover", (event) => {
      const target = event.target && event.target.closest ? event.target.closest("#div_menu, #div_megamenu_webr, #div_megamenu_workshop, #div_menu_mobile") : null;
      if (target)
        schedulePatch();
    }, true);
    document.addEventListener("click", (event) => {
      const target = event.target && event.target.closest ? event.target.closest("#div_menu, #div_megamenu_webr, #div_megamenu_workshop, #div_menu_mobile") : null;
      if (target)
        schedulePatch();
    }, true);
    const timer = setInterval(() => {
      attempts += 1;
      wrapDivMenu();
      runPatch();
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        observer.disconnect();
      }
    }, 150);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
