import Database from "@tauri-apps/plugin-sql";

type PlayerDisplay = {
    id: number;
    name: string;
    wins: number;
    losses: number;
    elo: number;
  };

type MatchDisplay = {
    outcome: string,
    opponent: string;
    tournament_name: string;
    date: string;
}

export type {PlayerDisplay as Player,MatchDisplay as PlayerMatch};