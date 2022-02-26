let initialState;
const goalState = [1, 2, 3, 8, 0, 4, 7, 6, 5];
const goalStateMatrix = [
  [1, 2, 3],
  [8, 0, 4],
  [7, 6, 5],
];

//Método que define um tempo de espera para que a atualização da matriz possa ser vista.
function sleep(ms = 1) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Classe que realiza a BFS (No caso modelo de força bruta)
class BFS {
  constructor(initialState, goalState) {
    this.initialState = initialState;
    this.goalState = goalState;
    this.allNodes = {};
    this.visitedNodes = [];
    this.Queue = [];
    // ADD INITAL TO QUEUE
    this.Queue.push(initialState);
  }

  // MOVE FUNCTIONS
  swap(value, swapfrom, swapto) {
    const temp = value[swapto];
    value[swapto] = value[swapfrom];
    value[swapfrom] = temp;
    return value;
  }

  /*Utilizando o stringfy criamos um objeto que o mesmo se torna a chave e verificamos se a chave chegou no estado final
  Estado final:{ 
                1,2,3
                8,0,4
                7,6,5
        }
  */
  checkGoalState(value) {
    // value is array
    if (JSON.stringify(goalState).indexOf(JSON.stringify(value)) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  //Método que define o movimento de cada peça na matriz

  getPossibleMoves(value) {
    let mid = {
      0: [{ swap: 1 }, { swap: 3 }],
      1: [{ swap: 2 }, { swap: 4 }, { swap: 0 }],
      2: [{ swap: 5 }, { swap: 1 }],
      3: [{ swap: 0 }, { swap: 4 }, { swap: 6 }],
      4: [{ swap: 1 }, { swap: 5 }, { swap: 7 }, { swap: 3 }],
      5: [{ swap: 2 }, { swap: 8 }, { swap: 4 }],
      6: [{ swap: 3 }, { swap: 7 }],
      7: [{ swap: 4 }, { swap: 8 }, { swap: 6 }],
      8: [{ swap: 5 }, { swap: 7 }],
    };

    return mid[value];
  }

  //Método responsavel por atualizar a tabela no html
  mov(visited) {
    const locationResult = document.querySelectorAll("[locationResult]");
    locationResult.forEach((item, index) => {
      if (visited[index] == 0) {
        item.querySelector("p").innerText = "";
        item.querySelector("div").setAttribute("class", "squareResult vazio");
      } else {
        item.querySelector("p").innerText = visited[index];
        item.querySelector("div").setAttribute("class", "squareResult");
      }
    });
  }

  //Metodo responsável por realizar a aleatoriedade plausivel para o jogo
  shuffle = () => {
    let rand = Math.floor(Math.random() * 30);
    for (let index = 0; index < rand; index++) {
      let index = this.Queue[0].indexOf(0);
      let moves = this.getPossibleMoves(index);

      // GET CHILDS
      let childNodes = moves.map((item) => {
        let temp = [...this.Queue[0]];
        return this.swap(temp, index, item.swap);
      });

      this.Queue.shift();
      this.Queue.push(
        childNodes[Math.floor(Math.random() * childNodes.length)]
      );
    }
    
    return this.Queue[0];
  };

  //Método responsavel por iniciar a BFS( Força Bruta)
  main = async function () {
    let index = this.Queue[0].indexOf(0);
    //Seleciona um array com as possibilidade de movimentação
    let moves = this.getPossibleMoves(index);

    //Para cada possibilidade de movimentação é feito a troca
    let childNodes = moves.map((item) => {
      let temp = [...this.Queue[0]];
      return this.swap(temp, index, item.swap);
    });

    //verifica se a nova posição já foi visitada ou não foi encontrada
    childNodes.forEach((item) => {
      if (JSON.stringify(this.Queue).indexOf(JSON.stringify(item)) == -1) {
        if (
          JSON.stringify(this.visitedNodes).indexOf(JSON.stringify(item)) == -1
        ) {
          this.Queue.push(item);
        }
      }
    });

    //Retira o primeiro elemento da fila
    let visited = this.Queue.splice(0, 1)[0];
    //Marca como visitado
    this.visitedNodes.push(visited);

    //Renderiza na tela.
    this.mov(visited);
    //Adicionado um await para que possa ser visto a movimentação das peças
    await sleep();

    //Quando encontrado a posição final ele finaliza as comparações
    if (this.checkGoalState(visited)) {
      console.log("FOUND CEGA = ", this.visitedNodes.length - 1);
      let resultado = document.getElementById("resultadoCegaLabbel");
      resultado.innerHTML = `Número de Comparações = ${
        this.visitedNodes.length - 1
      }`;

      const valorSucess = document.querySelectorAll(
        "[locationResult] .squareResult"
      );
      for (let index = 0; index < valorSucess.length; index++)
        valorSucess[index].setAttribute("class", "squareResult sucess");

      return;
    } else {
      //Caso não seja encontrada a posição ele executa o método novamente com a ultima arvore
      this.main();
    }
  };
}

function bfs() {
  renderResult();

  const bfs = new BFS(
    initialState.map((oi) => parseInt(oi.innerText == "" ? 0 : oi.innerText)),
    goalState
  );
  bfs.main();
}

//-------------------------------------------------------------------------------------------------
// Começo da A*

//Cada nó é uma combinação de peças diferentes
class Node {
  constructor(data, level, fval) {
    // array com os dados desse nó
    this.data = data;
    // Nivel que a arvore se encontra
    this.level = level;
    // Para o calculo da Distancia de manhattan
    this.fval = fval;
  }

  // Gerando o nó filho
  generateChild() {
    let { x, y } = this.find(this.data);
    const val_list = [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
    ];
    const children = [];
    for (const i in val_list) {
      const child = this.shuffle(
        this.data,
        x,
        y,
        val_list[i][0],
        val_list[i][1]
      );
      if (child !== null) {
        const childNode = new Node(child, this.level + 1, 0);
        children.push(childNode);
      }
    }
    return children;
  }

  // Responsável por movimentar as peças
  shuffle(puz, x1, y1, x2, y2) {
    if (x2 >= 0 && x2 < this.data.length && y2 >= 0 && y2 < this.data.length) {
      let temp_puz = [];
      temp_puz = puz.map((el) => el.map((element) => element));
      const temp = temp_puz[x2][y2];
      temp_puz[x2][y2] = temp_puz[x1][y1];
      temp_puz[x1][y1] = temp;
      return temp_puz;
    } else {
      return null;
    }
  }

  // Responsável por encontrar o branco no array
  find(puz) {
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data.length; j++) {
        if (puz[i][j] === 0) {
          return { x: i, y: j };
        }
      }
    }
  }
}

