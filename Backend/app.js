
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , adminManager = require('./routes/adminManager')
  , hubManager = require('./routes/hubs')
  , vSensorManager = require('./routes/vSensors')
  , data_access = require('./routes/dataAccess')  
  , userResoureMgr = require('./routes/userResources')
  , http = require('http')
  , path = require('path');


var sessions = require('client-sessions');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// all environments
app.set('port', process.env.PORT || 3006);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(sessions({
    cookieName: 'sensorcloud',
    secret: 'gasghergjrdagdasdas',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 15 
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));





// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/logout',function(req, res){
	req.sensorcloud.reset();
	res.redirect('/login');
});

app.get('/index', function(req, res){
	res.sendfile('index.html');
});

app.get('/register', function(req, res){
	res.sendfile('register.html');
});

app.get('/login', function(req, res){
	res.sendfile('login.html');
});

app.get('/sensors', function(req, res){
	res.sendfile('sensor.html');
});

app.get('/devices', function(req, res){
	res.sendfile('devices.html');
});

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/get-all-sensor-data', data_access.get_data);

app.post('/sign-in', user.sign_in);
app.post('/sign-up', user.sign_up);

/* This section contains APIs for providing details about resources owned by all users to the admin */
app.get('/get-all-vSensors', adminManager.get_all_vSensors);
app.get('/get-all-pSensors', adminManager.get_all_pSensors);
app.get('/get-all-hubs', adminManager.get_all_hubs);

/* This section contains APIs for providing details about resources owned by the user */
app.get('/get-user-vSensors', userResoureMgr.get_vSensors);
app.get('/get-user-pSensors', userResoureMgr.get_pSensors);
app.get('/get-user-hubs', userResoureMgr.get_Hubs);

/* This section contains APIs for creation and deletion of hubs and physical sensors */
app.post('/create-hub', hubManager.create_hub);
app.post('/delete-hub', hubManager.delete_hub);
app.post('/create-physical-sensor', hubManager.create_sensor);
app.post('/delete-physical-sensor', hubManager.delete_sensor);

/* This section contains APIs for creating, suspending, resuming and terminating virtual sensors */
app.post('/create-virtual-sensor', vSensorManager.create_sensor);
app.post('/suspend-virtual-sensor', vSensorManager.suspend_sensor);
app.post('/resume-virtual-sensor', vSensorManager.resume_sensor);
app.post('/terminate-virtual-sensor', vSensorManager.terminate_sensor);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
