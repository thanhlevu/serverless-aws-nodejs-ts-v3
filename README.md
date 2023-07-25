# Serverless - AWS Node.js Typescript with SDK v3

Serverless Framework template for zero-config TypeScript support.
This template includes an example code to create / get / update / delete a product.
Some build-in dependencies:
- @aws-sdk/client-dynamodb
- @aws-sdk/util-dynamodb
- aws-lambda
- aws-sdk
- uuid
- zod

## Features

Thanks to [`serverless-typescript`](https://github.com/prisma-labs/serverless-plugin-typescript) plugin:

- Zero-config: Works out of the box without the need to install any other compiler or plugins
- Supports ES2015 syntax + features (`export`, `import`, `async`, `await`, `Promise`, ...)
- Supports `sls package`, `sls deploy` and `sls deploy function`
- Supports `sls invoke local` + `--watch` mode
- Integrates nicely with [`serverless-offline`](https://github.com/dherault/serverless-offline)

## Prerequisites

- [`serverless-framework`](https://github.com/serverless/serverless)
- [`node.js`](https://nodejs.org)

## Usage

To create new serverless AWS TypeScript project using this template run:

```bash
serverless create \
--template-url https://github.com/thanhlevu/serverless-aws-nodejs-ts-v3/tree/main \
--path myServiceName
```

where `myServiceName` should be replaced with the name of your choice.

Then change directory to the newly created one:

```
cd myServiceName
```

And run:

```
npm install
```

or:

```
yarn
```

To run project offline:

```
serverless offline
```

To deploy:

```
serverless deploy
```

## Licence

MIT.
