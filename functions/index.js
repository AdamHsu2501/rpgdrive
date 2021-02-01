const express = require("express");
const app = express();
const url = require('url');
const path = require('path');
const os = require('os');
const fs = require('fs');
const querystring = require('querystring');
const cors = require('cors')({ origin: true });
const proxy = require('http-proxy-middleware');
const helmet = require('helmet');
const mkdirp = require('mkdirp-promise');
const crc32c = require("fast-crc32c");
var AdmZip = require('adm-zip');
const mime = require('mime');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const firebase_tools = require('firebase-tools');
var serviceAccount = require('./rpggamecenterServiceAccount.json');
const { Storage } = require('@google-cloud/storage');
var { google } = require("googleapis");
var strtotime = require('strtotime');
const { bot } = require('./socialMediaBot');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rpggamecenter.firebaseio.com"
});
const firestore = admin.firestore();

const gcconfig = {
    projectId: "rpggamecenter",
    keyFilename: './rpggamecenterServiceAccount.json'
};

const gcs = new Storage(gcconfig);

var scopes = [
    "https://www.googleapis.com/auth/devstorage.read_only"
];

var jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    scopes
);

var allowedOrigins = [
    'http://localhost:3000',
    'https://rpgdrive.ga',
    'https://us-central1-rpggamecenter.cloudfunctions.net'
];

const validateOrigins = async (req, res, next) => {
    try {
        var referer = url.parse(req.headers.referer);
        var originalUrl = path.parse(req.originalUrl);

        var hostUrl = url.format({
            protocol: referer.protocol,
            host: referer.host,
        })

        if (originalUrl.ext === ".html" && allowedOrigins.indexOf(hostUrl) === -1) {
            console.log('validateToken req.headers.referer', req.headers.referer)
            res.status(403).send('Unauthorized');
            return;
        }

        const oauthToken = await jwtClient.authorize();
        req.headers['authorization'] = `Bearer ${oauthToken.access_token}`;

        next();
        return;
    } catch (error) {
        console.error('Validate Origins error:', error);
        res.status(403).send('Unauthorized');
        return;
    }
}

app.use(cors);
app.use(helmet({ frameguard: false }));
app.use(validateOrigins);
app.use('/', proxy({
    target: `https://storage.googleapis.com/rpggamecenter`,
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
        if (proxyRes.headers['authorization']) {
            proxyRes.headers['authorization'] = req.headers['authorization'];
        }
    }
}))

app.use(function (err, req, res, next) {
    console.error('express error:', err);
    console.error('express error stack:', err.stack);
    res.status(500).send('Something broke!');
});

exports.gameCore = functions.https.onRequest(app)


const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '2GB'
}

exports.unzip = functions.runWith(runtimeOpts).storage.object().onFinalize((object) => {

    const arr = [
        'application/x-rar-compressed',
        'application/octet-stream',
        'application/zip',
        'application/x-zip-compressed',
        'multipart/x-zip'
    ];

    var valid = arr.indexOf(object.contentType) >= 0 ? true : false;

    if (!valid) {
        return null
    }

    const filePath = object.name;
    const fileDir = path.dirname(filePath);
    const gameName = path.basename(fileDir);
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);

    const srcBucketName = object.bucket;
    const srcBucket = gcs.bucket(srcBucketName);
    const dstBucketName = srcBucketName.slice(0, srcBucketName.indexOf('.'))
    const dstBucket = gcs.bucket(dstBucketName);
    const srcFile = srcBucket.file(filePath);
    var obj = {
        url: "",
        pc: false,
        mobile: false,
        size: 0,
        unzip: true,
    };


    return mkdirp(tempLocalDir).then(() => {
        return srcFile.download({ destination: tempLocalFile });
    }).then(() => {
        console.log("zip already downloaded to:", tempLocalFile);
        var promiseArray = [];

        var zip = new AdmZip(tempLocalFile);
        var zipEntries = zip.getEntries();
        

        zipEntries.forEach((zipEntry) => {
           
            if (!zipEntry.isDirectory) {
                const dstFilePath = path.join(fileDir, zipEntry.entryName);
                const content = zip.readFile(zipEntry.entryName);
                const dstFile = dstBucket.file(dstFilePath);
                const contentType = mime.getType(zipEntry.name);

                const options = {
                    //predefinedAcl: 'authenticatedRead',//'authenticatedRead',//'publicRead',
                    metadata: {
                        contentType: contentType
                    },
                    gzip: true,
                    validation: crc32c
                }

                if (contentType === 'text/html') {
                    obj.url = path.join(fileDir, zipEntry.entryName);//`https://storage.googleapis.com/${htmlUrl}`;
                }
                const accessType = path.extname(zipEntry.entryName);
                if (accessType === ".ogg" || accessType === ".rpgmvo") {
                    obj.pc = true;
                } else if (accessType === ".m4a" || accessType === ".rpgmvm") {
                    obj.mobile = true;
                }

               
                promiseArray.push(dstFile.save(content, options));
            }
        });

        return Promise.all(promiseArray);
    }).then(() => {
        console.log("All files uploaded to GCS");
        fs.unlinkSync(tempLocalFile);
        return dstBucket.getFiles({ prefix: fileDir })
    }).then(results => {
        const files = results[0];

        return Promise.all(
            files.map(file =>
                dstBucket.file(file.name).getMetadata().then(metadata_results =>
                    obj.size += parseInt(metadata_results[0].size, 10)
                )
            )
        );
    }).then(() => {
        console.log("All files size:", obj.size);
        return updateGameData(false, gameName, obj)
    }).catch(error => {
        console.error("unzip error:", error)
        return updateGameData(true, gameName, obj)
    }).then(() => {
        console.log('unzip end')
        return srcFile.delete();
    }).then(() =>
        console.log('file deleted:', filePath)
    );
});


