// 
// init 
//
var localIP; 
//var gatewayIP = '172.16.95.1';
//var gatewayIP = '10.0.247.1';
gatewayIP = '103.115.212.2';
let phone;
let session;
let watchStatus;
let duration = new Timer();

let localDevice = $("#localVoice");
let localDetail = localDevice[0];

let localDevice1 = $("#localVoice1");
let localDetail1 = localDevice1[0];



let remoteDevice = $("#remoteVoice");
let remoteDetail = remoteDevice[0];

let soundDevice = $("#songs");
let soundDetail = soundDevice[0];

let callOptions = {
	pcConfig: {
		rtcpMuxPolicy		: 'negotiate',
		hackStripTcp: true,
		iceServers: []
	},
	mediaConstraints: {
		audio: true, 
		video: false
	},
	rtcOfferConstraints: {
		offerToReceiveAudio: true,
		offerToReceiveVideo: false
	}
}

let DTMFOptions = {
	duration: 100,
	interToneGap: 500,
	transportType: "RFC2833"
}

// 
// update timer
// 
duration.addEventListener("secondsUpdated", function() {
    $("#duration").html(duration.getTimeValues().toString());
});

// 
// init
// 
$(document).ready(function() {

	

	window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;//compatibility for Firefox and chrome
var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};      
pc.createDataChannel('');//create a bogus data channel
pc.createOffer(pc.setLocalDescription.bind(pc), noop);// create offer and set local description
pc.onicecandidate = function(ice)
{
 if (ice && ice.candidate && ice.candidate.candidate)
 {
  localIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
	//localIP = "106.196.62.231";
  console.log('my IP: ', localIP);
 }
};
	

	$('#host').on('change',function(){
		console.log('onchange.....');
		if ($('#host').val()=='10.18.0.132') {
			$('#port').val('8089');
			$('#sip-port').val('5060');
			$('#number').val('777');
		}
		else if($('#host').val()=='10.18.0.63') {
                        $('#port').val('8087');
                        $('#sip-port').val('5060');
                        $('#number').val('777');
                }
		else {
			$('#port').val('8089');
			$('#sip-port').val('5060');
			$('#number').val('777');		}
	})



	setInterval(function function_name(argument) {
		// body...
	},1000);

	$('#exampleModal').modal('show');

	$('#exampleModal').on('hidden.bs.modal', function () {
		console.log('Modal Close....');
		if ( !($("#host").val() == "" || $("#port").val() == "" || $("#user").val() == "" || $("#secret").val() == "") ) $("#status").click();
	});
});

// 
// streaming
// 
function streamReroute() {
	session.connection.addEventListener("addstream", function(e) {
		console.log('Adding stream for remote from device.....');
		let localStream = session.connection.getLocalStreams();
		console.log('localStream.length : '+localStream.length);
		if (localStream.length) localDetail.srcObject = localStream[0];

		if (e.stream) remoteDetail.srcObject = (e.stream);

		//if (e.stream) localDetail1.srcObject =localStream[0];

		
	});
}

// 
// update status
//
function statusOff() {
	$("#status").html("Unregistered");
	$("#status").removeClass("btn-outline-success").addClass("btn-outline-danger");
}

function statusOn() {
	$("#status").html("Registered");
	$("#status").removeClass("btn-outline-danger").addClass("btn-outline-success");
}

function statusChecker() {
	watchStatus = setInterval(function() {
		if(phone == null || !phone.isRegistered()){
			statusOff();
		} else {
			statusOn();
		}
	}, 5000);
}

// 
// system audio
// 
function playSong(src="", loop=false) {
	soundDevice.prop("loop", loop);
	soundDevice.attr("src", src);
	setTimeout(function() {
		soundDevice.trigger("play");
	}, 100);
}

function stopSong(){
	soundDevice.trigger("pause");
}


$('#songs').on('pause',function(e){
	console.log('Song stopped......');
})
$('#songs').on('play',function(e){
	console.log('9999999999999999999999999999999999999999999999999999999999999999999999999999 Song played......');
})
$('#songs').on('playing',function(e){
	console.log('Song playing......');
})

$('#localVoice').on('pause',function(e){
	console.log('localVoice stopped......');
})
$('#localVoice').on('play',function(e){
	console.log('localVoice played......');
})
$('#localVoice').on('playing',function(e){
	console.log('localVoice playing......');
})

