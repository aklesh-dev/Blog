import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, "All fields are required!"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json("User created successfully!");
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, "All fields are required!"));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found!"));
        }
        const isValidPassword = bcryptjs.compareSync(password, validUser.password);
        if (!isValidPassword) return next(errorHandler(401, "Invalid Credentials"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRECT);

        const { password: hashedPassword, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json(rest);

    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { name, email, photoUrl } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRECT);
            const { password: hashedPassword, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser = new User({
                username: name.split(" ").join("").toLowerCase() + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePic: photoUrl
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRECT);
            const { password: pass, ...rest } = newUser._doc;
            res.status(201).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('Sign out Successfully.');
    } catch (error) {
        next(error);
    }
};