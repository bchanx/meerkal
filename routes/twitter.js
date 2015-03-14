var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'twitter' });
});

router.post('/oauth', function(req, res, next) {

});

module.exports = router;
