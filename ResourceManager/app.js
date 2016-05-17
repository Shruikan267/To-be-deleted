
/**
 * Module dependencies.
 */

var express = require('express')
  , userResoureMgr = require('./routes/userResourceManager')
  , hubManager = require('./routes/hubManager')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3005);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
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



app.post('/get-user-vSensors', userResoureMgr.get_vSensors);
app.post('/create-hub', hubManager.createHub);
app.post('/delete-hub', hubManager.deleteHub);
app.post('/create-physical-sensor', hubManager.createSensor);
app.post('/delete-physical-sensor', hubManager.deleteSensor);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
