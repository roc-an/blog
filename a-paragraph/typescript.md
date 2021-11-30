# 一段话说透一个前端知识点 - TypeScript

## 接口 interface 与类型别名 type 的区别

`interface` 是定义接口，而 `type` 是定义类型别名，它俩的使用非常类似。

**`type` 可以代表基本类型，而 `interface` 不可以，基本类型与联合类型配合使用时，使用 `type` 尤为方便**：

```ts
type Person = string;
type Direction = 'North' | 'East' | 'South' | 'West';
```

`type` 和 `interface` 都可以表示一个对象：

```ts
// 定义接口 interface
interface Person1 {
  name: string;
  say(): string;
}

// 定义类型别名 type
type Person2 {
  name: string;
  say(): string;  
}
```

TS 行业规范建议：如果能使用 `interface` 应优先使用 `interface`，`interface` 表示不了的情况再使用 `type`
