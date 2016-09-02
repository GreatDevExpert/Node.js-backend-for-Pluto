import {Challenge} from '../models'
let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];


async function create(req, res, next){

    let challenge = new Challenge(req.body);
    challenge._user = req.decoded._id;
    await challenge.saveAsync();

    return res.success({ data: challenge});

}

async function update(req, res, next){
    delete req.body._id;
    await req.Challenge.update(req.body);
    res.success({ data: req.Challenge});
}

async function addGoal(req, res, next){

    if (!req.body.goal_id) {
        console.log("Goal ID should be provided in params. \n");
        return res.error('Goal Id Not Found Error', 404, 'Missing Goal ID.')
    }

    let new_goal_id = req.body.goal_id;

    let flag_existing = false;

    for (let i = 0; i < req.Challenge._goals.length; i++) {
        let goal_id = req.Challenge._goals[i];
        if (goal_id === new_goal_id) {
            flag_existing = true;
        }
    }

    if (flag_existing == false) {

        let goals = req.Challenge._goals;
        goals.push(req.body.goal_id);
        Challenge.update({ _id: req.Challenge._id }, { $set: { _goals: goals }}, null);

        console.log("The goal has been connected to the challenge successfully. \n");
        res.success({_id: req.Challenge._id});
    } else {
        console.log("The goal is already connected to the challenge. \n");
        res.success({_id: req.Challenge._id});
    }


}

async function index(req, res, next){
    const challenges = await Challenge.findAsync({_user:req.decoded._id});
    res.success({data: challenges});
}

async function show(req, res) {
    res.success({ data: req.Challenge})
}

async function destroy(req, res) {

    await req.Challenge.removeAsync();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy,
    addGoal: addGoal
}
