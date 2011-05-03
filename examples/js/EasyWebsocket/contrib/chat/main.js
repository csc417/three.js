var ChatAnywhere	 = function()
{
	var channelName	 = jQuery.url.param("channel")	|| "0";
	// auto-generate username if one isn't given.
	var username	 = jQuery.url.param("user")	|| "user-"+Math.floor(Math.random()*9999);
	var yesVotes1	 = jQuery.url.param("yesVotes1")	|| 0;
	var yesVotes2	 = jQuery.url.param("yesVotes2")	|| 0;
	var yesVotes3	 = jQuery.url.param("yesVotes3")	|| 0;
	var yesVotes4	 = jQuery.url.param("yesVotes4")	|| 0;
	var yesVotes5	 = jQuery.url.param("yesVotes5")	|| 0;
	var noVotes1	 = jQuery.url.param("noVotes1")	|| 0;
	var noVotes2	 = jQuery.url.param("noVotes2")	|| 0;
	var noVotes3	 = jQuery.url.param("noVotes3")	|| 0;
	var noVotes4	 = jQuery.url.param("noVotes4")	|| 0;
	var noVotes5	 = jQuery.url.param("noVotes5")	|| 0;
	var proposedVid1 = document.getElementById("proposedVid1").value || "";
	var proposedVid2 = document.getElementById("proposedVid2").value || "";
	var proposedVid3 = document.getElementById("proposedVid3").value || "";
	var proposedVid4 = document.getElementById("proposedVid4").value || "";
	var proposedVid5 = document.getElementById("proposedVid5").value || "";
	
	// TODO put that in jQuery ? what is this ? obsolete ?
	var statusEl	= document.getElementById("chat-status");
	var textAreaEl	= document.getElementById("chat-textarea");
	var usernameEl	= document.getElementById("chat-username");
	var formEl		= document.getElementById("chat-form");
	var inputEl		= document.getElementById("chat-input");
	var submitEl	= document.getElementById("chat-submit");
	
	// Modification by Aaron Craft 04/19/2011	
	var setVideoURL = function(url){
		setvideo(url);
	}
	// End Modification by Aaron Craft 04/19/2011
	
	// setUsername
	var setUsername	= function(username){
		jQuery("#container .header .username").empty().text(username)
	}
	
	// setYesVotes
	var setYesVote = function(num, doIncrement, voteBoxNum){
		if (doIncrement == true){ num = num + 1; }
		
		if (voteBoxNum == "2")
		{
			yesVotes2 = num;
			if (num > 1 && num > noVotes2)
				sendVideoURL(proposedVid2);
		} else if (voteBoxNum == "3")
		{
			yesVotes3 = num;
			if (num > 1 && num > noVotes3)
				sendVideoURL(proposedVid3);
		} else if (voteBoxNum == "4")
		{
			yesVotes4 = num;
			if (num > 1 && num > noVotes4)
				sendVideoURL(proposedVid4);
		} else if (voteBoxNum == "5")
		{
			yesVotes5 = num;
			if (num > 1 && num > noVotes5)
				sendVideoURL(proposedVid5);
		} else
		{
			yesVotes1 = num;
			if (num > 1 && num > noVotes1)
				sendVideoURL(proposedVid1);
		}
		
		jQuery("#voteContainer" + voteBoxNum + " .voteHeader" + voteBoxNum + " .yesVotes" + voteBoxNum).empty().text(num);
	}
	
	// setNoVotes
	var setNoVote = function(num, doIncrement, voteBoxNum){
		if (doIncrement == true){ num = num + 1; }
		
		if (voteBoxNum == "2") {
			noVotes2 = num;
			if (num > 1 && num > yesVotes2)
				stopVideo();
		} else if (voteBoxNum == "3") {
			noVotes3 = num;
			if (num > 1 && num > yesVotes3)
				stopVideo();
		} else if (voteBoxNum == "4") {
			noVotes4 = num;
			if (num > 1 && num > yesVotes4)
				stopVideo();
		} else if (voteBoxNum == "5") {
			noVotes5 = num;
			if (num > 1 && num > yesVotes5)
				stopVideo();
		} else {
			noVotes1 = num;
			if (num > 1 && num > yesVotes1)
				stopVideo();
		}
		
		jQuery("#voteContainer" + voteBoxNum + " .voteHeader" + voteBoxNum + " .noVotes" + voteBoxNum).empty().text(num);
	}
	
	// setProposedVid
	var setProposedVid = function(videoURL, voteBoxNum){
		if (voteBoxNum == "2")
			proposedVid2 = videoURL;
		else if (voteBoxNum == "3")
			proposedVid3 = videoURL;
		else if (voteBoxNum == "4")
			proposedVid4 = videoURL;
		else if (voteBoxNum == "5")
			proposedVid5 = videoURL;
		else
			proposedVid1 = videoURL;
		
		jQuery("#voteContainer" + voteBoxNum + " .voteHeader" + voteBoxNum + " .proposedVideo" + voteBoxNum).empty().text(videoURL);
	}
	
	setUsername(username);
	jQuery("#container .header .channel.value").text(channelName)
	
	// setStatus
	var setStatus	= function(status){
		jQuery("#container .header .status").text(status)
	}
	
	// updateChatArea
	var updateChatArea	= function(tmplClass, tmplData){
		$( "#container ."+ tmplClass).tmpl(tmplData)
			.appendTo("#container .chatArea");
		// scroll to the bottom
		var chatAreaEl	= jQuery("#container .chatArea").get(0);
		chatAreaEl.scrollTop = jQuery("#container .chatArea").height();
	}
	
	// setMessage
	var setMessage	= function(tmplData){
		updateChatArea("tmplChatMessage", tmplData)
	}
	
	// setJoin
	var setJoin	= function(tmplData){
		updateChatArea("tmplChatJoin", tmplData)
	}
	
	// setRename
	var setRename	= function(tmplData){
		updateChatArea("tmplChatRename", tmplData)
	}
	
	// editButton_click
	jQuery("#container .header .editButton").click(function(){
		var selector	= "#container .header .username";
		var oldUsername	= jQuery("#container .header .username").text();
		jQuery(selector).empty();
		jQuery("<input type='text'/>").attr("value", oldUsername).appendTo(selector);
		jQuery(selector+ " input").focus();
		jQuery(selector+ " input").blur(function(){
			var newUsername	= jQuery(selector+ " input").val();
			jQuery("#container .footer .input").focus();
			if( !newUsername )	return;
			setUsername(newUsername);
			sendRename(oldUsername, newUsername)
		})
	})
	
	// voteButton1_click
	jQuery("#voteContainer1 .voteFooter1 .voteButton1").click(function()
	{
		buttonClick("1");
	})
	
	// voteButton2_click
	jQuery("#voteContainer2 .voteFooter2 .voteButton2").click(function()
	{
		buttonClick("2");
	})
	
	// voteButton3_click
	jQuery("#voteContainer3 .voteFooter3 .voteButton3").click(function()
	{
		buttonClick("3");
	})
	
	// voteButton4_click
	jQuery("#voteContainer4 .voteFooter4 .voteButton4").click(function()
	{
		buttonClick("4");
	})
	
	// voteButton5_click
	jQuery("#voteContainer5 .voteFooter5 .voteButton5").click(function()
	{
		buttonClick("5");
	})
	
	// buttonClick
	var buttonClick = function(voteBoxNum) {
		if (document.getElementById("proposedVid" + voteBoxNum).value != "" && document.getElementById("proposedVid" + voteBoxNum).value.indexOf("/propose") <= 0)
		{
			if (voteBoxNum == "2") {
				proposedVid2 = document.getElementById("proposedVid" + voteBoxNum).value;
				proposedVid2 = proposedVid2.toString().replace("\\propose ", "");
				socketSend(
					{type	: "propose",
					 data	: {message: proposedVid2,
							   voteBoxNumber: voteBoxNum
							  }
					});
			}
			else if (voteBoxNum == "3") {
				proposedVid3 = document.getElementById("proposedVid" + voteBoxNum).value;
				proposedVid3 = proposedVid3.toString().replace("\\propose ", "");
				socketSend(
					{type	: "propose",
					 data	: {message: proposedVid3,
							   voteBoxNumber: voteBoxNum
							  }
					});
			}
			else if (voteBoxNum == "4") {
				proposedVid4 = document.getElementById("proposedVid" + voteBoxNum).value;
				proposedVid4 = proposedVid4.toString().replace("\\propose ", "");
				socketSend(
					{type	: "propose",
					 data	: {message: proposedVid4,
							   voteBoxNumber: voteBoxNum
							  }
					});
			}
			else if (voteBoxNum == "5") {
				proposedVid5 = document.getElementById("proposedVid" + voteBoxNum).value;
				proposedVid5 = proposedVid5.toString().replace("\\propose ", "");
				socketSend(
					{type	: "propose",
					 data	: {message: proposedVid5,
							   voteBoxNumber: voteBoxNum
							  }
					});
			}
			else {
				proposedVid1 = document.getElementById("proposedVid" + voteBoxNum).value;
				proposedVid1 = proposedVid1.toString().replace("\\propose ", "");
				socketSend(
					{type	: "propose",
					 data	: {message: proposedVid1,
							   voteBoxNumber: voteBoxNum
							  }
					});
			}
			
			document.getElementById("yesValue" + voteBoxNum).checked = true;
			document.getElementById("proposedVid" + voteBoxNum).value = "";
		}
		
		if (document.getElementById("yesValue" + voteBoxNum).checked == true)
		{
			if (voteBoxNum == "2") {
				setYesVote(parseInt(yesVotes2), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "y"+yesVotes2,
							   voteBoxNumber: voteBoxNum}
					});
			}
			else if (voteBoxNum == "3") {
				setYesVote(parseInt(yesVotes3), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "y"+yesVotes3,
							   voteBoxNumber: voteBoxNum}
					});
			}
			else if (voteBoxNum == "4") {
				setYesVote(parseInt(yesVotes4), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "y"+yesVotes4,
							   voteBoxNumber: voteBoxNum}
					});
			}
			else if (voteBoxNum == "5") {
				setYesVote(parseInt(yesVotes5), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "y"+yesVotes5,
							   voteBoxNumber: voteBoxNum}
					});
			}
			else {
				setYesVote(parseInt(yesVotes1), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "y"+yesVotes1,
							   voteBoxNumber: voteBoxNum}
					});
			}
			document.getElementById("yesValue" + voteBoxNum).checked=false;
		}
		else if (document.getElementById("noValue" + voteBoxNum).checked == true)
		{
			if (voteBoxNum == "2") {
				setNoVote(parseInt(noVotes2), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "n"+noVotes2,
							   voteBoxNumber: voteBoxNum}
					});
			}
			else if (voteBoxNum == "3") {
				setNoVote(parseInt(noVotes3), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "n"+noVotes3,
							   voteBoxNumber: voteBoxNum}
					});
			}
			else if (voteBoxNum == "4") {
				setNoVote(parseInt(noVotes4), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "n"+noVotes4,
							   voteBoxNumber: voteBoxNum}
					});
			}
			else if (voteBoxNum == "5") {
				setNoVote(parseInt(noVotes5), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "n"+noVotes5,
							   voteBoxNumber: voteBoxNum}
					});
			}
			else {
				setNoVote(parseInt(noVotes1), true, voteBoxNum);
				socketSend(
					{type	: "vote",
					 data	: {message: "n"+noVotes1,
							   voteBoxNumber: voteBoxNum}
					});
			}
			document.getElementById("noValue" + voteBoxNum).checked=false;
		}
	}
	
	var socketUrl	= "ws://bigcat.cs.usm.edu/~strelz/three_331/examples/webgl_materials_video.html";
	var socket	= new EasyWebSocket(socketUrl);
	
	// onOpen of socket
	socket.onopen	= function(){
		setStatus("Connected");
		sendJoin(username);	
		sendConnected();	
	}
	
	// onMessage of socket
	socket.onmessage= function(event){
		var event	= JSON.parse(event.data);
		var target = event.data.message;
		
		if( event.type == "message" ){
			setMessage(event.data);			
		}else if( event.type == "join" ){
			setJoin(event.data);
		}else if( event.type == "left" ){
		}else if( event.type == "rename" ){
			setRename(event.data);
		}else if( event.type == "change" ){
			setvideo(event.data.message);
		}else if( event.type == "connected"){			
			if (event.data.username != username){
				sendVideoURL();
				UpdateVoterBoxes(username, yesVotes1, yesVotes2, yesVotes3, yesVotes4, yesVotes5,
								 noVotes1, noVotes2, noVotes3, noVotes4, noVotes5,
								 proposedVid1, proposedVid2, proposedVid3, proposedVid4, proposedVid5);
			}
		}else if( event.type == "vote" ){
			voteBoxNum = event.data.voteBoxNumber;
			if (event.data.voteBoxNumber = "")
				voteBoxNum = "1";

			if (target.indexOf("n") == 0)
			{
				target = target.replace("n", "");
				setNoVote(parseInt(target), false, voteBoxNum);
			}
			else if (target.indexOf("y") == 0)
			{
				target = target.replace("y", "");
				setYesVote(parseInt(target), false, voteBoxNum);
			}
		}else if( event.type == "propose" ){
			target = target.toString().replace("\\propose ", "");
			voteBoxNum = event.data.voteBoxNumber;
			if (event.data.voteBoxNumber = "")
				voteBoxNum = "1";
			
			setProposedVid(target, voteBoxNum);
		}else if( event.type == "videoURL"){
			if (event.data.username != username){
				setVideoURL(event.data.videoURL);
			}		
		}else{
			//console.log("unhandled event in socket message")
		}
	}
	
	var UpdateVoterBoxes = function(user, y1, y2, y3, y4, y5, n1, n2, n3, n4, n5, p1, p2, p3, p4, p5) {
			// Yes Votes
			socketSend(
				{type	: "vote",
				 data	: {message: "y"+y1,
						   voteBoxNumber: "1"}
				});
			socketSend(
				{type	: "vote",
				 data	: {message: "y"+y2,
						   voteBoxNumber: "2"}
				});
			socketSend(
				{type	: "vote",
				 data	: {message: "y"+y3,
						   voteBoxNumber: "3"}
				});
			socketSend(
				{type	: "vote",
				 data	: {message: "y"+y4,
						   voteBoxNumber: "4"}
				});
			socketSend(
				{type	: "vote",
				 data	: {message: "y"+y5,
						   voteBoxNumber: "5"}
				});
			// No Votes
			socketSend(
				{type	: "vote",
				 data	: {message: "n"+n1,
						   voteBoxNumber: "1"}
				});
			socketSend(
				{type	: "vote",
				 data	: {message: "n"+n2,
						   voteBoxNumber: "2"}
				});
			socketSend(
				{type	: "vote",
				 data	: {message: "n"+n3,
						   voteBoxNumber: "3"}
				});
			socketSend(
				{type	: "vote",
				 data	: {message: "n"+n4,
						   voteBoxNumber: "4"}
				});
			socketSend(
				{type	: "vote",
				 data	: {message: "n"+n5,
						   voteBoxNumber: "5"}
				});
			// Proposed Videos
			socketSend(
				{type	: "propose",
				 data	: {message: p1,
						   voteBoxNumber: "1"}
				});
			socketSend(
				{type	: "propose",
				 data	: {message: p2,
						   voteBoxNumber: "2"}
				});
			socketSend(
				{type	: "propose",
				 data	: {message: p3,
						   voteBoxNumber: "3"}
				});
			socketSend(
				{type	: "propose",
				 data	: {message: p4,
						   voteBoxNumber: "4"}
				});
			socketSend(
				{type	: "propose",
				 data	: {message: p5,
						   voteBoxNumber: "5"}
				});
	}
	
	// onClose of socket
	socket.onclose	= function(){
		setStatus("Closed");
	}
	
	// Submit for Chat send
	jQuery("#container .footer form").submit(function(){
		var username	= jQuery("#container .header .username").text()
		var message	= inputEl.value;
		if( !message )	return false;
		sendMessage(username, inputEl.value);
		inputEl.value	= "";
		return false;
	})
	
	// socketSend
	var socketSend	= function(data){
		//console.log("socketSend", data)
		socket.send(JSON.stringify(data));
	}
	
	// sendMessage
	var sendMessage	= function(username, message){
		if(message.charAt(0) == "/") {  //this is a command
		    if(message.indexOf("/change") == 0 )
			{ 
				message = message.slice(8);
				socketSend(
					{type	: "change",
					 data	: {message: message}
					});
		    }
		} else {  //this is just a chat message
		    socketSend({
			type	: "message",
			data	: {
				username: username,
				message	: inputEl.value						
			}
		    });
		}
	}
	
	// Modification by Aaron Craft 04/19/2011	
	var sendConnected = function(){
		socketSend({
			type	: "connected",
			data	: {
				username: username,
				connected: true,
			}
		});
	}
	var sendVideoURL = function(){
		socketSend({
			type	: "videoURL",
			data	: {
				username: username,
				videoURL: document.getElementById("video").src,
			}
		});
	}
	// End Modification by Aaron Craft 04/19/2011	
	
	// sendJoin
	var sendJoin	= function(username){
		socketSend({
			type	: "join",
			data	: {
				username: username,
			}
		});
	}
	
	// sendLeave
	var sendLeave	= function(username){
		socketSend({
			type	: "leave",
			data	: {
				username: username,
			}
		});
	}
	
	// sendRename
	var sendRename	= function(oldUsername, newUsername){
		socketSend({
			type	: "rename",
			data	: {
				newUsername: newUsername,
				oldUsername: oldUsername
			}
		});
	}
}

jQuery(function(){	
	var chat	= new ChatAnywhere();
})