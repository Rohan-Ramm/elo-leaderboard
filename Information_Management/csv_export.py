from Information_Management.IExport import IExport
import os
import csv
import json
'''
Description: Instead of creating one file, this export strategy creates a folder and stores the data in two files with in it
             This is necessary because the data should be displayed with two spreadsheets
export_file: lets the user decide the folder name, the file names are predecided
_export_player_list: Exports the player data to one spreadsheet
_export_tournament_list: Exports the match data to one spreadsheet
See IExport for more information
'''
class CSV_Export(IExport):
    
    def export_file(self,data_string):
        file_name = input("What do you want to name the data folder?\n").strip()
        os.makedirs(file_name,exist_ok=True)
        data = json.loads(data_string)
        self._export_player_list(file_name,data["Players"])
        self._export_tournament_list(file_name,data["Matches"])
    
    def completion_message(self):
        return "You have succesfully exported the data to several csv files.\n"
    
    def _export_player_list(self,file_path,data):
        with open(os.path.join(file_path, "players.csv"),mode='w',newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["Name", "Elo","Max Elo", "Wins", "Losses"])
            for name, stats in data.items():
                writer.writerow([name, stats["Elo"], stats["Max Elo"],stats["Wins"], stats["Losses"]])
    
    def _export_tournament_list(self,file_path,data):
        with open(os.path.join(file_path, "matches.csv"),mode='w',newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["Tour","Year","Game #", "Winner", "Loser"])
            for match in data:
                writer.writerow([match["Tour"],match["Year"],match["Match Number"],match["Winner"],match["Loser"]])
        
        