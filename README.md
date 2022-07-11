# unleashed-typescript

TypeScript with exposed internal definitions and some private methods for type checking.

# How does it work?

When you install the package, it will look for your local version of TypeScript. It will then make a copy of your version in its own location, apply the patches and re-export the patched version. Then you can import the patched version and enjoy your unleashed version of TypeScript while keeping your original version intact.

# What does it add/remove?

1. Removes all `@internal` tags which allows you to access internal types, classes, properties and methods with their declarations.

2. Export some very useful private methods from the `TypeChecker`:

   ```ts
   isTypeSubtypeOf(source: Type, target: Type): boolean;
   isTypeIdenticalTo(source: Type, target: Type): boolean;
   isTypeDerivedFrom(source: Type, target: Type): boolean;
   isTypeAssignableTo(source: Type, target: Type): boolean;
   isTypeComparableTo(source: Type, target: Type): boolean;
   areTypesComparable(source: Type, target: Type): boolean;
   ```

# Installation

```ts
pnpm add -D typescript unleashed-typescript
```

# Usage

```ts
import ts from 'unleashed-typescript';

// Use ts as usual.
```

# CLI

```bash
Usage: unleashed-typescript [options]

Options:
  --upgrade   Upgrade the unleashed version from your current version.
```

# Alternatives

`unleashed-typescript` is a combination of the alternatives listed below. But instead of maintaining an up-to-date build of TypeScript we use your locally installed version.

## Remove @internal tags

- [byots](https://github.com/basarat/byots) Bring your own TypeScript with more internal definitions
- [ts-expose-internals](https://github.com/nonara/ts-expose-internals) Expose TypeScript internal types by simply adding a development dependency

## Expose TypeChecker methods

- [tsd-typescript](https://github.com/SamVerschueren/tsd-typescript) TypeScript with some extras for type-checking.

# TypeScript ~~god~~ strict mode

It is strongly recommended to activate the [strict](https://www.typescriptlang.org/tsconfig#strict) mode of TypeScript which will activate all checking behaviours that results in stronger guarantees of the program's correctness.

# Contributing 💜

See [CONTRIBUTING.md](https://github.com/skarab42/unleashed-typescript/blob/main/CONTRIBUTING.md)
