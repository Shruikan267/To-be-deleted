
/**
 * Module dependencies.
 */

var express = require('express')
  , userResoureMgr = require('./routes/userResourceManager')
  , hubManager = require('./routes/hubManager')
  , vSensorManager = require('./routes/vSensorManager')
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

/* This section contains APIs for providing details about resources owned by the user */
app.post('/get-user-vSensors', userResoureMgr.get_vSensors);
app.post('/get-user-pSensors', userResoureMgr.get_pSensors);
app.post('/get-user-hubs', userResoureMgr.get_Hubs);

/* This section contains APIs for creation and deletion of hubs and physical sensors */
app.post('/create-hub', hubManager.createHub);
app.post('/delete-hub', hubManager.deleteHub);
app.post('/create-physical-sensor', hubManager.createSensor);
app.post('/delete-physical-sensor', hubManager.deleteSensor);

/* This section contains APIs for creating, suspending, resuming and terminating virtual sensors */
app.post('/create-virtual-sensor', vSensorManager.create_sensor);
app.post('/suspend-virtual-sensor', vSensorManager.suspend_sensor);
app.post('/resume-virtual-sensor', vSensorManager.resume_sensor);
app.post('/terminate-virtual-sensor', vSensorManager.terminate_sensor);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
