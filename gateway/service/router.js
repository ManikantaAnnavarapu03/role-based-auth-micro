const {Router} = require('express')

const { handleUserSignup, handleUserLogin, handleManager, handleAdmin} = require('../controller/controller')

const {validatebody, validateLoginbody} = require('../middlewares/middleware')

const validateRole = require('../middlewares/roleBased')

const validatetoken = require('../middlewares/validateToken')


const router = Router()

router.post('/signup',validatebody, handleUserSignup)

router.post('/login',validateLoginbody, handleUserLogin)

router.get('/admin',validatetoken,validateRole("admin"),handleAdmin)

router.get('/manager',validatetoken,validateRole("admin", "manager"), handleManager)

router.get('/user',validatetoken,validateRole("admin", "manager", "user"),handleAdmin)

module.exports = router