from abc import ABC, abstractmethod
import json
'''
Description: This is an interface for the player data values.
Update: Updates the stat based on what occured in the match and the opponent
Get_Data: Creates a json string containing all relevant data 
Print_Data: Return the created json string 
''' 
class I_Data_Value(ABC):
    @abstractmethod
    def update(self,result,opponent):
        pass
    
    def print_data(self):
        data = self.get_data()
        return json.dumps(data,indent=1)
    
    @abstractmethod
    def get_data(self):
        pass