[simpcicd](README.md) / Modules

# simpcicd

## Table of contents

### Functions

- [call](modules.md#call)
- [defineConfig](modules.md#defineconfig)
- [fork](modules.md#fork)
- [getGitPath](modules.md#getgitpath)
- [useCli](modules.md#usecli)
- [useConfig](modules.md#useconfig)
- [useExec](modules.md#useexec)
- [useHooks](modules.md#usehooks)
- [useTrigger](modules.md#usetrigger)

## Functions

### call

▸ `Const` **call**(`config`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Config` |

#### Returns

`Promise`<`void`\>

#### Defined in

utils/caller.ts:6

___

### defineConfig

▸ `Const` **defineConfig**(`config`): `Config`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Config` |

#### Returns

`Config`

#### Defined in

composables/config.ts:42

___

### fork

▸ `Const` **fork**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

utils/forker.ts:4

___

### getGitPath

▸ `Const` **getGitPath**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

utils/git.ts:10

___

### useCli

▸ `Const` **useCli**(`config`): `CAC`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Config` |

#### Returns

`CAC`

#### Defined in

resolvers/cli.ts:10

___

### useConfig

▸ `Const` **useConfig**(`config?`): `Config`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | `Config` |

#### Returns

`Config`

#### Defined in

composables/config.ts:11

___

### useExec

▸ `Const` **useExec**(`ctx?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx?` | `ExecContext` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `exec` | (`cmd`: `string`, `opts?`: `ExecOptions`) => `Promise`<`unknown`\> |
| `execPipeline` | (`pipeline`: `Pipeline`) => `Promise`<`void`\> |
| `execStep` | (`step`: `Step`) => `Promise`<`void`\> |
| `setContext` | (`ctx`: `ExecContext`) => `void` |

#### Defined in

composables/exec.ts:12

___

### useHooks

▸ `Const` **useHooks**(`config?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | `Config` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `linkHooks` | (`config`: `Config`) => `Promise`<`void`\> |
| `toHook` | (`target`: `string`) => `Promise`<`void`\> |

#### Defined in

resolvers/hooks.ts:13

___

### useTrigger

▸ `Const` **useTrigger**(`config?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | `Config` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `isUnique` | (`pipelines`: `Pipeline`[]) => `boolean` |
| `trigger` | (`name`: `string`) => `Promise`<`unknown`\> |

#### Defined in

resolvers/trigger.ts:6
