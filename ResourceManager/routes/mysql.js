/**
 * http://usejsdoc.org/
 */
var mysql =  require('mysql');

var pool = mysql.createPool({
    connectionLimit : 100, 
	  host 		: '127.0.0.1',
	  user 		: 'root',
	  password  : 'root',
	  database  : 'sensorcloud',
	  port	    : 3306
});	

function executeQuery(sqlQuery, callback) {

	var connection = pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            console.log("Error in connection to database");
            callback(err, null);
          }
        	connection.query( sqlQuery, function(err, rows) { 
    		connection.release();
			if (err) {
				console.log(err.message);
			} else {
				console.log("DB Data:" + rows);
				callback(err, rows);
			}
			
		});
	});
	
}

exports.executeQuery = executeQuery;