# Logger Middleware

Middleware for request logging in a server.

## Installation

```shell
npm install @hexstudiosar/reqlogger
```

## Usage

```javascript
const express = require('express');
const logger = require('@hexstudiosar/reqlogger');

const app = express();

// Add the request logging middleware
app.use(logger());

// Rest of your application configuration and routes
// ...

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## Options

The middleware accepts an option for the log style. The available options are:

```javascript
// 'inline': Inline log that displays all details in a single line.
app.use(logger('inline'));
/*
  Output:
  [15:30:45] GET /home 200 15ms 1750
*/
```

```javascript
// 'minified': Minimal log that displays only essential request details.
app.use(logger('minified'));
/*
  Output:
  GET /home 200 15ms
*/
```

```javascript
// 'agent': Log focused on agent information (IP, User Agent, Referer).
app.use(logger('agent'));
/* 
  Output:
  [15:30:45] | AGENT LOG
    IP: ::1
    User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36
    Referer: Unknown
*/
```

```javascript
// 'error': Inline log that displays only error requests details.
app.use(logger('error'));
/*
  Output:
  [15:30:45] GET /home6 404 9ms 143
*/
```

```javascript
// 'default': Detailed log with all request details.
app.use(logger('default'));
/* 
  Output:
  [15:30:45] | REQUEST LOG
    Timestamp: 15:30:45
    Method: GET
    URL: /home
    Status: 200
    Time: 15ms
    IP: ::1
    Size: 1750
    User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36
    Referer: Unknown
*/
```

*If no logging style is specified, the default style will be used*.

## License

This project is licensed under the MIT License.
