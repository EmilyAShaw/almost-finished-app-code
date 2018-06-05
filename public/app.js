//newevent

var UserID = "blank";
var geocoder;
var map;
var latitude;
var longitude;
var EventsArray = [];
var canWeJust;
var GoogleID = "blank";




document.addEventListener("DOMContentLoaded" , event => {

	const app = firebase.app();
	// console.log(app)
	const database = firebase.firestore();
  	const settings = {/* your settings... */ timestampsInSnapshots: true};
  	database.settings(settings);
	

	const myUser = database.collection('Users').doc('ONE');

	myUser.onSnapshot(doc =>{

				const data = doc.data();
				document.querySelector( "#Name").innerHTML = data.Name
				
			})

});



function updatePost (event){

	const database = firebase.firestore();
	const myUser = database.collection('Users').doc('ONE');
	myUser.update({ Name: event.target.value })


}

function googleLogin() {

	const provider = new firebase.auth.GoogleAuthProvider();
	

	firebase.auth().signInWithPopup(provider)

		.then(result =>{
			const user = result.user;
			//document.write ("Hello ");
			// Add a new document in collection "users"
			UserID = (user.displayName + "-" +user.email  )
			var Name = user.displayName;
			var Email = user.email;
			HideStuffOnLogin();
			const database = firebase.firestore();
			database.collection("Users").doc(String(UserID)).get().then(function(doc) {
				if (doc.exists) {
			        console.log("Document data:", doc.data());
			    } else {
			        // doc.data() will be undefined in this case
			        console.log("No such document!");
			        database.collection("Users").doc(String(UserID)).set({
					    name: String(Name),
					    email: String(Email),
					})
					.then(function() {

					    console.log("User Document successfully written!");
					})
					.catch(function(error) {
					    console.error("Error writing User document: ", error);
					});
			    }
			    }).catch(function(error) {
				    console.log("Error getting document:", error);
				});
			var ThisUser = database.collection('Users').doc(String(UserID));
			ThisUser.onSnapshot(doc =>{
				const data = doc.data();
				document.querySelector( "#Google").innerHTML = ("Welcome, " + data.name);
			})
		})
			//.catch(console.log)
}

function addUserDocument(Create) {
	// Add a new document in collection "Users"
	var Name = document.getElementById('UserName').value;
	var Email = document.getElementById('UserEmail').value;
	Password = document.getElementById('Password').value;
	UserID = Name + "-" + Email;
	if(Create) {
		firebase.auth().createUserWithEmailAndPassword(Email, Password)

		.then(result =>{
			
			const database = firebase.firestore();
			database.collection("Users").doc(String(UserID)).get().then(function(doc) {
				if (doc.exists) {
			        console.log("Document exists");
			    } else {
			        // doc.data() will be undefined in this case
			        console.log("No such document!");
			        database.collection("Users").doc(String(UserID)).set({
					    name: String(Name),
					    email: String(Email),
					})
					.then(function() {

					    console.log("User Document successfully written!");
					})
					.catch(function(error) {
					    console.error("Error writing User document: ", error);
					});
			    }
			    }).catch(function(error) {
				    console.log("Error getting document:", error);
				});

			HideStuffOnLogin();
			var ThisUser = database.collection('Users').doc(String(UserID));
			ThisUser.onSnapshot(doc =>{
				const data = doc.data();
				document.querySelector( "#Google").innerHTML = ("Hello " + data.name);
			})
		})

		.catch(function(error) {
		  	// Handle Errors here.
		  	var errorCode = error.code;
		  	var errorMessage = error.message;
		  	console.log("signup Errors =" +errorMessage + " " + errorCode)
		  	// ...
		});
	} else {
		firebase.auth().signInWithEmailAndPassword(Email, Password)
		.then(function(doc) {
			HideStuffOnLogin();
		})
		.catch(function(error) {
	  	// Handle Errors here.
	  	var errorCode = error.code;
	  	var errorMessage = error.message;
	  	console.log("signin Errors =" + errorMessage + " " + errorCode)
	  	// ...
		});
	}
	
	
}

function addEventDocument() {
	// Add a new document in collection "Events"
	var ID = document.getElementById('EventID').value
	var Name = document.getElementById('EventName').value
	var Location = document.getElementById('EventLocation').value
	var Time = document.getElementById('eventTime').value
	var Description = document.getElementById('eventDescription').value
	const database = firebase.firestore();
	database.collection("Events").doc(String(ID)).set({
	    name: String(Name),
	    Location: String(Location),
	    Time: String(Time),
	    Description: String(Description),

	})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing Events document: ", error);
});
}

function addFriendDocument() {
	// Add a new document in collection "Friends"
	var Name = document.getElementById('FriendName').value;
	var Email = document.getElementById('FriendEmail').value;
	Name = String(Name);
	Email = String(Email);
	var NameEmail = "Friendslist." + Name + "-" + Email;
	Friendslist = {

	}
	const database = firebase.firestore();
	database.collection("Friends").doc(String(UserID)).update({	     
	    	[NameEmail] : true,
	})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing Friends document: ", error);
	});
}

