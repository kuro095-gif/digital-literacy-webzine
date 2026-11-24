# 슬기로운 디지털 문해생활

중·고등학교 교사를 위한 디지털 미디어 리터러시 웹진입니다. 도입 기사를 스크롤하면서 광장 사진에 붙은 두 제목과 전기차 기사 두 편의 비교 범위를 살펴봅니다. 여섯 교과에서 12개 수업 프로젝트를 찾아볼 수 있습니다. [배포된 웹진](https://kuro095-gif.github.io/digital-literacy-webzine/)

## 내 컴퓨터에서 열기

1. ZIP을 풀고 폴더 안의 **index.html**을 브라우저에서 엽니다.
2. 표지에서 아래로 스크롤하면 사진의 구도가 바뀌고 도입 기사가 이어집니다. 본문을 읽으면 광장 사진에 두 제목과 관찰 지점이 차례로 표시되고, 과학 기사의 도표는 **생애 전체 → 제조 과정**을 강조합니다. 낮은 창에서는 그림을 줄여 본문을 읽을 공간을 확보합니다. 운영체제에서 모션 줄이기를 선택하면 사진 움직임 없이 제목과 도표의 표시가 즉시 바뀝니다. 자바스크립트 없이 읽을 때는 두 제목과 두 범위가 함께 표시됩니다.
3. **교과별 수업 보기**의 **본문 검색**에 `배출량` 또는 `이해관계자 카드`처럼 단어나 문구를 입력합니다. 일치한 문장 옆의 **차시 보기**를 누르면 해당 차시가 펼쳐집니다. 교과 메뉴에서도 수업을 찾을 수 있습니다.
4. 수업에서 **수업 구성도**로 이동해 차시를 펼칩니다. 자료의 이름을 누르면 연결 주소가 열리고 **QR 보기**를 누르면 같은 주소를 담은 코드가 표시됩니다.

학교 PC에서 로컬 파일 열기가 제한되거나 브라우저 주소로 미리보고 싶다면 프로젝트 폴더에서 아래 명령을 실행하고 [로컬 미리보기](http://localhost:8000/)를 엽니다. Python 3가 설치된 컴퓨터에서 사용할 수 있습니다.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

## GitHub Pages에 배포하기

현재 웹진은 저장소의 `main` 브랜치에서 발행됩니다. 수정한 파일을 같은 경로로 커밋한 뒤 저장소의 **Actions → pages build and deployment**에서 해당 커밋의 배포 결과를 확인합니다. 기존 웹진을 업데이트할 때는 이 방식으로 같은 주소를 계속 사용합니다. [웹진 GitHub 저장소](https://github.com/kuro095-gif/digital-literacy-webzine)

### 1. 새 저장소에 올리기

공개 웹진을 배포할 계정의 GitHub에 새 공개 저장소를 만듭니다. 예시 저장소 이름은 `digital-literacy-webzine`입니다. 아래 파일과 폴더를 **저장소의 최상위 위치**에 올리고 경로를 그대로 유지합니다. GitHub의 **Add file → Upload files** 또는 GitHub Desktop을 사용할 수 있습니다. 숨김 파일인 `.nojekyll`도 함께 올립니다. [GitHub Pages 이용 조건](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

```text
index.html
lessons/
assets/
scripts/
.nojekyll
README.md
```

Git 명령을 사용하는 경우 GitHub에서 빈 저장소를 만든 뒤, 압축을 푼 프로젝트 폴더에서 아래 명령을 실행합니다. `YOUR-ACCOUNT`와 저장소 이름은 실제 값으로 바꿉니다.

```sh
git init -b main
git add .
git commit -m "디지털 문해생활 웹진 첫 발행"
git remote add origin https://github.com/YOUR-ACCOUNT/digital-literacy-webzine.git
git push -u origin main
```

### 2. Pages 켜기

1. 저장소의 **Settings → Pages**를 엽니다.
2. **Build and deployment**의 **Source**에서 **Deploy from a branch**를 선택합니다.
3. 브랜치는 `main`, 폴더는 `/(root)`로 선택하고 **Save**를 누릅니다.
4. 배포가 완료되면 **Visit site**로 접속합니다. 프로젝트 사이트 기본 주소는 `https://계정.github.io/저장소/` 형식입니다. 실제 주소는 Pages에 표시된 값을 사용합니다. [GitHub Pages 발행 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

### 3. 교사에게 전달할 주소 확인하기

- 배포된 주소에서 PC와 휴대폰으로 표지와 본문을 스크롤하고, 검색 결과에서 맞는 차시가 펼쳐지는지 확인합니다.
- 원문 PDF와 연결된 활동지·기사·영상은 배포 대상 교사의 접속 조건으로 확인합니다. 활동지와 평가지 버튼에 표시된 원문 쪽수로 해당 부분을 찾을 수 있습니다.
- 공지에는 **Visit site** 주소를 사용합니다. 배포용 QR을 만들 때도 이 주소를 넣고 다른 기기의 카메라로 한 번 스캔합니다.
- 공개 저장소의 파일과 공개 Pages 주소는 누구나 열 수 있습니다. 교직원으로 웹진 자체의 열람을 제한해야 한다면 조직의 GitHub Enterprise Cloud에서 Pages 접근 제어를 확인합니다. [GitHub Pages 접근 제어](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)

## 원문과 수업 자료 확인

**원문 PDF 보기**는 제공받은 Google Drive 원문으로 연결됩니다. 조회 당시 이 파일은 비공유 상태였으므로 배포 전에 교사가 열 수 있는 공식 원문 주소와 공유 범위를 확인합니다. 공식 주소가 다르면 `index.html`과 `lessons/`의 원문 링크를 교체합니다.

지정된 차시와 활동에 **원문 QR 52개**를 연결했습니다. 이 QR과 옆의 바로가기 버튼은 원문에 인쇄된 네이버 단축주소를 사용합니다. 제작 환경에서 해당 도메인 접속이 제한되어 최종 목적지와 파일 권한은 배포 대상 계정으로 확인해야 합니다. 권한을 확인한 후 다른 주소로 교체한다면 QR 역시 새 주소로 갱신합니다.

과학 01은 2차시에 이해관계자 카드로 기사를 재구성하고, 3차시에 배출량을 계산해 기사 주장을 검토하는 활동으로 편집했습니다. 미술 07·08의 대상 학년은 중학교 1~3학년입니다. 미술 08의 2차시에는 추천 콘텐츠를 예측하고 근거를 설명하는 활동을 반영했습니다. 평가 자료의 원문 페이지에는 PDF 원본의 문구가 표시됩니다.

## 내용 수정하기

| 바꿀 내용 | 파일 |
| --- | --- |
| 표지, 기사 문단, 사진 제목, 전기차 도표 문구, 교과 목록 | `index.html` |
| 수업 설계 의도, 개요, 차시별 안내, 수업 팁 | `lessons/` 안의 해당 수업 HTML |
| 도입 기사의 지면 배치, 사진 표시, 도표와 모바일 화면 | `assets/story.css` |
| 문단에 맞춘 사진·도표 전환, 교과 선택, 연결된 차시 펼치기 | `assets/site.js` |
| 본문 검색 화면과 검색 동작 | `assets/search.css`, `assets/search.js` |
| 공통 색, 수업 상세와 모바일 배치 | `assets/style.css` |
| 첫 화면 사진 | `assets/hero.webp` |

도입 기사나 수업 본문을 바꿨다면, 프로젝트 폴더에서 Python 3.10 이상으로 검색 목록을 다시 만듭니다.

```sh
python3 scripts/build_search_index.py
```

수정한 HTML과 갱신된 `assets/search-index.js`를 `main` 브랜치에 함께 올리면 같은 Pages 주소에 반영됩니다.
