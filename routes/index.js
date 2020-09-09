const express = require('express');
const router = express.Router();

const firebaseAdmin = require('../connection/firebase-admin');
const firebaseRef = firebaseAdmin.ref('/');
const firebaseRefs = firebaseRef.push();

router.get('/', function (req, res, next) {
  res.render('index', {
    title: '六角線上排隊',
    fireClient: {
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.FIREBASE_DATABASEURL,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    }
  });
});

router.post('/', function (req, res, next) {

  //取得更新時間
  const time = new Date();
  const upDateTime = `${time.getHours()} 點 ${time.getMinutes()} 分`;

  //使用 once 讀取資料庫
  let cacheNum = 0;
 

  firebaseRef.once('value').then((snapshot) => {
    cacheNum = snapshot.val().num;
    // console.log(snapshot.val())
  }).then(() => {
    const numRef = firebaseRef.child('/num');
    numRef.set(cacheNum + 1);
    const currentDateRef = firebaseRef.child('/currentDate');
    currentDateRef.set(upDateTime);
    
    firebaseRef.child('/user').set(
      { id: firebaseRefs.key, num: cacheNum + 1, update_time: upDateTime }
    )
  }).then(() => {
     // AJAX RETURN
     res.send({
      status: true,
      num: cacheNum + 1, //自己的號碼
      currentDate: upDateTime,
      user: [{ id: firebaseRefs.key, num: cacheNum + 1, update_time: upDateTime }]
    })
    res.end();
  })

})



module.exports = router;
