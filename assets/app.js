(function () {
  var data = (window.HISTORY || []).slice().sort(function (a, b) { return b.year - a.year; });

  // 내용의 키워드로 분류를 자동 지정합니다.
  var CATEGORIES = [
    { key: "all", label: "모든 분류" },
    { key: "mou", label: "업무협약", test: /업무협약/ },
    { key: "award", label: "선정·수상", test: /선정|입상|수상/ },
    { key: "pr", label: "발간·보도", test: /발간|보도|전시|평가/ },
    { key: "program", label: "사업·행사" }
  ];
  function categorize(text) {
    for (var i = 1; i < CATEGORIES.length - 1; i++) {
      if (CATEGORIES[i].test.test(text)) return CATEGORIES[i];
    }
    return CATEGORIES[CATEGORIES.length - 1];
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // 「…」 로 묶인 사업명을 강조
  function format(text) {
    return escapeHtml(text).replace(/「([^」]+)」/g, '<strong>「$1」</strong>');
  }

  var state = { year: "all", cat: "all" };
  var tabs = document.querySelector(".year-tabs");
  var filters = document.querySelector(".filters");
  var timeline = document.getElementById("timeline");

  function button(label, active, onClick, role) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    if (role) b.setAttribute("role", role);
    b.setAttribute(role === "tab" ? "aria-selected" : "aria-pressed", active ? "true" : "false");
    b.className = active ? "is-active" : "";
    b.addEventListener("click", onClick);
    return b;
  }

  function renderControls() {
    tabs.innerHTML = "";
    tabs.appendChild(button("전체", state.year === "all", function () { state.year = "all"; render(); }, "tab"));
    data.forEach(function (y) {
      tabs.appendChild(button(y.year + "년", state.year === y.year, function () { state.year = y.year; render(); }, "tab"));
    });
    filters.innerHTML = "";
    CATEGORIES.forEach(function (c) {
      var b = button(c.label, state.cat === c.key, function () { state.cat = c.key; render(); });
      b.className += " chip chip-" + c.key;
      filters.appendChild(b);
    });
  }

  function renderTimeline() {
    var html = "";
    var total = 0;
    data.forEach(function (y) {
      if (state.year !== "all" && state.year !== y.year) return;
      var items = y.items.filter(function (it) {
        return state.cat === "all" || categorize(it.text).key === state.cat;
      });
      if (!items.length) return;
      total += items.length;
      html += '<section class="year-block"><h2 class="year">' + y.year + '<span class="count">' + items.length + '건</span></h2><ol class="events">';
      items.forEach(function (it) {
        var c = categorize(it.text);
        var parts = it.date.split(".");
        html += '<li class="event"><time datetime="' + y.year + "-" + parts[0] + "-" + parts[1] + '">' +
          '<span class="m">' + parseInt(parts[0], 10) + '월</span><span class="d">' + parts[1] + '</span></time>' +
          '<div class="body' + (it.image ? " has-photo" : "") + '">' +
          (it.image ? '<button type="button" class="photo" data-src="' + escapeHtml(it.image) + '" data-caption="' + y.year + "." + escapeHtml(it.date + " " + it.text) + '" aria-label="사진 크게 보기">' +
            '<img src="' + escapeHtml(it.image) + '" alt="' + escapeHtml(it.text) + '" loading="lazy" decoding="async" /></button>' : "") +
          '<div class="text"><span class="tag tag-' + c.key + '">' + c.label + '</span><p>' + format(it.text) + "</p></div></div></li>";
      });
      html += "</ol></section>";
    });
    timeline.innerHTML = total ? html : '<p class="empty">해당하는 연혁이 없습니다.</p>';
  }

  function render() { renderControls(); renderTimeline(); }

  // 사진 크게 보기
  var box = document.getElementById("lightbox");
  timeline.addEventListener("click", function (e) {
    var btn = e.target.closest(".photo");
    if (!btn) return;
    box.querySelector("img").src = btn.dataset.src;
    box.querySelector("img").alt = btn.dataset.caption;
    box.querySelector("figcaption").textContent = btn.dataset.caption;
    box.showModal();
  });
  box.addEventListener("click", function (e) {
    if (e.target === box || e.target.closest(".lb-close")) box.close();
  });

  document.getElementById("yr").textContent = new Date().getFullYear();
  render();
})();
