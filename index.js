class Peca {
  constructor(location, row, column, peso, visited = false) {
    this.location = location; // posicao atual
    this.row = row; //
    this.column = column; //
    this.peso = peso; // valor da peça
    this.visited = visited;
    this.parents = {
      up: null,
      down: null,
      left: null,
      rigth: null,
    };
  }

  updatePosition(newPosition) {
    this.position = newPosition;
  }
}

var vetPieces;
let blankLocation;

function insertValues() {
  var table = document.getElementById("emptyTable");
  let valorTeste = document.querySelectorAll("[location]");

  //for(let i=0;i<valorTeste.length;i++){
  //  console.log(valorTeste[i].getAttribute("location") +'valor dentro' + valorTeste[i].innerText)

  let cont = 0;
  for (var j = 0; j < 3; j++) {
    for (var k = 0; k < 3; k++) {
      let locationaux = valorTeste[k + j + cont].getAttribute("location");
      if (valorTeste[cont + k + j].innerText.length == 0) {
        console.log(valorTeste[cont + k + j].innerText);
        vetPieces[j][k] = new Peca(locationaux, j, k, 0);
        blankLocation = [j, k];
      } else {
        console.log(valorTeste[cont + k + j].innerText);
        vetPieces[j][k] = new Peca(
          locationaux,
          j,
          k,
          valorTeste[cont + k + j].innerText
        );
      }
    }
    cont += 2;
  }
}

var vetPecas;

function createMatrix() {
  // Create one dimensional array
  var vet = new Array(3);

  // Loop to create 2D array using 1D array
  for (var i = 0; i < vet.length; i++) {
    vet[i] = [];
  }
  return vet;
}

function ordemAleatoria() {
  const squares = [...document.getElementsByClassName("square")];
  let valorTeste = [...document.querySelectorAll("[location]")];

  console.log(squares, valorTeste);
  shuffle(squares);
  shuffle(valorTeste);
  for (let index = 0; index < 8; index++) {
    valorTeste[index].append(squares[index]);
  }
}

function ordemAleatorias() {
  const squares = [...document.getElementsByClassName("squareResult")];
  let valorTeste = [...document.querySelectorAll("[locationResult]")];

  console.log(squares, valorTeste);
  shuffle(squares);
  shuffle(valorTeste);
  for (let index = 0; index < 8; index++) {
    valorTeste[index].append(squares[index]);
  }
}

function shuffle(array) {
  let randomNumber;
  let tmp;
  for (let i = array.length; i; ) {
    randomNumber = (Math.random() * i--) | 0;
    tmp = array[randomNumber];
    // troca o número aleatório pelo atual
    array[randomNumber] = array[i];
    // troca o atual pelo aleatório
    array[i] = tmp;
  }
}

function Table() {
  vetPieces = createMatrix();
  console.log("passei aqui");
  //ordemAleatoria();
  insertValues();
  console.log("passei aqui2");

  pieceParents();

  agentVerificator();
  console.log(finalState());
  //changePieces(vetPieces[0][0],vetPieces[1][0])
  render();
}

// Método que percorre a matrix e atribui os vizinhos
function pieceParents() {
  // Implementado
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      pieceParentsAux(vetPieces[i][j]);
    }
  }
}

//Método aux que atribui as peças proximas
function pieceParentsAux(peca) {
  //Implementado

  if (peca.row != 0 && peca.row <= 2) {
    // Nao pode se movimentar para cima
    peca.parents["up"] = vetPieces[peca.row - 1][peca.column].peso;
  }

  if (peca.row != 2 && peca.row >= 0) {
    peca.parents["down"] = vetPieces[peca.row + 1][peca.column].peso;
  }

  if (peca.column == 0) {
    // Nao pode se movimentar para cima
    peca.parents["left"] = null;
  } else {
    peca.parents["left"] = vetPieces[peca.row][peca.column - 1].peso;
  }

  if (peca.column == 2) {
    // Nao pode se movimentar para baixo
    peca.parents["rigth"] = null;
  } else {
    peca.parents["rigth"] = vetPieces[peca.row][peca.column + 1].peso;
  }
}

function verifyFields() {
  //Função que verifica se os campos estão preenchidos corretamente
}

//Estado final da máquina no forca bruta
function finalState() {
  // Implementado, falta testar
  let finalStateVector = [1, 2, 3, 8, 0, 4, 7, 6, 5];
  let count = 0;
  let countFinalState = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (vetPieces[i][j].peso == finalStateVector[count]) {
        countFinalState++;
      }
      count++;
    }
  }

  if (countFinalState == 9) {
    return true;
  } else {
    return false;
  }
}

// Verificar as possiveis posicoes ao qual o mesmo pode andar
function agentVerificator() {
  // Implementado, falta testar
  let parents = vetPieces[blankLocation[0]][blankLocation[1]].parents;
  console.log(parents);
  let aux = Object.keys(parents).map(function (key) {
    return parents[key];
  });

  let vetParents = aux.filter((obj) => {
    if (obj != null) {
      return obj;
    }
  });

  return vetParents;
}

function agentValidator() {
  // Se tal movimento não foi feito anteriormente.
}

// Efetivamente vai se movimentar as peças
function agentRunner() {
  //Necessita Implementar
}

//Realiza a troca na matrix entre duas peças
function changePieces(piece1, piece2) {
  // Implementado, Falta testar

  let auxiliarPiece = piece1;
  piece1.row = piece2.row;
  piece1.column = piece2.column;

  piece2.row = auxiliarPiece.row;
  piece2.column = auxiliarPiece.column;

  pieceParents();
}

function visitedPieces(vetAuxiliar) {
  //erado
  for (let i = 0; i < vetAuxiliar.length; i++) {
    if (vetAuxiliar.visited == false) {
      cont++;
    }
  }

  //if(cont == vetAuxiliar.)
}

// Método de Busca em profundidade
function hardSearch() {
  //Implementando
  let matrixAuxPieces = vetPieces;
  let vetMovementMatrix;
  while (!finalState()) {
    var vetParents = agentVerificator();

    //Ver possibilidade de movimentação
    //
    //armazenar movimento
    //
  }
}

function render() {
  let valorTeste = [...document.querySelectorAll("[locationResult]")];
  let locationPadrao = [...document.querySelectorAll("[location]")];

  let cont = 0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      valorTeste[i + j + cont].innerHTML = "";
      if (locationPadrao[i + j + cont].querySelector("p") != null) {
        let squareResult = document.createElement("div");
        squareResult.setAttribute("class", "squareResult");
        squareResult.setAttribute("id", i + j + cont);
        squareResult.innerHTML = `<p id=${
          locationPadrao[i + j + cont].querySelector("p").textContent
        } > ${
          locationPadrao[i + j + cont].querySelector("p").textContent
        } </p>`;

        valorTeste[i + j + cont].append(squareResult);
      }
    }
    cont += 2;
  }
}
