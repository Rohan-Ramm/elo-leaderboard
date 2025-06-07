from abc import ABC, abstractmethod
'''
Description: Interface for the export strategy
export_file: export the file
completion_message: informs the user the export was successful
'''
class IExport(ABC):
    
    @abstractmethod
    def export_file(self,file_name,data_string):
        pass
    
    @abstractmethod
    def completion_message(self):
        pass
        