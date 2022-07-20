'use strict'


var MINE = '<img src = "assets/img/bomb.gif"/>'
var gBoard
const RESETLEVEL = '<img src = "assets/img/smiley.gif"/>'
var gLevel
var isOn
var shownCount
var markedCount
var secsPassed
var starterGBoard
var gGame = {
    isOn: isOn,
    shownCount: shownCount,
    markedCount: markedCount,
    secsPassed: secsPassed
}
// var redo = setInterval(startTimer, 47)
var stopWatch = document.querySelector('.timer')
var miliSec = 0
var sec = 0
var min = 0
var count = false

// (Math.random() > 0.5) ? BOMB : ' '


function init(level) {

    // console.log(level)
    gLevel = chooseLevel(level)
    // console.log(gLevel)
    starterGBoard = MatMines(gLevel)
    console.log(starterGBoard)
    gBoard = createBoard(starterGBoard)
    renderBoard(gBoard, '.board')
    var elTable = document.querySelector('table')
    elTable.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })

}
//RETURN AN OBJECT WITH MINES AMOUNT AND CURRENT LEVEL 
function chooseLevel(level) {

    if (level == 4) {
        var mines = 2
    }
    if (level == 8) {
        var mines = 12
    }
    if (level == 12) {
        var mines = 30
    }


    gLevel = {
        size: level,
        mineCount: mines
    }
    return gLevel
}


//CREATES A MATRIX WITH BOMBS IN A RANDOM PLACMENT ACOORDING TO HOW MUCH BOBS ARE ALLOWED TO BE ON THE BOARD
function MatMines(gLevel) {
    var mines = gLevel.mineCount
    console.log(mines)
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            if ((Math.random() > 0.8) && (mines > 0) && (board[i][j] != '*')) {
                board[i][j] = '*'
                mines--
            }
            else { board[i][j] = '' }
            console.log(i, j)
            if ((i == gLevel.size - 1) && j == (gLevel.size - 1) && mines > 0) {
                i = 0
                j = 0
            }
            // console.log(i,j)
        }
    }
    return board;
}
//RETURNS AMOUNT OF TIMES NEIGHBORING CELLS WERE EQUAL TO TRUE
function countNeighborMines(cellI, cellJ, mat) {
    var neighborsCount = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j] == '*') neighborsCount++;
        }
    }
    return neighborsCount;
}

//CHECKS EVERY PLACE ON THE MATMINES AND PLACES AN OBJECT ACOORDINGLY
function createBoard(starterGBoard) {
    var gboard = [];
    for (var i = 0; i < starterGBoard.length; i++) {
        gboard[i] = []
        for (var j = 0; j < starterGBoard.length; j++) {
            var cellObj = {}
            var minesAroundCount = countNeighborMines(i, j, starterGBoard)
            if (starterGBoard[i][j] == '*') {
                var isMine = true
                cellObj.minesAroundCount = null
                // console.log(isMine)
            }
            else {
                var isMine = false
                cellObj.minesAroundCount = minesAroundCount
                // console.log(isMine)
            }
            cellObj.isMine = isMine
            cellObj.isShown = false
            cellObj.isMarked = false
            // console.log(cellObj)
            gboard[i][j] = cellObj
        }
    }
    return gboard;
}


//PRINTS THE PLACES WITH OBJECT SHOWING THAT PROPERTY ISMINE =TRUE
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            const className = 'cell cell-' + i + '-' + j
            if (board[i][j].isShown == false && board[i][j].isMine == true) {
                var cell = MINE
                strHTML += `<td onmousedown="onCellClicked(this, ${i}, ${j})"><span style="visibility:hidden;" class="${className}"  data-i="${i}" data-j="${j}" >${cell}</span></td>`
            }
            else {
                var Color = numColor(board[i][j].minesAroundCount)
                var cell = board[i][j].minesAroundCount
                strHTML += `<td ${Color} onmousedown="onCellClicked(this, ${i}, ${j})"><span style="visibility:hidden;" class="${className}"  data-i="${i}" data-j="${j}" >${cell}</span></td>`
            }
        }
        strHTML += '</tr>'
    }

    // console.log(strHTML);
    var elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML


}

