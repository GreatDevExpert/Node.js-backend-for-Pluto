'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var bucketName = process.env.pluto - bucket || "pluto-bucket";
var awsAccessKey = process.env.AWS_ACCESS_KEY || "AKIAI2IAEMAKXVXCLLQA";
var awsSecretKey = process.env.AWS_ACCESS_KEY || "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";
var awsRegion = 'us-west-2';

_awsSdk2['default'].config.update({ accessKeyId: awsAccessKey, secretAccessKey: awsSecretKey });
_awsSdk2['default'].config.update({ region: awsRegion });

var plutoBucket = new _awsSdk2['default'].S3({ params: { Bucket: bucketName } });

exports.uploadToS3 = function (file, subDirectory, callback) {
    console.log("file upload to s3", file.path, subDirectory + file.name);
    plutoBucket.upload({
        ACL: 'public-read',
        Body: _fs2['default'].createReadStream(file.path),
        Key: subDirectory + "/" + file.name,
        ContentType: 'application/octet-stream' // force download if it's accessed as a top location
    }).send(callback);
};
exports.deleteFromS3 = function (key, subDirectory) {
    var params = {
        Key: subDirectory + key
    };
    plutoBucket.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
    });
};