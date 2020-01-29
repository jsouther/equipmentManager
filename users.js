/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/

module.exports = function(){
    var express = require('express');
    var router = express.Router();


/*function to get user info to display table of users*/
    function getUsers(res, mysql, context, complete){
      mysql.pool.query("SELECT users.Id, first_name, last_name, department, job_title, pref_phone, pref_email, location.city, location.state, laptops.sn FROM users INNER JOIN location ON location.Id = users.home_office LEFT JOIN laptops on laptops.Id = users.assigned_laptop", function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.users = results;
        complete();
      });
    }


/*function to get location info to display locations in dropdown menus*/
   function getLocations(res, mysql, context, complete){
        mysql.pool.query("SELECT Id, city FROM location", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.location = results;
            complete();
        });
    }

 /*function to get available laptop info to display laptops in dropdown menus*/
   function getLaptops(res, mysql, context, complete){
        mysql.pool.query("SELECT laptops.Id, sn, users.assigned_laptop FROM laptops left JOIN users ON laptops.Id = users.assigned_laptop WHERE users.assigned_laptop IS NULL", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.laptop = results;
            complete();
        });
    }

    function getLaptopsForUpdate(res, mysql, context, Id, complete){
        var sql = "SELECT laptops.Id, sn, users.assigned_laptop FROM laptops left JOIN users ON laptops.Id = users.assigned_laptop WHERE users.assigned_laptop IS NULL OR users.Id = ?";
        var inserts = [Id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.laptop = results;
            complete();
        });
    }

 /*function to get specific user info for purpose of updating user*/
    function getUser(res, mysql, context, Id, complete){
        var sql = "SELECT Id, first_name, last_name, department, job_title, pref_phone, pref_email, home_office, assigned_laptop FROM users WHERE Id = ?";
        var inserts = [Id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.user = results[0];
            complete();
        });
    }


/*Route to display all users and populate location dropdowns*/
    router.get('/', function(req,res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ["deleteFunctions.js"];
      var mysql = req.app.get('mysql');
      getUsers(res, mysql, context, complete);
      getLocations(res, mysql, context, complete);
      getLaptops(res, mysql, context, complete);
      function complete(){
        callbackCount++;
        if(callbackCount >= 3){
          res.render('users', context);
        }
      }
    });
	

/*Route to add a user, redirects to users page*/
  	router.post('', function(req, res) {
    	var mysql = req.app.get('mysql');
        if (req.body.laptop_input == "NULL") {
            req.body.laptop_input = null;
        }
    	var sql = "INSERT INTO users(`first_name`,`last_name`,`department`,`job_title`,`pref_phone`,`pref_email`,`home_office`, `assigned_laptop`) VALUES (?,?,?,?,?,?,?,?)";
    	var inserts = [req.body.fname_input, req.body.lname_input, req.body.department_input, req.body.title_input, req.body.phone_input, req.body.email_input, req.body.location, req.body.laptop_input] 
    		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}else{
    			res.redirect('/users');
    		}
  	  });
    });
	
	
/*Route to search for a user by email*/
	router.post('/search', function(req, res){
		var context = {};
		var mysql = req.app.get('mysql');
		var sql = "SELECT users.Id, first_name, last_name, department, job_title, pref_phone, pref_email, location.city, location.state FROM users INNER JOIN location ON location.Id = users.home_office WHERE pref_email = ?";
		var inserts = [req.body.email_search];
	//	console.log(req.body.email_search);
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}else
		//	console.log(results);
			context.users = results;
			res.render('users', context);
		});
	});
	
	
 /*Route to URL to display one user for updating*/
    router.get('/:Id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedLocation.js", "selectedLaptop.js", "updateUser.js"];
        var mysql = req.app.get('mysql');
        getUser(res, mysql, context, req.params.Id, complete);
        getLocations(res, mysql, context, complete);
        getLaptopsForUpdate(res, mysql, context, req.params.Id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-user', context);
            }
        }
    });	
	

/*Route to URL that update data is sent in order to update a user*/
    router.put('/:Id', function(req, res){
        var mysql = req.app.get('mysql');
        if (req.body.assigned_laptop == "NULL") {
            req.body.assigned_laptop = null;
        }
        console.log(req.body)
        console.log(req.params.Id)
        var sql = "UPDATE users SET first_name=?, last_name=?, department=?, job_title=?, pref_phone=?, pref_email=?, home_office=?, assigned_laptop=? WHERE Id=?";
        var inserts = [req.body.first_name, req.body.last_name, req.body.department, req.body.job_title, req.body.pref_phone, req.body.pref_email, req.body.home_office, req.body.assigned_laptop, req.params.Id];
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
    	//console.log("DELETING!!");
    	var sql = "DELETE FROM users WHERE Id=?";
    	var inserts = [req.params.Id];
    	//console.log(req.params.Id);
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
