var express = require('express');
var router = express.Router();
var firebaseAdmin = require('../connection/firebase-admin');


router.get('/', function (req, res, next) {
  res.render('admin', {
    title: '六角線上排隊後台',
    fireClient: {
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.FIREBASE_DATABASEURL,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    }
  });
});

router.post('/', function (req, res, next) {
  // SET
  const currentNumberRef = firebaseAdmin.ref('/currentNumber');
  currentNumberRef.set(req.body.currentNumber);
    // RETURN
    res.send({
      status: true,
    })
    res.end();
});

module.exports = router;
