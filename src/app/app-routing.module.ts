import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompoundsComponent } from './compounds/compounds.component';
import { ModelListComponent } from './model-list/model-list.component';

const routes: Routes = [
  {path: '**',redirectTo:''}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
