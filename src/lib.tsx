import Database from "@tauri-apps/plugin-sql";

function calculateNewElo(winnerElo: number, loserElo: number, kFactor = 32) {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));
  
    const newWinnerElo = Math.round(winnerElo + kFactor * (1 - expectedWinner));
    const newLoserElo = Math.round(loserElo + kFactor * (0 - expectedLoser));
  
    return { newWinnerElo, newLoserElo };
  }

async function addGame(winner: string, loser: string, tournament: string, date: string, db: Database) {
    await db.execute("INSERT OR IGNORE INTO players (name) VALUES ($1);", [winner]);
    await db.execute("INSERT OR IGNORE INTO players (name) VALUES ($1);", [loser]); 
    const currentWinnerElo = await db.select<{ elo: number }[]>(
        "SELECT elo FROM players WHERE name = $1;",
        [winner]
    );

    const currentLoserElo = await db.select<{ elo: number }[]>(
        "SELECT elo FROM players WHERE name = $1;",
        [loser]
    );
    const { newWinnerElo, newLoserElo } = calculateNewElo(currentWinnerElo[0].elo, currentLoserElo[0].elo);

    await db.execute("UPDATE players SET wins = wins + 1, elo = $2 WHERE NAME = $1",[winner,newWinnerElo])
    await db.execute("UPDATE players SET losses = losses + 1, elo = $2 WHERE NAME = $1",[loser,newLoserElo])
    await db.execute(`INSERT INTO matches (winner_id, loser_id, tournament_name, date) VALUES (
        (SELECT id FROM players WHERE name = $1),
        (SELECT id FROM PLAYERS WHERE name = $2),
        $3,
        $4
    )`,[winner,loser,tournament,date])
}

export default addGame