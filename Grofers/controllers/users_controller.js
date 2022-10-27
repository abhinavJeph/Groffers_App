const User = require("../models/User");
const Refferal = require("../models/Refferal");
const ShortUniqueId = require('short-unique-id');
const mongoose = require('mongoose');
const Utils = require("../config/utils");
const uid = new ShortUniqueId({ dictionary: 'hex', length: 10 });

//sign In
module.exports.register = async (req, res) => {
    const { name, email, password, password2, refferalCode } = req.body;
    let failureRenderRegister = () => {
        return res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            refferalCode
        });
    };
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // if (password.length < 6) {
    //     errors.push({ msg: 'Password must be at least 6 characters' });
    // }

    if (errors.length > 0) {
        failureRenderRegister();
        return;
    } else {
        let user = await User.findOne({ email: email });
        if (user) {
            errors.push({ msg: 'Email already exists' });
            failureRenderRegister();
            return;
        }


        if (refferalCode) {
            let refferal = await Refferal.findOne({ code: refferalCode });
            if (!refferal) {
                errors.push({ msg: 'Invalid Refferal Code' });
                failureRenderRegister();
                return;
            }

            let id = mongoose.Types.ObjectId(refferal.userID);
            let refferer = await User.findOne({ _id: id });
            if (!refferer || !refferer.status) {
                errors.push({ msg: 'Invalid Refferal Code' });
                failureRenderRegister();
                return;
            }

            let newUser = await User.create({
                name,
                email,
                password: Utils.encryptPassword(password),
            });

            const referral = await Refferal.create({
                userID: newUser._id,
                code: uid() //refferal code
            });

            //get incentive: random cash prize between [10, 50]
            let incentive = Utils.getIncentive();

            refferal.refers.push({ user: newUser._id, incentive });
            refferal.referCount++;
            await refferal.save();

            refferer.cash = refferer.cash + incentive;

            newUser.cash = incentive;
            newUser.refferer = id;
            newUser.save();

            //reward the refferer if any Milestone is reached
            let count = refferal.refers.length;
            await Utils.rewardIfMileStone(refferer, count);
        } else {
            let newUser = await User.create({
                name,
                email,
                password: Utils.encryptPassword(password),
            });

            const referral = await Refferal.create({
                userID: newUser._id,
                code: uid() //refferal code
            });
        }

        req.flash(
            'success_msg',
            'You are now registered and can log in'
        );
        return res.redirect('/user/login');
    }
}

module.exports.updateStatus = async (req, res) => {
    console.log(req.query);
    if (req.user) {
        const user = await User.findById(req.user.id);
        if (user && req.query) {
            //updating status
            user.status = req.query.status == 'true';
            user.save();

            return res.render("dashboard", {
                user: user
            });
        }
    }
    return res.redirect('back');
}

module.exports.getReferral = async (req, res) => {
    if (req.query) {
        const refferal = await Refferal.findOne({ userID: req.query.id });
        if (refferal) return res.status(200).send({ refferalCode: refferal.code });
    }
    return res.status(500).send({ message: "Unexpected error" });
}

module.exports.getRefferalHistory = async (req, res) => {
    const query = new URLSearchParams(req.query);
    if (query.has("id")) {
        try {
            const userID = query.get("id");
            let referral = await Refferal.findOne({ userID }).lean().select("refers").populate(
                {
                    path: "refers.user",
                    select: ["name", "email", "createdAt", "-_id"].join(" "),
                }
            )

            const data = referral.refers.map(refer => {
                return {
                    ...refer.user,
                    incentive: refer.incentive,
                    email: Utils.maskEmail(refer.user.email)
                }
            });

            // console.log(data);
            return res.status(200).send({ data });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                mssg: "Error occured while getting History",
                err,
            });
        }
    } else {
        return res.status(400).end("user id not provided");
    }
}

module.exports.getMilestoneInfo = async (req, res) => {
    const query = new URLSearchParams(req.query);
    if (query.has("id")) {
        try {
            const userID = query.get("id");
            let referral = await Refferal.findOne({ userID }).select('referCount -_id');

            let rewardAccuired = 0;
            let data = Utils.MILESTONE.map(target => {
                let isComplete = target.goal <= referral.referCount;
                rewardAccuired += isComplete ? target.reward : 0;
                return {
                    ...target,
                    isComplete,
                }
            })

            console.log(rewardAccuired);
            return res.status(200).send({ data, rewardAccuired });
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                mssg: "Error occured while getting History",
                err,
            });
        }
    } else {
        return res.status(400).end("user id not provided");
    }
}