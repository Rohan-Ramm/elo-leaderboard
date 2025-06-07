from Information_Management.IExport import IExport
'''
Description: Exports the leaderboard data to a json file
See IExport for more information
'''
class JsonExport(IExport):
    
    def export_file(self, data_string):
        file_name = input("What do you want to name the data file?\n").strip()
        file_string = file_name + ".json"
        with open(file_string,"w") as file:
            file.write(data_string)
        print(self.completion_message())
            
    def completion_message(self):
        return "You have succesfully exported the data to a json file.\n"
    