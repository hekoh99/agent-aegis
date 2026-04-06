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
- 한국 시장 공개 배포

### Phase 4 — 브라우저 플러그인 (북미 시장)
- 크롬 익스텐션으로 링크 우클릭 → 즉시 검사 UX
- Gmail 연동으로 이메일 자동 피싱 스캔
- 크롬 웹스토어 등록 ($5 1회)
- 북미 시장 수익화 주 채널

### Phase 5 — 왓츠앱 봇 (사업자 준비 후)
- 북미/글로벌 시니어 사용자 대상
- 동일한 백엔드에 왓츠앱 webhook 엔드포인트 추가
- Meta Business 등록 필요

> 핵심 원칙: 백엔드 로직은 공유, 인터페이스(웹/텔레그램/카카오/플러그인/왓츠앱)만 교체

---

## 수익화 전략

### 기본 구조 — 웹앱을 결제 허브로

챗봇/플러그인은 진입점, 결제는 웹앱에서 일원화한다.

```
텔레그램/카카오/왓츠앱 봇
브라우저 플러그인
        ↓
   무료 한도 초과 시 → 웹앱으로 유도
        ↓
   웹앱에서 구독 결제
        ↓
   계정 연동 → 모든 채널에서 유료 기능 해제
```

### 요금제 (안)

| 플랜 | 가격 | 내용 |
|---|---|---|
| 무료 | $0 | 하루 N회 검사 |
| 개인 | $5/월 | 무제한 검사 + 히스토리 |
| 가족 | $8/월 | 개인 플랜 + 부모님 계정 1개 포함 |

> "자녀가 부모님께 사줌" 구조 — "부모님 보호 플랜" 프레이밍

### 채널별 역할

| 채널 | 수익화 | 주 역할 |
|---|---|---|
| 웹앱 | 구독 결제 허브 | 핵심 수익 채널 |
| 텔레그램 | 직접 수익화 어려움 | 테스트 / 진입점 |
| 카카오톡 | 외부 결제 페이지 연동 | 한국 사용자 진입점 |
| 브라우저 플러그인 | 용이 (크롬 웹스토어) | 북미 수익화 주 채널 |
| 왓츠앱 | 외부 결제 페이지 연동 | 글로벌 진입점 |

### 결제 연동 (예정)
- 북미: Stripe
- 한국: 토스페이먼츠 또는 카카오페이

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


### Overall
- 함수/변수명은 영어, 주석은 한국어 허용
- 함수는 하나의 역할만 (Single Responsibility)
- 매직 넘버/문자열 금지 — 상수로 분리
- 환경변수는 반드시 `.env`로 관리, 코드에 하드코딩 금지
- 모든 에러는 무시하지 않고 명시적으로 처리

### Backend (FastAPI)
- 라우터 / 서비스 / 프롬프트 레이어 분리 유지
  - `routers/` — HTTP 요청/응답만 담당
  - `services/` — 비즈니스 로직 (Claude 호출, 외부 API 등)
  - `prompts/` — 프롬프트 문자열만, 로직 없음
- 서비스 레이어에서 직접 HTTP 응답 객체 반환 금지
- 모든 엔드포인트에 Pydantic 모델로 요청/응답 타입 정의
- 에러 응답은 FastAPI `HTTPException` 사용, 일관된 포맷 유지
```python
# 좋은 예
@router.post("/phishing", response_model=PhishingResponse)
async def check_phishing(req: PhishingRequest):
    result = await phishing_service.analyze(req.text, req.lang)
    return result

# 나쁜 예 — 라우터에 로직 섞기
@router.post("/phishing")
async def check_phishing(text: str):
    client = anthropic.Anthropic()
    message = client.messages.create(...)  # 서비스 레이어로 분리할 것
```

- 외부 API 호출은 모두 `services/`에서만
- 비밀키, API 키는 절대 로그에 출력 금지

### 프론트엔드
- UI 로직과 API 호출 로직을 반드시 분리
- `api.js` 파일에 모든 API 호출 함수를 모아둘 것
- 나중에 React로 교체 시 `api.js`는 그대로 재사용 가능해야 함
```javascript
// api.js — API 호출만 담당, UI 로직 섞지 말 것
async function checkPhishing(text, lang = "ko") {
  const res = await fetch("/api/phishing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, lang })
  })
  return res.json()
}
```

### AI / 프롬프트
- AI가 단언하지 않도록 — "입니다" 대신 "가능성이 높습니다" 톤 유지
- 팩트체크 시 근거 URL 반드시 포함
- 모든 AI 응답은 한국어/영어 lang 파라미터를 따름
- 프롬프트 수정 시 반드시 `prompts/` 파일만 수정, 서비스 로직 건드리지 말 것

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