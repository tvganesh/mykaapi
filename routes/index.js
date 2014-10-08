
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'A Bluemix app using Watson QAAPI' });
};