# firenpm ![node version](https://img.shields.io/node/v/firenpm.svg) [![Build Status](https://travis-ci.org/pawelgalazka/firenpm.svg?branch=master)](https://travis-ci.org/pawelgalazka/firenpm) [![npm version](https://badge.fury.io/js/firenpm.svg)](https://badge.fury.io/js/firenpm)


## Quick start
Install command line tools:

```bash
npm -g install firenpm.cli runjs
```

Create your project:

```bash
firenpm your-project
```

...and done! Now just `cd your-project` and type `run test`.
Linting, ES6 and tests work out of the box!

![screen shot 2016-09-25 at 19 59 50](https://cloud.githubusercontent.com/assets/829242/18814598/b4b0815c-835b-11e6-8e28-f163f93370e8.png)

Make a note that your dependencies in `package.json` will look like this:

```json
{
  "name": "package-name",
  "version": "1.0.0",
  // ...
  "dependencies": {},
  "devDependencies": {
    "firenpm": "X.X.X"
  },
  // ...
}
```

there is no test tools, eslint or babel plugins there! That means you don't need
to care about maintaining those dependencies, that's a job of firenpm.

## What's inside ?

firenpm ecosystem consist of 2 npm modules: `firenpm.cli` and `firenpm`.

- `firenpm.cli` - command line tool which generates project structure for you, from firenpm template
- `firenpm` - provides necessary devDependencies

Tools used by `firenpm`:

- [babel](http://www.babeljs.io) (with presets: es2015, react and stage-2)
- [eslint](http://www.eslint.org) (with standard and standard-react config)
- [mocha](http://www.mochajs.org)
- [mochaccino](https://github.com/pawelgalazka/mochaccino) (test asserts, mocking)
- [runjs](https://github.com/pawelgalazka/runjs) (minimalistic building tool)

## Web extension

For testing packages which should work within the browser like
React components there is `firenpm.web` extension.

To create project with that extension:

```bash
firenpm your-project --web
```

then

```bash
cd your-project
run test # will do tests on fake dom (jsdom)
run web # it will open up the browser, with your code
```

Web extension provides `webpack` setup which will run your code
in the browser for visual testing purposes. In your `devDependencies`
`firenpm.web` packages will be installed. Package stores all
necessary tools, so you don't have to manage all webpack dependencies.