// function onCellClicked(elCell, i, j){
//     var elCellContentName = getClassName({i,j})
//     console.log(elCellContentName)
//     var elCellContent = document.querySelector('.'+elCellContentName)
//     console.log(elCellContent)
//     elCellContent.style.visibility = 'visible'
//     if(elCellContent.innerText == MINE){

//     }

// }



function numColor(num) {
    if (num == 1) return 'style="color:green;"'
    if (num == 2) return 'style="color:blue;"'
    if (num == 3) return 'style="color:yellow;"'
    if (num == 4) return 'style="color:orange;"'
    if (num == 5) return 'style="color:purple;"'
    if (num == 6) return 'style="color:magenta;"'
    if (num == 7) return 'style="color:red;"'
}

// function getGameClassName(location) {
//     var cellClass = 'cell-' + location.i + '-' + location.j;
//     return cellClass;
// }
function onCellMarked() {
    var elTd = document.querySelector('td')
    elTable.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        alert('success!');
        return false;
    }, false);
}


function onCellClicked(elCell, i, j) {
    // var elTd = document.querySelector('td')
    // elTd.addEventListener('contextmenu', function (ev) {
    //     ev.preventDefault();
    //     return false;
    // }, false);
    var elTd = document.querySelector('td')
    elTd.addEventListener('contextmenu', (event) => {
        console.log(event.button)
    })

    // window.addEventListener('click', (event) => {
    //     console.log(event.button)
    //   })
    // console.log('cellI, cellJ', cellI, cellJ)
    // console.log('elCell.dataset:', elCell.dataset)
    // if (gBoard[cellI][cellJ] === LIFE) {
    //     // Model
    //     gBoard[cellI][cellJ] = SUPER_LIFE

    //     // DOM
    //     elCell.innerText = SUPER_LIFE


    //     blowUpNegs(cellI, cellJ)
    // }

    // console.table(gBoard)
}


function leftClick(elCell, i, j) {


    var elCellContentName = getClassName({ i, j })
    // console.log(elCellContentName)
    var elCellContent = document.querySelector('.' + elCellContentName)
    // console.log(elCellContent)

    if (gBoard[i][j].minesAroundCount == 0) {
        console.log('it is zero')
        //model
        gBoard[i][j].isShown = true
        //DOM
        elCellContent.innerText = ''
        displayNeighbors(i, j)
    }
    if (gBoard[i][j].minesAroundCount != 0) {
        if (gBoard[i][j].isMine) {
            console.log('is mine')
            // gameOver()
            elCellContent.style.visibility = 'visible'
        }
        else {
            elCellContent.style.visibility = 'visible'
            gBoard[i][j].isShown = true
        }

    }
}


function rightClick(elCell, i, j) {

}





function displayNeighbors(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isMine) { continue }
            if (gBoard[i][j].minesAroundCount == 0 && !gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true
                // console.log(gBoard[i][j].isShown)
                // console.log('neighbor zero')
                displayNeighbors(i, j)
            }

            //     // Model 
            gBoard[i][j].isShown = true
            // DOM
            renderGameCell(i, j)

        }
    }
    return
}
//MAKES CURRENT CELL VISIBLE 
function renderGameCell(i, j) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    if (gBoard[i][j].minesAroundCount == 0) {
        elCell.innerText = ''
    }
    elCell.style.visibility = 'visible'
}

function levels(btnLevel) {
    if (btnLevel.innerText == '4x4') {
        init(4)
    }
    if (btnLevel.innerText == '8x8') {
        init(8)
    }
    if (btnLevel.innerText == '12x12') {
        init(12)
    }
}

function gameOver() {

}
function checkVictory() {
    // if()

}

// function restartBtn(gBoard){
//     var lengthBoard = gBoard.length
//     console.log(lengthBoard)
//     init(lengthBoard)
// }




