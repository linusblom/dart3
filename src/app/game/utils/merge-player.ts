import { GamePlayer, Player } from 'dart3-sdk';

export const mergePlayer = (
  gamePlayers: Omit<GamePlayer, 'base'>[],
  players: Player[],
): GamePlayer[] =>
  gamePlayers.map(gamePlayer => {
    const { name, xp, color, avatarUrl } = players.find(player => player.id === gamePlayer.id);
    return {
      ...gamePlayer,
      base: {
        name,
        xp,
        color,
        avatarUrl,
      },
    };
  });
