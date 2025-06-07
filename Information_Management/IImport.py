from abc import ABC, abstractmethod
'''
Description: Interface for the import strategy
import_file: import the file. Uses the inputted data to initalize and return a new player and match list
completion_message: informs the user the import was successful
'''
class IImport(ABC):
    
    @abstractmethod
    def import_file(self):
        pass
    
    @abstractmethod
    def completion_message(self):
        pass
        