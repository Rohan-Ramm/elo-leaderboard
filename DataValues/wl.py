from DataValues.i_data_value import I_Data_Value
'''
Description: Updates the wins and losses based on the result of the game.
init: parameters are only passed reconstructing the leaderboard from a file
See i_data_value for more details
'''
class WL(I_Data_Value):
    def __init__(self,start_wins=0,start_losses=0):
        self.wins = start_wins
        self.losses = start_losses
    def update(self,result,opponent):
        if result == 1.0:
            self.wins += 1
        elif result == 0.5:
            self.wins += 0.5
            self.losses += 0.5
        elif result == 0:
            self.losses += 1
        else:
            raise ValueError("Incorrect Result")
  
    def get_data(self):
        data = {}
        data["Wins"] = self.wins
        data["Losses"] = self.losses
        return data