'use strict'
const NORMAL = '<img src="assets/img/normal.gif"/>';
const LOSE = '<img src="assets/img/lose.gif"/>'
const WIN = '<img src="assets/img/win.gif"/>'
var EMPTY = ''
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
var hint8thCount
var makeBombsOn = false
var starterMatForBombMode
//color: #0e3742



function init(level, randomArrayMines) {

    EMPTY = ''
    hint8thCount = 0
    // randomArrayMines=[]
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
    MINE = '<img src = "assets/img/bomb.png"/>'
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
    starterGBoard = MatMines(gLevel, randomArrayMines)
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
function MatMines(gLevel, randomArrayMines) {
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
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML


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
            renderGameCell({ i: i, j: j }, EMPTY)
            checkVictory(i, j)
            return
        }
        if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
            // debugger
            console.log('add')
            gBoard[i][j].isMarked = true
            gGame.markedCount++
            renderGameCell({ i: i, j: j }, FLAG)
            checkVictory(i, j)
            return
        }
    }
}

function matBombPlacment() {
    starterMatForBombMode = []
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if(gBoard[i][j].isMine){
                starterMatForBombMode.push('*')
            }
            else{
                starterMatForBombMode.push(EMPTY)
            }
        }
    }
    return starterMatForBombMode;

}


