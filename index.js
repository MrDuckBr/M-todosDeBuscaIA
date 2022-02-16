class Peca{
    constructor(location, row,column, peso){
        this.location = location // posicao atual
        this.row= row //
        this.column = column // 
        this.peso = peso // valor da peça
        this.parents = {
            up:null,
            down:null,
            left:null,
            rigth:null
        }
    }

    updatePosition(newPosition){
        this.position = newPosition
    }

}

var vetPieces

function insertValues(){
    
    var table = document.getElementById("emptyTable");
    let valorTeste = document.querySelectorAll("[location]");


    
    //for(let i=0;i<valorTeste.length;i++){
      //  console.log(valorTeste[i].getAttribute("location") +'valor dentro' + valorTeste[i].innerText)
        
        
        let cont = 0
        for (var j = 0;j<3; j++) {
            for (var k = 0; k<3; k++) {
                let locationaux = valorTeste[k + j + cont].getAttribute("location")
                if(valorTeste[cont+k+j].innerText.length == 0 ) {
                    console.log(valorTeste[cont + k + j].innerText)
                    vetPieces[j][k] = new Peca(locationaux,j,k,0)
                }else{
                    console.log(valorTeste[cont + k + j].innerText)
                    vetPieces[j][k]= new Peca(locationaux,j,k, valorTeste[cont + k + j].innerText)
                }
               
            } 
            cont+= 2

    
}



}

var vetPecas


function createMatrix(){


    // Create one dimensional array
    var vet = new Array(3);
    
    
    // Loop to create 2D array using 1D array
    for (var i = 0; i < vet.length; i++) {
        vet[i] = [];

            
        }
    return vet;
}



function Table(){
    
    vetPieces = createMatrix()
    console.log('passei aqui')
    insertValues()
    console.log('passei aqui2')
   
    

    for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++){
     pieceParents(vetPieces[i][j])
    }
    }

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++){
         console.log(vetPieces[i][j])
        }
        }
}



function pieceParents(peca){
    
    if(peca.row != 0 && peca.row <= 2){ // Nao pode se movimentar para cima
        peca.parents['up'] = vetPieces[peca.row - 1][peca.column].peso
    }
    
    if (peca.row != 2 && peca.row >= 0){
        peca.parents['down']= vetPieces[peca.row + 1][peca.column].peso
    }


    if(peca.column == 0){ // Nao pode se movimentar para cima
        peca.parents['left'] = null
    }else{
        peca.parents['left'] = vetPieces[peca.row][peca.column - 1].peso
    }
    
    if (peca.column == 2){ // Nao pode se movimentar para baixo
        peca.parents['rigth']= null
    }else {
        peca.parents['rigth']= vetPieces[peca.row][peca.column +1].peso
    }


}


function verifyFields(){ //Função que verifica se os campos estão preenchidos corretamente

}

//Estado final da máquina no forca bruta
function finalState(){
    let finalStateVector = [1,2,3,8,0,4,7,6,5]
    let count = 0
    let countFinalState = 0

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(vetPieces[i][j] == finalStateVector[count]){
                countFinalState++
            }
            count++
        }
    }

    if(countFinalState == 9){
        return true
    }else{
        return false
    }

}



function agentVerificator(){}



function agentValidator(){}


function agentRunner(){
    
}

function changePieces(piece1, piece2){
    if(piece1.parents[up] == piece2.peso){// peca 1 em baixo

    }else if(piece1.parents[down] == piece2.peso){ // peca 1 em cima

    }else if(piece1.parents[left] == piece2.peso){
        
    }
}


//pegar as peças organizadas no html
//calcular resposta/
//voltar para a pagina principal

// teste de commit