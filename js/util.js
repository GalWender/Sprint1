'use strict'
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}


function isInArray(array, num) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == num) { return true }
    } return false
}


function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}



function randomArraySort(array) {
    var shuffledArray = array.sort((a, b) => 0.5 - Math.random())
    return shuffledArray
}


// THE STOP WATCH VARIABLES 
// var redo = setInterval(startTimer, 47)
// var stopWatch = document.querySelector('.timer')
// var miliSec = 0
// var sec = 0
// var min = 0
// var count = false
function startTimer() {
    if (watchIsOn) {
        miliSec = parseInt(miliSec)
        sec = parseInt(sec)
        min = parseInt(min)

        miliSec += 48

        if (miliSec >= 1000) {
            sec++
            miliSec = 0
        }

        if (sec == 60) {
            min++
            sec = 0
            miliSec = 0
        }

        if (miliSec < 10) {
            miliSec = '0' + miliSec
        }

        if (sec < 10) {
            sec = '0' + sec
        }

        if (min < 10) {
            min = '0' + min
        }
        stopWatch.innerText = min + ' : ' + sec + ' : ' + miliSec
        // setTimeout('startTimer()', 0050)
    }
}


function zeroPad(num, size) {
    var srtPad = '0'.repeat(size)
    return srtPad.substring(srtPad.length - size)
}


function printMat(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            console.log(cell)
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}">${cell}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


function getEmptyCells(gBoard) {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            if (gBoard[i][j] === EMPTY) {
                emptyCells.push({ i, j })
            }
        }
    }
    // console.log(emptyCells)
    if (emptyCells.length == 0) return null
    //IF YOU WANT TO GET A RANDOM POSITION IN AN EMPTY CELL                        
    // var idx = emptyCells[getRandomInt(0,emptyCells.length)]
    // return idx

    //RETURN OF EMPTY CELLS ARRAY WITH I AND J OBJECTS 
    return emptyCells
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j] == true) neighborsCount++;
        }
    }
    return neighborsCount;
}

function blowUpNegs(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j] === LIFE) {
                // Model 
                gBoard[i][j] = ''

                // DOM
                var elCell = renderCell(i, j, '')
                elCell.classList.remove('occupied')
            }
        }
    }

}


function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}


// NEEDS TO BE CHANGED ACOORDINGLY
function handleKey(event) {
    var i = gGamerPos.i
    var j = gGamerPos.j

    switch (event.key) {
        case 'ArrowLeft':
            if (j <= 0) moveTo(i, gBoard[i].length - 1)
            else moveTo(i, j - 1)
            break
        case 'ArrowRight':
            if (j >= gBoard[i].length - 1) moveTo(i, 0)
            else moveTo(i, j + 1)
            break
        case 'ArrowUp':
            if (i <= 0) moveTo(gBoard.length - 1, j)
            else moveTo(i - 1, j)
            break
        case 'ArrowDown':
            if (i >= gBoard.length - 1) moveTo(0, j)
            else moveTo(i + 1, j)
            break
    }
}

// NEEDS AN ARRAY WITH RANDOM NUMS USUALLY
function drawNum(nums) {
    // console.log(`gNums.length:`, gNums.length)
    var num = getRandomInt(0, nums.length)
    var removedNum = nums.splice(num, 1)
    // console.log(`gNums:`, gNums)
    return removedNum
}


//NEEDS TO BE CHANGED ACOORDINGLY
function addGameElement(element, renderEl) {
    var emptyCells = getEmptyCells()
    if (emptyCells.length === 0) return

    var emptyCell = drawNum(emptyCells)
    var i = emptyCell[0].i
    var j = emptyCell[0].j
    gBoard[emptyCell[0].i][emptyCell[0].j].gameElement = element
    renderCell({ i, j }, renderEl)

    if (element === BALL) gBallsLeft++
    else if (element === GLUE) {
        setTimeout(() => {
            if (gBoard[emptyCell[0].i][emptyCell[0].j].gameElement === GLUE) {
                gBoard[emptyCell[0].i][emptyCell[0].j].gameElement = null
                renderCell({ i, j })
            }
        }, 3000)
    }

}