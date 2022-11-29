
const MongoDBCollection=require('./mongoDBCollection');
const { BadRequest}=require('../errors');
const validator=require('validator');
const bcrypt=require('bcrypt');
const assert = require("assert");

class User  extends MongoDBCollection{
    
    static #userName="User";

    static #userDefinitions = {
        email: {
            type:String,
            required:true,
            unique:true,
        },
        password: {
            type: String,
            required:true,
            minLength: 6,
        },
        birthDay: {
            type: Date,
            required:true,
            // Todo: min date will be added
        },
        info: {
            type:String,
            default:""
        },
        avatarUrl : {
            type:String,
            default:"/avatarUrls/defaultAvatar.jpg" // TODO: default image will be added and path could be changed

        },
        nativeLanguage: {
            type: String,
            required:true,
        },
        foreignLanguages: {
            //TODO: will be stored as a map in the database  to improve complexity
            type: Array,
            required:true,
        },
        friends: {
            type:Array,
            default:[]
        }
    }

    constructor(collectionName=User.#userName,collectionDefinitions = User.#userDefinitions) {
        super(collectionName,collectionDefinitions);
    }


     async signUp(userObject) {
        if (!this.areKeysMatched(userObject)) {
            throw new BadRequest('User object is not valid!')
        }
        const email=userObject.email;
        const password=userObject.password;
        assert((email) && (password), "keys matched is not valid!");
        if (!validator.isEmail(email)) {
            throw new BadRequest('Email is not valid!')
        }
        const exists = await this.getModel().findOne({email});
        if (exists) {
             throw new BadRequest('Email already in use');
         }
        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash(password,salt);
        const newUser=await this.getModel().create({...userObject,password : hash})
        return newUser;
    }

    async login(userObject) {
        const {email,password} = userObject;
        if (!email || !password) {
            throw new BadRequest('Please provide email and password!');
        }
        const user=await this.getModel().findOne({email});
        if (!user) {
            throw new UnAuthenticated('Invalid email');
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch) {
            throw new UnAuthenticated('Invalid password');
        }
        user.id=user._id; //TODO: better approach could be used
        return user;
    }


}

module.exports = User;