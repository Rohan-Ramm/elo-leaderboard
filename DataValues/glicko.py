from DataValues.i_data_value import I_Data_Value
import json
#r = 0.5
'''
Description: Glicko is a form of player rankings that fixes some of the issues with elo.
             Glicko has not yet been implemented for this leaderboard.
'''
class Glicko(I_Data_Value):
    def __init__(self):
        self.rating = 1500
        self.deviation = 350
        self.volatility = 0.06
    def update(self,result,opponent):
        self.elo = self.__new_elo(opponent.elo,result)
    def print_data(self):
        data = {}
        data["Elo:"] = self.elo
        return json.dumps(data)
    def __expected_score(self,opponent_elo):
        difference = 10 ** ((opponent_elo - self.elo) / 400)
        return 1 / (1 + difference)
    def __new_elo(self,opponent_elo,result,significance=32):
        e_score = self.__expected_score(opponent_elo)
        return self.elo + significance * (result - e_score)
    