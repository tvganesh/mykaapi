
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , question = require('./routes/question')
  , simplesync = require('./routes/simplesync')
  , evidence = require('./routes/evidence')
  , evidencereq = require('./routes/evidencereq')
  , items = require('./routes/items')
  , itemsreq = require('./routes/itemsreq')
  , items = require('./routes/format')
  , itemsreq = require('./routes/formatreq')  
  , connect = require('connect')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
// Simple Sync
app.get('/question',question.list);
app.post('/simplesync',simplesync.list);

//Evidence req
app.get('/evidence',evidence.list);
app.post('/evidencereq',evidencereq.list);

//Items req
app.get('/items',items.list);
app.post('/itemsreq',itemsreq.list);

// Format req
app.get('/format',items.list);
app.post('/formatreq',itemsreq.list);

//Start a Web server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
