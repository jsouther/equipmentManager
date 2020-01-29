/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/ 
 
 
//delete user by id 
 function deleteUser(Id){
	$.ajax({
		url: '/users/' + Id,
		type: 'DELETE',
		success: function(result){
			console.log("delete");
			window.location.reload(true);
		}
	})
};

//delete Location by id
 function deleteLocation(Id){
	$.ajax({
		url: '/location/' + Id,
		type: 'DELETE',
		success: function(result){
			console.log("delete");
			console.log(Id);
			window.location.reload(true);
		}
	})
};

//delete laptop by id
 function deleteLaptop(Id){
	$.ajax({
		url: '/laptops/' + Id,
		type: 'DELETE',
		success: function(result){
			console.log("delete");
			console.log(Id);
			window.location.reload(true);
		}
	})
};

 //delete laptop Doc by ID
 function deleteLaptopDoc(Id){
	$.ajax({
		url: '/laptop_docs/' + Id,
		type: 'DELETE',
		success: function(result){
			console.log("delete");
			console.log(Id);
			window.location.reload(true);
		}
	})
};

//delete perpherial by id
 function deletePeripheral(Id){
	$.ajax({
		url: '/peripherals/' + Id,
		type: 'DELETE',
		success: function(result){
			console.log("delete");
			console.log(Id);
			window.location.reload(true);
		}
	})
};

//delete laptop/doc relationship by id
 function deleteLtDocRelation(Id){
	$.ajax({
		url: '/laptop_laptopdocs/' + Id,
		type: 'DELETE',
		success: function(result){
			console.log("delete");
			console.log(Id);
			window.location.reload(true);
		}
	})
};





			