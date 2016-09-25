# firenpm [![Build Status](https://travis-ci.org/pawelgalazka/firenpm.svg?branch=master)](https://travis-ci.org/pawelgalazka/firenpm) [![npm version](https://badge.fury.io/js/firenpm.svg)](https://badge.fury.io/js/firenpm)


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
