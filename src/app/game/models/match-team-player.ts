import { MatchTeam, Player } from 'dart3-sdk';

export interface MatchTeamPlayer extends MatchTeam {
  players: Player[];
}
