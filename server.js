var express = require('express')
var app = express();
var port = process.env.PORT || 3000;
//var db = require('./src/db')

app.use(express.json());

var routes = require('./src/routes');
routes(app);

/*db.init();

process.on('exit', function () {
    db.shutdown();
});*/

app.listen(port, function () {
    console.log('Server started on port: ' + port);
});

