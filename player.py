from DataValues.i_data_value import I_Data_Value
from DataValues.elo import Elo
from DataValues.wl import WL
import json
'''
Description: Represents a player on the leaderboard
init: parameters are only passed when reconstructing the leaderboard from a file
update: updates all the data values within the player
'''
class Player():
    def __init__(self,name,creation_info=None):
        self._name = name
        self.data: list[I_Data_Value]
        if creation_info == None:
            self.data = [Elo(), WL()]
        else:
            self.data = [Elo(creation_info["Elo"],creation_info["Max Elo"]), WL(creation_info["Wins"],creation_info["Losses"])]
    def update(self,result,opponent):
        for self_metric, opp_metric in zip(self.data, opponent.data):
            self_metric.update(result, opp_metric)
    def print_data(self):
        data = self.get_data()
        return json.dumps(data,indent=1)
    def get_data(self):
        data = {}
        output = {}
        for n in self.data:
            n_dict = json.loads(n.print_data())
            for key,value in n_dict.items():
                data[key] = value
        output[self._name] = data
        return output
    def get_name(self):
        return self._name

if __name__=="__main__":
    player1 = Player("Player1")
    player2 = Player("Player2")
    player1.update(1.0,player2)
    player2.update(0,player1)
    print(player1.print_data())
    print(player2.print_data())