from match import Match
from player_list import Player_List
import json
'''
Description: An object managing all the matches entered into the leaderboard.
matches: a list of all the matches in the leaderboard
tournament: a hashmap containing every tournament that has a match
            the names are the key, the number of matches played in the tournament is in the value
init: parameters are only passed when reconstructing the leaderboard from a file
add_match: takes in match data, updates tournaments, creates the actual match object for the match, and then adds it to matches
'''
class Match_List():
    def __init__(self,creation_info=None) -> None:
        self._matches = []
        self._tournaments = {}
        if creation_info:
            for match in creation_info:
                tournament_name = match["Tour"]
                if tournament_name in self._tournaments:
                    self._tournaments[tournament_name] += 1
                else:
                    self._tournaments[tournament_name] = 1
                match_number = self._tournaments[tournament_name]
                new_match = Match(match["Winner"],match["Loser"],match_number,match["Year"],tournament_name,False)
                self._matches.append(new_match)
    
    def add_match(self,winner,loser,year,tournament_name):
        if tournament_name in self._tournaments:
            self._tournaments[tournament_name] += 1
        else:
            self._tournaments[tournament_name] = 1
        match_number = self._tournaments[tournament_name]
        new_match = Match(winner,loser,match_number,year,tournament_name)
        self._matches.append(new_match)
    
    def print_data(self):
        data = self.get_data()
        return json.dumps(data,indent=1)
    
    def get_data(self):
        matches_data = []
        for match in self._matches:
            match_data = json.loads(match.print_data())
            matches_data.append(match_data)
        return matches_data
        
    