# xbasic-auth

Expressjs middleware: Parse and validate the authorization header in a node server.

## How to install
```
$ npm install xbasic-auth
```


## Examples

You need pass an object with the user/password information.

**From object:** use the ***user*** and ***password*** keys. The values must be *string*.

**From file** use the ***filename*** key. The file must be in your app path.

### From object

```js
var express = require('express'),
  app = express(),
  xbasic = require('xbasic-auth');
	
	app.use(xbasic( { user: 'driver', password: 'mySecretPassword' } ))
	
	// your code

```

### From file

```json
{
  "user": "driver",
  "password": "mySecretPassword"
}
```

```js
var express = require('express'),
  app = express(),
  xbasic = require('xbasic-auth');
	
	app.use(xbasic( { filename : "somefile.json" } ))
	// your code

```
or

```js
  app.use(xbasic( { filename : "path/to/somefile.json" } ))
```

## Licence
[MIT](LICENSE)
