import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { MatTable } from '@angular/material';
import { CalculatorService } from 'src/app/services/calculator-service';
import { GeneratorService } from 'src/app/services/generator-service';

export class IpAddress{
    public value:string;
    public selected:boolean;
    public prefix:number;

    constructor(value:string,prefix:number){
      this.value=value;
      this.prefix=prefix;
    }
}

@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.css'],
  providers:[CalculatorService,GeneratorService]
})
export class RoutingComponent implements OnInit {

  subnetList:IpAddress[] = [];
  columnsToDisplay = ["ip-address"];
  @ViewChild(MatTable,{static: true}) table: MatTable<any>;
  difficulty:string="easy";
  ipAddress:string="";
  solutionSubnet:IpAddress;
  solutionSubnetIndex:number;
  selectedSubnet:IpAddress;
  solutionText:string="";
  solutionSubnetBit:string="";
  selectedSubnetBit:string="";


  constructor(private calculatorService:CalculatorService,private generatorService:GeneratorService) { }

  ngOnInit() {
    this.generateRouting();
  }
  clearSolution(){
    this.solutionText="";
    this.solutionSubnetBit="";
    this.selectedSubnetBit="";
  }

  //this method is calling different generate methods depending on difficulty
  //it also is responsible for randomly selecting a solution
  generateRouting(){
    this.subnetList=[];
    this.subnetList.push(new IpAddress("0.0.0.0",0));
    //on easy there is 1 address generated that fits one of the entries 
    if(this.difficulty==="easy"){
      for (let i = 0; i < 4; i++) {
        this.subnetList.push(
          new IpAddress(
            this.calculatorService.ipBitToCidr(
              this.calculatorService.calcNetAddress(
                24,this.generatorService.generateIpAddress()
              ),
            ),24
          )
        );
      }
      let n = Math.floor(Math.random() * (4 - 1 + 1) + 1);
      console.log(n);
      this.ipAddress=this.calculatorService.ipBitToCidr(
        this.generatorService.generateRouting(
          this.calculatorService.ipCidrToBit(
            this.subnetList[n].value
          ),this.subnetList[n].prefix
        )
      );

      this.solutionSubnet=this.subnetList[n];
    }
    //middle
    //generate the first subnet and then the following subnets with the generator service
    if(this.difficulty==="middle"){
      let firstSubnet = this.calculatorService.calcNetAddress(23,this.generatorService.generateIpAddress());
      let res= this.generatorService.generateMiddleRouting(firstSubnet);
      for (let i = 0; i < res.length; i++) {
        let x= i;
        if(x>2){
          x=2;
        }
        const element = res[i];
        this.subnetList.push(
          new IpAddress(
            this.calculatorService.ipBitToCidr(
              element
            ),23+x
          )
        );
      }
      //select a random subnet for the solution
      let n = Math.floor(Math.random() * (4 - 0 + 1) + 0);

      this.ipAddress=this.calculatorService.ipBitToCidr(
        this.generatorService.generateRouting(
          this.calculatorService.ipCidrToBit(
            this.subnetList[n].value
          ),this.subnetList[n].prefix
        )
      );

      this.solutionSubnet=this.subnetList[n];
    }

    //hard
    if(this.difficulty==="hard"){
      let firstSubnet = this.calculatorService.calcNetAddress(23,this.generatorService.generateIpAddress());
      let res= this.generatorService.generateHardRouting(firstSubnet);
      let x = 0;
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        this.subnetList.push(
          new IpAddress(
            this.calculatorService.ipBitToCidr(
              element
            ),23+x
          )
        );
        if(i%2==0){
          x++;
        }
      }
      //select a random subnet for the solution
      let n = Math.floor(Math.random() * (6 - 0 + 1) + 0);
      this.subnetList=this.generatorService.shuffle(this.subnetList);
      for (let i = 0; i < this.subnetList.length; i++) {
        const element = this.subnetList[i];
        //check that the solution is the one with the longest prefix. otherwhise select that subnet
        if((element.value===this.subnetList[n].value)&&(element.prefix>this.subnetList[n].prefix)){
          n = i;
        }
        
      }
      this.ipAddress=this.calculatorService.ipBitToCidr(
        this.generatorService.generateRouting(
          this.calculatorService.ipCidrToBit(
            this.subnetList[n].value
          ),this.subnetList[n].prefix
        )
      );
      
      this.solutionSubnet=this.subnetList[n];
      this.solutionSubnetIndex=n;
    }
  }
  onSelectAddress(address:IpAddress,row){
    for (let i = 0; i < this.subnetList.length; i++) {
      const element = this.subnetList[i];
      if(element.selected){
        element.selected=false;
      }
      
    }
    console.log(address,row);
    address.selected=true;
    this.selectedSubnet=address;
    console.log(this.selectedSubnet);
  }

  onEasy(){
    this.difficulty="easy";
  }
  onMiddle(){
    this.difficulty="middle";
  }
  onDifficult(){
    this.difficulty="hard";
  }

  //since no calculation is nessesary, this method checks if the selected subnet matches the solution subnet
  onClickSolution(){
    let selectedSubBit= this.calculatorService.ipCidrToBit(this.selectedSubnet.value);
    let solutionSubBit= this.calculatorService.ipCidrToBit(this.solutionSubnet.value);
    if(this.difficulty==="hard"){
      //this needs to be done to get the correct solution if the random number chose the smaller subnet
      
      //now the correct soluiton with the biggest prefix is chosen
      if((this.selectedSubnet.value===this.solutionSubnet.value)&&
      (this.selectedSubnet.prefix===this.solutionSubnet.prefix))
      {
        if(this.solutionSubnet.value==="0.0.0.0"){
          this.solutionText="Die Antwort ist richtig. Da kein anderer Eintrag der Routing Tabelle auf die IP Addresse passt, wird die standard Route 0.0.0.0 ausgewählt";
        }
        this.solutionText="Die Antwort ist richtig. Die Netzmaske der IP Addresse "+this.ipAddress+
        " stimmt mit dem ausgewählten Subnetz überein";
        this.selectedSubnetBit=selectedSubBit;
        this.solutionSubnetBit=solutionSubBit;
      }else {
        this.solutionText="Die Antwort ist falsch. Die Netzaddresse der gegebenen IP Addresse muss mit der Netzaddresse des ausgewählten "+
        " Subnetzes übereinstimmen. Passen mehrere Einträge der Routing Tabelle, muss der Eintrag, mit dem längsten Präfix ausgewählt werden. "
        +" In diesem fall: "+this.solutionSubnet.value+"/"+this.solutionSubnet.prefix;
        this.selectedSubnetBit=selectedSubBit;
        this.solutionSubnetBit=solutionSubBit;
      }
    }else{
      if(selectedSubBit===solutionSubBit){
        this.solutionText="Die Antwort ist richtig. Die Netzmaske der IP Addresse "+this.ipAddress+
        " stimmt mit dem ausgewählten Subnetz überein";
      }else {
        this.solutionText="Die Antwort ist falsch. Die Netzmaske der IP Addresse stimmt nicht mit dem ausgewählten Subnetz überein. "+ 
        "Das bedeutet, dass die IP Addresse nicht in dem angegebenen Subnetz liegt. Die richtige Antwort wäre "+
        this.solutionSubnet.value;
      }
      this.selectedSubnetBit=selectedSubBit;
      this.solutionSubnetBit=solutionSubBit;
    }
  }
  onGenerateNewAufgabe(){
    this.generateRouting();
    this.clearSolution();
  }
}
