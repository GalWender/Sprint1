'use strict'
const NORMAL = '<img src="assets/img/normal.gif"/>';
const LOSE = '<img src="assets/img/lose.gif"/>'
const WIN = '<img src="assets/img/win.gif"/>'
var MINE
var FLAG
var gBoard
const RESETLEVEL = '<img src = "assets/img/smiley.gif"/>'
var gLevel
var starterGBoard
var gGame = {}

var startWatch
var stopWatch
var miliSec
var sec
var min
var watchIsOn
var randomArrayMines = []
var firstClick
var startIsMine
var lives
var elLives
var restart
var safeClick
var elsafeClick
var elHighScore
var highScore
var elHints
var hints
var hintOn



function init(level) {
    elHints = document.querySelector('.hintsClick')

    miliSec = 0
    sec = 0
    min = 0
    elHighScore = document.querySelector('.highScore')
    elHighScore.innerText = localStorage.getItem('highScore')
    console.log(localStorage.getItem('highScore'))
    stopWatch = document.querySelector('.timer')
    elsafeClick = document.querySelector('.safeClick')
    restart = document.querySelector('.restart')
    restart.innerHTML = NORMAL
    startIsMine = true
    watchIsOn = false
    firstClick = true
    hintOn = false
    gGame.isOn = true
    MINE = '<img src = "assets/img/bomb.gif"/>'
    FLAG = '<img src = "assets/img/flag.gif"/>'
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gGame.lives = 3
    gGame.safeClick = 3
    gGame.hints = 3
    elsafeClick.innerText = '3'
    elHints.innerText = '3'
    elLives = document.querySelector('.lives')
    elLives.innerText = '3'
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
///////////////////////////////////////////// make the hints work on all cells
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
        var elTable = document.querySelector('table')
        elTable.addEventListener('contextmenu', (event) => {
            event.preventDefault()
        })

        if (gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
            console.log('remove')
            gBoard[i][j].isMarked = false
            gGame.markedCount--
            renderGameCell({ i, j }, '')
            checkVictory(i, j)
            return
        }
        if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
            // debugger
            console.log('add')
            gBoard[i][j].isMarked = true
            gGame.markedCount++
            renderGameCell({ i, j }, FLAG)
            checkVictory(i, j)
            return
        }
    }
}


function onCellClicked(elCell, i, j) {
    if (hintOn && gBoard[i][j].isShown==false) {
        elCell.style.backgroundColor = '#11414f'
        gBoard[i][j].isShown = true
        makeVisible(elCell, i, j)
        displayNeighbors(elCell, i, j)
        setTimeout(function () {
            elCell.style.backgroundColor = 'rgb(224, 73, 73)'
            gBoard.isShown = false
            renderGameCell({ i, j }, '')
            hintOn = false
        }, 1000, elCell, i, j)
    }
    if (firstClick && gGame.isOn) {
        firstClick = false
        watchIsOn = true
        startWatch = setInterval(startTimer, 47)
    }
    if (gGame.isOn) {
        if (gBoard[i][j].minesAroundCount == 0) {
            if (gBoard[i][j].isShown) {

            }
            else {
                elCell.style.backgroundColor = '#11414f'
                gBoard[i][j].isShown = true
                gGame.shownCount++
                makeVisible(elCell, i, j)
                displayNeighbors(elCell, i, j)
                checkVictory(i, j)
            }

        }
        if (gBoard[i][j].isMine) {
            if (startIsMine == false) {
                if (gBoard[i][j].isShown) {

                }
                else {
                    gGame.lives--
                    elLives = document.querySelector('.lives')
                    elLives.innerText = gGame.lives.toString()
                    elCell.style.backgroundColor = '#11414f'
                    gBoard[i][j].isShown = true
                    makeVisible(elCell, i, j)
                    checkVictory(i, j)
                }
            }
            else {
                gLevel.mineCount--
                startIsMine = false
                gBoard[i][j].isMine = false
                gBoard[i][j].minesAroundCount = 0
                elCell.style.backgroundColor = '#11414f'
                gBoard[i][j].isShown = true
                gGame.shownCount++
                makeVisible(elCell, i, j)
                displayNeighbors(elCell, i, j)
                checkVictory(i, j)
            }

        }
        if (gBoard[i][j].isMarked) {

        }
        if (gBoard[i][j].minesAroundCount > 0) {//if it is a number other than 0
            if (gBoard[i][j].isShown) {

            }
            else {
                elCell.style.backgroundColor = '#11414f'
                gBoard[i][j].isShown = true
                gGame.shownCount++
                makeVisible(elCell, i, j)
                checkVictory(i, j)
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
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].minesAroundCount == 0) {
                if (hintOn&& gBoard[i][j].isShown==false) {
                    elCell.style.backgroundColor = '#11414f'
                    gBoard[i][j].isShown = true
                    makeVisible(elCell, i, j)
                    setTimeout(function () {
                        elCell.style.backgroundColor = 'rgb(224, 73, 73)'
                        gBoard.isShown = false
                        renderGameCell({ i, j }, '')
                        hintOn = false
                    }, 1000, elCell, i, j)
                }
                if (gBoard[i][j].isShown) {
                }
                else {
                    var elCellClassName = getClassName({ i, j })
                    var elCellNeighbor = document.querySelector('.' + elCellClassName)
                    elCellNeighbor.style.backgroundColor = '#11414f'
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                    checkVictory(i, j)
                    displayNeighbors(elCell, i, j)
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
                    var elCellClassName = getClassName({ i, j })
                    var elCellNeighbor = document.querySelector('.' + elCellClassName)
                    elCellNeighbor.style.backgroundColor = '#11414f'
                    gBoard[i][j].isShown = true
                    gGame.shownCount++
                    console.log(gBoard[i][j].minesAroundCount)
                    renderGameCell({ i, j }, gBoard[i][j].minesAroundCount)
                    checkVictory(i, j)
                }

            }
        }

    }
}



