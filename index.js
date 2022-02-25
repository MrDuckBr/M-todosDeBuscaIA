let initialState;
const goalState = [1, 2, 3, 8, 0, 4, 7, 6, 5];
const goalStateMatrix = [
  [1, 2, 3],
  [8, 0, 4],
  [7, 6, 5],
];

//Método que define um tempo de espera para que a atualização da matriz possa ser vista.
function sleep(ms) {
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

  //Método responsavel por iniciar a BFS( Força Bruta)
  main = async function () {
    let index = this.Queue[0].indexOf(0);
    let moves = this.getPossibleMoves(index);

    // GET CHILDS
    let childNodes = moves.map((item) => {
      let temp = [...this.Queue[0]];
      return this.swap(temp, index, item.swap);
    });

    childNodes.forEach((item) => {
      if (JSON.stringify(this.Queue).indexOf(JSON.stringify(item)) == -1) {
        // IF NOT FOUND ON QUEUE THEN INSERT IN QUEUE AND NOT IN VISITED
        if (
          JSON.stringify(this.visitedNodes).indexOf(JSON.stringify(item)) == -1
        ) {
          this.Queue.push(item);
        }
      }
    });

    let visited = this.Queue.splice(0, 1)[0];
    this.visitedNodes.push(visited);

    this.mov(visited);
    await sleep(1);
    // this.mov(this.initialState);

    if (this.checkGoalState(visited)) {
      // this.mov(visited);
      console.log("FOUND CEGA = ", this.visitedNodes.length - 1);
      

      const valorSucess = document.getElementsByClassName("squareResult");
      for (let index = 0; index < valorSucess.length; index++)
        valorSucess[index].setAttribute("class", "squareResult sucess");

      return;
    } else {
      this.main();
    }
  };
}

class Node {
  constructor(data, level, fval) {
    // sets data arr
    this.data = data;
    // sets node's level
    this.level = level;
    // sets node's Manhattan Distance
    this.fval = fval;
  }

  // generate node children
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

  // move pieces
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

  // finds blank in data
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

class Puzzle {
  constructor(size, start, goal) {
    // sets Puzzle size
    this.n = size;
    // sets start state
    this.start = new Node(start, 0, 0);
    // sets goal state
    this.goal = goal;
    // open options
    this.open = [];
    // closed options
    this.closed = [];
    // control vars
    this.started = false;
    this.finished = false;
    this.solution = undefined;
  }

  // gets heuristc value
  f(start) {
    return this.h(start.data, this.goal) + start.level;
  }

  // gets Manhattan Distance
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

  initiate() {
    if (this.started) return;
    this.start.fval = this.f(this.start);
    this.open = [];
    this.closed = [];
    this.open.push(this.start);
    this.started = true;
  }

  proccess() {
    if (this.finished) return true;
    if (this.open.length === 0) return false;
    // picks best option
    const cur = this.open.shift();
    // checks if cur is goal
    if (cur.fval === cur.level) {
      this.finished = true;
      this.solution = cur;
      return true;
    }
    // generate cur childs
    const temp = cur.generateChild();
    for (const i in temp) {
      const data = temp[i];
      data.fval = this.f(data);
      // only add to open if not already done
      let aux = false;
      this.closed.map((el) => {
        if (this.h(data.data, el.data) === 0) aux = true;
      });
      if (!aux) this.open.push(data);
    }
    // closes cur
    this.closed.push(cur);
    // sorts best available options
    this.open.sort((a, b) => {
      if (a.fval > b.fval) return 1;
      if (a.fval < b.fval) return -1;
      return 0;
    });
    return this.open[0].data;
  }

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

//ordem alatoria para a primira tabela
function ordemAleatoria() {
  const squares = [...document.getElementsByClassName("square")];
  let valorTeste = [...document.querySelectorAll("[location]")];

  // aleatorio corre o risco de nao ter solucao

  // shuffle(squares);
  // shuffle(valorTeste);
  // for (let index = 0; index < 8; index++) {
  //   valorTeste[index].append(squares[index]);
  // }
  valorTeste[0].append(squares[0]);
  valorTeste[1].append(squares[1]);
  valorTeste[2].append(squares[2]);

  valorTeste[5].append(squares[3]);
  valorTeste[8].append(squares[4]);
  valorTeste[7].append(squares[5]);

  valorTeste[6].append(squares[6]);
  valorTeste[3].append(squares[7]);

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
}

function Table() {
  //ordemAleatoria();
  renderResult();

  const bfs = new BFS(
    initialState.map((oi) => parseInt(oi.innerText == "" ? 0 : oi.innerText)),
    goalState
  );
  bfs.main();
}

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
    const valorSucess = document.getElementsByClassName("squareResult");
    for (let index = 0; index < valorSucess.length; index++)
      valorSucess[index].setAttribute("class", "squareResult sucess");
    return true;
  } else if (temp === false) return false;
  else {
    puzzleAStar.mov(temp);
    return null;
  }
}



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
    await sleep(1);
  } while (temp === null);
  console.log("FOUND HEURISTICA = ", cont);
}


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

function play(){
  Table()
  aStar()
}

ordemAleatoria();
