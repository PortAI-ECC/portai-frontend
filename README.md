# PortAI - Frontend (React + Vite)

## 프로젝트 소개

Velog/Notion 등의 기술블로그, GitHub 프로젝트, 활동 이력 등을 넣으면 자동으로 포트폴리오 웹페이지와 이력서(PDF)를 만들어 주는 웹사이트

---

## 🌐 배포

- 빌드 결과(`dist/`)를 Netlify(정적 호스팅 서비스)에 업로드 : https://portai-frontend0.netlify.app/
- CI/CD(GitHub Actions 등)를 설정하면 자동 빌드/배포도 가능합니다.

---

## Template

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