function onCellClicked(elCell, i, j) {
    if (makeBombsOn == true) {
        console.log('making bombs')
        gBoard[i][j].isMine = true
        gBoard[i][j].minesAroundCount = null
        renderGameCell({ i: i, j: j }, MINE)
        setTimeout(() => {
            makeHidden(elCell, i, j)
        }, 1500, elCell, i, j)
    }
    else if (makeBombsOn == false) {
        if (firstClick && gGame.isOn) {
            if (gBoard[i][j].isMine) {
                gLevel.mineCount--
                gBoard[i][j].isMine = false
                gBoard[i][j].minesAroundCount = 0
                elCell.style.backgroundColor = '#11414f'
                gBoard[i][j].isShown = true
                gGame.shownCount++
                makeVisible(elCell, i, j)
                displayNeighbors(elCell, i, j)
                checkVictory(i, j)
            }
            firstClick = false
            watchIsOn = true
            startWatch = setInterval(startTimer, 47)
        }
        if (gGame.isOn) {
            if (hintOn) {
                // debugger
                addHintClass(elCell, i, j)
                makeVisible(elCell, i, j)
                elCell.style.backgroundColor = '#11414f'
                hideHintCells(elCell, i, j)
                displayNeighbors(elCell, i, j)
                for (let iel = 0; iel < gBoard.length; iel++) {
                    for (let jel = 0; jel < gBoard.length; jel++) {

                        let elHintCheck = document.querySelector('.' + getClassName({ i: iel, j: jel }))

                        if (elHintCheck.classList.contains('hinted')) {
                            if (gBoard[iel][jel].isMine) {
                                makeVisible(elHintCheck, iel, jel)
                                elHintCheck.style.backgroundColor = '#11414f'
                                hideHintCells(elHintCheck, iel, jel)


                            }
                            if (gBoard[iel][jel].minesAroundCount == 0) {
                                elHintCheck.style.backgroundColor = '#11414f'
                                hideHintCells(elHintCheck, iel, jel)


                            }
                            if (typeof gBoard[iel][jel].minesAroundCount == 'number' && gBoard[iel][jel].minesAroundCount > 0) {
                                elHintCheck.style.backgroundColor = '#11414f'
                                makeVisible(elHintCheck, iel, jel)
                                hideHintCells(elHintCheck, iel, jel)


                            }
                        }
                    }

                }
                hintOn = false
                var elHintsBtn = document.querySelector('.hintsClick')
                elHintsBtn.innerText = gGame.hints
                elHintsBtn.style.backgroundColor = '#0e3742'
                return

            }
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
}


function displayNeighbors(elCell, cellI, cellJ) {
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            // if(firstClick){
            //     gBoard[i][j].minesAroundCount=0
            // }
            if (hintOn) {
                if (gBoard[i][j].isShown == false) {
                    addHintClass(elCell, i, j)
                    hint8thCount++
                    if (hint8thCount == 8) {
                        hint8thCount = 0
                        return
                    }
                }
            }
            else {
                if (gBoard[i][j].minesAroundCount == 0) {
                    if (gBoard[i][j].isShown) {
                    }
                    else {
                        var elCellClassName = getClassName({ i: i, j: j })
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
                if (typeof gBoard[i][j].minesAroundCount == 'number' && gBoard[i][j].minesAroundCount > 0) {//if it is a number other than 0
                    if (gBoard[i][j].isShown) {

                    }
                    else {
                        var elCellClassName = getClassName({ i: i, j: j })
                        var elCellNeighbor = document.querySelector('.' + elCellClassName)
                        elCellNeighbor.style.backgroundColor = '#11414f'
                        gBoard[i][j].isShown = true
                        gGame.shownCount++
                        console.log(gBoard[i][j].minesAroundCount)
                        makeVisible(elCellNeighbor, i, j)
                        /////////////////////////
                        checkVictory(i, j)
                    }

                }
            }
        }

    }
    return
}



//MAKES CURRENT CELL VISIBLE, DOM
function makeVisible(elCell, i, j) {
    if (gBoard[i][j].minesAroundCount == 0) {
        console.log('is 0')
        if (gBoard[i][j].isMarked) {

        }
        else {
            elCell.style.backgroundColor = '#11414f'
            gBoard[i][j].isShown = true
        }
    }
    if (gBoard[i][j].isMine) {
        if (gBoard[i][j].isMarked) {

        }
        else {
            elCell.style.backgroundColor = '#11414f'
            renderGameCell({ i: i, j: j }, MINE)
        }

    }

    if (typeof gBoard[i][j].minesAroundCount == 'number' && gBoard[i][j].minesAroundCount > 0) {
        if (gBoard[i][j].isMarked) {

        }
        else {
            gBoard[i][j].isShown = true
            elCell.style.backgroundColor = '#11414f'
            renderGameCell({ i: i, j: j }, gBoard[i][j].minesAroundCount)
        }
    }

}

function makeHidden(elCell, i, j) {
    if (gBoard[i][j].minesAroundCount == 0) {
        console.log('is 0')
        if (gBoard[i][j].isMarked) {

        }
        else {
            console.log(elCell)
            console.log('hidden')
            elCell.style.backgroundColor = '#0e3742'
            gBoard[i][j].isShown = false
        }
    }
    if (gBoard[i][j].isMine) {
        if (gBoard[i][j].isMarked) {

        }
        else {
            console.log(elCell)
            console.log('hidden')
            elCell.style.backgroundColor = '#0e3742'
            renderGameCell({ i: i, j: j }, EMPTY)
        }

    }

    if (typeof gBoard[i][j].minesAroundCount == 'number' && gBoard[i][j].minesAroundCount > 0) {
        if (gBoard[i][j].isMarked) {

        }
        else {
            gBoard[i][j].isShown = false
            console.log(elCell)
            console.log('hidden')
            elCell.style.backgroundColor = '#0e3742'
            renderGameCell({ i: i, j: j }, EMPTY)
        }
    }


}

function levels(btnLevel) {
    if (btnLevel.innerText == '4x4') {
        if (makeBombsOn == false) {
            var randomArrayMines = []
            var minesLeft = 2
            for (var i = 0; i < 16; i++) {
                if (minesLeft > 0) { randomArrayMines.push('*') }
                else { randomArrayMines.push(EMPTY) }
                minesLeft--
            }
            randomArrayMines = randomArraySort(randomArrayMines)

            init(4, randomArrayMines)
        }
        else {
            var randomArrayMines = []
            for (var i = 0; i < 16; i++) { randomArrayMines.push(EMPTY) }
            init(4, randomArrayMines)
        }
    }
    if (btnLevel.innerText == '8x8') {
        if (makeBombsOn == false) {
            var randomArrayMines = []
            var minesLeft = 12
            for (var i = 0; i < 64; i++) {
                if (minesLeft > 0) { randomArrayMines.push('*') }
                else { randomArrayMines.push(EMPTY) }
                minesLeft--
            }
            randomArrayMines = randomArraySort(randomArrayMines)
            init(8, randomArrayMines)
        }
        else {
            var randomArrayMines = []
            for (var i = 0; i < 64; i++) { randomArrayMines.push(EMPTY) }
            init(8, randomArrayMines)
        }

    }
    if (btnLevel.innerText == '12x12') {
        if (makeBombsOn == false) {
            var randomArrayMines = []
            var minesLeft = 30
            for (var i = 0; i < 144; i++) {
                if (minesLeft > 0) { randomArrayMines.push('*') }
                else { randomArrayMines.push(EMPTY) }
                minesLeft--
            }
            randomArrayMines = randomArraySort(randomArrayMines)
            init(12, randomArrayMines)
        }
        var randomArrayMines = []
        for (var i = 0; i < 144; i++) { randomArrayMines.push(EMPTY) }
        init(12, randomArrayMines)
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
                renderGameCell({ i: i, j: j }, MINE)
            }
        }
    }
}