function hide(myDIV) {
	myDIV = String(myDIV);
	//console.log(myDIV);
    var x = document.getElementById(myDIV);
    if (x.style.display === "none") {
        x.style.display = "block";
    } 

    else if (x.style.display ==="block" ){
    	console.log("fella");

}
    	else {
        x.style.display = "none";
    }
}

function HideStuffOnLogin(){
	hide("EventForm");
	hide("UserForm");
	hide("Name");
	hide("FriendForm");
	hide("update");
	hide("Controls");
	hide("addEventLocation");
	hide("GoogleButton");
	hide("hideLogo");

	EventDropDown();
	myMap();
}

function myMap() {
	geocoder = new google.maps.Geocoder();
    var Location = new google.maps.LatLng(-41.291002,  174.768925)
    var mapOptions = {
        center: Location,
        zoom: 15,
        //mapTypeId: google.maps.MapTypeId.TERRAIN

        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
        
    }
	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	const database = firebase.firestore();
	console.log("Started");
	database.collection("Events")//.where("Location", "==", true)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //debug console.log(doc.id, " => ", doc.data());
            var image = "marker.png"
            var myLatLng = {lat: doc.data().Location._lat, lng: doc.data().Location._long};
            var marker = new google.maps.Marker({
			    map: map,

			    draggable: false,
			    position: myLatLng,
			    label: doc.data().name,
			    title: doc.data().name,
			    icon: image


			});
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function codeAddress() {
	var address = document.getElementById("address").value;
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);

			var marker = new google.maps.Marker({
			    map: map,
			    draggable: true,
			    position: results[0].geometry.location

			});
		   	google.maps.event.addListener(marker, 'dragend', function(evt){
			   	document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' 
			  	 + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
			   
			   	latitude = evt.latLng.lat().toFixed(6);
			   	longitude = evt.latLng.lng().toFixed(6);
			   	console.log(latitude + " " + longitude)
			   	var input = latitude + ", " + longitude;
				var latlngStr = input.split(',', 2);
			    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
			    geocoder.geocode({'location': latlng}, function(results, status) {
			          	if (status === 'OK') {
				          	if (results[0]) {
				    			document.getElementById('info').innerHTML = '<p>Address:  ' + results[0].formatted_address + '</p>';
				    		} else {
				              window.alert('No results found');
				            }
						} else {
			            window.alert('Geocoder failed due to: ' + status);
			          }
			    });      

		   	});

		   	google.maps.event.addListener(marker, 'dragstart', function(evt){
		   		document.getElementById('current').innerHTML = '<p>Currently dragging marker...</p>';
		   	});

		   	// google.maps.event.addListener(marker, 'dragend', function(evt){
		   	// document.getElementById('info').innerHTML = '<p>Address:  ' + results[0].formatted_address + '</p>';
		   	// });

		   	google.maps.event.addListener(marker, 'dragstart', function(evt){
		   	document.getElementById('info').innerHTML = '<p>Currently dragging marker...</p>';
		   	});



		 	map.setCenter(marker.position);
		 	marker.setMap(map);

	  	} else {
	    	alert("Geocode was not successful for the following reason: " + status);
	    }
 	});
}

function addEventMapDocument() {
	// Add a new document in collection "Events"
	var Name = document.getElementById('EventNameMap').value
	var Description = document.getElementById('EventNameMap').value
	var Time = document.getElementById('eventTime').value
	var Description = document.getElementById('eventDescription').value
	var loc = new firebase.firestore.GeoPoint(Number(latitude),Number(longitude));
	console.log(loc);
	const database = firebase.firestore();
	database.collection("Events").add({
	    name: String(Name),
	    Description: String(Description),
	    Time: String(Time),
	    Location: loc,
	})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing Events document: ", error);
	});
}

function EventDropDown() {
	var select = document.getElementById("SelectEvents"); 
	
	console.log(EventsArray); 
	var Counter = 0;
	const database = firebase.firestore();
	console.log("EventDDStarted");
	database.collection("Events")//.where("Location", "==", true)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data().name);
            EventsArray[Counter] = doc.data().name;
            //console.log(EventsArray[Counter]);
            //console.log(EventsArray.length);            
            Counter ++;
		});
    })
    .then(function(){
    	for (var i = EventsArray.length - 1; i >= 0; i--) {
    	//console.log(EventsArray[i]);
	    }
	    console.log("EventDDMidpoint");

		for(var i = 0; i < EventsArray.length; i++) {
		    var Evt = EventsArray[i];
		    var listItem = document.createElement("option");
		    listItem.textContent = Evt;
		    listItem.value = Evt;
		    select.appendChild(listItem);
		}
		console.log("EventDDEndpoint");
    })	
    
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    
}

function addEventToUser(){

	var NameOfEvent = document.getElementById('SelectEvents').value;
	var RSVPEvent = "RSVPs." + NameOfEvent;
	const database = firebase.firestore();
	database.collection("Users").doc(String(UserID)).update({	     
	    	[RSVPEvent] : true,
	})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing Friends document: ", error);
	});
}

//firebase.auth().onAuthStateChanged(function(user) {
  //if (user) {
    // User is signed in.
  //  window.location = 'createEvent.html';
  //} 
//});
