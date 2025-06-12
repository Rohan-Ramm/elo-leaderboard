#facade
#create a player list singleton
#implement strategy pattern
from match_list import Match_List
from player_list import Player_List
import json
from Information_Management.json_import import JsonImport
from Information_Management.json_export import JsonExport
from Information_Management.csv_import import CSV_Import
from Information_Management.csv_export import CSV_Export
from Information_Management.text_import import Text_Import
from Information_Management.text_export import Text_Export
from caretaker import Caretaker
'''
Description: The facade that runs the entire program
players: The database's player list
matches: The database's match list
import_strategy: The strategy used to import data
export_strategy: The strategy used to export data
caretaker: the object saving previous states of the database
current_year: the year the database is in
start: Prints the start menu and lets the user decide if they want to stop the program, load an old database or start a new database
cycle: Prints the main menu and asks the user what they want to do
secure_confirmation: Doublechecks that the user wants to save, calls console_output, then checks again
console_output: prints out the database in a human readable format
add_games: updates the leaderboard with information from a new match
           if the year has changed, saves the past year's data
           makes sure the year doesn't go back
'''
class Database():
    def __init__(self,current_year=0):
        self.players = Player_List()
        self.current_year = current_year
        self.import_strategy = JsonImport()
        self.export_strategy = JsonExport()
        self.caretaker = Caretaker() 
        self.matches = Match_List()
        self.mass_entry = False
    
    
    def start(self):
        print("Main Menu")
        print("Start new database (1)")
        print("Load database from file (2)")
        choice = int(input("Quit (3) \n"))
        #switch
        while choice != 1 and choice != 2 and choice != 3:
            print("Invalid Input")
            choice = int(input("Enter a valid input \n"))
        if choice == 2:
            print("What type of file(s) do you want to import from?")
            print("Json (1)")
            print("CSV (2)")
            print("Plain Text (3)")
            choice = int(input("What do you choose? \n"))
            while choice < 1 or choice > 3:
                print("Invalid Input")
                choice = int(input("Enter a valid input \n"))
            if choice == 1:
                self.import_strategy = JsonImport()
            elif choice == 2:
                self.import_strategy = CSV_Import()
            else:
                self.import_strategy = Text_Import()
            self.players, self.matches = self.import_strategy.import_file()
        elif choice == 3:
            return
        continuing = True
        while continuing:
            continuing = self.cycle()
    def cycle(self):
        result = True
        print("Menu")
        print("Add games (1)")
        print("Save (2)")
        print("Save and Exit (3)")
        print("Roll back to last year (4)")
        print("Print leaderboard (5)")
        print("Print All Data (6)")
        print("Change Settings (7)")
        print("Exit (8)")
        choice = int(input("What do you choose? \n"))
        while choice < 1 or choice > 8:
            print("Invalid Input")
            choice = int(input("Enter a valid input \n"))
        if choice == 1:
            self.add_games()
        elif choice == 2:
            #Ask for export strategy
            print("What type of file(s) do you want to export to?")
            print("Json (1)")
            print("CSV (2)")
            print("Plain Text (3)")
            choice = int(input("What do you choose? \n"))
            while choice < 1 or choice > 3:
                print("Invalid Input")
                choice = int(input("Enter a valid input \n"))
            if choice == 1:
                self.export_strategy = JsonExport()
            elif choice == 2:
                self.export_strategy = CSV_Export()
            else:
                self.export_strategy = Text_Export()
            self.export_strategy.export_file(self.get_data())
        elif choice == 3:
            #Ask for export strategy
            confirmation = self.secure_confimation()
            if confirmation:
                print("What type of file(s) do you want to export to?")
                print("Json (1)")
                print("CSV (2)")
                print("Plain Text (3)")
                choice = int(input("What do you choose? \n"))
                while choice < 1 or choice > 3:
                    print("Invalid Input")
                    choice = int(input("Enter a valid input \n"))
                if choice == 1:
                    self.export_strategy = JsonExport()
                elif choice == 2:
                    self.export_strategy = CSV_Export()
                else:
                    self.export_strategy = Text_Export()
                self.export_strategy.export_file(self.get_data())
                result = False
        elif choice == 4:
            past_year = int(input("What year do you want to roll back to? \n").strip())
            try:
                self.players, self.matches = self.caretaker.revert_to_past_year(past_year)
                self.current_year = past_year
            except:
                print("This is not a valid year.\n Please enter a year in which tournaments occur. \n")
            #for verification ask the user if they want to print
        elif choice == 5:
            category = input("What category should the leaderboard be sorted based on?").strip()
            while category != "elo" and category != "wins" and "alphabetic":
                print("Invalid Input")
                category = input("Enter a valid input \n").strip()
            player_count = int(input("How many players should the leaderboard contain?"))
            while player_count > self.players.get_length() or player_count < 0:
                print("The input must be less than the player count and greater than zero.")
                player_count = int(print("Enter a valid number of players \n"))
            sorted_data = self.players.get_sorted_data(category,player_count)
            print(sorted_data)
            #output the data in text form, using json to text function
        elif choice == 6:
            self.console_output()
        elif choice == 7:
            self.settings_menu()
        elif choice == 8:
            result = False
        return result
    def get_data(self):
        data = {}
        data["Players"] = json.loads(self.players.print_data())
        data["Matches"] = json.loads(self.matches.print_data())
        return json.dumps(data,indent=1)
    def secure_confimation(self):
        print("Once you exit you will no longer be able to roll back to past years.")
        print("Are you sure you want to save and exit?")
        confirmation = input("Enter y for yes and n for no.\n").strip()
        while confirmation != 'y' and confirmation != 'n':
                confirmation = input("Invalid Input. \nPrint y for yes, print n for no.\n").strip()
        if confirmation == 'n':
            return False
        self.console_output()
        confirmation = input("Does this information look correct? \n Enter y for yes and n for no.\n").strip()
        while confirmation != 'y' and confirmation != 'n':
            confirmation = input("Invalid Input. \nPrint y for yes, print n for no.\n").strip()
        if confirmation == 'n':
            return False
        elif confirmation == 'y':
            return True
    def add_games(self):
        ongoing = True
        while ongoing:
            print(f"Okay, let's start inputting match data.")
            w_name = input("Who won this match?\n").strip()
            l_name = input("Who lost this match?\n").strip()
            tournament_name = input("What is the name of the tournament this match was played in? \n").strip()
            tournament_year = int(input("What year was this match played? \n").strip())
            while (tournament_year < self.current_year):
                print("Matches cannot be entered out of order.")
                print("If you entered data out of order press (1) to stop adding matches.\n After that use the rollback feature in the main menu to fix your data.")
                result = input("If you made a typo while entering the year press any other button. You will be given the opportunity to reinput the year.\n").strip()
                if result == '1':
                    return
                tournament_year = int(input("What year was this match played? \n").strip())
            if (tournament_year > self.current_year):
                print("New Year")
                self.caretaker.take_snapshot(self.current_year,self.get_data())
                self.current_year = tournament_year
            winner = self.players.get_player(w_name)
            loser = self.players.get_player(l_name)
            self.matches.add_match(winner,loser,tournament_year,tournament_name)
            print("Match has been added.")
            confirmation = input("Are there any more matches? \nPrint y for yes, print n for no.\n").strip()
            while confirmation != 'y' and confirmation != 'n':
                confirmation = input("Invalid Input. \nPrint y for yes, print n for no.\n").strip()
            ongoing = confirmation == 'y'
        
    def console_output(self):
        print()
        data = json.loads(self.get_data())
        print("Players:")
        for name,stats in data["Players"].items():
            print(f"{name}: Elo of {stats["Elo"]}, Maximum Elo of {stats["Max Elo"]}, {stats["Wins"]}-{stats["Losses"]} record")
        print("Matches:")
        for match in data["Matches"]:
            print(f"During {match["Year"]} {match["Winner"]} defeated {match["Loser"]} for game {match["Match Number"]} of {match["Tour"]}.")
        print()
        
    def settings_menu(self):
        print("Change Input Strategy (1)")
        if self.players.checks_duplicates:
            print("Remove duplicate player checking (2)")
        else:
            print("Add duplicate player checking (2)")
        choice = int(input())
        if choice == 1:
            pass
        elif choice == 2:
            self.players.checks_duplicates = not self.players.checks_duplicates
        
        
    
    

if __name__ == "__main__":
    system = Database()
    system.start()
    
