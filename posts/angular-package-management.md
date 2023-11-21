---
title: 'Angular의 패키지 관리'
date: '2022-10-30'
slug: 'Angular에서 여러 패키지를 관리하는 방법을 알아보자'
---

# 1. 패키지 분리

`Angular`는 프레임워크답게 애플리케이션 개발에 필요한 대부분의 기능을 제공한다. 하지만 모든 기능을 1개의 패키지에서 제공하진 않는다. 만약 1개의 패키지에서 모든 기능을 제공한다면 아래와 같은 단점들이 있기 때문이다.

- 패키지의 크기가 너무 커진다
- 유지보수가 어렵다

반대로 패키지를 여러 개로 나누어 관리한다면 아래와 같은 단점들이 있을 수 있다.

- 패키지 간 호환성 이슈가 발생할 수 있다
- 사용하는 입장에선 여러 개의 패키지를 설치하고 업데이트해야 하니 관리포인트가 늘어난다

결국 2가지 방법 모두 장단점이 있지만 Angular 팀이 선택한 방식은 `기능에 따라 패키지를 분리하고 패키지를 쉽게 관리하는 방법을 제공하는 것`이었다.

# 2. 패키지 버저닝

패키지 간 호환성 이슈를 해결하기 위한 전략이다. Angular의 여러 패키지는 버전이 동일하다면 호환성 이슈가 발생하지 않는 것을 보장한다.

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

Angular CLI를 통해 프로젝트를 생성하면 위와 같은 패키지들이 설치된다. 각 패키지 설치 버전을 보면 거의 모두 동일하다. 기껏해야 patch 버전 정도만이 다른 것을 볼 수 있다.

사용하는 입장에선 버전만 맞춰주면 패키지 간 호환성 이슈에 대한 걱정은 따로 하지 않아도 되니 편리하다. 또한 버전 업데이트로 인한 인터페이스 변경 등 추가적으로 처리해야 하는 부분들이 있을 수 있는데, [Angular Update Guide](https://update.angular.io/)에서 관련 부분들을 상세하게 제공하고 있다.

# 3. 패키지 업데이트

호환성 이슈는 해결됐지만 패키지 버전은 정적이지 않다. 새로운 기능의 추가, 기존 버그의 수정 등의 이유로 패키지 버전은 증가하기 마련이고 사용자는 패키지를 업데이트해야 하는 상황이 올 수 있다.

Angular는 이 문제를 `패키지 그룹핑`과 `마이그레이션 스크립트`로 해결한다.

## 3-1. 패키지 그룹핑

`@angular/core`의 package.json 파일을 보면 특이한 속성을 발견할 수 있다.

```json
{
  "ng-update": {
    "migrations": "./schematics/migrations.json",
    "packageGroup": [
      "@angular/core",
      "@angular/bazel",
      ...
    ]
  }
}
```

대부분의 Angular 패키지가 `packageGroup` 속성에 포함된 걸 볼 수 있다. 여기에 적힌 패키지들은 하나의 그룹으로 묶여 버전이 함께 관리된다.

`버전이 함께 관리된다`라는 말의 의미는 다음과 같다.

1. 터미널에서 `ng update @angular/core` 실행
2. `@angular/core` 버전 업데이트 진행
3. `ng-update > packageGroup` 속성 체크
4. 목록에 있는 패키지들의 버전도 함께 업데이트 진행

커맨드 입력 한 번으로 여러 개의 패키지 버전을 한꺼번에 업데이트할 수 있는 것이다.

## 3-2. 마이그레이션 스크립트

패키지 간 호환성 문제는 버저닝 정책으로 해결되었지만, 패키지 업데이트로 야기되는 호환성 문제는 여전히 남아있다.

![semver](/angular-package-management/semver.webp)

npm 저장소의 모든 패키지는 [semantic versioning](https://semver.org/lang/ko/)을 따른다. 주로 Major, 때때로 Minor까지 버전의 증가로 인한 호환성 문제가 발생한다. 인터페이스 변경, deprecated 되어 더는 사용할 수 없게 된 기능 등등 말이다.

보통 이런 경우엔 `CHANGELOG.md`나 `마이그레이션 가이드`를 참고해서 사용자가 직접 수정하는 게 일반적이다. 하지만 Angular는 `마이그레이션 스크립트`를 통해 자동으로 코드 수정을 해주기 때문에 사용자가 직접 수정할 필요가 없다.

```json
{
  "ng-update": {
    "migrations": "./schematics/migrations.json",
    "packageGroup": [
      ...
    ]
  }
}
```

아까 봤던 @angular/core의 package.json 파일이다. `migrations` 속성을 보면 `migrations.json` 파일 경로가 적혀 있는 걸 볼 수 있다. 이 파일에는 각 마이그레이션에 대한 메타데이터가 작성되어 있다.

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

마이그레이션 메타데이터들이 `schematics` 속성에 적혀 있다. 각 속성이 의미하는 바는 다음과 같다.

- version: 마이그레이션 실행의 조건이 되는 버전
- description: 마이그레이션에 대한 설명
- factory: 실행 파일 경로

`프로젝트에 설치된 버전 < version <= 업데이트 버전` 조건을 만족하는 모든 마이그레이션 스크립트가 실행된다.

# 4. 우리 프로젝트에도..?

개인적으로 정말 좋은 기능이라고 생각해서 회사 프로젝트에도 적용 가능한 지 알아보았는데 적용이 가능했다. 위에서 소개한 인터페이스에 맞춰 패키지를 구성하면 동일한 기능을 사용할 수 있다.

처음에는 `마이그레이션 스크립트 작성`이 어려울 수 있다. 이와 관련해 실제 Angular 팀에서 어떻게 작성하는 지 참고하는 것만큼 좋은 교재가 없다고 생각한다. [@angular/core 마이그레이션 폴더](https://github.com/angular/angular/tree/main/packages/core/schematics/migrations)를 참고하도록 하자.