function safeClickBtn(elsafeClick) {
    // debugger
    if (gGame.isOn) {
        for (var i = 0; i < gLevel.size; i++) {
            for (var j = 0; j < gLevel.size; j++) {
                if (gBoard[i][j].isMine) {

                }
                else if (gBoard[i][j].minesAroundCount >= 0 && gBoard[i][j].isShown == false && gGame.safeClick > 0) {
                    gGame.safeClick--
                    var elSpsafeClick = document.querySelector('.safeClick')
                    elSpsafeClick.innerText = gGame.safeClick
                    var elCellClassName = getClassName({ i: i, j: j })
                    var elCell = document.querySelector('.' + elCellClassName)
                    elCell.style.backgroundColor = '#11414f'
                    // elSpsafeClick.style.backgroundColor = '#11414f'
                    gGame.isOn = false
                    setTimeout(function () {
                        gGame.isOn = true
                        elCell.style.backgroundColor = '#0e3742'
                        // elsafeClick.style.backgroundColor = '#0e3742'
                    }, 2000, elCell, elsafeClick)
                    return

                }
            }
        }
    }
}

function hintsClickBtn(elHintsClickBtn) {
    if (gGame.isOn) {
        elHintsClickBtn.style.backgroundColor = '#11414f'
        hintOn = true
        gGame.hints--
    }

}
function addHintClass(elCell, cellI, cellJ) {
    var hintClassName = getClassName({ i: cellI, j: cellJ })
    var elAddHint = document.querySelector('.' + hintClassName)
    elAddHint.classList.add('hinted')
}
function removeHintClass(cellI, cellJ) {
    var hintClassName = getClassName({ i: cellI, j: cellJ })
    var elRemoveHint = document.querySelector('.' + hintClassName)
    elRemoveHint.classList.remove('hinted')
}
function hideHintCells(elCell, i, j) {
    setTimeout(() => {
        makeHidden(elCell, i, j)
    }, 1000, elCell, i, j)
    removeHintClass(i, j)
    return
}
//
function makeBombs(elMakeBombsBtn) {
    if (makeBombsOn == false) {
        console.log('on')
        init()
        elMakeBombsBtn.style.backgroundColor = '#11414f'
        makeBombsOn = true
    }
    else if (makeBombsOn == true) {
        console.log('off')
        elMakeBombsBtn.style.backgroundColor = '#0e3742'
        makeBombsOn = false
        var matWithBombs = matBombPlacment()
        init(gLevel.size,matWithBombs)
    }

}








