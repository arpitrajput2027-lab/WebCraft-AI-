import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import { changeWebsite, deleteWebsite, generateWebsite, getAllWebsite, getWebsiteById, renameWebsite } from '../controllers/websiteController.js'


const router = express.Router()

router.post('/generate', isAuthenticated, generateWebsite)
router.post('/update/:id', isAuthenticated, changeWebsite)
router.get('/getbyid/:id', isAuthenticated, getWebsiteById)
router.get('/getall', isAuthenticated, getAllWebsite)
router.delete('/delete/:id', isAuthenticated, deleteWebsite)
router.patch('/rename/:id', isAuthenticated, renameWebsite)

export default router