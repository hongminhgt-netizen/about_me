# 프로젝트 작업 규칙

이 프로젝트는 Vanilla JavaScript와 Vite를 사용합니다. 코드 작업을 시작하기 전에 이 문서와 관련 기존 파일 및 설정을 확인하세요.

1. HTML, CSS, JavaScript는 각각 별도의 파일로 작성합니다.
2. `index.html`과 `vite.config.js` 등 설정 파일은 프로젝트 루트에 두고, 애플리케이션의 CSS와 JavaScript 파일은 `src`에 둡니다.
3. JavaScript는 ES 모듈로 연결하고, CSS는 JavaScript 진입 파일에서 `import`하여 Vite 빌드에 포함합니다.
4. 외부 JavaScript 라이브러리는 `npm install`로 설치한 뒤 `import`하여 사용합니다. CDN 방식은 사용하지 않습니다.
5. 기존 파일과 설정을 먼저 확인하고 필요한 부분만 수정합니다.

## 빌드 및 Netlify 배포

프로젝트 루트에서 `npm run build`를 실행합니다. Vite는 루트의 `index.html`을 진입점으로 사용하고 결과를 `dist`에 출력합니다.

GitHub 저장소를 Netlify에 연결한 뒤 다음 값을 사용합니다.

| Netlify 설정 | 값 |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
