---
title: '이미지 CLS 최적화'
date: '2022-12-03'
slug: '이미지 CLS 최적화를 통한 사용자 경험 향상'
---

# 1. CLS(Cumulative Layout Shift)

`누적 레이아웃 이동`이라고도 한다. [CoreWeb Vitals](https://web.dev/vitals) 메트릭으로, 사용자 입력 500ms 이내에 발생하지 않는 레이아웃 이동 점수를 합산하여 콘텐츠의 불안전성을 측정한다.

쉽게 얘기하면, **사용자가 예상하지 못한 레이아웃 이동이 발생한 정도**를 측정한 값이다.

# 2. CLS로 인한 사용자 경험 저하

![CLS](/image-cls/cls.webp)

왼쪽 화면의 모습일 때, 사용자가 Zebra를 클릭하려고 시도한다고 가정해보자. 다음과 같은 상황이 벌어질 수 있다.

1. 사용자는 4번째 아이템(Zebra) 클릭을 시도한다
2. 5개의 아이템이 추가되어 Zebra의 위치가 9번째로 바뀐다
3. 사용자가 4번째 아이템(Elephant)을 클릭한다
4. 사용자의 의도(Zebra)와 다른 결과(Elephant)가 발생한다

위 예시는 단순히 아이템을 클릭하는 것이기에 조금 불편한 정도로 끝났지만 결제, 환불 등과 같이 사용자의 선택이 중요한 경우에는 문제가 커질 수 있다.

# 3. 이미지 로딩으로 인한 CLS

이미지도 높은 CLS의 주된 원인 중 하나이다.

```html
<img src="imgSrc" width="400" height="500" />
```

위 예시처럼 이미지 크기가 고정적인 경우는 괜찮지만, 스크린 크기 등의 요소에 따라 이미지 크기가 가변적인 경우도 많다.

![CLS](/image-cls/image-cls.webp)

이런 경우엔 이미지 로딩 전에 이미지 크기를 알기가 어렵다. 그래서 이미지 로딩 전과 후의 높이 차이로 인한 레이아웃 이동이 발생할 수 있다.

# 4. 이미지 로딩으로 인한 CLS 최적화

최적화를 위한 사전 조건이 하나 있는데, `이미지 비율`을 알아야 한다는 것이다. 이를 위해 이미지 파일을 업로드할 때 이미지 크기나 비율 정보를 함께 저장하는 게 하나의 방법일 수 있겠다.

## 방법 1. aspect-ratio

css 속성 중 하나인 [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)을 이용하는 방법이다. 이 속성을 설정하면 요소의 크기를 비율에 맞춰 설정한다. `이미지 길이/이미지 높이` 형식의 값을 넣어주면 된다.

```css
.image {
  aspect-ratio: 400 / 500;
}
```

## 방법 2. aspect-ratio-box 기법

`Chrome 88`부터 aspect-ratio 속성을 지원하기 때문에 브라우저 호환성을 고려한 다른 방법도 필요하다. 이 기법은 `padding-top`을 `%`로 설정할 경우 **가로 길이에 대한 비율**로 설정되는 것을 이용한다.

```html
<div class="aspect-ratio-box">
  <div class="aspect-ratio-box-inside">
    <img src="imgSrc" />
  </div>
</div>
```

HTML 문서 구조를 위와 같이 잡고

```css
.aspect-ratio-box {
  height: 0;
  overflow: hidden;
  position: relative;
  padding-top: 125%; /* (500/400) * 100 = 125 */
}

.aspect-ratio-box-inside {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.aspect-ratio-box-inside img {
  width: 100%;
  height: auto;
}
```

CSS는 위와 같이 설정해준다.

img 태그를 감싸는 컨테이너 요소의 높이가 비율적으로 결정되고, 컨테이너 요소 안에 이미지를 꽉 채우는 방식이다. 하지만 약간의 오차가 있을 수 있으니 이미지 로딩이 끝나면 컨테이너 요소를 제거하는 것도 좋은 방법이다.

# 5. 참고 사이트

[https://web.dev/articles/optimize-cls](https://web.dev/articles/optimize-cls)

[https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)

[https://css-tricks.com/aspect-ratio-boxes](https://css-tricks.com/aspect-ratio-boxes)
