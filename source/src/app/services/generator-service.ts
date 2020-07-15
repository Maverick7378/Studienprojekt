

export class GeneratorService{

    generatedCrcData:{};
    generateCRC(){
        let daten = ["1"];
        //generte data payload
        for (let i = 0; i < 6; i++) {
            daten.push(Math.floor(Math.random()*(1-0+1)+0).toString());
        }
        //generate gen pol
        let genPol = ["1"];
        for (let i = 0; i < 3; i++) {
            genPol.push(Math.floor(Math.random()*(1-0+1)+0).toString());
        }
        //return data to component
        let returnData = {
            "daten":daten.join(''),
            "generatorPolynom":genPol.join(''),
            "summe":""
        };
        this.generatedCrcData= returnData;
        

        return returnData;
    }
    generateRouting (subnet:string,prefix:number){
        console.log(subnet);
        let addressBitArray:string[]=[];
        let sol:string[]=[];
        let re = /\./gi;
        addressBitArray=subnet.replace(re,"").split('');
        console.log(addressBitArray);

        let counter:number=0;   //counter to track when a . has to come
         //counter to track if the array has all 32 bits

        for (let i = 0; i < 32; i++) {
            
            if(counter==8){
                counter=0;
                sol.push(".");
            }
            counter++;
            if(prefix>0){
                sol.push(addressBitArray[i]);
                prefix--;
            } else {
                sol.push(Math.floor(Math.random()*(1-0+1)+0).toString());
            }

            
        }
        return sol.join('');
    }
    private bitToStringAddress(address:string[],prefix:number){
        let sol:string[]=[];

        let counter:number=0;   //counter to track when a . has to come
         //counter to track if the array has all 32 bits

        for (let i = 0; i < 32; i++) {
            
            if(counter==8){
                counter=0;
                sol.push(".");
            }
            counter++;
            if(prefix>0){
                sol.push(address[i]);
                prefix--;
            } else {
                sol.push("0");
            }

            
        }
        return sol.join('');
    }
    generateMiddleRouting(subnet:string){
        let subnetBitArray:string[]=[];
        let sol:string[]=[];
        let sol2,sol3,sol4,sol5:string[]=[];
        let res:string[]=[];
        let re = /\./gi;
        subnetBitArray=subnet.replace(re,"").split('');
        console.log(subnetBitArray);
        sol= subnetBitArray;
        sol[22]="0";
        res.push(this.bitToStringAddress(sol,23));
        sol[22]="1";
        //generate /24 subnets
        sol[23]="1";
        res.push(this.bitToStringAddress(sol,24));
        sol[23]="0";
        //generate /25 subnets
        sol[24]="1";
        res.push(this.bitToStringAddress(sol,25));
        sol[24]="0";
        res.push(this.bitToStringAddress(sol,25));
        return res;
    }
    generateHardRouting(subnet:string){
        let subnetBitArray:string[]=[];
        let sol:string[]=[];
        let res:string[]=[];
        let re = /\./gi;
        subnetBitArray=subnet.replace(re,"").split('');
        console.log(subnetBitArray);
        sol= subnetBitArray;
        sol[22]="0";
        res.push(this.bitToStringAddress(sol,23));
        sol[23]="0";
        res.push(this.bitToStringAddress(sol,24));
        sol[22]="1";
        //generate /24 subnets
        sol[23]="1";
        res.push(this.bitToStringAddress(sol,24));
        sol[23]="0";
        //generate /25 subnets
        sol[24]="1";
        res.push(this.bitToStringAddress(sol,25));
        sol[24]="0";
        res.push(this.bitToStringAddress(sol,25));
        sol[21]="1";
        res.push(this.bitToStringAddress(sol,26));
        
        return res;
    }
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
    generateIpAddress(){
        let ret = "";
        
        for (let j = 0; j < 8; j++) {
            ret+= Math.floor(Math.random()*(1-0+1)+0).toString();
        }
        ret+=".";
        for (let j = 0; j < 8; j++) {
            ret+= Math.floor(Math.random()*(1-0+1)+0).toString();
        }
        ret+=".";
        for (let j = 0; j < 8; j++) {
            ret+= Math.floor(Math.random()*(1-0+1)+0).toString();
        }
        ret+=".";
        for (let j = 0; j < 8; j++) {
            ret+= Math.floor(Math.random()*(1-0+1)+0).toString();
        }

        return ret;
    }

}