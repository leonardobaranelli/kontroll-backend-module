import Express from 'express';
import UserController from '../controllers/user.controller';
import {
  checkIdParam,
  checkUsernameParam,
} from '../middlewares/route-params.middleware';
import { isAuth } from '../middlewares/auth.middleware';

const router = Express.Router();

// GET
router.get('/', isAuth, UserController.getAll);

router.get(
  '/username/:username',
  isAuth,
  checkUsernameParam,
  UserController.getByUsername,
);

router.get('/id/:id', isAuth, checkIdParam, UserController.getById);

// POST
router.post('/register', UserController.register);

router.post('/login', UserController.login);

// PUT
router.put(
  '/username/:username',
  isAuth,
  checkUsernameParam,
  UserController.updateByUsername,
);

router.put('/id/:id', checkIdParam, UserController.updateById);

// DELETE
router.delete(
  '/all',
  //isAdmin
  isAuth,
  UserController.deleteAll,
);

router.delete(
  '/username/:username',
  //isAdmin
  isAuth,
  checkUsernameParam,
  UserController.deleteByUsername,
);

router.delete(
  '/id/:id',
  //isAdmin
  isAuth,
  checkIdParam,
  UserController.deleteById,
);

export default router;
