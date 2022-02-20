let initialState;
const goalState = [1, 2, 3, 8, 0, 4, 7, 6, 5];

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

  //   initialState[0].innerText
  checkGoalState(value) {
    // value is array
    if (JSON.stringify(goalState).indexOf(JSON.stringify(value)) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  // GET POSSIBLE MOVES
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

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // initialState.find((item) => item.innerText == '')
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
    await this.sleep(100);
    // this.mov(this.initialState);

    if (this.checkGoalState(visited)) {
      // this.mov(visited);
      console.log("FOUND");

      const valorSucess = document.getElementsByClassName("squareResult");
      for (let index = 0; index < valorSucess.length; index++)
        valorSucess[index].setAttribute("class", "squareResult sucess");

      // let output = document.getElementById("output");

      // let t = "";
      // this.visitedNodes.forEach((item) => {
      //   console.log("passei");

      //   t += '<div class="node">';
      //   item.forEach((value) => {
      //     console.log("result", value);
      //     t += '<div class="node_item">' + value + "</div>";
      //   });
      //   t += '<div class="right_arrow">&rarr;</div>';
      //   t += "</div>";
      // });

      // output.innerHTML = t;

      console.log(this.visitedNodes.length);

      return;
    } else {
      this.main();
    }
  };
}

//ordem alatoria para a primira tabela
function ordemAleatoria() {
  const squares = [...document.getElementsByClassName("square")];
  let valorTeste = [...document.querySelectorAll("[location]")];

  // console.log(squares, valorTeste);
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
  valorTeste[4].append(squares[7]);

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

ordemAleatoria();