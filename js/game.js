class Game {
    constructor() {
        this.score = 0;
        this.gameData = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.nextDivs = [];
        this.gameDivs = [];
        this.isValid = function (pos, data) {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[0].length; j++) {
                    if (data[i][j] !== 0) {
                        if (!this.check(pos, i, j)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }.bind(this);
        this.down = function () {
            if (this.cur.canDown(this.isValid)) {
                this.clearData();
                this.cur.down();
                this.setData();
                this.refreshDiv(this.gameData, this.gameDivs);
                return true;
            } else {
                return false;
            }
        }.bind(this);
        this.fix = function () {
            for (let i = 0; i < this.cur.data.length; i++) {
                for (let j = 0; j < this.cur.data[0].length; j++) {
                    if (this.check(this.cur.origin, i, j)) {
                        if (this.gameData[this.cur.origin.x + i][this.cur.origin.y + j] === 2) {
                            this.gameData[this.cur.origin.x + i][this.cur.origin.y + j] = 1;
                        }
                    }
                }
            }
            this.refreshDiv(this.gameData, this.gameDivs);
        }.bind(this);
        this.performNext = function (type, dir) {
            this.cur = this.next;
            this.setData();
            this.next = SquareFactory.make(type, dir);
            this.refreshDiv(this.gameData, this.gameDivs);
            this.refreshDiv(this.next.data, this.nextDivs);
        }.bind(this);
        this.checkClear = function () {
            let line = 0;
            for (let i = this.gameData.length - 1; i >= 0; i--) {
                let clear = true;
                for (let j = 0; j < this.gameData[0].length; j++) {
                    if (this.gameData[i][j] !== 1) {
                        clear = false;
                        break;
                    }
                }
                if (clear) {
                    line++;
                    for (let m = i; m > 0; m--) {
                        for (let n = 0; n < this.gameData[0].length; n++) {
                            this.gameData[m][n] = this.gameData[m - 1][n];
                        }
                    }
                    for (let n = 0; n < this.gameData[0].length; n++) {
                        this.gameData[0][n] = 0;
                    }
                    i++;
                }
            }
            return line;
        }.bind(this);
        this.checkGameOver = function () {
            let gameOver = false;
            for (let i = 0; i < this.gameData[0].length; i++) {
                if (this.gameData[1][i] === 1) {
                    gameOver = true;
                }
            }
            return gameOver;
        }.bind(this);
        this.addScore = function (line) {
            let s = 0;
            switch (line) {
                case 1:
                    s = 10;
                    break;
                case 2:
                    s = 30;
                    break;
                case 3:
                    s = 60;
                    break;
                case 4:
                    s = 100;
                    break;
            }
            this.score += s;
            this.scoreDiv.innerHTML = this.score;
        }.bind(this);
        this.gameover = function (win) {
            if (win) {
                this.resultDiv.innerHTML = "你赢了";
            } else {
                this.resultDiv.innerHTML = "你输了";
            }
        }.bind(this);
    }

    initDiv(container, data, divs) {
        for (let i = 0; i < data.length; i++) {
            const div = [];
            for (let j = 0; j < data[i].length; j++) {
                let newNode = document.createElement("div");
                newNode.className = "none";
                newNode.style.top = (i * 20) + "px";
                newNode.style.left = (j * 20) + "px";
                container.appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
    }

    init(doms, type, dir) {
        this.gameDiv = doms.gameDiv;
        this.nextDiv = doms.nextDiv;
        this.timeDiv = doms.timeDiv;
        this.scoreDiv = doms.scoreDiv;
        this.resultDiv = doms.resultDiv;
        this.next = SquareFactory.make(type, dir);
        this.initDiv(this.gameDiv, this.gameData, this.gameDivs);
        this.initDiv(this.nextDiv, this.next.data, this.nextDivs);
        this.refreshDiv(this.next.data, this.nextDivs);
    }

    refreshDiv(data, divs) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] === 0) {
                    divs[i][j].className = "none";
                } else if (data[i][j] === 1) {
                    divs[i][j].className = "done";
                } else if (data[i][j] === 2) {
                    divs[i][j].className = "current";
                }
            }
        }
    }

    check(pos, x, y) {
        if (pos.x + x < 0) {
            return false;
        } else if (pos.x + x >= this.gameData.length) {
            return false;
        }
        if (pos.y + y < 0) {
            return false;
        } else if (pos.y + y >= this.gameData[0].length) {
            return false;
        } else if (this.gameData[pos.x + x][pos.y + y] === 1) {
            return false;
        }
        return true;
    }

    setData() {
        for (let i = 0; i < this.cur.data.length; i++) {
            for (let j = 0; j < this.cur.data[i].length; j++) {
                if (this.check(this.cur.origin, i, j)) {
                    this.gameData[this.cur.origin.x + i][this.cur.origin.y + j] = this.cur.data[i][j];
                }
            }
        }
    }

    clearData() {
        for (let i = 0; i < this.cur.data.length; i++) {
            for (let j = 0; j < this.cur.data[i].length; j++) {
                if (this.check(this.cur.origin, i, j)) {
                    this.gameData[this.cur.origin.x + i][this.cur.origin.y + j] = 0;
                }
            }
        }
    }


    fall() {
        while (this.down()) ;
    }

    left() {
        if (this.cur.canLeft(this.isValid)) {
            this.clearData();
            this.cur.left();
            this.setData();
            this.refreshDiv(this.gameData, this.gameDivs);
        }
    }

    right() {
        if (this.cur.canRight(this.isValid)) {
            this.clearData();
            this.cur.right();
            this.setData();
            this.refreshDiv(this.gameData, this.gameDivs);
        }
    }

    rotate() {
        if (this.cur.canRotate(this.isValid)) {
            this.clearData();
            this.cur.rotate();
            this.setData();
            this.refreshDiv(this.gameData, this.gameDivs);
        }
    }

    setTime(time) {
        this.timeDiv.innerHTML = time;
    }

    addTailLines(lines) {
        for (let i = 0; i < this.gameData.length - lines.length; i++) {
            this.gameData[i] = this.gameData[i + lines.length];
        }
        for (let i = 0; i < lines.length; i++) {
            this.gameData[this.gameData.length - lines.length + i] = lines[i];
        }
        this.cur.origin.x=this.cur.origin.x-lines.length;
        if (this.cur.x<0){
            this.cur.origin.x=0;
        }
        this.refreshDiv(this.gameData,this.gameDivs);
    }

}