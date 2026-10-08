# Elo Leaderboard
## Overview
This program is a continually updating leaderboard for sports leagues. All the user has to do enter in a matches result, players, date, and tournament and the database is updated. The database consists of a list of players and a list of matches. Each match has a date, tournament, match number, and result. Each player has a name, a win loss record, and an [elo rating](https://en.wikipedia.org/wiki/Elo_rating_system). Leaderboards can be saved by being exported to a file and imported in at a later point. Users can fix errors by reverting to the leaderboard of a past year. 
## How to Use
Create a leaderboard for a sports league by adding in match statistics. To update the leaderboard add matches. To check that the leaderboard is correct print the data. The settings allow you to change the way you input data and how the system responds to said data. Once you are done adding matches export the leaderboard to text, csv, or json. Any exported leaderboard can be imported back into the program to be updated.
## Example

Let's create a leaderboard for NFL teams. We'll start by adding a match. To add a match we need to provide the match's winner, loser, tournament, and its date (in YYYY-MM-DD).


<img src="images/add-game-demo.png" height=350px></img>


Matches can be added all at once in addition to one at a time.


<img src="images/add-game-multiple-1.png" height=350px></img>


When adding multiple matches at a time you can pre-set a common tournament.

<img src="images/add-game-multiple-2.png" height=350px></img>

After we've added a couple matches we can view the player leaderboard to see who's on top.

<img src="images/view-leaderboard-demo.png" height=350px></img>

We can also look up individual players or teams through the find player tab.


<img src="images/find-player-demo.png" height=350px></img>

Data can be shared through both CSV and JSON exports. Any instance of the leaderboard app can receive an input from another input. Additionally, csv data can be displayed for general viewing in google sheets. 


<img src="images/export-league-demo.png" height=400px></img>
<img src="images/csv-display-demo.png" height=400px></img>