'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const record = event.Records[0].s3;
  const bucketName = record.bucket.name;
  const file = record.object;

  const parameters = {
    Bucket: bucketName,
    Key: 'images.json'
  };
  
  const uploadParameters = {
    Body: '',
    ContentType: 'application/json',
    Bucket: bucketName,
    Key: 'images.json'
  };

  const uploadImage = async () => {
    await new Promise((resolve, reject) => {
      s3.putObject(uploadParameters, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  try {
    const getObjectResponse = await s3.getObject(parameters).promise();
    const existingData = JSON.parse(getObjectResponse.Body.toString());

    const newData = [...existingData, file];
    uploadParameters.Body = JSON.stringify(newData);
  } catch (error) {
    console.log(error);
    uploadParameters.Body = JSON.stringify([file]);
  }

  await uploadImage();
};
