
const MemoryStream = require('memorystream');
const express = require("express");
const bodyParser = require('body-parser');
const isNullOrEmpty = require('is-null-or-empty');
const isJSON = require('is-valid-json')
const path_module = require('path');
const nodeMailer = require('nodemailer');
const request = require("request");
const session = require('express-session')
// const uuidv4 = require('uuid/v4');
const cache = require('memory-cache');
const fs = require('fs')
const dateFormat = require('dateformat')
const Readable = require('stream').Readable
const mysql      = require('mysql');
const fileUpload = require('express-fileupload');
const deferred = require('deferred');
const utf8 = require('utf8');
const pdfMake = require('pdfmake');
const { Console } = require('console');
const dateToWords = require('date-to-words');
const PDFDocument = require('pdfkit');
const HTMLTOPDF = require('html-pdf');



// const NodeGeocoder = require('node-geocoder');

// const options = {
//   provider: 'google',
//   apiKey: 'AIzaSyARNdl_LNWQZoOQzDxsuc6c27Oku3Jbec8'
// };

// const geocoder = NodeGeocoder(options);

// const dotenv = require('dotenv');
// dotenv.config();

// const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// const googleMapsClient = require('@google/maps').createClient({
// 	key: process.env.GOOGLE_MAPS_API_KEY
//   });

//   googleMapsClient.geocode({address: '1600 Amphitheatre Parkway, Mountain View, CA'}, function(err, response) {
// 	if (!err) {
// 	  console.log(response.json.results);
// 	}
//   });

const port = process.env.port ? process.env.port : 3000;
const dbhost = process.env.dbhost ? process.env.dbhost : "ajrs-db.c3ik60saqctw.ap-south-1.rds.amazonaws.com";
const dbuser = process.env.dbuser ? process.env.dbuser : "ajrsjournal";
const dbpwd = process.env.dbpwd ? process.env.dbpwd : "ajrsjournal";
const dbname = process.env.dbname ? process.env.dbname : "samjournal";


//  const dbhost = process.env.dbhost ? process.env.dbhost : "localhost";
//  const dbuser = process.env.dbuser ? process.env.dbuser : "root";
//  const dbpwd = process.env.dbpwd ? process.env.dbpwd : "";
//  const dbname = process.env.dbname ? process.env.dbname : "samjournal";


// var path = require('path');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var path = require('path');
const app = express();
app.use('/images', express.static('images')); 
app.set('trust proxy', 1)
app.set('view engine', 'ejs');
const router = express.Router({strict: true});
const path = __dirname + '/views/';


app.use(express.static('resources'));
global.__basedir = __dirname;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '2000mb', extended: true}))

// parse application/json
app.use(bodyParser.json({limit: '2000mb', extended: true}))
app.use(fileUpload({
	limits: { fileSize: 5 * 1024 * 1024 },
  }));

app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: (60000 * 480) }
}));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

