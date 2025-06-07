from player import Player
import json
'''
Description: The class for a match. 
             Takes in both players, the match number, the year, and the tournament name. 
             Updates both players with the result of the match.
init: if new is true then this is a new match and both players need to have their data updated.
      if new is false then this is an old match being imported and the players do not need to be updated, and in fact
      only strings have been passed in. 

'''
class Match():
    def __init__(self,winner,loser,match_number,year,tournament_name,new=True):
        if new:
            winner.update(1.0,loser)
            loser.update(0.0,winner)
            self.winner = winner.get_name()
            self.loser = loser.get_name()
            self.number = match_number
            self.year = year
            self.tournament_name = tournament_name
        else:
            self.winner = winner
            self.loser = loser
            self.number = match_number
            self.year = year
            self.tournament_name = tournament_name
    def get_data(self):
        data = {}
        data["Tour"] = self.tournament_name
        data["Year"] = self.year
        data["Match Number"] = self.number
        data["Winner"] = self.winner
        data["Loser"] = self.loser
        return data
    def print_data(self):
        data = self.get_data()
        return json.dumps(data,indent=1)
        

if __name__=="__main__":
    player1 = Player("Player1")
    player2 = Player("Player2")
    match1 = Match(player1,player2)
    print(player1.print_data())
    print(player2.print_data())
    print(match1.print_data())
        
        