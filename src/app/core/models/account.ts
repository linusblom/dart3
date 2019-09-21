export interface Account {
  created: number;
  currentGame: string;
  currentJackpot: string;
  permissions: Permission[];
  jackpot: Jackpot;
}

export interface Jackpot {
  value: number;
  next: number;
  started: number;
  ended: number;
  playerId: string;
}

export enum Permission {
  CORE_ACCOUNT_WRITE = 'core:account:write',
  CORE_PASSWORD_WRITE = 'core:password:write',
  CORE_TOTAL_CREDITS_READ = 'core:total-credits:read',
  GAME_BET_10 = 'game:bet:10',
  GAME_BET_20 = 'game:bet:20',
  GAME_BET_50 = 'game:bet:50',
  GAME_BET_100 = 'game:bet:100',
  GAME_BET_200 = 'game:bet:200',
  GAME_BET_500 = 'game:bet:500',
  GAME_TYPE_HALVEIT = 'game:type:halveit',
  GAME_TYPE_LEGS = 'game:type:legs',
  GAME_TYPE_LEGS_CLASSIC = 'game:type:legs-classic',
  GAME_TYPE_THREEHUNDREDONE = 'game:type:three-hundred-one',
  GAME_DEV_CONTROLS = 'game:dev:controls',
}
