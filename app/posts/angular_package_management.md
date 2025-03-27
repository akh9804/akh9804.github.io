---
title: 'angular의 패키지 관리'
date: '2022-11-20'
preview: 'angular의 패키지를 편리하게 관리하는 방법'
---

# 패키지 분리

angular는 프레임워크이다. 애플리케이션에 필요한 대부분의 기능을 제공한다. 하지만 애플리케이션에 필요한 기능은 정말 많다. 만약 하나의 패키지에서 모든 기능을 제공한다면 유지보수가 어렵고 패키지의 용량도 너무 커질 것이다.

그래서 angular는 기능별로 패키지를 여러 개로 나누고, 그룹핑하는 방식을 선택했다.

```json
{
  "dependencies": {
    "@angular/animations": "~12.1.0-",
    "@angular/common": "~12.1.0-",
    "@angular/compiler": "~12.1.0-",
    "@angular/core": "~12.1.0-",
    "@angular/forms": "~12.1.0-",
    "@angular/platform-browser": "~12.1.0-",
    "@angular/platform-browser-dynamic": "~12.1.0-",
    "@angular/router": "~12.1.0-"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~12.1.3",
    "@angular/cli": "~12.1.3",
    "@angular/compiler-cli": "~12.1.0-"
  }
}
```

`@angular/cli` 패키지를 설치하고 `ng new` 커맨드를 통해 애플리케이션을 생성하면 위와 같은 패키지들이 설치된다. 써드 파티 라이브러리를 설치하지 않고도 기본적인 기능들은 모두 구현이 가능하다.

기본 기능만 제공할 뿐인데 종류가 11가지나 된다. 이를 하나의 패키지에서 모두 관리했다고 하면… 개발하는 사람이나 사용하는 사람이나 힘들었을 것이다.

# 패키지 업데이트

패키지를 분할했지만 여전히 불편한 점이 남아 있다. 바로 분할된 패키지들의 버전을 관리하는 일이다. 패키지 간 의존성이 있기 때문에 대부분의 경우 모든 패키지의 버전이 한 번에 올라간다. 그럴 경우, 각 패키지를 일일이 업데이트해야 한다. 패키지의 개수가 많을수록 관리의 어려움은 커질 것이다.

`@angular/cli`는 이 문제를 해결하기 위해 강력한 기능을 제공한다. 바로 **ng update를 통한 패키지 그룹 업데이트 기능**이다.

> @angular/cli는 ng update 이외에도 패키지를 추가할 때 사용하는 `ng add`, 파일 생성 · 관리를 도와주는 `ng generate` 등 여러 기능을 제공한다.

### 패키지 그룹 버전 관리

@angular/core의 package.json을 살펴 보면 특이한 속성이 하나 존재한다. 바로 `ng-update`이다.

```json
{
  "ng-update": {
    "migrations": "./schematics/migrations.json",
    "packageGroup": [
      "@angular/core",
      "@angular/bazel",
      "@angular/common",
      "@angular/compiler",
      "@angular/compiler-cli",
      "@angular/animations",
      "@angular/elements",
      "@angular/platform-browser",
      "@angular/platform-browser-dynamic",
      "@angular/forms",
      "@angular/platform-server",
      "@angular/upgrade",
      "@angular/router",
      "@angular/language-service",
      "@angular/localize",
      "@angular/service-worker"
    ]
  }
}
```

ng-update 는 angular에서 사용하기 위해 정의한 속성이다. `packageGroup` 속성을 통해 패키지 그룹을 관리하고, `migrations` 속성을 통해 패키지 마이그레이션 기능을 지원한다. 마이그레이션 기능에 대해선 아래에서 자세히 설명한다.

```bash
# 최신 버전으로 업데이트
ng update @angular/core

# 특정 버전으로 업데이트
ng update @angular/core@14.0.0
```

위 커맨드를 입력하면 먼저, @angular/core를 업데이트한다. 그 다음, packageGroup 에 명시한 패키지들도 업데이트한다. 즉, 하나의 커맨드로 패키지 그룹의 모든 패키지를 업데이트할 수 있는 것이다.

패키지 그룹 내의 패키지들은 버전이 함께 관리된다. 즉, 같은 버전이라면 호환성에 대한 걱정없이 사용할 수 있기 때문에 안심하고 ng update를 통해 업데이트할 수 있는 것이다.

### 패키지 마이그레이션

패키지 간 호환성 문제는 해결되었지만 해결되지 않은 문제가 있다. 바로 이전 버전과 업데이트 버전 사이의 변경 사항으로 인한 호환성 문제다.

![semver](/app/assets/semver.webp)

