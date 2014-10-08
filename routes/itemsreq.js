var express = require('express');
var connect = require('connect');
var http = require('http');
var https = require('https');
var url = require('url');

exports.list = function(req, res) {	
  
  // Get the form value
  var question = req.body.query;
  var items = req.body.items;
  
  console.log("Question:" + question + " Items:" + items);
  if (process.env.VCAP_SERVICES) {
	   var VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
	   // retrieve the credential information from VCAP_SERVICES for Watson QAAPI
	   var hostname   = VCAP_SERVICES["Watson QAAPI-0.1"][0].name;               
	   var passwd = VCAP_SERVICES["Watson QAAPI-0.1"][0].credentials.password; 
	   var userid = VCAP_SERVICES["Watson QAAPI-0.1"][0].credentials.userid; 
       var watson_url = VCAP_SERVICES["Watson QAAPI-0.1"][0].credentials.url;
       
      // set required headers
       headers = {'Content-Type'  :'application/json',
                  'X-synctimeout' : '10',
                  'Authorization' : "Basic " + new Buffer(userid+":"+passwd).toString("base64")};
             
       
       var parts = url.parse(watson_url);
       console.log("********************************************");
       console.log("Host:" + parts.hostname + "  Password:" + passwd );
       console.log("Userid:" + userid + "  Watson-URL:"+ watson_url);
       console.log("********************************************");
	   // create the request options to POST our question to Watson
       console.log("Entered here - 1");
	   var options = {host: parts.hostname,
                 port: 443,
                 path: parts.pathname,
                 method: 'POST',
                 headers: headers,
                 rejectUnauthorized: false, // ignore certificates
                 requestCert: true,
                 agent: false};
	  var output="";
	   // Create a request to POST to Watson
	   var req = https.request(options, function(result) {
		   // retrieve and return the result back to the client  
		   console.log("Entered here -2");		   
		   result.on("data", function(chunk) {     		  
			   //console.log("3");
			   output += chunk;  
			   //console.log("output=" + output);			   
			   		  
		   });
		   
		   result.on('end', function(chunk) {		  
			   console.log("4");
			   var rslt = output.toString();
			   var results = JSON.parse(output);
			  
			      /*res.render(
						 'itemsres', {
                             "rslt":rslt
                                                 
				   });*/
			      res.render(
					 'itemsres', {
                      "results":results
                                          
			   });
			
		   });
	   });

	   //console.log("Chunk output final =" + output);
	   req.on('error',function(e) {
		   console.log("problem"+ e.message);
	   });
       var question = {"question":{
    	        "questionText":question,
    	        "items":items
    	        }
    	 }
    	
  
	   // create the Question text to ask Watson  
	   
	   
	   console.log("val" + JSON.stringify(question));
	   
	   // Set the POST body and send to Watson
	   req.write(JSON.stringify(question));
	   
	   req.write("\n\n");
	   
	   //Set the evidence
	   /*req.write(JSON.stringify(evidence));
	   req.write("\n\n");*/
	   req.end();
	
  
  }

}

