'use strict'


var MINE
var FLAG
var gBoard
const RESETLEVEL = '<img src = "assets/img/smiley.gif"/>'
var gLevel
var starterGBoard
var gGame = {}

// var redo = setInterval(startTimer, 47)
var stopWatch = document.querySelector('.timer')
var miliSec = 0
var sec = 0
var min = 0
var count = false
var randomArrayMines = []

// (Math.random() > 0.5) ? BOMB : ' '


function init(level) {
    gGame.isOn = true
    MINE = '<img src = "assets/img/bomb.gif"/>'
    FLAG = '<img src = "assets/img/flag.gif"/>'
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gBoard = []
    // randomArrayMines=[]
    // console.log(level)
    gLevel = chooseLevel(level)
    // console.log(gLevel)
    starterGBoard = MatMines(gLevel)
    console.log(starterGBoard)
    gBoard = createBoard(starterGBoard)
    renderBoard(gBoard, '.board')

}
//RETURN AN OBJECT WITH MINES AMOUNT AND CURRENT LEVEL 
function chooseLevel(level) {

    if (level == 4) {
        var minesCount = 2
    }
    if (level == 8) {
        var minesCount = 12
    }
    if (level == 12) {
        var minesCount = 30
    }


    gLevel = {
        size: level,
        mineCount: minesCount
    }
    return gLevel
}


//CREATES A MATRIX WITH BOMBS IN A RANDOM PLACMENT ACOORDING TO HOW MUCH BOBS ARE ALLOWED TO BE ON THE BOARD
function MatMines(gLevel) {
    var z = 0
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = randomArrayMines[z]
            z++
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
    for (var i = 0; i < starterGBoard.length; i++) {
        gBoard[i] = []
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
            gBoard[i][j] = cellObj
        }
    }
    return gBoard;
}


//PRINTS THE PLACES WITH OBJECT SHOWING THAT PROPERTY ISMINE =TRUE
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})" class="${className}"></td>`
        }
        strHTML += '</tr>'
    }

    // console.log(strHTML);
    var elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML


}

// function onCellClicked(elCell, i, j){
//     var elCellName = getClassName({i,j})
//     console.log(elCellName)
//     var elCell = document.querySelector('.'+elCellName)
//     console.log(elCell)
//     elCell.style.visibility = 'visible'
//     if(elCell.innerText == MINE){

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


function onCellMarked(elCell, i, j) {
    if (gGame.isOn) {
        console.log('entered right click')
        // debugger
        var elTable = document.querySelector('table')
        elTable.addEventListener('contextmenu', (event) => {
            event.preventDefault()
        })

        if (gBoard[i][j].isMarked) {
            console.log('remove')
            gBoard[i][j].isMarked = false
            gGame.markedCount--
            renderGameCell({ i, j }, '')
            // checkVictory()
            return
        }
        if (!gBoard[i][j].isMarked) {
            // debugger
            console.log('add')
            gBoard[i][j].isMarked = true
            gGame.markedCount++
            renderGameCell({ i, j }, FLAG)
            // checkVictory()
            return
        }

        ////////////////////////////


    }
}


function onCellClicked(elCell, i, j) {
    if (gGame.isOn) {
        if (gBoard[i][j].minesAroundCount == 0) {
            if (gBoard[i][j].isShown) {

            }
            else {
                gBoard[i][j].isShown = true
                gGame.shownCount++
                makeVisible(elCell, i, j)
                displayNeighbors(elCell, i, j)
                // checkVictory(i, j)
            }

        }
        if (gBoard[i][j].isMine) {
            if (gBoard[i][j].isShown) {

            }
            else {
                gBoard[i][j].isShown = true
                makeVisible(elCell, i, j)
                // checkVictory(i, j)
            }

        }
        if (gBoard[i][j].isMarked) {

        }
        if (gBoard[i][j].minesAroundCount > 0) {//if it is a number other than 0
            if (gBoard[i][j].isShown) {

            }
            else {
                gBoard[i][j].isShown = true
                gGame.shownCount++
                makeVisible(elCell, i, j)
                // checkVictory(i, j)
            }
        }


    }
}




function renderGameCell(location, value) {
    // Select the elCell and set the value
    var elCellName = getClassName(location)
    var elCell = document.querySelector('.' + elCellName)
    elCell.innerHTML = value
}



