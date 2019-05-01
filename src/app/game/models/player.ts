export interface Player {
  id: string;
  name: string;
  credits: number;
  xp: number;
}

export const makePlayer = (values: Partial<Player> = {}) => ({
  id: '',
  name: '',
  credits: 0,
  xp: 0,
  ...values,
});
