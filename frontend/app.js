const I18N = {
    ko: {
        title: "AI 보안 어시스턴트",
        subtitle: "의심스러운 문자, 링크, 뉴스를 간편하게 확인하세요",
        tab_phishing: "피싱 판별",
        tab_link: "링크 검사",
        tab_factcheck: "팩트체크",
        phishing_placeholder: "의심 문자를 붙여넣으세요...",
        link_placeholder: "링크를 입력하세요...",
        factcheck_placeholder: "확인할 내용을 붙여넣으세요...",
        submit: "검사하기",
        loading: "분석 중...",
    },
    en: {
        title: "AI Security Assistant",
        subtitle: "Easily verify suspicious messages, links, and news",
        tab_phishing: "Phishing Check",
        tab_link: "Link Safety",
        tab_factcheck: "Fact Check",
        phishing_placeholder: "Paste suspicious message here...",
        link_placeholder: "Enter a URL...",
        factcheck_placeholder: "Paste content to fact-check...",
        submit: "Check",
        loading: "Analyzing...",
    },
};

let currentLang = "ko";

function setLang(lang) {
    currentLang = lang;
    const t = I18N[lang];

    document.getElementById("title").textContent = t.title;
    document.getElementById("subtitle").textContent = t.subtitle;
    document.getElementById("tab-phishing").textContent = t.tab_phishing;
    document.getElementById("tab-link").textContent = t.tab_link;
    document.getElementById("tab-factcheck").textContent = t.tab_factcheck;
    document.getElementById("phishing-input").placeholder = t.phishing_placeholder;
    document.getElementById("link-input").placeholder = t.link_placeholder;
    document.getElementById("factcheck-input").placeholder = t.factcheck_placeholder;

    document.querySelectorAll(".submit").forEach((btn) => (btn.textContent = t.submit));
    document.getElementById("btn-ko").classList.toggle("active", lang === "ko");
    document.getElementById("btn-en").classList.toggle("active", lang === "en");
}

// Tab switching
document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`panel-${tab.dataset.tab}`).classList.add("active");
        document.getElementById("result").classList.add("hidden");
    });
});

function showResult(text) {
    const el = document.getElementById("result");
    el.textContent = text;
    el.classList.remove("hidden");
}

async function submitPhishing() {
    const text = document.getElementById("phishing-input").value.trim();
    if (!text) return;
    showResult(I18N[currentLang].loading);
    const res = await fetch(`/api/phishing?lang=${currentLang}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `text=${encodeURIComponent(text)}`,
    });
    const data = await res.json();
    showResult(data.result || JSON.stringify(data));
}

async function submitLink() {
    const url = document.getElementById("link-input").value.trim();
    if (!url) return;
    showResult(I18N[currentLang].loading);
    const res = await fetch(`/api/link?lang=${currentLang}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `url=${encodeURIComponent(url)}`,
    });
    const data = await res.json();
    showResult(data.result || JSON.stringify(data));
}

async function submitFactcheck() {
    const text = document.getElementById("factcheck-input").value.trim();
    if (!text) return;
    showResult(I18N[currentLang].loading);
    const res = await fetch(`/api/factcheck?lang=${currentLang}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `text=${encodeURIComponent(text)}`,
    });
    const data = await res.json();
    showResult(data.result || JSON.stringify(data));
}
