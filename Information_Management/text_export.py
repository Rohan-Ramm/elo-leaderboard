from Information_Management.IExport import IExport
import json 
'''
Description: Exports the leaderboard to a text file
See IExport for more information
'''
class Text_Export(IExport):
    def export_file(self, data_string):
        file_name = input("What do you want to name the data file?\n").strip()
        file_string = file_name + ".txt"
        data = json.loads(data_string)
        with open(file_string,"w") as file:
            file.write("Players:")
            file.write("\n")
            for name,stats in data["Players"].items():
                file.write(f"{name}: Elo of {stats["Elo"]}, Maximum Elo of {stats["Max Elo"]}, {stats["Wins"]}-{stats["Losses"]} record \n")
            file.write("\n")
            file.write("Matches:")
            file.write("\n")
            for match in data["Matches"]:
                file.write(f"During {match["Year"]} {match["Winner"]} defeated {match["Loser"]} for game {match["Match Number"]} of {match["Tour"]}.\n")
        print(self.completion_message())
    
    def completion_message(self):
        return "You have succesfully exported the data to a text file.\n"
    
    