var connection = mysql.createConnection({
	multipleStatements: true,
	host     : dbhost,
	user     : dbuser,
	password : dbpwd,
	database : dbname,
  
	charset : 'utf8'
  });
  connection.connect();
  
  //Navigatinng to home page.
  
  
  app.get('/', (req, res) => {
    res.render('index', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

  
  
  router.get("/", function(req, res) {
  	
  	return res.render('index', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
  	});
  
  router.get("/editorial", function(req, res) {
  	
  	return res.render('editorial', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
  });
  router.get("/peerreview", function(req, res) {
  	
	return res.render('peerreview', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
});

router.get("/editordetails", function(req, res) {
  	
	return res.render('editordetails', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
});
  
router.get("/editorialprocess", function(req, res) {
  	
	return res.render('editorialprocess', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
});

router.get("/plagarism", function(req, res) {
  	
	return res.render('plagarism', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
});
  router.get("/submitpaper", function(req, res) {
	
	return res.render('submitpaper', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno,"manuscript":cache.get("manuscript"),"designation":cache.get("designation"),"noofauthors":cache.get("noofauthors")})
  });

  
router.get("/beamember", function(req, res) {
	
	return res.render('beamember', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno})
  });

router.get("/archives", function(req, res) {
	
return res.render('archives', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno})
});
  
router.get("/volone", function(req, res) {
	
	return res.render('volone', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno})
	});

 router.get("/callforpapers", function(req, res) {
	
	return res.render('callforpapers', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
	});

router.get("/currentissue", function(req, res) {
	
	return res.render('currentissue', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
	});
	


router.get("/payment", function(req, res) {
	
	return res.render('payment', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
	});

router.get("/elements", function(req, res) {

	return res.render('elements', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
	});

router.get("/about", function(req, res) {
	return res.render('about', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
	});

	router.get("/contact", function(req, res) {
		return res.render('contact', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
		});

	router.get("/author-details", function(req, res) {
		if (req.session && req.session.userId && req.session.role) {
			if("admin" == req.session.role || "staffuser" == req.session.role){
			return res.render('author-details', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno,"manuscript":cache.get("manuscript"),"designation":cache.get("designation"),"noofauthors":cache.get("noofauthors"),"status":cache.get("status")})
		}else{
			return res.render('error', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno})
		}
		}else {
		res.redirect('/login'+req.originalUrl);
		}
	});


	router.get("/download/student/image/:idno", function(req, res) {
		if (req.session && req.session.userId && req.session.role) {
			if("admin" == req.session.role && !isNullOrEmpty(req.params.idno)){
				pdffiledownloaddetails(req.params.idno,function(pdffile){
				res.attachment(pdffile.name)
				const attachmentBuffer = Buffer.from(pdffile.content, 'base64');
				const stream = new Readable();
				stream.push(attachmentBuffer);
				stream.push(null);
				stream.pipe(res);
				});
	
		}else{
			return res.render('error', {TVU_USERNAME: req.session.uname, TVU_LOGINIDNO: req.session.loginidno})
		}
		}else {
		res.redirect('/login'+req.originalUrl);
		}
	});


  router.get("/signup", function(req, res) {
	  
	  return res.render('signup', {JOURNAL_USERNAME: req.session.uname, JOURNAL_LOGINIDNO: req.session.loginidno});
  });

  // to add all pages like public pages without login(Before login)
  //Navigatinng to login page.
  router.get("/login", function(req, res) {
	  return res.render('login',{"status":"invisible","message":""});
  });
  router.get("/login/:url", function(req, res) {
	  return res.render('login',{"status":"invisible","message":"","url":req.params.url});
  });
  router.post("/login", function(req, res, callback) {
	  var sess = req.session;
	  login(req.body.journal_username_input,req.body.journal_password_input,function(response) {
		  if(response.login == "success"){
			  req.session.userId = req.body.journal_username_input;
			  req.session.uname = response.name;
			  req.session.role = response.role;
			  req.session.loginidno = response.loginidno;
			  
			  return res.redirect('/'+req.body.url);
		  }else{
			  return res.render('login',{"status":"error","message":"Login failed.","url":req.body.url});
		  }
		  
	  });
  });
  
  
  
  router.use(function(req, res, next) {
	  next();
  });
  
  
  //GET /logout
  router.get("/logout", function(req, res, next) {
	if (req.session) {
	  // delete session object
	  req.session.destroy(function(err) {
		if(err) {
		  return next(err);
		} else {
		  return res.redirect('/');
		}
	  });
	}
  });
  
     
  
  

  
  router.post('/submitpaper', function(req, res) {
		   papersubmission(req,function(response) {
		  return res.render('submitpaper',{"manuscript":cache.get("manuscript"),"designation":cache.get("designation"),"noofauthors":cache.get("noofauthors"),"message":response.message,"studentstatus":response.status});
		  
	  });
  });

  router.post('/beamember', function(req, res) {
			memberdetails(req,function(response) {
   			return res.render('beamember',{"message":response.message,"studentstatus":response.status});
				
		});
		
	});

  router.post("/author-details", function(req, res, callback) {
	if (req.session && req.session.userId) {
		
		authordetailssearch(req.body,function(search){
			res.send(search);
		});
	}else{
		res.redirect('/login');
	}
});

module.exports = app;

app.use("/", router);

app.use("*", function(req, res) {
	return res.render('error');
});

app.listen(port, function() {
	loading();
	console.log("Application listening on port : "+port)
});

var login = function(uname,pwd,callback)
{
	var loginqry="SELECT empname,loginidno,role from login where uname='"+uname+"' AND pwd='"+pwd+"'";
	
	connection.query(loginqry, function (error, results, fields) {
	  if (error){
		  var res = {"login":"error"}
		  callback(res)
	  }else{
		  if(!isNullOrEmpty(results) && !isNullOrEmpty(results[0]) && !isNullOrEmpty(results[0].empname)){
			  var res = {"login":"success","name":results[0].empname,"loginidno":results[0].loginidno,"role":results[0].role}
			  callback(res)
		  }else{
			  var res = {"login":"error"}
			  callback(res)
		  }
	  }
	});
}


var memberdetails = function(req,callback)
{
// var successcount=0;
// var errorcount = 0;
// const rowcount = vaccine_entry.length;
// var values = [];
// for(var i=0; i < bemember.length; i++){
	// var ptitle = isNullOrEmpty(req.body.ptitle) ? "":req.body.ptitle;
	var createtime = new Date();
const name = isNullOrEmpty(req.body.name) ? "" : req.body.name;
const designation = isNullOrEmpty(req.body.designation) ? "" : req.body.designation;
const instaddress = isNullOrEmpty(req.body.instaddress) ? "" : req.body.instaddress;
const mailid = isNullOrEmpty(req.body.mailid) ? null : req.body.mailid;
const contactno = isNullOrEmpty(req.body.contactno) ? "" : req.body.contactno;
	

var svalues = [name,designation,instaddress,mailid,contactno,createtime];
	var query = "insert into beamember (name,designation,instaddress,mailid,contactno,createtime) values (?,?,?,?,?,?)";
	// values.push([name,designation,instaddress,mailid,contactno,createtime]);
	

// var query = "insert into beamember (name,designation,instaddress,mailid,contactno,createtime) values ?";

connection.query(query, svalues , function (error, results) {
	if (error){
		console.log(error)
		var message = {"error_code":"-100","status":"error","message":"Member details save failed."}
		callback(message)
	}
	else{
		var message = {"status":"success","message":"Member details saved Successfully."}
		callback(message)
	}
	});
}





var papersubmission = function(req,callback){
	
	
	var createtime = new Date();
	//Initialize with student information
	var ptitle = isNullOrEmpty(req.body.ptitle) ? "":req.body.ptitle;
	var arearch = isNullOrEmpty(req.body.arearch) ? "":req.body.arearch;
	var manutype = isNullOrEmpty(req.body.manutype) ? "":req.body.manutype;
	var noofpages = isNullOrEmpty(req.body.noofpages) ? "":req.body.noofpages;
	var studentimage = (!isNullOrEmpty(req.files) && !isNullOrEmpty(req.files.studentimagefile) && !isNullOrEmpty(req.files.studentimagefile.data)) ? req.files.studentimagefile.data:""
	var studentimagename = (!isNullOrEmpty(req.files) && !isNullOrEmpty(req.files.studentimagefile) && !isNullOrEmpty(req.files.studentimagefile.name)) ? req.files.studentimagefile.name:""
	// var uploadfilepaper = (!isNullOrEmpty(req.files) && !isNullOrEmpty(req.files.paperuploadfile) && !isNullOrEmpty(req.files.paperuploadfile.data)) ? req.files.paperuploadfile.data:""
	// var uploadfilename = (!isNullOrEmpty(req.files) && !isNullOrEmpty(req.files.paperuploadfile) && !isNullOrEmpty(req.files.paperuploadfile.name)) ? req.files.paperuploadfile.name:""
	var paperabstract = isNullOrEmpty(req.body.paperabstract) ? "":req.body.paperabstract;
	var keywords = isNullOrEmpty(req.body.keywords) ? "":req.body.keywords;
	var authname = isNullOrEmpty(req.body.authname) ? "":req.body.authname;
	var authcont = isNullOrEmpty(req.body.authcont) ? "":req.body.authcont;
	var authmail = isNullOrEmpty(req.body.authmail) ? "":req.body.authmail;
	var designation = isNullOrEmpty(req.body.designation) ? "":req.body.designation;
	var institute = isNullOrEmpty(req.body.institute) ? "":req.body.institute;
	var noofauthors = isNullOrEmpty(req.body.noofauthors) ? "":req.body.noofauthors;
	var authname2 = isNullOrEmpty(req.body.authname2) ? "":req.body.authname2;
	var authcont2 = isNullOrEmpty(req.body.authcont2) ? "":req.body.authcont2;
	var authmail2 = isNullOrEmpty(req.body.authmail2) ? "":req.body.authmail2;
	var designation2 = isNullOrEmpty(req.body.designation2) ? "":req.body.designation2;
	var institute2 = isNullOrEmpty(req.body.institute2) ? "":req.body.institute2;
	var authname3 = isNullOrEmpty(req.body.authname3) ? "":req.body.authname3;
	var authcont3 = isNullOrEmpty(req.body.authcont3) ? "":req.body.authcont3;
	var authmail3 = isNullOrEmpty(req.body.authmail3) ? "":req.body.authmail3;
	var designation3 = isNullOrEmpty(req.body.designation3) ? "":req.body.designation3;
	var institute3 = isNullOrEmpty(req.body.institute3) ? "":req.body.institute3;
	var authname4 = isNullOrEmpty(req.body.authname4) ? "":req.body.authname4;
	var authcont4 = isNullOrEmpty(req.body.authcont4) ? "":req.body.authcont4;
	var authmail4 = isNullOrEmpty(req.body.authmail4) ? "":req.body.authmail4;
	var designation4 = isNullOrEmpty(req.body.designation4) ? "":req.body.designation4;
	var institute4 = isNullOrEmpty(req.body.institute4) ? "":req.body.institute4;
	
	var svalues = [ptitle,arearch,manutype,noofpages,studentimage,studentimagename,paperabstract,keywords];
	var query = "insert into submitpaper (ptitle,arearch,manutype,noofpages,uploadfilepaper,uploadfilename,paperabstract,keywords) VALUES (?,?,?,?,?,?,?,?)";
	
	connection.query(query, svalues , function (error, results, fields) {
	  if (error){
		  console.log(error)
		  var message = {"status":"error","message":"Registration failed."}
		  callback(message)
	  }
	  else{
		  //var idno = results.insertId;
		  var author_values = [authname,authcont,authmail,designation,institute,noofauthors,createtime];
		  add_authordetails(author_values)
		  var author_values2 = [authname2,authcont2,authmail2,designation2,institute2,createtime];
		  add_authordetails2(author_values2)
		  var author_values3 = [authname3,authcont3,authmail3,designation3,institute3,createtime];
		  add_authordetails3(author_values3)
		  var author_values4 = [authname4,authcont4,authmail4,designation4,institute4,createtime];
		  add_authordetails4(author_values4)
		 
		 // var message = {"status":"success","message":"Registration Success.","idno":idno}
		 var message = {"status":"success","message":"Registration Success."}
		  
		  callback(message)
	  }});
}
var add_authordetails = function(values){
	var query = "insert into author_details (authname,authcont,authmail,designation,institute,noofauthors,createtime) VALUES (?,?,?,?,?,?,?)";
	
	connection.query(query, values, function (error, results, fields) {
	  if (error){
		  console.log(error)
	  }else{
	  }});
}
var add_authordetails2 = function(values){
	var query = "insert into author_details2 (authname2,authcont2,authmail2,designation2,institute2,createtime) VALUES (?,?,?,?,?,?)";
	
	connection.query(query, values, function (error, results, fields) {
	  if (error){
		  console.log(error)
	  }else{
	  }});
}

var add_authordetails3 = function(values){
	var query = "insert into author_details3 (authname3,authcont3,authmail3,designation3,institute3,createtime) VALUES (?,?,?,?,?,?)";
	
	connection.query(query, values, function (error, results, fields) {
	  if (error){
		  console.log(error)
	  }else{
	  }});
}

var add_authordetails4 = function(values){
	var query = "insert into author_details4 (authname4,authcont4,authmail4,designation4,institute4,createtime) VALUES (?,?,?,?,?,?)";
	
	connection.query(query, values, function (error, results, fields) {
	  if (error){
		  console.log(error)
	  }else{
	  }});
}



var authordetailssearch = function (body,callback){
	var repmanuscript = body.search_author_manuscript;
	var repdesignation = body.search_author_designation_input;
	
	
	
	// if(!isNullOrEmpty(repclass)){
	// 	condition = condition+"g.graduateno in("+repclass+")";
	// }
	// if(condition.length === 6 && !isNullOrEmpty(repdegree)){
	// 	condition = condition+"s3.degree in("+repdegree+") and s3.studentstatus='"+repstatus+"' ";
	// }else if(!isNullOrEmpty(repdegree)){
	// 	condition = condition+" and s3.degree in("+repdegree+") and s3.studentstatus='"+repstatus+"'";
	// }
	
	//condition = condition + " group by c.categoryno,d.branchname,b.batchname,gd.gendername  order by c.categoryno";
	
	var condition = " where ";
	condition = condition + "  m.manuscriptno in ("+repmanuscript+") and s.manutype=m.manuscriptno and a.idno = s.idno order by s.sno desc";
	var query = "select s.sno,s.idno,a.authname,s.ptitle,m.manuscriptname,m.manuscriptno,to_base64(s.uploadfilepaper) as uploadfilepaper,date_format(a.createtime,'%d-%M-%Y') as createtime from manuscript m,submitpaper s,author_details a " +condition;
	
	
	connection.query(query, function (error, results, fields) {
		  if (error){
			  console.log(error)
			  var data ={"error_code":"-100","status":"failure","error_message":"Student details not found."}
			  callback(data);
		  }else{
			  var payload= JSON.stringify(results)
		    	if (!isNullOrEmpty(payload.replace(/\s/g, '')) && isJSON(results) && results.length !== 0){
		    		  callback(results);
		    	}else{
		    		 var data ={"error_code":"-100","status":"failure","error_message":"Student details not found."}
					  callback(data);
		    	}
		  }
	});
}




//photo-download

var pdffiledownloaddetails = function (idno,callback){
	
	
	
	var query = "SELECT uploadfilename as name,to_base64(uploadfilepaper) as content from submitpaper where idno = '"+idno+"'"
	
	connection.query(query, function (error, results, fields) {
		  if (error){
			  console.log(error)
			  var data ={"error_code":"-100","status":"failure","error_message":"Paper details not found."}
			  callback(data);
		  }else{
			  var payload= JSON.stringify(results)
		    	if (!isNullOrEmpty(payload.replace(/\s/g, '')) && isJSON(results) && results.length !== 0){
		    		  callback(results[0]);
		    	}else{
		    		 var data ={"error_code":"-100","status":"failure","error_message":"Paper details not found."}
					  callback(data);
		    	}
		  }
	});

}


// var memberdetails = function(bemember,callback)
// {
	
// 	var successcount = 0;
// 	var errorcount = 0;
// 	const rowcount = bemember.length;
// 	var values = [];
// 	for(var i=0; i < bemember.length; i++){
		
// 		var createtime = new Date();
// 		const name = isNullOrEmpty(bemember[i].name) ? "" : bemember[i].name;
// 		const designation = isNullOrEmpty(bemember[i].designation) ? "" : bemember[i].designation;
// 		const instaddress = isNullOrEmpty(bemember[i].instaddress) ? "" : bemember[i].instaddress;
// 		const mailid = isNullOrEmpty(bemember[i].mailid) ? null : bemember[i].mailid;
// 		const contactno = isNullOrEmpty(bemember[i].contactno) ? "" : bemember[i].contactno;
		
// 		console.log(contactno)
		
// 		values.push([name,designation,instaddress,mailid,contactno,createtime]);
// 	}
// 	console.log([values])
// 	var query = "insert into beamember (name,designation,instaddress,mailid,contactno,createtime) values (?";
// 	console.log(query)
// 	connection.query(query, [values] , function (error, results) {
// 		if (error){
// 			console.log(error)
// 			errorcount = errorcount+1;
			
// 			}
// 		  else{
// 			  successcount = successcount+1;
// 		  }
// 		  if (Number(successcount+errorcount) === Number(rowcount)){
// 			  if (Number(successcount) === Number(rowcount)  && Number(errorcount) === 0){
// 				  var message = {"status":"success","message":"Member Details have registered for  "+successcount+ " person"}
// 				  callback(message)
// 			  }
// 			  else
// 			  {
// 				  var message = {"status":"error","message":"Member Details have registered for " +errorcount+ " person"}
// 				  callback(message)
// 			  }
// 			  }		
			  
// 		  });
		  
		  
		  
		  




var loadInitialData = function(table,query,callback)
{
	if(!isNullOrEmpty(cache.get(table))){
		callback(cache.get(table))
	}else{
connection.query(query, function (error, results, fields) {
	  if (error){
	  }else{
		  var result = []
		  Object.keys(results).forEach(function(key) {
			  if(!isNullOrEmpty(results[key].manuscriptno) && !isNullOrEmpty(results[key].manuscriptname)){
				  result.push({"value":results[key].manuscriptno,"name":results[key].manuscriptname})
		     	}else if(!isNullOrEmpty(results[key].designo) && !isNullOrEmpty(results[key].designation)){
					result.push({"value":results[key].designo,"name":results[key].designation})
				}else if(!isNullOrEmpty(results[key].noofauthors) && !isNullOrEmpty(results[key].noofauthors)){
					result.push({"value":results[key].noofauthors,"name":results[key].noofauthors})
			  }
		    });
			
		  	cache.put(table, result);
		  	callback(result)
	  }
	});
	}
}


	function loading (){
	loadInitialData("manuscript","select manuscriptno,manuscriptname from manuscript",function(data){});
	loadInitialData("designation","select designo,designation from designation",function(data){});
	loadInitialData("noofauthors","select noofauthors from noofauthors",function(data){});
	}
