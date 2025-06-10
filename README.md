# Simple Synthesizer 🎹

웹 브라우저에서 동작하는 간단한 신디사이저 애플리케이션입니다.
실시간 음향 합성을 통해 음악을 연주할 수 있습니다.

## 주요 기능 🎵

- Waveform 선택(Sine, Square, Sawtooth, Triangle)
- ADSR Envelope, LP/HP Filter, Reverb
- 생성되는 음향의 파형을 실시간으로 시각화합니다,
- 키보드를 활용하여 연주할 수 있습니다.

## 기술 스택 💻

- React, TypeScript, Web Audio API(Tone.js), Vite, PNPM

## 시작하기 🚀

### 설치 방법

```bash
# 저장소 클론
git clone https://github.com/fliklab/simple-web-synthesizer.git

# 프로젝트 디렉토리로 이동
cd simple-web-synthesizer

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 프로젝트 구조 📁

```
simple-synthesizer/
├── src/
│   ├── components/     # UI 컴포넌트
│   │   ├── controls/   # 신디사이저 컨트롤 컴포넌트
│   │   └── visualizers/# 오디오 시각화 컴포넌트
│   ├── hooks/         # 커스텀 훅
│   ├── utils/         # 유틸리티 함수
│   ├── constants/     # 상수 정의
│   ├── types/         # TypeScript 타입 정의
│   └── styles/        # 스타일 파일
└── public/            # 정적 파일
```

## 라이선스

이 프로젝트는 MIT 라이선스로 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
