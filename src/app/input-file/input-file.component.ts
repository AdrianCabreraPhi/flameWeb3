
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { Compound, Model } from '../Globals';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss']
})
export class InputFileComponent implements OnInit {

  isValidSDFile: boolean = false;
  fileContent: any;
  file = undefined;
  constructor(public model: Model,public compound: Compound,private commonService: CommonService,private toastr: ToastrService) { }
  ngOnInit(): void {

  }
  Save(){
    this.commonService.isValidCompound$.emit(true);
    this.commonService.currentSelection$.emit({'option':'Input File','name':this.compound.file_info['name']});
    this.compound.input_file = {'name': this.compound.file_info['name'] ,'result':this.file}
    this.cleanOtherOptions();
    var modeltab =  document.getElementById('build-tab-line');
    modeltab.click();
    this.toastr.success('Successfully', 'Save '+this.compound.file_info['name'], {
     timeOut: 5000, positionClass: 'toast-top-right'
   });

   }
   public change(event): void {
    const file:File = event.target.files[0];
    if(file) this.file = file;
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
        //var listNameMols = self.fileContent.matchAll(/<name>\s+(.+)\s*/ig)
        self.compound.file_info['num_mols'] = (self.fileContent.match(/(\$\$\$\$)/g) || []).length;
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
  cleanOtherOptions(){
    this.compound.input_list = undefined;
    this.compound.sketchstructure = undefined
  }
}
