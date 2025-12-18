
export const TableFun = () =>{
var tableTrigger = document.querySelectorAll('.-table-trigger');
        console.log(tableTrigger);
        tableTrigger && tableTrigger.forEach((tableTrigger) => {
          tableTrigger.addEventListener('click', ()=> {
            let parentDiv = tableTrigger.closest('tbody').nextElementSibling;
            console.log(parentDiv);
            if (parentDiv && parentDiv.classList.contains('-hide')) {
              parentDiv.classList.remove('-hide');
              tableTrigger.classList.add('-active')
            } else {
                parentDiv.classList.add('-hide');
                tableTrigger.classList.remove('-active')
            }
          });
        });
    }