npm 저장소의 모든 패키지는 [semantic versioning](https://semver.org/lang/ko/)을 따르고 있다. 이에 따르면 일반적으로 minor와 patch 버전의 증가는 호환성 문제가 발생하지 않는다. 하지만 major 버전의 증가는 때때로 호환성 문제를 야기한다. 보통의 경우, 해당 패키지의 `CHANGELOG`나 `마이그레이션 가이드`를 참고해서 수정해야 한다.

angular는 이런 불편함을 해소하기 위해 `자동 마이그레이션 기능`을 지원한다.

```json
{
  "ng-update": {
    "migrations": "./schematics/migrations.json"
  }
}
```

migrations 속성에는 각 마이그레이션에 대한 메타데이터가 작성된 파일의 위치를 명시한다.

```json
// @angular/core@14.0.0 migrations.json
{
  "schematics": {
    "migration-entry-components": {
      "version": "14.0.0-beta",
      "description": "As of Angular version 13, `entryComponents` are no longer necessary.",
      "factory": "./migrations/entry-components/index"
    },
    "migration-v14-typed-forms": {
      "version": "14.0.0-beta",
      "description": "As of Angular version 14, Forms model classes accept a type parameter, and existing usages must be opted out to preserve backwards-compatibility.",
      "factory": "./migrations/typed-forms/index"
    },
    "migration-v14-path-match-type": {
      "version": "14.0.0-beta",
      "description": "In Angular version 14, the `pathMatch` property of `Routes` was updated to be a strict union of the two valid options: `'full'|'prefix'`. `Routes` and `Route` variables need an explicit type so TypeScript does not infer the property as the looser `string`.",
      "factory": "./migrations/path-match-type/index"
    }
  }
}
```

각 마이그레이션의 메타데이터가 작성된 모습이다. `schematics` 속성에 각 마이그레이션을 작성한다. 각 마이그레이션은 3가지 속성을 가진다. `version`은 마이그레이션이 적용되어야 하는 최소 버전이고 `description`은 마이그레이션에 대한 설명이며 `factory`는 노드로 실행할 파일의 위치이다.

ng update 를 실행하면 아래와 같은 조건을 만족하는 마이그레이션들이 실행된다.

> 설치 버전 < 마이그레이션 version <= 업데이트 버전

예를 들어, 13 버전대(=설치 버전)를 사용하다가 14.0.0-beta 이상의 버전(=업데이트 버전)으로 업데이트할 경우 위에 명시된 모든 마이그레이션이 실행되는 것이다.

# angular 이외의 패키지

정말 좋은 기능이라 angular 패키지 그룹에만 쓰기에는 조금 아깝다는 생각이 든다. angular 팀에서도 이런 생각을 했는지, angular 이외의 패키지에서도 이 기능을 활용하는 것이 가능하다.

### package.json

먼저, package.json 에 그룹핑할 패키지들과 마이그레이션 설정 파일의 위치를 작성한다.

```json
{
  "ng-update": {
    "migrations": "./schematics/migration.json",
    "packageGroup": ["packageA", "packageB", "packageC", "packageD"]
  }
}
```

### 마이그레이션 설정 파일

다음으로, 마이그레이션 설정 파일을 작성한다.

```json
{
  "schematics": {
    "마이그레이션 제목": {
      "version": "마이그레이션 적용할 패키지 버전",
      "description": "마이그레이션 내용",
      "factory": "마이그레이션 실행 파일 위치"
    },
    "migration example": {
      "version": "2.0.0",
      "description": "migration description example",
      "factory": "./migrations/2.0.0/index"
    },
    "migration example2": {
      "version": "3.0.0",
      "description": "migration description example2",
      "factory": "./migrations/3.0.0/index"
    }
  }
}
```

### 마이그레이션 실행 파일 작성

마이그레이션 설정 파일에서 factory 에 명시한 실행 파일을 작성한다. 처음에는 작성하는 것이 어려울 수 있으니 [@angular/core 마이그레이션 실행 파일](https://github.com/angular/angular/tree/main/packages/core/schematics/migrations)을 참고하자.

`@angular/schematics`, `@angular/devkit`에서 관련 기능들을 많이 제공하고 있기 때문에 유용하다.

# 마치며

사내 패키지를 관리하다 보면 변경 사항이 많은 작업은 꺼려지게 된다. 설치해서 사용하는 서비스에서 변경 사항을 일일이 적용해야 하는데 바쁜 상황에서 적용하는 것도 일이지만 충돌나서 에러나기 시작하면… 답도 없다.

작년에 ng update란 녀석을 알게 된 뒤 사내 패키지에 적용하고 나니 버전 관리와 변경 사항 적용이 훨씬 편해지고 부담도 적어졌다. ng update 로 업데이트 해주세요~ 라고 하기만 하면 될 뿐.

angular로 패키지를 관리해야 하는 일이 있다면 한 번 적용해보는 것을 추천한다.
