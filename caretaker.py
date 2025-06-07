import json
from player_list import Player_List
from match_list import Match_List
'''
Description: The caretaker saves previous states of the leaderboard.
             These states can be restored if the user makes an error.
             Each state is connected to a year.
snapshots: A dictionary connecting each year to the state of the leaderboard at the end of the year.
take_snapshot: Adds a year's snapshot to the caretaker.
revert_to_past_year: If the year is not in the caretaker an error is raised.
                     Otherwise a new player list and match list are created from the old data and returned
'''
class Caretaker():
    def __init__(self) -> None:
        self.snapshots = {}
    #takes the data and saves it to a hashmap with the year as the key
    def take_snapshot(self,year, data):
        self.snapshots[year] = data
    #raise error if year not in map, otherwise return a correct player list and tournament history
    def revert_to_past_year(self,year):
        if year not in self.snapshots:
            raise ValueError("Year cannot be returned to.\n")
        year_data = json.loads(self.snapshots[year])
        return Player_List(year_data["Players"]), Match_List(year_data["Matches"])
        