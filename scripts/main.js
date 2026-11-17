let caseList = document.getElementById("case-list");
let submitButton = document.getElementById("submit-button");
let randMovesSelect = document.getElementById("rand-moves-select");
let secondH2 = document.getElementById("second-h2");
let firstH2 = document.getElementById("first-h2");
let training = false;
let scrambles = []
let nNS = 131;
let moves = ["R", "R'", "L", "L'", "U", "U'", "B", "B'"]
let nRandMoves = 1;
let cases = {
    "basic-insert": "abc123"
};

function mainLoop(){
    nsCase = scrambles[randInt(nNS)];
    scram = nsCase[randInt(nsCase.length)];
    console.log(scram);
}

async function loadData(){
    const response = await fetch("./scrambles.json");
    data = await response.json();
    scrambles = Object.values(data);
    mainLoop();
}

function randInt(max){
    return Math.floor(max*Math.random());
}

loadData();

submitButton.addEventListener("click", () => {
    caseList.style = "display: none";
    submitButton.style = "display: none";
    randMovesSelect.style = "display: none";
    secondH2.style = "display: none";
    training = true;

    firstH2.textContent = "";
});

selected = [];
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
