# Agent Aegis

부모님 세대를 위한 AI 기반 개인 보안 어시스턴트.
복잡한 설치 없이, 의심스러운 문자/링크/뉴스를 간편하게 검증할 수 있습니다.

## 주요 기능

- **피싱 문자 판별** — 의심 문자를 붙여넣으면 AI가 피싱 여부 판별
- **링크 안전성 검사** — URL을 입력하면 악성 여부 확인
- **팩트체크** — 카톡으로 퍼지는 찌라시/뉴스의 사실 여부 확인

## 기술 스택

| 역할 | 기술 |
|---|---|
| 백엔드 | Python, FastAPI |
| AI | Claude API (claude-sonnet-4-20250514) |
| 링크 검사 | Google Safe Browsing API |
| 프론트엔드 | HTML / Vanilla JS |

## 시작하기

### 1. 환경변수 설정

```bash
cp .env.example .env
# .env 파일에 API 키 입력
```

### 2. 가상환경 및 패키지 설치

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. 서버 실행

```bash
uvicorn backend.main:app --reload
```

브라우저에서 `http://localhost:8000` 접속

## 프로젝트 구조

```
backend/
├── main.py              # FastAPI 앱 진입점
├── routers/             # API 엔드포인트
├── services/            # Claude API, Safe Browsing 래퍼
└── prompts/             # 언어별 프롬프트 (ko/en)
frontend/
├── index.html
├── style.css
└── app.js
```

## 다국어 지원

한국어(ko)와 영어(en)를 지원합니다. 모든 API 엔드포인트에 `lang` 파라미터로 언어를 지정할 수 있습니다.
