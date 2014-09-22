// basic.js
'use strict'

var fs = require('fs'),
		path = require('path');

/**
* 
* basic
*
* Expressjs middleware. Parse and validate the authorization header in a node server. Populates 'req.user'.
*
* Examples: 
* 
* app.use(xbasic-auth({ filename: "settings.json" })) 
* // or
* app.use(xbasic-auth({ user: "driver", password: "inside"}))
* 
*
* @param {Object} Context object.
* @api public.
*/

module.exports = function (context) {

	var user = (context.user && typeof context.user == 'string')? context.user : null,
			password = (context.password && typeof context.password == 'string')? context.password : null;

	if(context.filename && typeof context.filename == 'string'){

		var file = path.join(path.dirname(require.main.filename), context.filename);
		
		// get file content
		if (fs.existsSync(file)) {
			var fileContent = JSON.parse(fs.readFileSync(file, 'utf8'));
			
			user = (fileContent.user && typeof fileContent.user == 'string')? fileContent.user : null;
			password = (fileContent.password && typeof fileContent.password == 'string')? fileContent.password : null;
		} else{
			throw new Error('xbasic-auth: Basic auth file not found');
		}
	}

	if( user == null || password == null ) throw Error('xbasic-auth: user or password are null?');

	return function (req, res, next) {
		// get header content
		var auth = req.headers.authorization;

		if (req.user)  return next();
		if(!auth) return unAuthorized(res);

		var parts = auth.split(' ');

		if(parts.length !== 2 || parts[0] == "" || parts[1] == "") return badRequest(res);

		// get credentials
		var scheme = parts[0],
				credentials = new Buffer(parts[1], 'base64').toString(),
				index = credentials.indexOf(':');

		if(scheme != 'Basic' || index < 0) return badRequest(res);

		var _user = credentials.slice(0, index),
				_password = credentials.slice(index + 1);

		if (_user === user && _password === password) {
			req.user = user;
			next();
		} else{
			unAuthorized(res);
		}
	}	

};


function unAuthorized (res) {
	res.statusCode = 401;
	res.setHeader('WWW-Authenticate', 'Basic realm="Unauthorized"');
	res.end('Unauthorized');
}

function badRequest (res) {
	res.statusCode = 400;
	res.end('Bad request');
}
