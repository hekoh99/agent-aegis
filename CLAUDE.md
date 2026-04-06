# Agent Aegis — 프로젝트 컨텍스트

## 프로젝트 목적

부모님 세대를 타겟으로 한 AI 기반 개인 보안 어시스턴트.
복잡한 설치나 학습 없이, 의심스러운 문자/링크/뉴스를 간편하게 검증할 수 있도록 한다.

### 핵심 기능

1. **피싱 문자 판별** — 의심 문자를 붙여넣으면 AI가 피싱 여부 판별
2. **링크 안전성 검사** — URL을 입력하면 악성 여부 확인
3. **팩트체크** — 카톡으로 퍼지는 찌라시/뉴스 링크나 텍스트의 사실 여부 확인

### 타겟 사용자

- 디지털 리터러시가 낮은 중장년층 (부모님 세대)
- UI는 최대한 직관적, 단순하게 설계
- 텍스트 복붙 또는 링크 입력만으로 작동해야 함

---

## 개발 로드맵

### Phase 1 — 웹앱 프로토타입 (현재)
- FastAPI 백엔드 + 간단한 HTML/JS 프론트엔드
- 기능 검증 및 프롬프트 튜닝 목적
- 백엔드 API를 잘 설계해두면 이후 확장이 수월

### Phase 2 — 텔레그램 봇
- 동일한 백엔드에 텔레그램 webhook 엔드포인트 추가
- `python-telegram-bot` 라이브러리 사용
- 부모님 실사용 테스트

### Phase 3 — 카카오톡 채널 챗봇 (한국 방문 후)
- 사업자등록 후 카카오 비즈니스 채널 심사 신청
- 동일한 백엔드에 카카오 webhook 엔드포인트 추가
- 공개 배포 목적

> 핵심 원칙: 백엔드 로직은 공유, 인터페이스(웹/텔레그램/카카오)만 교체

---

## 다국어 지원 (i18n)

한국어/영어 두 언어를 지원한다. 초기 설계부터 반영해 나중에 리팩토링이 필요 없도록 한다.

### 지원 언어
- `ko` — 한국어 (기본값)
- `en` — 영어

### 원칙
- 모든 백엔드 엔드포인트는 `lang` 파라미터를 받는다 (기본값 `"ko"`)
- 프롬프트는 언어별로 분리된 파일로 관리
- 프론트엔드 텍스트는 하드코딩하지 않고 i18n 상수로 관리
- AI 응답 언어는 `lang` 파라미터를 따른다

### 백엔드 패턴

```python
@router.post("/phishing")
async def check_phishing(text: str, lang: str = "ko"):
    prompt = get_prompt("phishing", lang)
    ...
```

### 프롬프트 구조

```
prompts/
├── ko/
│   ├── phishing.py
│   └── factcheck.py
└── en/
    ├── phishing.py
    └── factcheck.py
```

### 프론트엔드 패턴

```javascript
const I18N = {
  ko: {
    title: "AI 보안 어시스턴트",
    phishing_placeholder: "의심 문자를 붙여넣으세요...",
    factcheck_placeholder: "확인할 내용을 붙여넣으세요...",
    link_placeholder: "링크를 입력하세요...",
  },
  en: {
    title: "AI Security Assistant",
    phishing_placeholder: "Paste suspicious message here...",
    factcheck_placeholder: "Paste content to fact-check...",
    link_placeholder: "Enter a URL...",
  }
}
```

---

## 기술 스택

| 역할 | 기술 |
|---|---|
| 백엔드 | Python, FastAPI |
| AI | Claude API (`anthropic` SDK), claude-sonnet-4-20250514 |
| 링크 검사 | Google Safe Browsing API |
| 텔레그램 봇 | `python-telegram-bot` |
| 프론트엔드 | HTML / Vanilla JS (심플하게) |
| 배포 | Railway 또는 Render (무료 티어로 시작) |

---

## 프로젝트 구조

```
project/
├── CLAUDE.md               # 이 파일 (Claude Code 자동 참조)
├── .env                    # API 키 등 환경변수 (git 제외)
├── requirements.txt
├── backend/
│   ├── main.py             # FastAPI 앱 진입점
│   ├── routers/
│   │   ├── phishing.py     # 피싱/문자 판별 엔드포인트
│   │   ├── factcheck.py    # 팩트체크 엔드포인트
│   │   └── link.py         # 링크 안전성 검사 엔드포인트
│   ├── services/
│   │   ├── claude.py       # Claude API 래퍼
│   │   └── safebrowsing.py # Google Safe Browsing 래퍼
│   └── prompts/
│       ├── ko/
│       │   ├── phishing.py
│       │   └── factcheck.py
│       ├── en/
│       │   ├── phishing.py
│       │   └── factcheck.py
│       └── system.py       # 공통 시스템 프롬프트 (언어 무관)
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── telegram/
    └── bot.py              # 텔레그램 봇 (Phase 2)
```

---

## 환경변수 (.env)

```
ANTHROPIC_API_KEY=
GOOGLE_SAFE_BROWSING_API_KEY=
TELEGRAM_BOT_TOKEN=        # Phase 2에서 추가
DEFAULT_LANG=ko            # 기본 언어 (ko / en)
```

---

## 개발 원칙

- **다국어 지원 (i18n)** — 한국어/영어 지원, 모든 엔드포인트에 `lang` 파라미터, 프론트 텍스트는 하드코딩 금지
- **프롬프트는 별도 파일로 관리** — 재배포 없이 튜닝 가능하도록
- **AI가 단언하지 않도록** — "피싱입니다" 대신 "피싱일 가능성이 높습니다. 주의하세요" 톤 유지
- **출처 명시** — 팩트체크 시 근거 URL 반드시 포함
- **한국어 응답** — 모든 AI 응답은 한국어, 쉬운 말로
- **백엔드 API 우선 설계** — 프론트/봇은 API 클라이언트일 뿐

---

## 개발 환경 세팅

### 가상환경 (venv)

```bash
python -m venv .venv

# Mac/Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 비활성화
deactivate
```

> conda 사용 안 함. 배포 환경(Railway/Render)이 requirements.txt 기반이라 venv로 통일.

### 로컬 실행

```bash
cd backend
uvicorn main:app --reload
```

---

## 현재 개발 상태

- [ ] Phase 1: 웹앱 프로토타입
  - [ ] FastAPI 백엔드 세팅
  - [ ] 피싱 판별 기능
  - [ ] 링크 안전성 검사
  - [ ] 팩트체크 기능
  - [ ] 프론트엔드
- [ ] Phase 2: 텔레그램 봇
- [ ] Phase 3: 카카오톡 채널