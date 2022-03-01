---
title: ng update 로 패키지 버전 관리하기
date: 2022-03-01 15:03:65
category: angular
thumbnail: { thumbnailSrc }
draft: false
---

`@angular/cli` 에서 제공하는 기능 중의 하나이다.

설치한 패키지의 업데이트를 도와준다. 커맨드만 보면 angular와 관련된 패키지만 업데이트할 수 있을 것 같지만 모든 패키지의 업데이트가 가능하다. 그 밖에도 여러 기능을 제공하고 있다.

# 1. 패키지 그룹핑

커맨드 하나로 그룹핑한 패키지들을 업데이트할 수 있다. 패키지를 그룹핑하기 위해서는 package.json 파일에 `packageGroup` 속성에 정의하면 된다.

```js
{
  "name": "package1",
  "ng-update": {
    "packageGroup": [
      "package1",
      "package2"
    ]
  }
}
```

위와 같이 설정하고 아래와 같이 커맨드를 입력하면 package2 까지 같이 업데이트된다.

```bash
ng update package1
```

# 2. 재귀적 업데이트

그룹핑한 패키지 뿐만 아니라 `peerDependencies(이하 peerDeps)`에 기술한 패키지들의 업데이트도 함께 이루어진다. 그것도 재귀적으로.

```js
{
  "name": "package1",
  "version": "2.0.0",
  "peerDependencies": [
    "package2": "^2.0.0"
  ]
}
```

`package1@2.0.0` 의 package.json 이 위와 같은 형태라고 하고,

```js
{
  "name": "package2",
  "version": "2.0.0",
  "peerDependencies": [
    "package3": "^3.0.0"
  ]
}
```

`package2@2.0.0` 의 package.json 은 위와 같은 형태라고 하자. 설치된 패키지들의 버전은 아래와 같다.

```js
{
  "dependencies": {
    "package1": "^1.0.0",
    "package2": "^1.0.0",
    "package3": "^2.0.0",
  }
}
```

이 상황에서 `ng update package1` 커맨드를 입력하면 아래와 같은 순서로 업데이트가 이루어진다.

(1) **package1**을 `2.0.0`으로 업데이트해야 함을 인식한다.

(2) **package1**의 peerDeps에 따라 **package2**의 버전이 `2.0.0` 이상이어야 한다.

(3) **package2**를 `2.0.0`으로 업데이트해야 한다는 사실도 인식한다.

(4) **package2**의 peerDeps에 따라 **package3**의 버전이 `3.0.0` 이상이어야 한다.

(5) **package3**을 `3.0.0`으로 업데이트해야 한다는 사실도 인식한다.

(6) 3개의 패키지의 업데이트가 이루어진다.

# 3. 마이그레이션

패키지의 업데이트 중 이전 버전과 호환되지 않거나 새로운 파일 혹은 기능을 추가해야 하는 경우가 있다. 보통 이럴 때는 사용자가 최신 버전을 설치하고 공식 문서를 보면서 일일이 수정해야 한다.

하지만 앵귤러에서 제공하는 마이그레이션 기능을 이용하면 패키지를 업데이트할 때 실행할 스크립트를 지정할 수 있다.

```js
{
  "name": "package1",
  "ng-update": {
    "migrations": "./schematics/migration.json",
    "packageGroup": [
      "package1",
      "package2"
    ]
  }
}
```

먼저 위와 같이 package.json 에 `migrations` 속성을 추가한다. migration 설정 파일의 경로를 설정해주면 된다.

```js
{
  "schematics": {
    "migration-2.0.0": {
      "version": "2.0.0",
      "description": "migration to version 2",
      "factory": "./ng-update/update-2_0_0"
    }
  }
}
```

마이그레이션 설정 파일인 `migration.json` 이다. 각 항목은 다음을 나타낸다.

- version : 패키지 버전

- description : 마이그레이션에 대한 간단한 설명

- factory : 마이그레이션 스크립트 파일 위치

```ts
import {Rule, Tree, SchematicContext} from '@angular-devkit/schematics';

export default function(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    ...
  }
}
```

마이그레이션 스크립트 파일의 한 예시이다. 스크립트 파일을 작성하는 부분에 대해선 참고할 만한 자료가 많지 않기 때문에 다른 github 패키지들을 참고하는 것이 좋다.

이렇게 패키지를 설정해 놓으면 이 스크립트를 factory 로 지정한 버전보다 높은 버전으로 업데이트할 때 마이그레이션 스크립트도 함께 실행된다.

예를 들어, `1.0.0 -> 3.0.0` 으로의 업데이트라면 `1.1.0`, `2.0.0` 등의 버전에서의 마이그레이션 스크립트가 실행될 수 있는 것이다.
