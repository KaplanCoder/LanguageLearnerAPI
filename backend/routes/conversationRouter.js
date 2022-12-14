
const express=require('express');

const ConversationController = require('../controllers/conversationController');

const {authenticateTheUserForHTTP} = require('../middlewares/authentication');

const commentRouter = express.Router();

//TODO: some routes don't need to authenticate the user. It could be removed

commentRouter.post('/', [authenticateTheUserForHTTP,ConversationController.createConversation]);

commentRouter.get('/', [authenticateTheUserForHTTP, ConversationController.getConversationOfMembers]);

commentRouter.patch('/addMember/:conversationId', [authenticateTheUserForHTTP, ConversationController.addMembersToConversation]);

commentRouter.patch('/removeMember/:conversationId',[authenticateTheUserForHTTP,ConversationController.removeMembersFromConversation]);

module.exports=commentRouter;