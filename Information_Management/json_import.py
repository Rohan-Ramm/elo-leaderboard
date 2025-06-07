from Information_Management.IImport import IImport
import json
from player_list import Player_List
from match_list import Match_List
'''
Description: Imports the leaderboard from a json file
See IImport for more information
'''
class JsonImport(IImport):
    def import_file(self):
        file_name = input("What is the name of the file you want to import from?\n").strip()
        try:
            with open(file_name, 'r') as file:
                data = json.load(file)
            return Player_List(data["Players"]), Match_List(data["Matches"])
        except FileNotFoundError:
            print("File not found.")
            return Player_List(), {}
    
    def completion_message(self):
        return "The json file has been imported."