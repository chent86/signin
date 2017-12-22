var mongojs = require('mongojs');
var db = mongojs('signout', ['important'])

// db.important.insert({"username":"insert","password":"123456"});

// db.important.find(function (err, docs) {
//     console.log(docs[2]["username"]);
//     console.log(docs[2]["password"]);
// })

db.important.findOne({
    "username":"insert","password":"1234567"
}, function(err, doc) {
    if(doc != null)
      console.log(doc["password"]);
    else
      console.log("not find");
})