from DataValues.i_data_value import I_Data_Value
import json
'''
Description: The player's elo score.
elo: The player's elo. Starts at 1000.
max_elo: The highest elo the player has ever achieved.
_expected score: Calculates the expected result based on the elo of both players
_new_elo: The significance is pre-set to 80. 
          Based on the expected result and 
          how it differs from the real result the player's elo is updated. 
init: parameters are only passed reconstructing the leaderboard from a file
See i_data_value for more details
'''
class Elo(I_Data_Value):
    def __init__(self,start_elo=1000,max_elo=1000):
        self.elo = start_elo
        self.max_elo = max_elo

    def update(self, result, opponent):
        opp_data = opponent.get_data()
        opp_elo = opp_data["Elo"]
        self.elo = self.__new_elo(opp_elo, result) 
        self.elo = round(self.elo,2)
        self.max_elo = max(self.elo,self.max_elo)
    
    def get_data(self):
        return {"Elo": self.elo, "Max Elo": self.max_elo}

    def __expected_score(self, opponent_elo):
        difference = 10 ** ((opponent_elo - self.elo) / 400)
        return 1 / (1 + difference)

    def __new_elo(self, opponent_elo, result, significance=80):
        e_score = self.__expected_score(opponent_elo)
        return self.elo + significance * (result - e_score)
