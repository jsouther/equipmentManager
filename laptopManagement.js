/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/

/*THE FUNCTIONS ON THIS PAGE WERE ADDED TO OTHER PAGES, THIS PAGE IS NOT DISPLAYED*/


module.exports = function(){
    var express = require('express');
    var router = express.Router();

/*function to get laptop, user and location*/
    function getLaptopMgmt(res, mysql, context, complete){
	mysql.pool.query("SELECT sn, make, model, ram, cpu, users.pref_email, location.city FROM laptops LEFT JOIN users ON laptops.Id = users.assigned_laptop LEFT JOIN location ON users.home_office =location.id", function(error, results, fields){
       if(error){
		//console.log("ERROR!!");
        res.write(JSON.stringify(error));
         res.end();
       }
        context.laptops = results;
       // console.log(context.laptops);
		complete();
      });

	}

/*Route to display laptopManagement page*/
	router.get('/', function(req,res){
      var callbackCount = 0;
      var context = {};
      //context.jsscripts = []
      var mysql = req.app.get('mysql');
      getLaptopMgmt(res, mysql, context, complete);
      function complete(){
        callbackCount++;
        if(callbackCount >= 1){
		//	res.render('laptopManagement')
	      res.render('laptopManagement', context);
       }
      }
	})




    return router;
}(); 