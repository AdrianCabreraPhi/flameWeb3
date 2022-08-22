import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Model, Prediction, Globals, Compound } from './Globals';
import { ModelListComponent } from './model-list/model-list.component';
import { CompoundsComponent } from './compounds/compounds.component';
import { ValidationsComponent } from './validations/validations.component';
import { QualitConformalComponent } from './qualit-conformal/qualit-conformal.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { ConfusionMatrixComponent } from './confusion-matrix/confusion-matrix.component';
import { QuantitConformalComponent } from './quantit-conformal/quantit-conformal.component';
import { SketchStructureComponent } from './sketch-structure/sketch-structure.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ModelSelectedInfoComponent } from './model-selected-info/model-selected-info.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManageModelsComponent } from './manage-models/manage-models.component';
import { InputFileComponent } from './input-file/input-file.component';
import { InputListComponent } from './input-list/input-list.component';
import { PredictionComponent } from './prediction/prediction.component';
import { PredictButtonComponent } from './predict-button/predict-button.component';
import { AngularSplitModule } from 'angular-split';
import { ProfileSummaryComponent } from './profile-summary/profile-summary.component';
import { SelectorComponent } from './selector/selector.component';
import { CurrentSelectionComponent } from './current-selection/current-selection.component';
import { SaveProfileButtonComponent } from './save-profile-button/save-profile-button.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    ModelListComponent,
    CompoundsComponent,
    ValidationsComponent,
    QualitConformalComponent,
    ConfusionMatrixComponent,
    QuantitConformalComponent,
    SketchStructureComponent,
    ModelSelectedInfoComponent,
    ManageModelsComponent,
    InputFileComponent,
    InputListComponent,
    PredictionComponent,
    PredictButtonComponent,
    ProfileSummaryComponent,
    SelectorComponent,
    CurrentSelectionComponent,
    SaveProfileButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PlotlyModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    AngularSplitModule
  ],
  providers: [Model, Prediction, Globals,Compound],
  bootstrap: [AppComponent]
})
export class AppModule { }
