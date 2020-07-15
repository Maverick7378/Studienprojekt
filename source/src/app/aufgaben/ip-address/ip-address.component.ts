import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GeneratorService } from 'src/app/services/generator-service';
import { CalculatorService } from 'src/app/services/calculator-service';

@Component({
  selector: 'app-ip-address',
  templateUrl: './ip-address.component.html',
  styleUrls: ['./ip-address.component.css'],
  providers:[GeneratorService,CalculatorService]
})
export class IpAddressComponent implements OnInit {


  generateAddress:boolean=true;
  prefixLength:number= 24;
  addressBit:string = ""; 
  addressCidr:string = "";
  netzMaskBit: string = "";
  netzMaskCidr: string = "";
  netzAddresseBit:string = "";
  netzAddresseCidr:string = "";
  broadcastAddresseBit:string ="";
  broadcastAddresseCidr:string = "";

  netzMaskSolutionBit:string;
  netzMaskSolutionCidr:string;
  netzAddresseSolutionBit:string;
  netzAddresseSolutionCidr:string;
  broadcastAddresseSolutionBit:string;
  broadcastAddresseSolutionCidr:string;

  solutionFarbeNetAddress:number = 0; //0 nichts, 1 rot, 2 grün
  solutionFarbeNetMask:number = 0;
  solutionFarbeBroadcastAddress:number = 0;

  constructor(private generatorService:GeneratorService, private calculatorService:CalculatorService) { }

  ngOnInit() {
    this.onGenerateNewAufgabe();
  }

  //this method gets called when the user presse the calc solution button
  calcAddress(form:NgForm){
    //do not calculate anything if the strings are empty
    if(this.netzMaskCidr!="") {
      this.onChangeNetmask();
      this.netzMaskSolutionBit= this.calculatorService.calcNetmask(this.prefixLength);
      this.netzMaskSolutionCidr=this.calculatorService.ipBitToCidr(this.netzMaskSolutionBit);
      if(this.netzMaskSolutionBit==this.netzMaskBit) this.solutionFarbeNetMask=2;
      else this.solutionFarbeNetMask=1;
    }
    if(this.netzAddresseCidr!="") {
      this.onChangeNetAddress();
      this.netzAddresseSolutionBit= this.calculatorService.calcNetAddress(this.prefixLength,this.addressBit);
      this.netzAddresseSolutionCidr=this.calculatorService.ipBitToCidr(this.netzAddresseSolutionBit);
      if(this.netzAddresseSolutionBit==this.netzAddresseBit) this.solutionFarbeNetAddress=2;
      else this.solutionFarbeNetAddress=1;
    }
    if(this.broadcastAddresseCidr!="") {
      this.onChangeBroadcastAddress();
      this.broadcastAddresseSolutionBit= this.calculatorService.calcBroadcastAddress(this.prefixLength,this.addressBit);
      this.broadcastAddresseSolutionCidr= this.calculatorService.ipBitToCidr(this.broadcastAddresseSolutionBit);
      if(this.broadcastAddresseSolutionBit==this.broadcastAddresseBit) this.solutionFarbeBroadcastAddress=2;
      else this.solutionFarbeBroadcastAddress=1;
    }
  }

  //event functions
  //these functions change the ip adress in the bit input every time the user changes the input
  onGenerateNewAufgabe(){
    this.addressBit=this.generatorService.generateIpAddress();
    this.addressCidr= this.calculatorService.ipBitToCidr(this.addressBit);
  }
  onChangeAddressInput(){
    this.addressBit= this.calculatorService.ipCidrToBit(this.addressCidr);
  }
  onChangeNetmask(){
    this.netzMaskBit= this.calculatorService.ipCidrToBit(this.netzMaskCidr);
  }
  onChangeNetAddress(){
    this.netzAddresseBit=this.calculatorService.ipCidrToBit(this.netzAddresseCidr);
  }
  onChangeBroadcastAddress(){
    this.broadcastAddresseBit=this.calculatorService.ipCidrToBit(this.broadcastAddresseCidr);
  }


}
