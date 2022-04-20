import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { Model, Globals,Compound } from '../Globals';
@Component({
  selector: 'app-compounds',
  templateUrl: './compounds.component.html',
  styleUrls: ['./compounds.component.scss']
})
export class CompoundsComponent implements OnInit {
  fileContent: any;
  num_of_mols = 0;
  type_file: string;
  listNameMols: [];
  isValidSDFile: boolean = false;
  

  constructor(public model: Model,private commonService: CommonService,public globals:Globals,public compound: Compound,private toastr: ToastrService) { }


  ngOnInit(): void {
 
  }
  currentTab(event){
   this.commonService.currentCompoundTab.emit(event.target.id);
  }

  Save(){
   this.commonService.isValidCompound$.emit(true);
   var modeltab =  document.getElementById('build-tab-line');
   modeltab.click();
   this.toastr.success('Successfully', 'Save '+this.compound.file_info['name'], {
    timeOut: 5000, positionClass: 'toast-top-right'
  });
  }

  public change(event): void {
    
    const file:File = event.target.files[0];
    if(file) this.compound.file = file;
    this.compound.file_info = {};
    this.compound.file_info['name'] = file.name;
    this.compound.file_info['size_M'] = ((file.size / 1024) / 1024).toFixed(2);
    const extension = file.name.split('.');
    this.compound.file_info['type_file'] = extension[1];
    const fileReader: FileReader = new FileReader();
    const self = this;

    // for SDFiles only.
    if (this.compound.file_info['type_file'] == 'sdf') {
      this.isValidSDFile = true;
      fileReader.onloadend = function(x) {
        self.fileContent = fileReader.result;
        var listNameMols = self.fileContent.matchAll(/<name>\s+(.+)\s*/ig)
        self.compound.file_info['num_mols'] = (self.fileContent.match(/(\$\$\$\$)/g) || []).length;
        listNameMols = Array.from(listNameMols).sort();
        self.listNameMols = listNameMols.reduce((acc,el) => acc.concat(el[1]),[])// reduce the arrays to one with the names only
        const res_array = self.fileContent.match(/>( )*<(.*)>/g);
        const res_dict = {};
        for (const variable of res_array) {
          const value = variable.replace(/[<> ]*/g, '');
          if (value in res_dict) {
            res_dict[value] = res_dict[value] + 1;
          }
          else {
            res_dict[value] = 1;
          }
        }
        self.compound.file_fields = res_dict; 
      }
      fileReader.readAsText(file);
    }
   
   
  }

}
