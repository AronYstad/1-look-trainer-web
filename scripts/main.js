selected = [];

for(let button of document.getElementsByClassName("case-button")){
    button.addEventListener("click", () => {
        if(button.getAttribute("selected") !== "true"){
            button.style = "background-color: blue";
            button.setAttribute("selected", "true");
            selected.push(button.id.slice(0,-7));
        }
        else{
            button.style = "background-color: rgb(57, 57, 57)";
            button.setAttribute("selected", "false");
            selected = selected.filter((item) => {
                return item !== button.id.slice(0,-7);
            });
        }
    })
}
