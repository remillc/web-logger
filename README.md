# web-logger
A tiny wrapper around morgan that simplifies web traffic loggins in Apache or custom format. Works best with [Express](https://expressjs.com/).

Log files will be saved where you want to, with each day in it's own file. Filename: `access-%DATE%.log`.

That's it.

## Installation
```
npm i @remillc/web-logger
```

## Usage

### API
```
import express from 'express'
import { join } from 'path'
import webLogger from '@remillc/web-logger'

const app = express()

...

// Set the logger as an Express middleware
app.use(webLogger({
  logDirectory: join(__process.cwd(), 'logs')
}));
```

##### Options
- `logDirectory`: path to the folder where the logs will be saved. Default: `./logs` [optional]
- `format`: Log format. See [morgan](https://github.com/expressjs/morgan) for formats. Default: `combined` [optional]