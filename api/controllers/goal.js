// 200 : Okay
// 400 : Bad Request
// 401 : Unauthorized
// 404 : Not Found
// 500 : Internal Server Error

import {Goal} from '../models'
import P from 'bluebird';
import aws from '../utils/aws';
import fs from 'fs';

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

P.promisifyAll(fs);

async function create(req, res, next){

    console.log("Creating a new goal : " + JSON.stringify(req.body) + "\n");

    let goal = new Goal(req.body);
    goal._user = req.decoded._id;

    try {
        await goal.saveAsync();
        console.log("New goal created successfully.\n");

    } catch (error) {

        console.log("Error in creating a new goal : " + JSON.stringify(error) + "\n");
        return res.error('goal_creation_failed', 400, 'Error with request.');
    }

    //let file = req.files.image;
    let binaryFile = await decodeBase64Image(req.body.image); //await base64ToBlob(req.body.image);

    if (binaryFile) {
        aws.uploadToS3(binaryFile, config.goalImagesFolder + "/" + goal._id + ".jpg", async function (err, data) {

            if (err) {
                console.log("Error in uploading image for a goal : " + JSON.stringify(error) + "\n");
                return res.success({ data: goal, message: "Image upload failed" });
            } else {
                goal.image_url = data.Location;
                await goal.saveAsync();

                console.log("Successfully uploaded the image for the goal. \n");
                return res.success({ data: goal });
            }
        });
    } else {
        console.log("Goal created without image. \n");
        return res.success({ data: goal, message: "image file does not exist in params" });
    }
}

async function decodeBase64Image(dataString) {

    if (dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (matches.length !== 3) {
            console.log("Invalid base 64 input string for image. \n");
            return null;
        }

        return new Buffer(matches[2], 'base64');
    } else {
        console.log("Image is nil. \n");
    }

}

async function update(req, res, next){
    delete req.body._id;
    await req.Goal.update(req.body);

    //let file = req.files.image;
    let binaryFile = await decodeBase64Image(req.body.image); //await base64ToBlob(req.body.image);

    if (binaryFile) {
        aws.uploadToS3(binaryFile, config.goalImagesFolder + "/" + req.Goal._id + ".jpg", async function (err, data) {

            if (err) {
                console.log("Error in uploading image for a goal : " + JSON.stringify(error) + "\n");
                return res.success({ data: req.Goal, message: "Image upload failed" });
            } else {
                req.Goal.image_url = data.Location + '?' + new Date().getTime();
                await req.Goal.saveAsync();

                console.log("Successfully uploaded the image for the goal. \n");
                return res.success({ data: req.Goal });
            }
        });
    } else {
        console.log("Goal created without image. \n");
        return res.success({ data: req.Goal, message: "image file does not exist in params" });
    }

    res.success({ body: req.Goal});
}

async function updateCompleteNotificationFlag(req, res, next) {

    if (req.body.complete_notification_flag) {
        req.Goal.complete_notification_flag = req.body.complete_notification_flag;
        await req.Goal.saveAsync();
        res.success({message: "Successfully updated."});
    } else {
        return res.error('Failed to update complete_notification_flag.', 400, 'Error with request.');
    }
}

async function updateFivePercentNotificationFlag(req, res, next) {

    if (req.body.fivepercent_notification_flag) {
        req.Goal.fivepercent_notification_flag = req.body.fivepercent_notification_flag;
        await req.Goal.saveAsync();
        res.success({message: "Successfully updated."});
    } else {
        return res.error('Failed to update fivepercent_notification_flag.', 400, 'Error with request.');
    }
}

async function index(req, res, next){
    const goals = await Goal.findAsync({_user:req.decoded._id});
    res.success({data: goals});
}

async function show(req, res) {
    res.success({ data: req.Goal})
}

async function destroy(req, res) {

    await req.Goal.removeAsync();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy,
    updateCompleteNotificationFlag: updateCompleteNotificationFlag,
    updateFivePercentNotificationFlag: updateFivePercentNotificationFlag
}
