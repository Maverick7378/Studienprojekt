export class CalculatorService{

    calcCRC(daten:string,genPol:string){
    
        let dividerSolution=[];
        let dataArray = daten.split('');
        let polArray = genPol.split('');
        // let dataArray = ["1","0","1","1","1","0"];
        // let polArray=["1","0","0","1"];

        //füllbit and data array anfügen
        for (let i = 0; i < polArray.length-1; i++) {
            dataArray.push("0"); 
        }

        //zeorArray generieren
        let zeroArray= [];
        for (let i = 0; i < polArray.length; i++) {
            zeroArray.push("0");  
        }
        let zwischenErg = [];
        let tempErg = [];
        let solutionWeg = [];
        let solutionStringPrefixe = [];

        //daten und genPol in das Lösungsweg array packen
        //solutionWeg.push(dataArray.join('')+":"+polArray.join(''));
        solutionWeg.push(" ");
        solutionWeg.push(polArray.join(''));
        solutionStringPrefixe.push("");
        solutionStringPrefixe.push("");

        //erster schritt
        dividerSolution.push(dataArray[0]);
        for (let j = 1; j < polArray.length; j++) {
            if(dataArray[0+j]==polArray[j]){
                zwischenErg.push("0");
            }else zwischenErg.push("1");
        }
        zwischenErg.push(dataArray[polArray.length])

        //dem lösungsweg das erste zwischenergebnis hinzufügen
        solutionWeg.push(zwischenErg.join(''));
        solutionStringPrefixe.push("--");

        //nächster schritt
        for (let i = polArray.length; i < dataArray.length; i++) {
            const element = dataArray[i];

            //formatieren des lösungsstrings
            let solutionStringPrefix = "";
            for (let k = 0; k < i-polArray.length+1; k++) {
                solutionStringPrefix= solutionStringPrefix+"--";            
            }

            //wenn die erste Stelle des zwischenergebnisses eine 1 ist, rechne mit dem polynom weiter
            if(zwischenErg[0]=="1"){
                dividerSolution.push(zwischenErg[0]);
                for (let j = 1; j < polArray.length; j++) {
                    if(zwischenErg[0+j]==polArray[j]){
                        tempErg.push("0");
                    }else tempErg.push("1");
                }
                //dem lösungsweg das polynom hinzufügen mit welchem im aktuellen schritt verglichen wurde
                solutionWeg.push(polArray.join(''));
                solutionStringPrefixe.push(solutionStringPrefix);
            }else {
                // ist sie eine 0, rechne mit dem polynom 00000 weiter
                dividerSolution.push(zwischenErg[0]);
                for (let j = 1; j < polArray.length; j++) {
                    if(zwischenErg[0+j]==zeroArray[j]){
                        tempErg.push("0");
                    }else tempErg.push("1");
                }
                //dem lösungsweg das polynom hinzufügen mit welchem im aktuellen schritt verglichen wurde
                solutionWeg.push(zeroArray.join(''));
                solutionStringPrefixe.push(solutionStringPrefix);
            }
            tempErg.push(dataArray[i+1]);


            zwischenErg=tempErg;
            tempErg=[];

            //dem lösungsweg das zwischenergebnis hinzufügen
            solutionWeg.push(zwischenErg.join(''));
            solutionStringPrefixe.push("--"+solutionStringPrefix);
            
        }
        console.log("prüfsumme ist"+zwischenErg);
        console.log(dividerSolution);
        console.log(solutionWeg);
        let ret = {
            "summe":zwischenErg.join(''),
            "solutionWeg":solutionWeg,
            "solutionWegPrefixe":solutionStringPrefixe,
            "datenMitFullBit":dataArray.join('')
        }
        return ret;
    }

    ipBitToCidr(addressBit:string){
        //addressBit="10000110.01101100.00001000.00000000" //for testing
        let addressBitArray=[]; //two dimensional array of the address
        let addressCidrArray=[]; //array of the address in cidr notation

        //splitting the addressBit string into an array of 4 strings. Each section is one entry
        let temp = addressBit.split('.'); 
        for (let i = 0; i < temp.length; i++) {
            //splitting each of the 4 sections in another array of 8 bits, to allow easier calculation
            const element = temp[i];
            addressBitArray.push(element.split('').reverse());
        }
        

        for (let i = 0; i < addressBitArray.length; i++) {
            const element = addressBitArray[i];
            let partSolution=0;
            for (let i = 0; i < element.length; i++) {
                if(element[i]==1){
                    partSolution+=Math.pow(2, i);
                }
            }
            addressCidrArray.push(partSolution);
            
        }
        
        return addressCidrArray.join('.');
    }

    ipCidrToBit(address:string){
        //address = "152.123.255.19";
        let addressArray:string[];
        addressArray = address.split('.');
        let addressArrayBit:string[] =[];
        let partSolutionArray:string[] =[];
        for (let i = 0; i < addressArray.length; i++) {
            let element = parseInt(addressArray[i]);
            //check each section of the string
            //if it is smaller 255 try 256. if it is bigger substract and continue
            for (let j = 7; j >= 0; j--) {
                if(element >= Math.pow(2,j) ){
                    partSolutionArray.push("1");
                    element= element- Math.pow(2,j);
                } else partSolutionArray.push("0");
            }
            addressArrayBit.push(partSolutionArray.join(''));
            partSolutionArray=[];
        }

        //console.log(addressArrayBit.join('.'));
        return addressArrayBit.join('.');
    }

    calcNetmask(prefix:number){
        if((prefix>30)||(prefix<8)) return "prefix length invalid";
        let counter:number=0;   //counter to track when a . has to come
        let address:string[]=[];
        let counter2:number= 32; //counter to track if the array has all 32 bits

        for (let i = 0; i < prefix; i++) {
           if(counter==8) {
               counter=0;
               address.push(".");
            }
           address.push("1");
           counter++;
           counter2--;
        }
        for (let i = 0; i < counter2; i++) {
            if(counter==8) {
                counter=0;
                address.push(".");
            }
            address.push("0");
            counter++;
        }
        return address.join('');
        
    }

    calcNetAddress(prefix:number, address:string){
        if((prefix>30)||(prefix<8)) return "prefix length invalid";
        let addressBitArray:string[]=[];
        let netaddressBitArray:string[]=[];
        let re = /\./gi;
        addressBitArray=address.replace(re,"").split('');
        let counter:number=0;   //counter to track when a . has to come
        let counter2:number= 32; //counter to track if the array has all 32 bits

        for (let i = 0; i < 32; i++) {
            
            if(counter==8){
                counter=0;
                netaddressBitArray.push(".");
            }
            counter++;
            if(prefix>0){
                netaddressBitArray.push(addressBitArray[i]);
                prefix--;
            } else {
                netaddressBitArray.push("0");
            }

        
        }
        return netaddressBitArray.join('');
    }
    calcBroadcastAddress(prefix:number, address:string){
        if((prefix>30)||(prefix<8)) return "prefix length invalid";
        let addressBitArray:string[]=[];
        let broadcastAddressBitArray:string[]=[];
        let re = /\./gi;
        addressBitArray=address.replace(re,"").split('');
        let counter:number=0;   //counter to track when a . has to come
        let counter2:number= 32; //counter to track if the array has all 32 bits

        for (let i = 0; i < 32; i++) {
            
            if(counter==8){
                counter=0;
                broadcastAddressBitArray.push(".");
            }
            counter++;
            if(prefix>0){
                broadcastAddressBitArray.push(addressBitArray[i]);
                prefix--;
            } else {
                broadcastAddressBitArray.push("1");
            }

            
        }
        return broadcastAddressBitArray.join('');
    }

    calcRoutingAddress(prefix:number, address:string){
    }

}