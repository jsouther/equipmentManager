/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/

module.exports = function(){
    var express = require('express');
    var router = express.Router();

/* Get document info to display table of documents*/
   	function getLaptopDocs(res, mysql, context, complete){
      mysql.pool.query("SELECT DISTINCT laptop_docs.Id, title, doc_link FROM laptop_docs LEFT JOIN laptops_laptopdocs ON laptops_laptopdocs.doc_id = laptop_docs.Id LEFT JOIN laptops ON laptops.Id = laptops_laptopdocs.lt_id", function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.laptop_docs = results;
        complete();
      });
    }

/*Get specific document info for purpose of updating document*/
    function getDocument(res, mysql, context, Id, complete){
        var sql = "SELECT Id, title, doc_link FROM laptop_docs WHERE Id = ?";
        var inserts = [Id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.document = results[0];
            complete();
        });
    }
	
/*Get distinct laptop make/model listings for populating dropdown to search with*/
	function getLaptops(res, mysql, context, complete){
	mysql.pool.query("SELECT DISTINCT make, model FROM laptops ORDER BY make, model", function(error, results, fields){
		if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
		context.laptops = results;
		complete()
	});
}

/*Get all documents assigned to specific make/model UNUSED
function getAssignedDocs(res, mysql, context, complete, make, model){
	var sql = "SELECT DISTINCT laptop_docs.title FROM laptop_docs INNER JOIN laptops_laptopdocs ON laptop_docs.Id = laptops_laptopdocs.doc_id INNER JOIN laptops ON laptops.Id = laptops_laptopdocs.lt_id WHERE laptops.make = ? AND laptops.model = ?";
	var inserts = [make, model];
	mysql.pool.query(sql, inserts, function(error, results, fields){
		if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
		context.laptops = results;
		//console.log(results);
		complete()
	});
}
*/	
	

/*Route to display all documents*/
    router.get('/', function(req,res){
      var callbackCount = 0;
      var context = {};
       context.jsscripts = ["deleteFunctions.js"];
      var mysql = req.app.get('mysql');
      getLaptopDocs(res, mysql, context, complete);
	  getLaptops(res, mysql, context, complete);
      function complete(){
        callbackCount++;
        if(callbackCount >= 2){
          res.render('laptop_docs', context);
        }
      }
    });
    
	
/*Route insert into laptop_docs table*/ 
	  router.post('', function (req, res){
  	//console.log("adding!");
  	var mysql = req.app.get('mysql');
  	var sql = "INSERT INTO laptop_docs (`title`, `doc_link`) VALUES (?,?)";
  	var inserts = [req.body.title_input, req.body.link_input];
  		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
    		if(error){
    			res.write(JSON.stringify(error));
    			res.end();
    		}else{
    			res.redirect('/laptop_docs');
    		}
  	  });
    });

/*Route to URL to display one document for updating*/
    router.get('/:Id', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = ["updateDoc.js"];
      var mysql = req.app.get('mysql');
      getDocument(res, mysql, context, req.params.Id, complete);
      function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render('update-document', context);
        }
      }
    });


/*Route to URL that update data is sent in order to update a user*/
    router.put('/:Id', function(req, res){
      var mysql = req.app.get('mysql');
      //console.log(req.body)
      //console.log(req.params.Id)
      var sql = "UPDATE laptop_docs SET title=?, doc_link=? WHERE Id=?";
      var inserts = [req.body.title, req.body.doc_link, req.params.Id];
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
    
 /*Route to delete laptopDoc*/
    router.delete('/:Id', function(req, res){
    	var mysql = req.app.get('mysql');
    	//console.log("DELETING!!");
    	var sql = "DELETE FROM laptop_docs WHERE Id=?";
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
    });
	
	
/*Route to display docs that pertain to make/model*/
    router.post('/search', function(req,res){
	 callbackCount = 0;
      //console.log("HERE!!!");
	  //console.log(req.body.laptop);
	var params = JSON.parse(req.body.laptop);
      var context = {};
      var mysql = req.app.get('mysql');	  
	  //this works but doesn't fill in the laptop dropdown
	  var sql = "SELECT DISTINCT laptop_docs.title, laptop_docs.doc_link FROM laptop_docs INNER JOIN laptops_laptopdocs ON laptop_docs.Id = laptops_laptopdocs.doc_id INNER JOIN laptops ON laptops.Id = laptops_laptopdocs.lt_id WHERE laptops.make = ? AND laptops.model = ?";
			var inserts = [params.make, params.model];
     		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}else
			//console.log(results);
			context.laptop_docs = results;
			res.render('laptop_docs', context);
		});
    });
	

    return router;
}();