exports.generateImgUrl = functions.storage.object().onFinalize((object) => {
    if (!object.contentType.startsWith('image/')) {
        return null;
    }

    const filePath = object.name;
    const fileDir = path.dirname(filePath);
    const dirName = path.basename(fileDir);
    const fileName = path.basename(filePath);
    const bucket = gcs.bucket(object.bucket);
    const file = bucket.file(filePath);
    const imgName = fileName.replace('.', '_');

    const config = {
        action: 'read',
        expires: '03-01-2500',
    };

    console.log("generateImgUrl start:", filePath);

    return file.getSignedUrl(config).then(result => {
        var obj = {};
        obj.imgUrl = { [imgName]: result[0] };
        return updateGameData(false, dirName, obj)
    }).then(() =>
        console.log(`generateImgUrl end: ${filePath} url uploaded`)
    ).catch(error => {
        console.log("generateImgUrl error:", error)
    });
});


function updateGameData(error, id, obj) {
    var ref = firestore.collection('game').doc(id);

    if (error) {
        obj.error = true;
        obj.complete = true;
    }
    console.log('obj', obj)
    return ref.set(obj, { merge: true }).then(() => {
        return ref.get()
    }).then(doc => {
        var data = doc.data();

        var complete = data.image.every(item => data.imgUrl[item.replace('.', '_')] !== undefined) && data.unzip ? true : false;

        console.log('data', data)
        if (complete && !data.error) {
            return ref.update({ complete }).then(() => {
                return bot(data)
            })
        } else {
            return null
        }
    })
}


exports.deleteProcess = functions.https.onCall((data, context) => {
    console.log('deleteProcess start');

    const userRef = firestore.collection('user');
    var promises = [];

    promises.push(gcs.bucket('rpggamecenter.appspot.com').deleteFiles({ prefix: `game/${data.id}` }));
    promises.push(gcs.bucket('rpggamecenter').deleteFiles({ prefix: `game/${data.id}` }));
    promises.push(firebase_tools.firestore.delete(`game/${data.id}`, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token
    }))

    return Promise.all(promises).then(() =>
        //     return userRef.where("like", "array-contains", data.id).get();
        // }).then(docs => {
        //     if (docs.empty) {
        //         return null
        //     }

        //     const followPromises = [];
        //     var notice = `notice.${data.id}`;

        //     docs.forEach(doc => {
        //         followPromises.push(
        //             userRef.doc(doc.id).set({
        //                 like: admin.firestore.FieldValue.arrayRemove(data.id),
        //                 [notice]: admin.firestore.FieldValue.delete()
        //             }, { merge: true })
        //         )
        //     })

        //     return Promise.all(followPromises);
        // }).then(() =>
        console.log('deleteProcess end:', data.id)
    )
});


