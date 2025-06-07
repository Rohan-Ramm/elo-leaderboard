from Information_Management.IImport import IImport
from match_list import Match_List
from player_list import Player_List
'''
Description: Imports the leaderboard from a text file
import_file: takes substrings of all the lines in the file to extract the data
             data is converted from csv format to json format so the construction of the new player and match list works         
'''
class Text_Import(IImport):
    def completion_message(self):
        return "Text file has been imported"
    
    def import_file(self):
        matches_data = []
        players_data = {}
        file_name = input("What is the name of the file you want to import from?\n").strip()
        file_name = file_name
        with open(file_name,'r') as file:
            if (file.readline() != "Players\n"):
                raise ImportError("Text file is not readable.")
            line = file.readline()
            while(line != "\n"):
                colon_index = line.find(':')
                name = line[:colon_index]
                elo_start = line.find("Elo of ") + len("Elo of ")
                elo_end = line.find(",", elo_start)
                elo = line[elo_start:elo_end]
                max_elo_start = line.find("Maximum Elo of ",elo_end) + len("Maximum Elo of ")
                max_elo_end = line.find(",",max_elo_start)
                max_elo = line[elo_start:elo_end]
                record_start = line.find(",", max_elo_end) + 2 
                dash_index = line.find("-", record_start)
                wins = line[record_start:dash_index]
                record_end = line.find(" ", dash_index)
                losses = line[dash_index + 1:record_end]
                
                player_info = {}
                player_info["Elo"] = elo
                player_info["Wins"] = wins
                player_info["Losses"] = losses
                player_info["Max Elo"] = max_elo
                players_data[name] = player_info
                line = file.readline()
            if (file.readline() != "Matches\n"):
                raise ImportError("Text file is not readable.")
            line = file.readline()
            while(line != ""):
                during_index = line.find("During ") + len("During ")
                year_end = line.find(" ", during_index)
                year = line[during_index:year_end]
                defeated_index = line.find("defeated")
                winner = line[year_end:defeated_index].strip()
                for_index = line.find("for", defeated_index)
                loser = line[defeated_index + len("defeated"):for_index].strip()
                game_index = line.find("game", for_index)
                of_index = line.find("of", game_index)
                game_number = line[game_index + len("game"):of_index].strip()
                tournament_name = line[of_index + len("of"):].strip().rstrip(".")
                match_info = {}
                match_info["Tour"] = tournament_name
                match_info["Year"] = year
                match_info["Match Number"] = game_number
                match_info["Winner"] = winner
                match_info["Loser"] = loser
                matches_data.append(match_info)
                line = file.readline()
        self.completion_message()
        return Player_List(players_data), Match_List(matches_data)
