import * as admin from 'firebase-admin';

admin.initializeApp();

export { onCreate as onCreateAuthUser } from './auth/onCreate';
export { onCreate as onCreatePlayer } from './player/onCreate';
export { onCreate as onCreateGame } from './game/onCreate';
export { onUpdate as onUpdateGame } from './game/onUpdate';
export { onCreate as onCreateJackpot } from './jackpot/onCreate';
