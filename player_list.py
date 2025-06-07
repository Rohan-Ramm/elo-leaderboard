from player import Player
import json
from match import Match
'''
Description: An object managing all the players within the database.
init: parameters are only passed when reconstructing the leaderboard from a file
.player_list: a dictionary where the player name is the key and the actual player object is the value
add_player: takes a name. Creates a new player with that name and adds them to that list and then returns True.
            Double checks this is actually a new player not a typo, if it is a typo returns False.
get_player: takes in a name. If there is already a player with that name it gets that player.
            If not it calls add_player. If add_player returns false it prompts the user for a new name and checks for that.
get_sorted_data: Lets the player decide what to sort by and how many players to sort.
                 Then returns a list sorted based on that data.
                 Not used for much at the moment.
            
'''
class Player_List():
    def __init__(self,creation_info=None):
        self._player_list = {}
        if creation_info:
            for player in creation_info.keys():
                self._player_list[player] = Player(player,creation_info[player])
    def add_player(self,name):
        confirm = 'x'
        while confirm != 'n' and confirm != 'y':
            confirm = input("The name " + name + " is not known to the system. Is this a new player? \nPress y for yes and n for no.\n").strip()
        if confirm == 'n':
            return False
        new_player = Player(name)
        self._player_list[name] = new_player
        return True
    def in_list(self,name):
        return name in self._player_list
    def print_data(self):
        data = self.get_data()
        return json.dumps(data,indent=1)
    def get_data(self):
        data = {}
        for player_name in self._player_list.keys():
            data[player_name] = json.loads(self._player_list[player_name].print_data())[player_name]
        return data
    def get_player(self,name):
        added = False
        while not added:
            if self.in_list(name):
                added = True
            else:
                added = self.add_player(name)
                if not added:
                    name = input("Then what is the actual name?\n").strip()
        return self._player_list[name]
    
    def get_sorted_data(self,category="elo",player_count=10):
        sorted_data = self._create_sorted_data(category,player_count)
        data = []
        for player in sorted_data:
            data.append(json.loads(player.print_data()))
        return json.dumps(data,indent=1)
    def _create_sorted_data(self,category,player_count):
        sorted_data = []
        if category == "elo":
            sorted_data = self._sort_on_elo(player_count)
        elif category == "wins":
            sorted_data = self._sort_on_wins(player_count)
        else:
            sorted_data = self._sort_alphabetically(player_count)
        return sorted_data
    
    def _sort_on_elo(self,player_count):
        sorted_players = sorted(self._player_list.values(),key=lambda value: json.loads(value.print_data())[value.get_name()]["Elo"],reverse=True)
        return sorted_players[0:player_count]
    def _sort_on_wins(self,player_count):
        sorted_players = sorted(self._player_list.values(),key=lambda value: json.loads(value.print_data())[value.get_name()]["Wins"],reverse=True)
        return sorted_players[0:player_count]
    def _sort_alphabetically(self,player_count):
        alph_sorted_dict = dict(sorted(self._player_list.items()))
        sorted_players = alph_sorted_dict.values()
        return sorted_players[0:player_count]
    def get_length(self):
        return len(self._player_list.values())
                          
if __name__=="__main__":
    
    player_list = Player_List()
    test_player1 = player_list.get_player("player1")
    test_player2 =  player_list.get_player("player2")
    test_player3 = player_list.get_player("player3")
    print(player_list.print_data())
    #print(test_player1.print_data())
    #print(test_player2.print_data())
    #print(test_player3.print_data())  
    Match(test_player3,test_player2)
    Match(test_player3,test_player1)
    print(player_list.print_data())
    print(player_list.get_sorted_data())
    '''
    d = {2:3, 1:89, 4:5, 3:0}
    test = dict(sorted(d.items()))
    print(test.values())
    sorted_dict = {}
    for key in sorted(d, key=d.get):
        sorted_dict[key] = d[key]
    print(sorted_dict)
    #sorted_list = []
    #for val in sorted(d):
        #sorted_list.append(val)
    #print(sorted_list)
    e = sorted(d)
    print(e)
    list_d ={2:["a",42],3:['c',37],5:['b',100]}
    list_ds1 = sorted(list_d.values(), key=lambda value:value[1])
    print(list_ds1)
    '''
    
    
            
            