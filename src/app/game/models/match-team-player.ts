import { MatchTeam, Player, RoundHit } from 'dart3-sdk';

export interface MatchTeamPlayer extends MatchTeam {
  players: Player[];
  hits: RoundHit[];
}
