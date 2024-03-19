<h1 align="center">Welcome to @tamnt-work/data-mapper 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/@tamnt-work/data-mapper" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@tamnt-work/data-mapper.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

## Install

```sh
yarn add @tamnt-work/data-mapper
```

## Usage with CLI

### Create custom config

```sh
npx tw init
```

We will create a `tw-config.json` file in the root of your project.

Default config:

```json
{
  "modulePath": "/app",
  "modelSuffix": ".model",
  "mapperSuffix": ".mapper",
  "entitySuffix": ".entity",
  "overwrite": false
}
```

### Create schema

```sh
npx tw schema init
```

We will create a `schema/schema.tws` file in your project.

### Define schema

Example:

```yaml
user:
  id: string <=> id
  fullName: string <=> name
  username: string
  email: string
  phoneNumber: string <=> phone
  companyName: string <=> company.name
  address: string <=> address.street.name
  age: number

post:
  id: string
  title: string <=> name
  content: string <=> body
  views: number
  createdAt: string <=> date
```

### Generate with schema

```sh
npx tw schema generate
```

#### Output

_user.entity.ts_

```typescript
export interface UserEntity {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  age: number;
  company: {
    name: string;
  };
  address: {
    street: {
      name: string;
    };
  };
}
```

_user.model.ts_

```typescript
export interface UserModel {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  address: string;
  age: number;
}
```

_user.mapper.ts_

```typescript
import { Mapper, type TransformationMap } from "@tamnt-work/data-mapper";
import type { UserEntity } from "./user.entity";
import type { UserModel } from "./user.model";

const transformationMap: TransformationMap<UserModel, UserEntity> = {
  id: "id",
  fullName: "name",
  username: "username",
  email: "email",
  phoneNumber: "phone",
  companyName: "company.name",
  address: "address.street.name",
  age: "age",
};

export const UserMapper = new Mapper<UserEntity, UserModel>(transformationMap);
```

## Example

Auto suggestion with key and value

![Alt Text](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2htZmt4N2YxMG1wd2t3bGNlcTNqbTNpN3p1cXQ3aHd5MzE3aWttZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BfwfnGfykyN5OEoyj1/giphy.gif)

## Usage with code

```typescript
const data = {
  id: "1",
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: {
      lat: "-37.3159",
      lng: "81.1496",
    },
  },
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
};

const model = UserMapper.toModel(data);

// Output
{
  "id": "1",
  "companyName": "Romaguera-Crona",
  "email": "Sincere@april.biz",
  "fullName": "Leanne Graham",
  "phoneNumber": "1-770-736-8031 x56442",
  "username": "Bret"
}

const entity = UserMapper.toEntity(model);

// Output
{
  "id": "1",
  "company": {
    "name": "Romaguera-Crona"
  },
  "email": "Sincere@april.biz",
  "name": "Leanne Graham",
  "phone": "1-770-736-8031 x56442",
  "username": "Bret"
}
```

## Method

### Mapper

#### toArrayModel

```typescript
toArrayModel(entity: Entity[]): Model[]
```

#### toEntityArray

```typescript
toEntityArray(model: Model[]): Entity[]
```

#### toModel

```typescript
toModel(entity: Entity): Model
```

#### toEntity

```typescript
toEntity(model: Model): Entity
```

## Author

👤 **TamNT**

Email: contact@tamnt.work

## Show your support

Give a ⭐️ if this project helped you!
