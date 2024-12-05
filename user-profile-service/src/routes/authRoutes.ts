import express from 'express';
// import  getProfile from '../controllers';
import {updateProfile,getProfile,changePassword, deleteAccount} from "../controllers/UserProfile"

const router = express.Router();

router.get('/:userId', getProfile);
router.patch('/:userId', updateProfile);
router.post('/:userId/password', changePassword);
router.delete('/:userId', deleteAccount);

export default router;