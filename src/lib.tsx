import Database from "@tauri-apps/plugin-sql";

type PlayerDisplay = {
    id: number;
    name: string;
    wins: number;
    losses: number;
    elo: number;
  };

type MatchDisplay = {
    winner_name: string,
    loser_name: string;
    tournament_name: string;
    date: string;
}

export type {PlayerDisplay as Player,MatchDisplay as Match};