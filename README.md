# PortAI Frontend (React + Vite)

## 📌 프로젝트 소개
React + Vite 기반의 프론트엔드 저장소입니다. 빠른 개발 환경(HMR), 기본 ESLint 규칙, React Compiler 설정을 포함하여 UI/UX 프로토타입 제작과 프론트엔드 개발을 진행합니다.

---

## 🚀 주요 특징
- 빠른 개발 서버: Vite 기반 HMR(Hot Module Replacement) 지원
- React Compiler 활성화: 최신 React 기능을 활용 가능
- ESLint 기본 규칙 포함: 코드 품질 유지
- 플러그인 선택 가능:
  - @vitejs/plugin-react [(github.com in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite-plugin-react") → Oxc 기반
  - @vitejs/plugin-react-swc [(github.com in Bing)](https://www.bing.com/search?q="https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite-plugin-react-swc") → SWC 기반

---

## ⚙️ 설치 및 실행
```bash
# 저장소 클론
git clone https://github.com/PortAI-ECC/portai-frontend.git
cd portai-frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 📖 개발 가이드
- **코드 스타일**: ESLint 규칙을 따르고, Prettier를 함께 사용。
- **브랜치 전략**:  
  - `main` → 배포 가능한 안정 버전
  - branch 이름 통일
    - 파트/이름/기능  
- **커밋 메시지 규칙**:
  - 헤더 타입
    - Feat: 새로운 기능 추가, 기존의 기능을 요구 사항에 맞추어 수정 커밋
    - Fix: 기능에 대한 버그 수정 커밋
    - Build: 빌드 관련 수정 / 모듈 설치 또는 삭제에 대한 커밋
    - Chore: 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore
    - Ci: CI 관련 수정
    - Docs: 문서(주석) 수정
    - Style: 코드 스타일, 포맷팅에 대한 수정
    - Refactor: 기능에 변화가 아닌 코드 리팩터링 ex) 변수 이름 변경
    - Test: 테스트 코드 추가 / 수정
   
  - PR 제목 7가지 규칙
    - 제목과 본문을 빈 행으로 구분한다.
    - 제목은 50글자 이내로 제한한다.
    - 제목의 첫 글자는 대문자로 작성한다.
    - 제목 끝에는 마침표를 넣지 않는다.
    - 제목은 명령문으로 사용하며 과거형을 사용하지 않는다.
    - 본문의 각 행은 72글자 내로 제한한다.
    - 어떻게 보다는 무엇과 왜를 설명한다.
---

## 🧪 테스트
- 기본 템플릿에는 테스트 러너가 포함되어 있지 않습니다.  
- 필요 시 Jest 또는 Vitest를 추가해 `*.test.js`, `*.spec.js` 파일로 테스트 작성 권장.

---

## 🌐 배포
- 빌드 결과(`dist/`)를 Netlify, Vercel, GitHub Pages 등 정적 호스팅 서비스에 업로드하면 바로 배포 가능합니다.
- CI/CD(GitHub Actions 등)를 설정하면 자동 빌드/배포도 가능합니다.

---

## 🤝 기여 방법
- **이슈 등록**: 버그 리포트, 기능 제안은 GitHub Issues에 작성
- **PR(Pull Request)**: 코드 변경 목적, 변경 내용, 테스트 방법을 명시

---

## 📜 라이선스
이 프로젝트는 `LICENSE` 파일에 명시된 라이선스를 따릅니다. 

---
---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
