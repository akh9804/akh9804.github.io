---
title: 'EsLint 플러그인 개발기'
date: '2022-11-23'
preview: 'EsLint 플러그인과 설정 패키지를 개발하는 방법'
---

# EsLint

[EsLint](https://eslint.org/)는 Javascript 코드 분석 도구 중의 하나이다. 코드 실행 전에 코드를 분석해서 에러를 파악하고 고칠 수 있도록 도와준다.

비슷한 것으로 [JSLint](https://www.jslint.com/), [JSHint](https://jshint.com/)가 있다. 모두 코드 분석 도구이지만 이들과 구별되는 EsLint 만의 특징이 있다.

- [Espree](https://github.com/eslint/espree)를 이용한 코드 파싱
- `AST(Abstract Syntax Tree)`를 통한 코드 패턴 분석
- 플러그인 방식

# EsLint 동작 방식

EsLint 동작 방식은 아래와 같다.

![EsLint 동작 방식](/images/eslint_plugin/eslint_principle.webp)

### 코드 파싱

먼저, 소스 코드를 AST 형식으로 파싱한다. 이 역할을 담당하는 것을 `파서(parser)` 라고 하며, espree가 이 역할을 담당한다. 옵션을 통해 다른 파서를 사용하는 것도 가능하다.

### AST 분석

다음으로 파싱된 AST를 분석한다. AST는 다음과 같은 트리 형태의 구조를 가지고 있다.

![AST](/images/eslint_plugin/ast.webp)

각 노드는 `VariableDeclaration`, `Identifier` 등의 타입을 가진다. 모든 노드를 순회하며 규칙 준수 여부를 검사하는데 이 때 규칙 적용 여부의 기준이 노드의 타입이 된다.

각 규칙은 규칙을 적용할 노드의 타입을 명시하고 있으며, 해당 타입의 노드를 순회할 때 규칙을 검사한다. 규칙을 위반한 노드가 있다면 에러를 리포트한다.

# EsLint 더 잘 사용하기

EsLint의 첫 배포일은 2013년이다. 지금으로부터 약 9년 전인데, 이 사이에 수많은 플러그인이 오픈소스로 공개되었다. 그래서 대부분의 경우 이미 시중에 나와있는 플러그인만 잘 활용해도 괜찮다.

우리 팀도 그랬다. 대부분의 문제는 기존 플러그인을 이용하는 것으로 해결할 수 있었다. 하지만 2가지 문제는 기존 자원만으로 해결하기 쉽지 않았다.

1. 팀 코딩 컨벤션 규칙화
2. 리포지토리 간 EsLint 설정 동기화

이 문제들을 해결하기 위해선 다른 방법이 필요했다.

# EsLint 플러그인 개발

먼저, 팀 코딩 컨벤션 규칙화를 위해 EsLint 플러그인을 개발해서 적용했다. 우리 팀은 `typescript`를 사용 중이라는 것을 감안해주길 바란다. `javascript` 기준의 플러그인 개발은 [이곳](https://tech.kakao.com/2019/12/05/make-better-use-of-eslint/)을 참고하도록 하자.

### 프로젝트 구조

프로젝트 구조는 아래와 같다.

![Project Structure](/images/eslint_plugin/project_structure.webp)

규칙 관련 파일들은 `src`에, 테스트 관련 파일들은 `tests`에 두었다.

### Typescript 설정

typescript 설정 파일은 2개를 두었다. 2개로 나누어서 관리한 이유는, 빌드할 때 테스트 파일들은 포함시키지 않기 위해서다. 테스트를 작성하지 않는다면 나눌 필요가 없지만, 작성하는 것을 추천한다.

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": false,
    "declarationMap": false,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

`tsconfig.json`은 각자 상황에 맞게 작성하고, `tsconfig.build.json`은 위와 같이 작성한다.

**declaration**, **declarationMap** 속성을 `false`로 설정해 `*.d.ts` 타입 파일이 생성되지 않도록 하고 타입은 따로 `index.d.ts`에 작성한다.

```ts
// index.d.ts
import {TSESLint} from '@typescript-eslint/utils';

export const rules: Record<string, TSESLint.RuleModule<string, unknown[]>>;
export const configs: Record<string, TSESLint.Linter.Config>;
```

또한 **include** 속성에는 **src** 폴더만 포함시켜 테스트 파일은 빌드에 포함되지 않도록 한다.

### package.json

아래와 같이 작성한다. 패키지 버전은 작성일 기준 최신 버전으로 설정했다.

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "index.d.ts",
  "files": ["dist", "index.d.ts", "README.md"],
  "peerDependencies": {
    "@typescript-eslint/parser": "^5.44.0",
    "@typescript-eslint/utils": "^5.44.0"
  }
}
```

### 규칙 작성

`@typescript-eslint/utils`에서 제공하는 기능을 이용하면 좋다. 먼저 규칙 생성 함수를 만든다.

```ts
import {ESLintUtils} from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(ruleName => '규칙 문서 URL');
```

이 때, 규칙 내용을 정리한 페이지를 만들어 `규칙 문서 URL`로 제공하는 것을 추천한다.

![Error](/images/eslint_plugin/error.webp)

규칙을 위반한 코드가 있을 경우 위와 같이 IDE에서 규칙 내용을 팝업창으로 보여주는데, 규칙 문서 링크도 함께 제공된다. 사용자가 바로 규칙 내용을 파악하고 수정하는 데 도움을 줄 수 있다.

다음으로, 규칙 생성 함수를 통해 규칙을 생성한다.

```ts
import {ESLintUtils} from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(ruleName => '규칙 문서 URL');

export default createRule({
  name: '규칙 이름',
  meta: {
    type: '규칙 타입',
    docs: {
      description: '규칙 설명',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      errorMessageId: '에러 리포트 메시지 {{value}}', // 에러 리포트 메시지 abc
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      // 노드 타입 === 함수 이름
      VariableDeclaration(node): void {
        // 에러 리포트
        context.report({
          node,
          messageId: 'errorMessageId', // messages의 key와 동일해야 함
          data: {value: 'abc'}, // 추가 데이터를 전달하는 것도 가능하다
        });
      },
    };
  },
});
```

규칙 생성에 대한 더 자세한 내용은 [공식문서](https://typescript-eslint.io/developers/custom-rules/)를 참고하자.

### 테스트 작성

마지막으로 규칙에 대한 테스트를 작성한다. 테스트는 `jest` 기준으로 작성했다.

```ts
import {ESLintUtils} from '@typescript-eslint/utils';
import rule from '../../src/rules/custom-rule';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('custom-rule', rule, {
  // 규칙을 통과하는 코드들
  valid: [`const a = 'a';`],

  // 규칙을 위반하는 코드들
  invalid: [
    {
      code: `const a = 'b';`,
      errors: [{messageId: 'errorMessageId'}],
    },
  ],
});
```

테스트는 크게 2가지 경우로 나뉜다. 규칙을 통과하는 코드와 그렇지 못하는 코드.

`@typescript-eslint/utils`에서 제공하는 `ESLintUtils`를 이용하면 위와 같이 어렵지 않게 작성할 수 있다.

# EsLint 설정 공유

리포지토리 간 EsLint 설정을 공유하기 위해 EsLint 설정 공유 패키지를 개발하고 배포했다.

### 프로젝트 구조

플러그인보다 훨씬 간단한 구조를 가진다.

![Project Structure](/images/eslint_plugin/project_structure2.webp)

기본적으로 필요한 건 `index.js`, `package.json` 이고 여러 버전의 설정을 공유하고 싶다면 그만큼의 js 파일이 필요하다.

### index.js 작성

```js
module.exports = {
  root: true,
  overrides: {
    ...
  }
}
```

EsLint 설정 파일에 작성하는 내용을 동일하게 작성한 뒤, exports를 통해 내보낸다.

### package.json

```json
{
  "name": "packageName",
  "version": "1.0.0",
  "main": "index.js",
  "files": ["index.js", "next.js"]
}
```

`files` 속성에 배포에 포함할 파일 목록을 작성한다.

### 공유 설정 사용

배포한 패키지를 설치한 뒤 **EsLint 설정 파일**에 추가한다.

```json
{
  "extends": ["packageName"]
}
```

index.js 이외의 파일에 작성한 설정을 가져오고 싶다면

```json
{
  "extends": ["packageName/next"]
}
```

위와 같이 `{패키지명}/{js 파일명}` 형태로 작성해준다.

# 마치며

이미 만들어진 도구를 잘 활용하는 것도 중요하지만, 필요에 맞게 수정해서 사용하는 것도 중요한 것 같다.

팀 내에 특별한 규칙을 적용하고 싶거나 설정을 공유하고 싶다면 한 번 만들어보면 좋을 것 같다.