// Class do tabuleiro que é utilizada para armazenar o estado final e o
//estado inicial
class Puzzle {
  constructor(size, start, goal) {
    // Tamanho do Jogo
    this.n = size;
    // Seta o estado inicial
    this.start = new Node(start, 0, 0);
    // Seta o objetivo do jogo
    this.goal = goal;

    this.open = [];

    this.closed = [];

    this.started = false;
    this.finished = false;
    this.solution = undefined;
  }

  // Calcula o valor heuristico
  f(start) {
    return this.h(start.data, this.goal) + start.level;
  }

  // Calcula a distancia de manhattan
  h(start, goal) {
    let temp = 0;
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (start[i][j] != goal[i][j] && start[i][j] !== 0) {
          temp++;
        }
      }
    }
    return temp;
  }
  //Inicia a class e consequentemente o jogo
  initiate() {
    if (this.started) return;
    this.start.fval = this.f(this.start);
    this.open = [];
    this.closed = [];
    this.open.push(this.start);
    this.started = true;
  }
  //Define a melhor opção e verifica se finalizou
  proccess() {
    if (this.finished) return true;
    if (this.open.length === 0) return false;
    // Escolhe a melhor opção
    const cur = this.open.shift();

    if (cur.fval === cur.level) {
      this.finished = true;
      this.solution = cur;
      return true;
    }
    // Gera os filhos gerados a partir do nivel da arvore
    const temp = cur.generateChild();
    for (const i in temp) {
      const data = temp[i];
      data.fval = this.f(data);
      // Adiciona apenas se o open não estiver finalizado
      let aux = false;
      this.closed.map((el) => {
        if (this.h(data.data, el.data) === 0) aux = true;
      });
      if (!aux) this.open.push(data);
    }
    // adiciona os fechados
    this.closed.push(cur);
    // Embaralha as melhores opções
    this.open.sort((a, b) => {
      if (a.fval > b.fval) return 1;
      if (a.fval < b.fval) return -1;
      return 0;
    });
    return this.open[0].data;
  }

  //Método que troca as peças(swap) do A*
  mov(visited) {
    const locationResult = document.querySelectorAll("[locationResultaStar]");

    let vet = [];
    let cont = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        vet[i + j + cont] = visited[i][j];
      }
      cont += 2;
    }

    locationResult.forEach((item, index) => {
      if (vet[index] == 0) {
        item.querySelector("p").innerText = "";
        item.querySelector("div").setAttribute("class", "squareResult vazio");
      } else {
        item.querySelector("p").innerText = vet[index];
        item.querySelector("div").setAttribute("class", "squareResult");
      }
    });
  }
}

