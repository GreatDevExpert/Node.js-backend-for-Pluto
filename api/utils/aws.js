import fs from 'fs';
import AWS from 'aws-sdk';

const bucketName = process.env.PLUTO_BUCKET || "pluto-bucket";
const awsAccessKey = process.env.AWS_ACCESS_KEY || "AKIAI2IAEMAKXVXCLLQA";
const awsSecretKey = process.env.AWS_ACCESS_KEY || "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";
const awsRegion = 'us-west-2';

AWS.config.update({accessKeyId: awsAccessKey, secretAccessKey: awsSecretKey});
AWS.config.update({region: awsRegion});

let plutoBucket = new AWS.S3({params: {Bucket: bucketName}});

exports.uploadToS3 = function(file, subDirectory, callback) {

    //console.log("file upload to s3", file.path, subDirectory + file.name);
    //
    plutoBucket
        .upload({
            ACL: 'public-read',
            Body: file, //fs.createReadStream(file.path),
            Key: subDirectory, // + "/" + file.name,
            ContentType: 'application/octet-stream' // force download if it's accessed as a top location
        })
        .send(callback);

    //plutoBucket
    //    .upload({
    //        Body: file,
    //        Key: subDirectory
    //    })
    //    .send(callback);
}
exports.deleteFromS3 = function(key, subDirectory){
    var params = {
        Key: subDirectory + key
    };
    plutoBucket.deleteObject(
        params,
        function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
}