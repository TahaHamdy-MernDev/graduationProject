const router=require("express").Router()
const questionCtrl =require("../controllers/questionController")
const { authenticate } = require("../middleware/auth")
router.post('/create',authenticate,questionCtrl.askQuestion)
router.get('/get-all',questionCtrl.getAllQuestions)
router.post('/add-answer/:id',authenticate, questionCtrl.addAnswer)
router.post('/question-vote/:id',authenticate, questionCtrl.upvoteQuestion)
router.post('/answer-vote/:questionId/:answerId',authenticate, questionCtrl.upvoteAnswer)
router.post('/unRegisterUserAskQuestion', questionCtrl.unRegisterUserAskQuestion)
module.exports=router