$('#remoteVoice').on('pause',function(e){
	console.log('remoteVoice stopped......');
})
$('#remoteVoice').on('play',function(e){
	console.log('9999999999999999999999999999999999999999999999999999999999999999999999999999 remoteVoice played......');
})
$('#remoteVoice').on('playing',function(e){
	console.log('remoteVoice playing......');
})
//
// form
//

// register


$("#status").click(function() {

	console.log($(this).html());
	if( $(this).html() === "Unregistered" || $(this).html() === "Trying..." ) {
		let host = $("#host").val();
		let port = $("#port").val();
		let user = $("#user").val();
		let secret = $("#secret").val();
		let sipPort = $("#sip-port").val();
		console.log('sipPort = '+sipPort);
		let peer;
		var selfHost = host;
		var ws_protocol = $('#ws-protocol').val();
		if($('#from-ip').val()!='Default') {
			selfHost = localIP;
		}
		
		if(sipPort!='') {
			 peer = "sip:" + user + "@" + selfHost + ":" + sipPort;
			console.log('1 peer = '+peer);
		}else {
			 peer = "sip:" + user + "@" + selfHost;
			console.log('2 peer = '+peer);
		}

		//let peer = "sip:9560700235@sip.antisip.com";

		//let socket = new JsSIP.WebSocketInterface("wss://" + host + ":" + port);
	//	let socket = new JsSIP.WebSocketInterface(ws_protocol+"://" + host + ":" + port + "/ws");
		let socket = new JsSIP.WebSocketInterface(ws_protocol+"://webrtc-network.one97.delhi.net:" + port + "/ws");	// Using Domain
		//let socket = new JsSIP.WebSocketInterface("wss://sip.antisip.com:4443");
		//socket.via_transport = "udp";

		let regOptions = {
			"sockets"			: [ socket ],
			"uri"      			: peer,
			"contact_uri"			: peer,
			"password"			: secret
			//"register_expires"	: 180
		};

		JsSIP.debug.enable("JsSIP:*");
		phone = new JsSIP.UA(regOptions);

		phone.on("registered", () => {
			statusOn();
			statusChecker();
		});

		phone.on("registrationFailed", (e) => {
			//swal("Error", e.cause, "error");
			console.log('registrationFailed....');
			statusOn();
		});

		phone.on("unregistered", () => {
			clearInterval(watchStatus);
			statusOff();
		});
		
		phone.on("newRTCSession", (e) => {
			let newSession = e.session;
			if (session) session.terminate();
			session = newSession;

			session.on('peerconnection', function() {
				if (session.direction === 'incoming') streamReroute();
					console.log('##########################################################################################################################');
					console.log('										peerconnection CREATED											');
					console.log('##########################################################################################################################');
			});

/*
			session.on('peerconnection', function(data) {
					console.log('##########################################################################################################################');
					console.log('										peerconnection CREATED											');
					console.log('##########################################################################################################################');
			});*/


			session.on("progress", () => {
				clearInterval(watchStatus);
				//playSong("sounds/ringing.mp3", true);
				$("#status").html("Ringing...");
			});

			session.on("confirmed", () => {
				console.log('Session Confirmed, going to stopSong...');
				stopSong();
				clearInterval(watchStatus);
				$("#status").html("In call");
				duration.start();
			});

			session.on("sdp", (evt) => {
				console.log('*************************************************************************************');
   				console.log('#################### originator : '+evt.originator+' ####################');
   				console.log('#################### type : '+evt.type+' ####################');
				console.log('********************************* BEFORE MODIFYING SDP **********************************');
   				console.log(evt.sdp);
   				var myOffer = evt.sdp;

   				let tmpArray=[];

   				console.log('##################### defaultChk : '+$('#defaultChk').is(":checked"));
   				var isDefaultSDP = $('#defaultChk').is(":checked");
   			if(!isDefaultSDP) {
   				let lines = myOffer.split('\n')
      						.map(l => l.trim()); // split and remove trailing CR
							  lines.forEach(function(line) {
							    if (line.indexOf('c=IN') === 0) {     
							      //let parts = line.substr(14).split(' ');
							      let parts = line.split(' ');
							      console.log('0', parts[0]);
							      console.log('1', parts[1]);
							      console.log('2', parts[2]);

							     // parts[2] = "192.168.1.6";
							     //172.16.95.1
							     //10.212.143.68
							     var tmpStr = parts[0]+' '+parts[1] + ' ';
							    	if($('#connection-ip').val()=='Local') {
							    		 tmpStr = tmpStr + localIP;
							    		 tmpArray.push(tmpStr);
							    	}	      		
							      	else if($('#connection-ip').val()=='Gateway')  {
							      		tmpStr = tmpStr + gatewayIP;
							    		 tmpArray.push(tmpStr);
							      	}
							      	else {
							      		tmpArray.push(line);
							      	}

							     // var tmpStr = parts[0]+' '+parts[1]+' '+"172.16.95.1";
							     
							    }
							    else if(line.indexOf('m=audio') === 0) {							    	
							    	let parts = line.split(' ');/*
	  						        console.log('0', parts[0]);
							        console.log('1', parts[1]);
							        console.log('2', parts[2]);*/
							        console.log('parts.length', parts.length);
							        //var sdpPort = Math.floor(Math.random() * (65534 - 7078 + 1) + 7078);
							        var sdpPort = Math.floor(Math.random() * (6020 - 6000 + 1) + 6000);

							        var tmpStr = parts[0] + " " + sdpPort;
						        	for (var i=2; i<parts.length; i++) {
						        		tmpStr = tmpStr + " "+ parts[i];
						        	}
							        
							        console.log('tmpStr : '+tmpStr);
							        if($('#profile').val()!='Default') {
							        	tmpStr = tmpStr.replace('SAVPF',$('#profile').val());
							        }							    	
							        tmpArray.push(tmpStr);
							    }
							    else if($('#ignore-rtcp').val()=='Yes' && !line.includes("rtcp-mux") && line.includes("rtcp")) {	
							    	console.log('Ignoring this '+line);
							    }
							    else if(line.includes("a=setup")) {	
							    	if($('#setup').val()=='default') {
							    		console.log('Send Default : '+line);
							    		tmpArray.push(line);
							    	}else if($('#setup').val()!='no') {
							    		tmpArray.push('a=setup:'+$('#setup').val());
							    	}
							    	else {
							    		console.log('Ignoring this '+line);
							    	}
							    	 
							    	 //console.log('Ignoring this '+line);
							    }
							    else if($('#ignore-ice').val()=='Yes' && line.includes("a=ice")) {	
							    	console.log('Ignoring ice '+line);
							    }
							    else if(line.includes("minptime")) {
							    	console.log('Actual Line : '+line);		
							    	tmpArray.push('a=fmtp:111 minptime=20;useinbandfec=1');
							    	console.log('Pushing minptime=20');
							    }
							    else if(line.includes("o=")) {
							    	if($('#origin-ip').val()=='Local')
							      		 line = line.replace('127.0.0.1',localIP);
							      	else if($('#origin-ip').val()=='Gateway') 
							      	     line = line.replace('127.0.0.1',gatewayIP);	
							      tmpArray.push(line);
							    }
							    else if(line.includes("s=-")) {
							      tmpArray.push(line);
							      tmpArray.push('i=(o=IN IP4 10.212.143.68)');
							    }
							    else if(line.includes("a=candidate")) {						    	
							    	let parts = line.split(' ');
	  						        console.log('0', parts[0]);
							        console.log('ice-can-ip : ', $('#ice-can-ip').val());
							        tmpStr = parts[0];
							    	if($('#ice-can-ip').val()=='Local') {
							      		for (var i=1; i<parts.length; i++) {
							        		if(i==4) {
							        			parts[i] = localIP;
							        		}
							        		tmpStr = tmpStr + " "+ parts[i];
						        		}			
							    	}
							      	else if($('#ice-can-ip').val()=='Gateway')  {
							      		for (var i=1; i<parts.length; i++) {
							        		if(i==4) {
							        			parts[i] = gatewayIP;
							        		}
							        		tmpStr = tmpStr + " "+ parts[i];
						        		}			

							      	}
							      	else {
							      		tmpStr = line;
							      	}
						        				        
							        console.log('tmpStr : '+tmpStr);	
							        tmpArray.push(tmpStr);
							    }
							    else {
							      tmpArray.push(line);
							    }
							  })  


					var finalSDP = "";
							  
					tmpArray.forEach(function(tmp) {
						//console.log("tmp : "+tmp);

						if(finalSDP=="") {
							finalSDP = tmp;
						}else if($('#add-crypto').val() == 'Yes' && tmp=='a=setup:actpass') {
							finalSDP = finalSDP + "\n" + tmp;
							finalSDP = finalSDP + "\n" + 'a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:64tgrt1lUekLKBdYbJUYKgOe8Y4n346q/He3nckf';
						}
						else {
							finalSDP = finalSDP + "\n" + tmp;
						}
					});			  

					//console.log('finalSDP : '+finalSDP);
					evt.sdp = finalSDP;
					console.log('********************************* AFTER MODIFYING SDP **********************************');
					console.log(evt.sdp);
				}
					

			});


	        session.on("ended", (e) => {
	        	session = null;
				$("#status").html(e.cause);
	        	duration.stop();
	        	playSong("sounds/busy.mp3", false);
	        	setTimeout(function() {
	        		statusOn();
	        		statusChecker();
	        		$("#duration").html("00:00:00");
	        	}, 2000);
	        });

	        session.on("failed", (e) => {
	        	session = null;
	        	playSong("sounds/busy.mp3", false);
				$("#status").html(e.cause);
				setTimeout(function() {
					statusOn();
					statusChecker()
				}, 2000);
	        });

			if(session.direction === "incoming"){
			//	session.answer(callOptions);	//Auto Answer
				//For Auto hangup
			/*	setTimeout(function autoHangup(){
                	console.log('Auto Hangup');
                    if (session && (session.isEstablished() || session.isInProgress())) session.terminate();
                     }, 100000);	*/
                //For Auto hangup
                
				swal({
					closeOnEsc: false,
					closeOnClickOutside: false,
					title: "Incoming call",
					text: "from: " + session.remote_identity.display_name,// + session.remote_identity.uri,
					
					icon: "info",
					buttons: {
						cancel: "Reject",
						catch: {
							text: "Accept",
							value: "true"
						},
					},
				})
				.then(function(value) {
					if (value) {
						session.answer(callOptions);
					} else {
						session.terminate();
					}
				}); 
	        }
		});

		phone.start();
		$("#status").html("Trying...");
	} else {
		phone.stop();
		$("#status").html("Trying...");
	}	
});