//MAKES CURRENT CELL VISIBLE, DOM
function makeVisible(elCell, i, j) {
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



function checkVictory(i, j) {
    restart = document.querySelector('.restart')
    console.log(gLevel.mineCount, gGame.markedCount)
    console.log(((gLevel.size * gLevel.size) - gLevel.mineCount), gGame.shownCount)
    if ((gGame.shownCount == ((gLevel.size * gLevel.size) - gLevel.mineCount)) && gGame.lives > 0) {
        restart.innerHTML = WIN
        watchIsOn = false
        clearInterval(startWatch)
        gGame.secsPassed = sec
        console.log(gGame.secsPassed)
        if (localStorage.getItem('highScore') > gGame.secsPassed) {
            localStorage.setItem('highScore', gGame.secsPassed)
        }
        console.log(localStorage.getItem('highScore'))
        firstClick = true
        console.log('winnn')
        gGame.isOn = false
        displayAllMines()
    }
    if ((gBoard[i][j].isMine && gBoard[i][j].isShown) && gGame.lives == 0) {
        restart.innerHTML = LOSE
        watchIsOn = false
        clearInterval(startWatch)
        firstClick = true
        displayAllMines()
        gGame.isOn = false
        console.log('lose')
    }

}



function displayAllMines() {
    console.log(gLevel.size)
    console.log(gBoard)
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].minesAroundCount == null) {
                renderGameCell({ i, j }, MINE)
            }
        }
    }
}

function safeClickBtn(elsafeClick) {
    // debugger
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isMine) {

            }
            else if (gBoard[i][j].minesAroundCount >= 0 && gBoard[i][j].isShown == false && gGame.safeClick > 0) {
                gGame.safeClick--
                var elSpsafeClick = document.querySelector('.safeClick')
                elSpsafeClick.innerText = gGame.safeClick
                var elCellClassName = getClassName({ i, j })
                var elCell = document.querySelector('.' + elCellClassName)
                elCell.style.backgroundColor = 'red'
                gGame.isOn = false
                setTimeout(function () {
                    gGame.isOn = true
                    elCell.style.backgroundColor = '#11414f'
                }, 2000, elCell)
                return

            }
        }
    }
}

function hintsClickBtn(elHintsClickBtn) {
    elHintsClickBtn.style.backgroundColor = 'red'
    hintOn = true
    gGame.hints--


}