//ordem alatoria para a primeira tabela
function ordemAleatoria() {
  resetCost();
  const squares = [...document.getElementsByClassName("square")].sort(
    (a, b) => parseInt(a.innerText) - parseInt(b.innerText)
  );
  let valorTeste = [...document.querySelectorAll("[location]")];

  const bfs = new BFS(
    [
      parseInt(squares[0].innerText),
      parseInt(squares[1].innerText),
      parseInt(squares[2].innerText),
      parseInt(squares[7].innerText),
      0,
      parseInt(squares[3].innerText),
      parseInt(squares[6].innerText),
      parseInt(squares[5].innerText),
      parseInt(squares[4].innerText),
    ],
    []
  );
  const inicial = bfs.shuffle();

  for (let index = 0; index < 9; index++) {
    if (inicial[index] != 0)
      valorTeste[index].append(squares[inicial[index] - 1]);
  }
}

//Metodo que renderiza o jogo do força bruta
function renderResult() {
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
      } else {
        let squareResult = document.createElement("div");
        squareResult.setAttribute("class", "squareResult vazio");
        squareResult.setAttribute("id", i + j + cont);
        squareResult.innerHTML = `<p id=
          -1
         ></p>`;

        valorTeste[i + j + cont].append(squareResult);
      }
    }
    cont += 2;
  }
  initialState = [...valorTeste];
}

//Metodo que verifica se aquela organização das peças é valida e caso nao seja inicia em um novo nivel
function tester(puzzleAStar) {
  let aaa = [];
  let element = [];
  for (let index = 1; index <= 9; index++) {
    element.push(
      initialState[index - 1].innerText == ""
        ? 0
        : parseInt(initialState[index - 1].innerText)
    );
    if (index != 0 && index % 3 == 0) {
      aaa.push(element);
      element = [];
    }
  }

  if (!puzzleAStar.started || puzzleAStar.finished) {
    delete puzzleAStar;
    puzzleAStar = new Puzzle(3, aaa, goalStateMatrix);
    puzzleAStar.initiate();
  }

  let temp = puzzleAStar.proccess();
  if (temp === true) {
    const valorSucess = document.querySelectorAll(
      "[locationResultaStar] .squareResult"
    );
    for (let index = 0; index < valorSucess.length; index++)
      valorSucess[index].setAttribute("class", "squareResult sucess");
    return true;
  } else if (temp === false) return false;
  else {
    puzzleAStar.mov(temp);
    return null;
  }
}
//Metodo que inicia a busca em amplitude
async function aStar() {
  renderResultAStar();

  let temp;
  let aaa = [];
  let element = [];
  for (let index = 1; index <= 9; index++) {
    element.push(
      initialState[index - 1].innerText == ""
        ? 0
        : parseInt(initialState[index - 1].innerText)
    );
    if (index != 0 && index % 3 == 0) {
      aaa.push(element);
      element = [];
    }
  }
  let puzzleAStar = new Puzzle(3, aaa, goalStateMatrix);
  puzzleAStar.initiate();
  let cont = -1;
  do {
    temp = tester(puzzleAStar);
    cont++;
    await sleep();
  } while (temp === null);
  console.log("FOUND HEURISTICA = ", cont);
  let finalCost = document.getElementById("resultadoAstarLabbel");
  finalCost.innerHTML = `Número de comparações = ${cont}`;
}

// Método responsável por renderizar o A*
function renderResultAStar() {
  let valorTeste = [...document.querySelectorAll("[LocationResultaStar]")];
  let locationPadrao = [...document.querySelectorAll("[LocationStar]")];
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
      } else {
        let squareResult = document.createElement("div");
        squareResult.setAttribute("class", "squareResult vazio");
        squareResult.setAttribute("id", i + j + cont);
        squareResult.innerHTML = `<p id=
          -1
         ></p>`;

        valorTeste[i + j + cont].append(squareResult);
      }
    }
    cont += 2;
  }
  initialState = [...valorTeste];
}

// Reset da quantidade de comparações
function resetCost() {
  let finalCost = document.getElementById("resultadoCegaLabbel");
  finalCost.innerHTML = "";
  finalCost = document.getElementById("resultadoAstarLabbel");
  finalCost.innerHTML = "";
}

// Método que inicia os dois ao mesmo tempo
function play() {
  resetCost();
  bfs();
  aStar();
}

ordemAleatoria();
