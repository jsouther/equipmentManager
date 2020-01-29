/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/

module.exports = function(){
    var express = require('express');
    var router = express.Router();
	

/*function to get all laptops and their assigned user*/
function getLaptops(res, mysql, context, complete){
	mysql.pool.query("SELECT laptops.Id, laptops.make, laptops.model, laptops.sn, users.first_name, users.last_name FROM laptops INNER JOIN users ON laptops.Id = users.assigned_laptop ORDER BY Id", function(error, results, fields){
		if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
		//console.log(results);
		context.laptops = results;
		complete()
	});
}

/*function to get all laptop docs*/
function getDocuments(res, mysql, context, complete){
	mysql.pool.query("SELECT Id, title FROM laptop_docs", function(error, results, fields){
		if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
		//console.log(results);
		context.laptop_docs = results;
		complete()
	});
}



/*function to get all laptops and their associated docs*/
function getAssignments(res, mysql, context, complete){
	mysql.pool.query("SELECT laptops.Id AS LaptopId, laptops_laptopdocs.Id, laptops.make, laptops.model, laptops.sn, laptop_docs.title FROM laptops INNER JOIN laptops_laptopdocs ON laptops.Id = laptops_laptopdocs.lt_id INNER JOIN laptop_docs ON laptop_docs.Id = laptops_laptopdocs.doc_id ORDER BY laptops.Id", function(error, results, fields){
	if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
		//console.log(results);
		context.laptopDocs = results;
		complete()
	});
}

	
	
/*Route to display page*/
    router.get('/', function(req,res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteFunctions.js"];
		var mysql = req.app.get('mysql');
      getLaptops(res, mysql, context, complete);
	  getDocuments(res, mysql, context, complete);
      getAssignments(res, mysql, context, complete);
	  function complete(){
        callbackCount++;
        if(callbackCount >= 3){
			//console.log(context);
          res.render('laptop_laptopdocs', context);
        }
      }
    });
	

	
   
//Route to insert into laptop_laptopdocs table 
	router.post('', function (req, res){
	var mysql = req.app.get('mysql');
	var sql = "INSERT INTO laptops_laptopdocs (`lt_id`, `doc_id`) VALUES (?,?)";
	var inserts = [req.body.laptop, req.body.document];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}else{
			res.redirect('/laptop_laptopdocs');
		}
	});
});
 
    
    
/*Route to delete laptop/document relation*/
    router.delete('/:Id', function(req, res){
    	var mysql = req.app.get('mysql');
    	//console.log("DELETING!!");
    	var sql = "DELETE FROM laptops_laptopdocs WHERE Id=?";
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
