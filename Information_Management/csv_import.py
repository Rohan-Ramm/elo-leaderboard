from Information_Management.IImport import IImport
import os
import csv
from player_list import Player_List
from match_list import Match_List
''' 
Description: Starts up a leaderboard from a folder with two csv files
import_file: the folder name is asked for and the files are pulled from it.
             data is converted from csv format to json format so the construction of the new player and match list works
See IImport for more information         
'''
class CSV_Import(IImport):
    def import_file(self):
        matches_data = []
        players_data = {}
        file_name = input("What is the name of the folder you want to import from?\n").strip()
        player_path = os.path.join(file_name,"players.csv")
        tournament_path = os.path.join(file_name, "matches.csv")
        with open(player_path,newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                player_info = {}
                player_info["Elo"] = row["Elo"]
                player_info["Max Elo"] = row["Max Elo"]
                player_info["Wins"] = row["Wins"]
                player_info["Losses"] = row["Losses"]
                players_data[row["Name"]] = player_info
        file.close()
        with open(tournament_path,newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                match_info = {}
                match_info["Tour"] = row["Tour"]
                match_info["Year"] = row["Year"]
                match_info["Match Number"] = row["Game #"]
                match_info["Winner"] = row["Winner"]
                match_info["Loser"] = row["Loser"]
                matches_data.append(match_info)
        self.completion_message()
        return Player_List(players_data), Match_List(matches_data)
                    
                
    def completion_message(self):
        return "The CSV files have been inputted."