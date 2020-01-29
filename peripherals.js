/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/


module.exports = function(){
    var express = require('express');
    var router = express.Router();

 /* function to get peripheral info to display table of peripherals*/
    function getPeripherals(res, mysql, context, complete){
      mysql.pool.query("SELECT peripherals.Id, equip_type, make, model, users.first_name, users.last_name FROM peripherals LEFT JOIN users ON users.Id = peripherals.assigned_user ORDER BY peripherals.Id ASC", function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.peripherals = results;
        complete();
      });
    }

 /* function to get user info to display users in dropdown menus*/
    function getUsers(res, mysql, context, complete){
      mysql.pool.query("SELECT Id, first_name, last_name, pref_email FROM users", function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.user = results;
        complete();
      });
    }

 /*function to get specific peripheral info for purpose of updating peripheral*/
    function getPeripheral(res, mysql, context, Id, complete){
        var sql = "SELECT Id, equip_type, make, model, assigned_user FROM peripherals WHERE Id = ?";
        var inserts = [Id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.peripheral = results[0];
            complete();
        });
    }

   /*Route to display peripherals*/
    router.get('/', function(req,res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ["deleteFunctions.js"];
      var mysql = req.app.get('mysql');
      getPeripherals(res, mysql, context, complete);
      getUsers(res, mysql, context, complete);
      function complete(){
        callbackCount++;
        if(callbackCount >= 2){
          res.render('peripherals', context);
        }
      }
	  });  
	 

   /* Route to add peripheral*/
  	router.post('', function(req, res) {
      var mysql = req.app.get('mysql');
      console.log(req.body.assigned_user_input)
      if (req.body.assigned_user_input == "NULL") {
        req.body.assigned_user_input = null;
      }
      console.log(req.body)
        console.log(req.params.Id)
      var sql = "INSERT INTO peripherals(`equip_type`,`make`,`model`, `assigned_user`) VALUES (?,?,?,?)";
      var inserts = [req.body.type_input, req.body.make_input, req.body.model_input, req.body.assigned_user_input] 
      		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        	if(error){
        		res.write(JSON.stringify(error));
        		res.end();
        	}else{
        		res.redirect('/peripherals');
        	}
  	  });
    });
	

 /*Route to URL to display one peripheral for updating*/
    router.get('/:Id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatePeripheral.js", "selectedUser.js"];
        var mysql = req.app.get('mysql');
        getPeripheral(res, mysql, context, req.params.Id, complete);
        getUsers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-peripheral', context);
            }
        }
    }); 

    
  /*Route to URL that update data is sent in order to update a peripheral*/
    router.put('/:Id', function(req, res){
        var mysql = req.app.get('mysql');
        
        if (req.body.assigned_user == "NULL") {
        req.body.assigned_user = null;
        }
        console.log(req.body)
        console.log(req.params.Id)
        var sql = "UPDATE peripherals SET equip_type=?, make=?, model=?, assigned_user=? WHERE Id=?";
        var inserts = [req.body.equip_type, req.body.make, req.body.model, req.body.assigned_user, req.params.Id];
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


 /*Route to delete peripheral*/
    router.delete('/:Id', function(req, res){
    	var mysql = req.app.get('mysql');
    	//console.log("DELETING!!");
    	var sql = "DELETE FROM peripherals WHERE Id=?";
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