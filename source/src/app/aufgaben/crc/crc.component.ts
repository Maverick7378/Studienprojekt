import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GeneratorService } from 'src/app/services/generator-service';
import { CalculatorService } from 'src/app/services/calculator-service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-crc',
  templateUrl: './crc.component.html',
  styleUrls: ['./crc.component.css'],
  providers:[GeneratorService,CalculatorService]
})
export class CrcComponent implements OnInit {

  constructor(private generatorService:GeneratorService, private calculatorService:CalculatorService) { }

  prufsumme:string;
  generateDaten:boolean = true;
  generatePolynom:boolean=true;
  daten:string;
  datenMitFullBit:string;
  generatorPolynom:string;
  summe:string;
  solutionWeg:string[];
  solutionWegPrefixe:string[];
  summeFarbe:number = 0; //farbe für den hintergrund der Summe. 0 keine farbe, wenn keine Lösung angegeben wurde.
                          //1 für hintergrund rot, 2 für hintergrund grün
  ngOnInit() {
    this.generateNewAufgabe();

  }
 //this method gets called every time a new exersice is generated
 //it will call the generate CRC from the generator Service to get all needed information
  private generateNewAufgabe(){
    let ret={
      "daten":"",
      "generatorPolynom":"",
      "summe":""
    };
     ret = this.generatorService.generateCRC();
     this.daten=ret.daten;
     this.generatorPolynom=ret.generatorPolynom;
     this.summe=ret.summe;
     this.solutionWeg=[];
     this.solutionWegPrefixe=[];
     this.datenMitFullBit="";
  }

  //this method gets called when the user presses the calc crc button
  calcCRC(form: NgForm){
    const value = form.value;
    //console.log(this.calculatorService.calcCRC(this.daten,this.generatorPolynom));
    let temp = this.calculatorService.calcCRC(this.daten,this.generatorPolynom);
    if(this.summe==""){
      this.summeFarbe=0;
      this.summe=temp.summe;
    }else if(this.summe==temp.summe){
      this.summeFarbe=2;
    }else {
      this.summeFarbe=1;
    }
    //this.summe=temp.summe;
    this.solutionWeg=temp.solutionWeg;
    this.datenMitFullBit=temp.datenMitFullBit;
    this.solutionWegPrefixe= temp.solutionWegPrefixe;
    console.log(this.solutionWeg);
  }

  //this method gets called when the user presses the generate new aufgabe button
  onGenerateNewAufgabe(){
    this.generateNewAufgabe();
  }

}
