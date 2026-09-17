[English](../README.md) | [简体中文](../README.zh-CN.md) | [日本語](../docs/README.ja.md) | [한국어](../docs/README.ko.md) | [Español](../docs/README.es.md) | [Deutsch](../docs/README.de.md) | [Русский](../docs/README.ru.md)

<p align="center"><img src="../site/mark.svg" width="64" alt="SandKit"></p>

# SandKit

이미지와 텍스트를 인터랙티브 모래 애니메이션으로 만드세요.

[데모](https://linkly.ai/sandkit) · [MIT](../LICENSE) · WebGL2 · [Linkly AI](https://linkly.ai/)

## Codex에서 시작하기

아래 프롬프트를 Codex에 붙여 넣으세요.

> https://github.com/LinklyAI/SandKit/blob/main/GETTING_STARTED.md 를 읽고 안내에 따라 SandKit 스킬 두 개를 설정한 뒤, 포함된 샘플로 현재 디렉터리에 인터랙티브 모래 데모를 만들고 실행해 주세요.

첫 실행에는 포함된 샘플을 사용합니다. 새 이미지를 생성하려면 이미지 생성 기능이 있는 Codex 세션이 필요합니다. 실행 환경의 권한 확인이 표시될 수 있습니다.

## 로컬 실행

Node.js 22 이상이 필요합니다. 코어, 데모, 에디터는 의존성 설치 없이 실행됩니다.

```sh
git clone https://github.com/LinklyAI/SandKit.git
cd SandKit
node scripts/serve.mjs
```

- Demo: `http://127.0.0.1:4173/site/`
- Editor: `http://127.0.0.1:4173/site/editor/`

## 포함된 기능

- 프레임워크 독립 WebGL2 렌더러와 선택적 React 어댑터.
- 숫자 매개변수 30개, 프리셋, 색상, 텍스트, 재생 제어, 선화·깊이 검사, JSON 가져오기·내보내기와 공유 링크를 지원하는 에디터.
- **[sandkit-art](../skills/sandkit-art/SKILL.md)**: 선화와 추정 깊이 맵 생성 및 검증.
- **[sandkit-build](../skills/sandkit-build/SKILL.md)**: 애니메이션 코드 작성, 통합 및 최적화.
- 뇌, Macintosh, 책 더미, 타자기의 선화와 깊이 맵.

웹사이트는 영어와 중국어 데모 및 텍스트 입력을 지원합니다. 사용자 이미지는 Codex 스킬로 만듭니다. 깊이는 시차 효과를 위한 추정치이며 정밀한 3D 측정값이 아닙니다.

![SandKit](../skills/sandkit-art/assets/typewriter.webp)

## 개발 및 문서

```sh
node scripts/check.mjs
node --test tests/*.test.js
node scripts/build.mjs
```

정적 사이트는 dist/sandkit/에 생성됩니다. 공식 사이트 배포와 패키지 게시는 별도 작업이며, 아직 공개되지 않았을 수 있습니다.

[API (English)](API.md) · [README (English)](../README.md) · [Contributing (English)](../CONTRIBUTING.md) · [Security (English)](../SECURITY.md)

## 라이선스

MIT. 생성된 샘플에는 보유한 권리 범위에서 같은 조건이 적용됩니다. 상표권은 포함되지 않습니다.

[MIT](../LICENSE) · [Asset provenance (English)](../skills/sandkit-art/assets/PROVENANCE.md)

## Built with Linkly AI

Linkly AI는 AI 에이전트의 지식 브레인입니다. 에이전트가 노트, 문서, 오디오, 동영상을 검색하고 읽을 수 있도록 도와줍니다.

[Linkly AI](https://linkly.ai/#get-started) · [X @linkly_ai](https://x.com/linkly_ai)
