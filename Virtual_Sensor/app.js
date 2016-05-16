
/**
 * Module dependencies.
 */

var express = require('express')
  , virtual_sensor = require('./routes/virt_sensor')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3002);
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

app.post('/create',virtual_sensor.create_sensor);
app.post('/resume',virtual_sensor.start_sensor);
app.post('/suspend',virtual_sensor.suspend_sensor);
app.post('/terminate',virtual_sensor.terminate_sensor);
app.post('/get-data',virtual_sensor.get_data);
app.post('/get-sensors',virtual_sensor.get_sensors);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