// const nodemailer = require('nodemailer');
// //cmd > firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="email-password"
// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = 'jqooxxxlnhvdvyly'; //functions.config().gmail.password;
// const mailTransport = nodemailer.createTransport({
//     service: 'gmail',
//     secure: true,
//     auth: {
//         user: gmailEmail,
//         pass: gmailPassword,
//     },
// });

// const APP_NAME = 'RPG drive';
// // Sends a welcome email to the given user.
// function sendWelcomeEmail(email) {
//     const mailOptions = {
//         from: `${APP_NAME} <noreply@firebase.com>`,
//         to: email,
//     };

//     // The user subscribed to the newsletter.
//     mailOptions.subject = `Welcome to ${APP_NAME}!`;
//     mailOptions.text = `Hey! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
//     return mailTransport.sendMail(mailOptions).then(() => {
//         return console.log('New welcome email sent to:', email);
//     });
// }


// exports.createUser = functions.auth.user().onCreate((user) => {
//     console.log(user.displayName) // null
//     //have to user admin.auth() to get user.displayName
//     return admin.auth().getUser(user.uid).then(userRecord => {
//         return firestore.collection('user').doc(userRecord.uid).set({
//             displayName: userRecord.displayName,
//             email: userRecord.email,
//             emailVerified: userRecord.emailVerified,
//             introduction: null,
//             level: 3,
//             paypal: null,
//             photoURL: userRecord.photoURL,
//             uid: userRecord.uid,
//         })
//     }).then(() =>
//         console.log("Successfully create user data")
//         // return sendWelcomeEmail(user.email);
//     ).catch(error => {
//         console.log("Error:", error);
//     })
// });



const { payment, executePayment, billingPlan, billingProcess, refund, requestPermissions, getAuth } = require('./paypal');

function compareNumbers(a, b) {
    return b - a;
}

exports.ipn = functions.runWith({ timeoutSeconds: 300 }).https.onRequest((req, res) => {
    var reqBody = req.body;
    console.log('reqBody', reqBody);

    if (reqBody.transaction) {
        var transaction = reqBody.transaction;
        var obj = {};
        var ref = firestore.collection('transaction').doc(reqBody.pay_key);
        return ref.get().then(doc => {
            var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var txnIdArray = transaction.filter(item => !regexEmail.test(item)).filter(item => !item.includes("USD ")).filter(item => item.length > 16);

            var userRef;
            obj.status = reqBody.status;
            obj.payeeTxnId = reqBody.status === 'COMPLETED' ? txnIdArray[txnIdArray.length - 1] : null;

            if (doc.exists) {
                userRef = firestore.collection('user').doc(doc.data().payer).collection('history').doc(doc.data().game)
                console.log('Transaction update')
                obj.update = transaction;
                if (reqBody.reason_code) {
                    obj.action = reqBody.reason_code;
                }
            } else {
                console.log('Transaction create')
                var amountArray = transaction.filter(item => item.includes("USD ")).map(item => item.replace("USD ", "")).sort(compareNumbers)
                var memo = reqBody.memo.split('|');

                var returnRef = url.parse(reqBody.return_url);
                var qs = querystring.parse(returnRef.query);

                var exDate = new Date(reqBody.payment_request_date);
                exDate.setDate(exDate.getDate() + 7);

                obj.create = transaction
                obj.payer = memo[1];
                obj.payerTxnId = txnIdArray[0];
                obj.payee = memo[2];
                obj.action = memo[0];
                obj.date = new Date(reqBody.payment_request_date);
                obj.exDate = exDate;
                obj.game = qs.id;
                obj.gameName = memo[3];
                obj.amount = amountArray;
                obj.payKey = reqBody.pay_key;
                obj.totalMs = 0;
                obj.reqRefund = false;
                obj.reqReason = "";
                obj.resReason = null;
                obj.return = url.format({
                    protocol: returnRef.protocol,
                    host: returnRef.host,
                });

                userRef = firestore.collection('user').doc(obj.payer).collection('history').doc(obj.game)
            }

            return ref.set(obj, { merge: true }).then(() => {
                console.log('transaction done');
                return userRef.set({
                    buy: obj.action !== 'Refund' ? true : false
                }, { merge: true })
            }).then(() => {
                console.log('update user history')
                res.status(200).end();
            })
        })
    }

    if (reqBody.recurring_payment_id && reqBody.txn_id) {
        var id = reqBody.recurring_payment_id;
        var status = reqBody.payment_status;
        var payer = reqBody.payer_email;
        var date = new Date(reqBody.payment_date);
        var amount = reqBody.amount;
        var fee = reqBody.payment_fee;
        var txnId = reqBody.txn_id
        console.log('sponsor', id)
        return firestore.collection('sponsor').doc(id).set({
            id: id,
            payer: payer,
            txnId: admin.firestore.FieldValue.arrayUnion(txnId),
            status: admin.firestore.FieldValue.arrayUnion(status),
            date: admin.firestore.FieldValue.arrayUnion(date),
            amount: admin.firestore.FieldValue.arrayUnion(amount),
            fee: admin.firestore.FieldValue.arrayUnion(fee),
        }, { merge: true }).then(() => {
            console.log('sponsor update')
            res.status(200).end();
        })
    }

    res.status(200).end();
});

