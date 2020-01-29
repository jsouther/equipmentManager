/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/

module.exports = function(){
    var express = require('express');
    var router = express.Router();

 /*function to get locations info to display table of locations*/
    function getLocations(res, mysql, context, complete){
      mysql.pool.query("SELECT Id, street_address, city, state, zip FROM location", function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.location = results;
        complete();
      });
    }

 /*function to get specific location info for purpose of updating location*/
    function getLocation(res, mysql, context, Id, complete){
        var sql = "SELECT Id, street_address, city, state, zip FROM location WHERE Id = ?";
        var inserts = [Id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.location = results[0];
            complete();
        });
    }

 /*Route to display all locations*/
    router.get('/', function(req,res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ["deleteFunctions.js"];
      var mysql = req.app.get('mysql');
      getLocations(res, mysql, context, complete);
      function complete(){
        callbackCount++;
        if(callbackCount >= 1){
          res.render('location', context);
        }
      }
    });
	
//route to insert into location table
    router.post('/', function (req, res){
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO location (`street_address`,`city`,`state`,`zip`) VALUES (?,?,?,?)";
      var inserts = [req.body.address_input, req.body.city_input, req.body.state_input, req.body.zip_input];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      	if(error){
      		res.write(JSON.stringify(error));
      		res.end();
      	}else{
      		res.redirect('/location');
      	}
      });
    });

 /*Route to URL to display one user for updating*/
    router.get('/:Id', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = ["updateLocation.js"];
      var mysql = req.app.get('mysql');
      getLocation(res, mysql, context, req.params.Id, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 1){
              res.render('update-location', context);
          }
      }
    }); 

/*Route to URL that update data is sent in order to update a user*/
    router.put('/:Id', function(req, res){
      var mysql = req.app.get('mysql');
      console.log(req.body)
      console.log(req.params.Id)
      var sql = "UPDATE location SET street_address=?, city=?, state=?, zip=? WHERE Id=?";
      var inserts = [req.body.street_address, req.body.city, req.body.state, req.body.zip, req.params.Id];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(error)
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.status(200);
              res.end();
          }
      });
    });

    /*Route to delete user*/
    router.delete('/:Id', function(req, res){
    	var mysql = req.app.get('mysql');
    	console.log("DELETING!!");
    	var sql = "DELETE FROM location WHERE Id=?";
    	var inserts = [req.params.Id];
    	console.log(req.params.Id);
    	sql = mysql.pool.query(sql,inserts,function(error, results, fields){
    		if(error){
    			console.log("error!!!!");
    			res.write(JSON.stringify(error));
    			res.status(400);
    			res.end();
    		}else{
    			res.status(202).end();
    		//	console.log("deleted");
    		}
    	})
    })
	
    return router;
}();

