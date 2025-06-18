import json
from player_list import Player_List
from match_list import Match_List
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from database import Database
'''
Description: The caretaker saves previous states of the leaderboard.
             These states can be restored if the user makes an error.
             Each state is connected to a year.
snapshots: A dictionary connecting each year to the state of the leaderboard at the end of the year.
database: a back reference to the database
take_snapshot: Adds a year's snapshot to the caretaker.
revert_to_past_year: If the year is not in the caretaker an error is raised.
                     Otherwise a new player list and match list are created from the old data and returned
'''
class Caretaker():
    def __init__(self,database) -> None:
        self.snapshots = {}
        self.database = database
    #takes the data and saves it to a hashmap with the year as the key
    def take_snapshot(self,year, data):
        self.snapshots[year] = data
        
    def revert_to_past_year(self,year):
        while True:
            try:
                print("Saved Years:")
                for year in self.snapshots.keys():
                    print(f"\t-{year}")
                past_year = int(input("What year do you want to roll back to? \n").strip())
                if year not in self.snapshots:
                    break
                print("This year cannot be returned to.")
            except:
                print("Invalid input. Please enter an integer.")
        year_data = json.loads(self.snapshots[year])
        self.database.players, self.database.matches =  Player_List(year_data["Players"]), Match_List(year_data["Matches"])
        self.database.current_year = past_year
        