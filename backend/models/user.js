
const MongoDBCollection=require('./mongoDBCollection');
const { BadRequest,UnAuthenticated}=require('../errors');
const validator=require('validator');
const bcrypt=require('bcrypt');
const assert = require("assert");

class User  extends MongoDBCollection {
    
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
        nativeLanguage: {
            type: String,
            required:true,
        },
        foreignLanguages: {
            //Todo: foreign languages are unique that's why another data structure like
            // hash set or map must be used to store unique values instead of using array
            type: Array,
            required:true,
        },
        friends: { //TODO: ref will be added for population
            //Todo: friendIds are unique that's why another data structure like
            // hash set must be used to store unique values instead of using array
            type:Array,
            default:[]
        }
    }

    constructor(collectionName=User.#userName,collectionDefinitions = User.#userDefinitions) {
        super(collectionName,collectionDefinitions);
    }



     async signUp(newUserObject) {
        if (!this.areRequiredDefinitionKeysMatched(newUserObject)) {
            throw new BadRequest('User object is not valid!')
        }
        const {email,password} = newUserObject;
        assert((email) && (password), "precondition is not valid! Email or password  is not found!");
        if (!validator.isEmail(email)) { //TODO: different mail checker could be used
            throw new BadRequest('Email is not valid!')
        }
        const exists = await this.getModel().findOne({email});
        if (exists) {
             throw new BadRequest('Email already in use');
         }
        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash(password,salt);
        const newUser=await this.getModel().create({...newUserObject,password : hash})
         if (!newUser) {
             throw new BadRequest('New user could not be created! Please check your user body!');
         }
        newUser.id=newUser._id;    //TODO: better approach could be used
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