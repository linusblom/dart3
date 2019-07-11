import { GameType } from '@game/models';

export interface Account {
  created: number;
  jackpot: number;
  hiddenJackpot: number;
  currentGame: string;
  permissions: Permission[];
}

export enum Permission {
  CORE_ACCOUNT_WRITE = 'core:account:write',
  CORE_PASSWORD_WRITE = 'core:password:write',
  GAME_BET_10 = 'game:bet:10',
  GAME_BET_20 = 'game:bet:20',
  GAME_BET_50 = 'game:bet:50',
  GAME_BET_100 = 'game:bet:100',
  GAME_BET_200 = 'game:bet:200',
  GAME_BET_500 = 'game:bet:500',
  GAME_TYPE_HALVEIT = 'game:type:halveit',
  GAME_TYPE_LEGS = 'game:type:legs',
  GAME_TYPE_THREEHUNDREDONE = 'game:type:threehundredone',
}