// handle call
$("#call").click(function() {
	number = $("#number").val();
	console.log('Calling number : '+number);
	if (number != "") {
		session = phone.call(number, callOptions);
		streamReroute();
	}
});

$("#number").keypress(function(e) {
	if(e.which === 13) $("#call").click();
});

// clear number
$("#clear").click(function() {
	$("#number").val("");
});

// Call reset
$("#hangup").click(function() {
	if (session && (session.isEstablished() || session.isInProgress())) session.terminate();
});

// set phone number
$("[name=key]").click(function() { 
	$("#number").val( $("#number").val() + $(this).val() );
	if (session && session.isEstablished()) {
		session.sendDTMF( $(this).val().toString(), DTMFOptions );
		playSong("sounds/tone.mp3", false);
	}
});

// set volume
$("#volume").on("change", function() {
	let level = $(this).val();
	let icon = (level == 0) ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>' ;
	remoteDetail.volume = level;
	soundDetail.volume = level;
	$("#icon").html(icon);
});

// mute
$("#mute").click(function(){
	if (session && session.isEstablished) {
		if ( $(this).html() === "Mute" && !session.isMuted().audio){
			$(this).html("UnMute");
			session.mute();
		} else {
			$(this).html("Mute");
			session.unmute();
		}
	}
});

// transfer
$("#transfer").click(function(){
	if (session && session.isEstablished) {
		swal("Перевод на номер:", {
			content: "input",
		})
		.then(function(e) {
			session.refer(e);
			session.terminate();
			// session.sendDTMF( "##"+e.toString()+"#", DTMFOptions );
		});
	}
});

// hold
$("#hold").click(function(){
	if (session && session.isEstablished) {
		if ( $(this).html() === "Hold" && !session.isOnHold().local){
			$(this).html("UnHold");
			session.hold();
		} else {
			$(this).html("Hold");
			session.unhold();
		}
	}
});





