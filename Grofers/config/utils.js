const bcrypt = require('bcryptjs');

const MILESTONE = [{
    goal: 1,
    reward: 100,
},
{
    goal: 5,
    reward: 200,
},
{
    goal: 10,
    reward: 400,
},
{
    goal: 20,
    reward: 1000,
},
{
    goal: 25,
    reward: 1200,
},
{
    goal: 50,
    reward: 3000,
},
{
    goal: 100,
    reward: 5000,
},
]
module.exports.MILESTONE = MILESTONE;

module.exports.maskEmail = (emailID) => {
    var maskId = emailID.replace(/^(.)(.*)(.@.*)$/,
        (_, a, b, c) => a + b.replace(/./g, '*') + c
    );
    return maskId;
}

module.exports.getIncentive = () => {
    return 10 * (Math.floor(Math.random() * 5) + 1);
}

module.exports.encryptPassword = (plainPassword) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainPassword, salt);
}

module.exports.rewardIfMileStone = async (refferer, count) => {
    let obj = MILESTONE.find(m => m.goal == count);
    if (obj) {
        refferer.cash += obj.reward;
    }
    await refferer.save();
}