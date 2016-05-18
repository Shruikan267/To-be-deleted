
/**
 * Module dependencies.
 */

var express = require('express')
  , hub = require('./routes/hub')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
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

app.post('/create',hub.create_hub);
app.post('/add-sensor',hub.add_sensor);
app.post('/delete-sensor',hub.delete_sensor);
app.post('/delete',hub.delete_hub);
app.post('/get-data',hub.get_data);
app.post('/view-hubs',hub.view_hubs);
app.post('/view-sensors',hub.view_sensors);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
