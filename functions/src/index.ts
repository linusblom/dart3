import * as admin from 'firebase-admin';

admin.initializeApp();

export { authOnCreate } from './auth/onCreate';
export { playerOnCreate } from './player/onCreate';