# react-email-handlebars

> React Email과 JSX Email을 위한 Handlebars 템플릿 지원

React 기반 이메일 템플릿과 Handlebars 템플릿을 연결하는 라이브러리입니다. React 컴포넌트로 이메일 템플릿을 한 번만 작성하면, 동적 콘텐츠 렌더링을 위한 Handlebars 호환 템플릿을 생성할 수 있습니다.

[English Documentation](./README.md)

## 주요 기능

- **이중 런타임 지원**: [React Email](https://react.email/)과 [JSX Email](https://jsx.email/) 모두와 완벽하게 호환
- **타입 안전성**: Zod 스키마 검증을 통한 완전한 TypeScript 지원
- **미리보기 모드**: 개발 중 샘플 데이터로 이메일 미리보기
- **빌드 모드**: 프로덕션용 Handlebars 템플릿 생성
- **조건부 렌더링**: 조건부 콘텐츠를 위한 `If` 컴포넌트
- **리스트 렌더링**: 데이터 배열 반복을 위한 `Each` 컴포넌트

## 설치

```bash
npm install react-email-handlebars zod
# 또는
pnpm add react-email-handlebars zod
# 또는
yarn add react-email-handlebars zod
```

### Peer Dependencies

이 라이브러리는 React 19 이상이 필요합니다:

```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

## 사용법

### Runtime Provider

`RuntimeProvider`로 이메일 템플릿을 감싸서 런타임 모드를 지정합니다:

- `preview`: 미리보기 데이터로 렌더링 (개발용)
- `build`: Handlebars 템플릿 문법 생성 (프로덕션용)

### If 컴포넌트

Handlebars 경로를 기반으로 조건부로 콘텐츠를 렌더링합니다.

#### React Email 예제

```tsx
import { Body, Html, Text } from "@react-email/components";
import { If, RuntimeProvider } from "react-email-handlebars";

export default function WelcomeEmail() {
  return (
    <RuntimeProvider value="build">
      <Html>
        <Body>
          <If
            conditionPath="user.isAdmin"
            previewCondition={false}
            then={<Text>관리자입니다</Text>}
            else={<Text>관리자가 아닙니다</Text>}
          />
        </Body>
      </Html>
    </RuntimeProvider>
  );
}
```

**생성된 Handlebars 템플릿:**

```handlebars
{{#if user.isAdmin}}
  관리자입니다
{{else}}
  관리자가 아닙니다
{{/if}}
```

#### JSX Email 예제

```tsx
import { Body, Html, Text } from "jsx-email";
import { If, RuntimeProvider } from "react-email-handlebars";

export const Template = () => (
  <RuntimeProvider value="preview">
    <Html>
      <Body>
        <If
          conditionPath="user.isPremium"
          previewCondition={true}
          then={<Text>프리미엄 기능이 활성화되었습니다!</Text>}
          else={<Text>프리미엄으로 업그레이드하세요</Text>}
        />
      </Body>
    </Html>
  </RuntimeProvider>
);
```

### Each 컴포넌트

타입 안전성을 보장하며 배열을 반복하고 아이템을 렌더링합니다.

#### React Email 예제

```tsx
import { Body, Html, Text, Section } from "@react-email/components";
import { Each, RuntimeProvider } from "react-email-handlebars";
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  email: z.string(),
});

type User = z.infer<typeof userSchema>;

export default function UserListEmail() {
  const previewData: User[] = [
    { name: "홍길동", email: "hong@example.com" },
    { name: "김철수", email: "kim@example.com" },
  ];

  return (
    <RuntimeProvider value="build">
      <Html>
        <Body>
          <Section>
            <Text>사용자 목록:</Text>
            <Each
              previewData={previewData}
              each="users"
              schema={userSchema}
              renderItem={(user) => (
                <div>
                  <Text>이름: {user.name}</Text>
                  <Text>이메일: {user.email}</Text>
                </div>
              )}
            />
          </Section>
        </Body>
      </Html>
    </RuntimeProvider>
  );
}
```

**생성된 Handlebars 템플릿:**

```handlebars
{{#each users}}
  <div>
    <p>이름: {{name}}</p>
    <p>이메일: {{email}}</p>
  </div>
{{/each}}
```

#### JSX Email 예제

```tsx
import { Body, Html, Text } from "jsx-email";
import { Each, RuntimeProvider } from "react-email-handlebars";
import { z } from "zod";

const productSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export const Template = () => {
  const previewData = [
    { name: "제품 A", price: 29.99 },
    { name: "제품 B", price: 49.99 },
  ];

  return (
    <RuntimeProvider value="preview">
      <Html>
        <Body>
          <Each
            previewData={previewData}
            each="products"
            schema={productSchema}
            renderItem={(product) => (
              <Text>
                {product.name}: ${product.price}
              </Text>
            )}
          />
        </Body>
      </Html>
    </RuntimeProvider>
  );
};
```

## API 레퍼런스

### `RuntimeProvider`

**Props:**
- `value`: `"preview" | "build"` - 런타임 모드

### `If`

**Props:**
- `conditionPath`: `string` - 조건에 대한 Handlebars 경로
- `previewCondition`: `boolean` - 미리보기 모드의 조건 값
- `then`: `ReactNode` - 조건이 참일 때 렌더링할 콘텐츠
- `else?`: `ReactNode` - 조건이 거짓일 때 렌더링할 선택적 콘텐츠

### `Each`

**Props:**
- `previewData`: `TItem[]` - 미리보기 모드용 아이템 배열
- `each`: `string` - 배열에 대한 Handlebars 경로
- `schema`: `z.ZodSchema<TItem>` - 아이템 구조를 정의하는 Zod 스키마
- `renderItem`: `(item: TItem) => ReactNode` - 각 아이템을 렌더링하는 함수

## 개발

### 설정

```bash
pnpm install
```

### 빌드

```bash
pnpm run build
```

### Watch 모드

```bash
pnpm run dev
```

### 예제 실행

#### React Email 예제

```bash
cd examples/react-email
pnpm install
pnpm run dev
```

http://localhost:3000 에서 예제를 확인할 수 있습니다.

#### JSX Email 예제

```bash
cd examples/jsx-email
pnpm install
pnpm run dev
```

## 작동 원리

라이브러리는 두 가지 런타임 모드를 제공합니다:

1. **미리보기 모드** (`runtime="preview"`):
   - 제공된 `previewData`와 `previewCondition` 사용
   - 실제 React 컴포넌트 렌더링
   - 개발 및 테스트에 적합

2. **빌드 모드** (`runtime="build"`):
   - Handlebars 템플릿 문법 생성
   - Zod 스키마를 사용하여 플레이스홀더 변수 생성
   - 프로덕션 사용 준비가 완료된 템플릿 문자열 출력

런타임 컨텍스트는 React Context API를 통해 관리되어 React Email과 JSX Email 환경 모두와의 호환성을 보장합니다.

## 라이센스

MIT

## 기여

기여는 언제나 환영합니다! Pull Request를 자유롭게 제출해주세요.