exports.pay = functions.https.onRequest(payment);

//every day 00:00  or  every 3 minutes
exports.schedule = functions.pubsub.schedule('0 0 * * *').onRun(context => {
    console.log('every day 00:00!', context);

    var promises = []

    promises.push(
        firestore.collection('transaction').where('status', '==', 'INCOMPLETE').where('reqRefund', '==', true).orderBy('date').get().then(docs => {
            if (docs.empty) {
                console.log('schedule no refund')
                return null
            }

            var subPromises = []
            console.log('schedule refund', docs.size)

            docs.forEach(doc => {
                var data = doc.data();
                var ref = firestore.collection('transaction').doc(doc.id);
                // var expired = data.reqDate.toMillis() > data.exDate.toMillis();
                var expired = data.reqDate > data.exDate;
                var timeOut = data.totalMs > 900000;

                if (expired || timeOut) {
                    var resReason = expired ? 'date' : 'time';
                    subPromises.push(
                        ref.set({
                            reqRefund: false,
                            resReason
                        }, { merge: true })
                    )
                } else {
                    subPromises.push(
                        executePayment(data).then(result => {
                            console.log('1', result)
                            return refund(data);
                        }).then(result => {
                            console.log('2', result)
                        }).catch(error => {
                            console.log('error', error)
                        })
                    )
                }
            })
            return Promise.all(subPromises)
                .then(() => console.log('refund complete'))
                .catch(error => console.log('refund error', error))
        })
    )

    var d = new Date(context.timestamp)
    console.log('d', d, context.timestamp)

    promises.push(
        firestore.collection('transaction').where('status', '==', 'INCOMPLETE').where('reqRefund', '==', false).where('exDate', "<", d).orderBy('exDate').get().then(docs => {
            if (docs.empty) {
                console.log('schedule no executePayment')
                return null
            }

            console.log('schedule executePayment', docs.size)

            var promises = [];
            docs.forEach(doc => {
                promises.push(
                    executePayment(doc.data()).then((result) => {
                        console.log('result', result)
                    }).catch(error => {
                        console.log('error', error)
                    })
                )
            })

            return Promise.all(promises)
                .then(() => console.log('execute update'))
                .catch(error => console.log('execute error', error))
        })
    )

    return Promise.all(promises);
});

exports.subscribe = functions.https.onRequest(billingPlan);

exports.process = functions.https.onRequest(billingProcess);

exports.permission = functions.https.onRequest(requestPermissions);

exports.updatePaypalAccount = functions.https.onRequest((req, res) => {
    const uid = req.query.uid;

    return getAuth(req, res)
        .then(email => {
            return firestore.collection('user').doc(uid).set({
                paypal: email
            }, { merge: true })
        })
        .then(() => {
            res.redirect(req.query.ref)
        })
        .catch(error => {
            console.error('updatePaypalAccount', error)
            res.redirect(req.query.ref)
        })
});

// exports.refund = functions.https.onRequest(refund);

const { create, map, query, print, testData, updateShipInfo, updateStoreInfo } = require('./ecpay');
exports.ecpayTestData = functions.https.onRequest(testData);
exports.ecpayUpdateShip = functions.https.onRequest(updateShipInfo);
exports.ecpayUpdateStore = functions.https.onRequest(updateStoreInfo);
exports.ecpayPrint = functions.https.onRequest(print);
exports.ecpayQuery = functions.https.onRequest(query);
exports.ecpayMap = functions.https.onRequest(map);
exports.ecpayCreate = functions.https.onRequest(create);
exports.ecpayInfo = functions.https.onRequest((req, res) => {
    console.log('ecpay Info res', req)

    return res.status(200).end();
})