function displayNeighbors(elCell, cellI, cellJ) {
    console.log(elCell)
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            ////////////////////
            // debugger
            console.log(gBoard[i][j].minesAroundCount)
            if (gBoard[i][j].minesAroundCount == 0) {
                if (gBoard[i][j].isShown) {

                }
                else {
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                    // makeVisible(i, j)
                    displayNeighbors(elCell,i, j)
                    // checkVictory(i, j)
                }
            }
            if (gBoard[i][j].isMine) {

            }
            if (gBoard[i][j].isMarked) {

            }
            if (gBoard[i][j].minesAroundCount > 0) {//if it is a number other than 0
                if (gBoard[i][j].isShown) {

                }
                else {
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                    console.log(gBoard[i][j].minesAroundCount)
                    // makeVisible(i, j)
                    renderGameCell({i,j},gBoard[i][j].minesAroundCount)
                    // checkVictory(i, j)
                }

            }
        }

    }
}


// if (gBoard[i][j].minesAroundCount == 0) {/////////////////////////////
//     elCell.innerText = ''
// }


//MAKES CURRENT CELL VISIBLE, DOM
function makeVisible(elCell, i, j) {
    // if (gBoard[i][j].isMarked==false) {
    if (gBoard[i][j].minesAroundCount == 0) {
        console.log('is 0')
        if (gBoard[i][j].isMarked) {

        }
        else {
            gBoard[i][j].isShown = true
        }
    }
    if (gBoard[i][j].isMine) {
        if (gBoard[i][j].isMarked) {

        }
        else {
            renderGameCell({ i, j }, MINE)
        }

    }

    if (gBoard[i][j].minesAroundCount > 0) {
        if (gBoard[i][j].isMarked) {

        }
        else {
            renderGameCell({ i, j }, gBoard[i][j].minesAroundCount)
        }
    }
    // }

}

function makeHidden(elCell, i, j) {
    if (gBoard[i][j].isMine) {
        if (gBoard[i][j].isMarked) {

        }
        else {
            renderGameCell({ i, j }, '')
        }

    }
    if (gBoard[i][j].isMarked) {
        if (!gBoard[i][j].isShown) {

        }
        else {
            renderGameCell({ i, j }, '')
        }
    }
    if (gBoard[i][j].minesAroundCount > 0) {
        renderGameCell({ i, j }, '')
    }
}

function levels(btnLevel) {
    if (btnLevel.innerText == '4x4') {
        var minesLeft = 2
        for (var i = 0; i < 16; i++) {
            if (minesLeft > 0) { randomArrayMines.push('*') }
            else { randomArrayMines.push('') }
            minesLeft--
        }
        randomArrayMines = randomArraySort(randomArrayMines)
        init(4)
    }
    if (btnLevel.innerText == '8x8') {
        var minesLeft = 12
        for (var i = 0; i < 84; i++) {
            if (minesLeft > 0) { randomArrayMines.push('*') }
            else { randomArrayMines.push('') }
            minesLeft--
        }
        randomArrayMines = randomArraySort(randomArrayMines)
        init(8)
    }
    if (btnLevel.innerText == '12x12') {
        var minesLeft = 30
        for (var i = 0; i < 144; i++) {
            if (minesLeft > 0) { randomArrayMines.push('*') }
            else { randomArrayMines.push('') }
            minesLeft--
        }
        randomArrayMines = randomArraySort(randomArrayMines)
        init(12)
    }
}

function gameOver() {

}
function checkVictory(i, j) {
    console.log(gGame.markedCount, gLevel.mineCount)
    console.log(gGame.shownCount, ((gLevel.size * gLevel.size) - gLevel.mineCount))
    if (gGame.markedCount == gLevel.mineCount && gGame.shownCount == ((gLevel.size ** 2) - gLevel.mineCount)) {
        console.log('winnn')
        gGame.isOn = false
        // gameOver()
    }
    if (gBoard[i][j].isMine) {
        displayAllMines()
        gGame.isOn = false
        console.log('lose')
        // gameOver()
    }

}
function displayAllMines() {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
                renderGameCell({ i, j }, MINE)
                makeVisible(i, j)
            }
            else { makeVisible(i, j) }
        }
    }
}


// function restartBtn(gBoard){
//     var lengthBoard = gBoard.length
//     console.log(lengthBoard)
//     init(lengthBoard)
// }




