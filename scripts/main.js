let caseList = document.getElementById("case-list");
let submitButton = document.getElementById("submit-button");
let randMovesSelect = document.getElementById("rand-moves-select");
let secondH2 = document.getElementById("second-h2");
let firstH2 = document.getElementById("first-h2");
let thirdH2 = document.getElementById("third-h2");
let customLayerInput = document.getElementById("custom-layer-input");
let training = false;
let scrambles = []
let nNS = 131;
let moves = ["R", "R'", "L", "L'", "U", "U'", "B", "B'"]
let nRandMoves = 0;
let cases = {
    "basic-insert": ["L' U' L", "R U R'"],
    "alt": ["L' U' L B R' L'", "R U R' B' L R"],
    "awkward": ["L' U' L B' R", "R U R' B L'"],
    "double-back": ["L R' L U'"],
    "double-insert": ["L B R' L' R' U"],
    "double-side": ["U B' L' U"],
    "long-insert": ["L' U' L'", "R U R"],
    "nightmare": ["R U R' B' R' B'", "L' U' L B L B"],
    "rurprime": ["B L' B'", "B' R B"],
    "side-insert": ["B U' R'", "B' U L"],
    "sledge": ["L R' L' B", "B' U L U'"],
    "topside": ["B U' R", "R' L R'"],
    "twist": ["L' U' L B", "R U R' B'"],
    "uprimeru": ["U' B' R", "U B L'"],
    "zig-zag": ["R' U' B L"]
};
let selected = [];
let selectedLayers = [];

function mainLoop(){
    let nsCase = scrambles[randInt(nNS)];
    let scram = nsCase[randInt(nsCase.length)];
    if(selectedLayers.length !== 0){
        let layerArray = selectedLayers[randInt(selectedLayers.length)];
        let layerScram = layerArray[randInt(layerArray.length)];
        scram = scram + " " + layerScram;
    }
    for(i = 0; i < nRandMoves; i++){
        let lastMove = "";
        let randMove = "";
        if(i > 0){
            if(scram.at(-1) === "'"){
                lastMove = scram.at(-2);
            }
            else{
                lastMove = scram.at(-1);
            }
            randMove = lastMove;
        }
        randMove = moves[randInt(moves.length)];
        while(randMove[0] === lastMove){
            randMove = moves[randInt(moves.length)];
        }
        scram = scram + " " + randMove;
    }
    moves = scram.split(" ");
    shortening = true;
    while(shortening){
        shortening = false;
        for(i = moves.length-1; i > 0; i--){
            if(moves[i].length === 2 && moves[i][1] === "'"){ // R'
                if(moves[i-1] === moves[i]){ // R' R' = R
                    let move = moves[i];
                    moves.splice(i-1, 2, move[0]);
                    shortening = true;
                    break;
                }
                else if(moves[i-1] === moves[i][0]){ // R R' = 1
                    moves.splice(i-1, 2);
                    shortening = true;
                    break;
                }
            }
            else{ // R
                if(moves[i-1] === moves[i]){ // R R = R'
                    let move = moves[i];
                    moves.splice(i-1, 2, move+"'");
                    shortening = true;
                    break;
                }
                else if(moves[i-1][0] === moves[i]){ // R' R = 1
                    moves.splice(i-1, 2);
                    shortening = true;
                    break;
                }
            }
        }
    }
    scram = "";
    for(m of moves){
        if(scram === ""){
            scram = m;
        }
        else{
            scram = scram + " " + m;
        }
    }
    firstH2.textContent = scram;
}

async function loadData(){
    const response = await fetch("./scrambles.json");
    data = await response.json();
    scrambles = Object.values(data);
}

function randInt(max){
    return Math.floor(max*Math.random());
}

loadData();

submitButton.addEventListener("click", () => {
    caseList.style = "display: none";
    randMovesSelect.style = "display: none";
    secondH2.style = "display: none";
    thirdH2.style = "display: none";
    customLayerInput.style = "display: none";
    training = true;

    firstH2.textContent = "";
    submitButton.textContent = "Next";
    let customLayers = customLayerInput.value;
    for(layer of selected){
        selectedLayers.push(cases[layer]);
    }
    if(customLayers !== ""){
        for(layer of customLayers.split(",")){
            layer = layer.trim();
            selectedLayers.push([layer]);
        }
    }
    
    nRandMoves = Math.max(Math.min(randMovesSelect.value, 10), 0);
    mainLoop();
});

if(localStorage.getItem("selected")){
    selected = JSON.parse(localStorage.getItem("selected"));
    for(button of document.getElementsByClassName("case-button")){
        if(selected.includes(button.id.slice(0,-7))){
            button.setAttribute("selected", "true");
            button.style = "background-color: blue";
        }
    }
}

for(let button of document.getElementsByClassName("case-button")){
    button.addEventListener("click", () => {
        if(button.getAttribute("selected") !== "true"){
            button.style = "background-color: blue";
            button.setAttribute("selected", "true");
            selected.push(button.id.slice(0,-7));
            localStorage.setItem("selected", JSON.stringify(selected));
        }
        else{
            button.style = "background-color: rgb(57, 57, 57)";
            button.setAttribute("selected", "false");
            selected = selected.filter((item) => {
                return item !== button.id.slice(0,-7);
            });
            localStorage.setItem("selected", JSON.stringify(selected));
        }
    })
}
