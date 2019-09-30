import { GamePlayer } from '@game/models';
import { Player } from '@player/models';

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
