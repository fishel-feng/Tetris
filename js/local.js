class Local {

    constructor(socket) {
        this.game = null;
        this.INTERVAL = 200;
        this.timer = null;
        this.timeCount = 0;
        this.time = 0;
        this.socket = socket;
        socket.on("start", () => {
            document.getElementById("waiting").innerHTML = "";
            this.start();
        });
        socket.on("lose", () => {
            this.game.gameover(true);
            this.stop();
        });
        socket.on("leave", () => {
            document.getElementById("local_gameover").innerHTML = "对方掉线";
            document.getElementById("remote_gameover").innerHTML = "已掉线";
            this.stop();
        });
        socket.on("bottomLines",(data)=>{
            this.game.addTailLines(data);
            socket.emit("addTailLines",data);
        });
    }

    move() {
        let down = this.game.down;
        let fix = this.game.fix;
        let performNext = this.game.performNext;
        let generateType = this.generateType;
        let generateDir = this.generateDir;
        let checkClear = this.game.checkClear;
        let checkGameOver = this.game.checkGameOver;
        let stop = this.stop.bind(this);
        let timeFun = this.timeFun.bind(this);
        let addScore = this.game.addScore;
        let gameover = this.game.gameover;
        let socket = this.socket;
        let generateBottomLine = this.generateBottomLine;
        this.timer = setInterval(function () {
            timeFun();
            if (!down()) {
                fix();
                socket.emit("fix");
                let line = checkClear();
                if (line) {
                    addScore(line);
                    socket.emit("line", line);
                    if (line > 1) {
                        let bottomLines=generateBottomLine(line);
                        socket.emit("bottomLines",bottomLines);
                    }
                }
                let gameOver = checkGameOver();
                if (gameOver) {
                    gameover(false);
                    document.getElementById("remote_gameover").innerHTML = "你赢了";
                    socket.emit("lose");
                    stop();
                }
                let t = generateType();
                let d = generateDir();
                performNext(t, d);
                socket.emit("next", {type: t, dir: d});
            } else {
                socket.emit("down");
            }
        }, this.INTERVAL);
    }

    timeFun() {
        this.timeCount++;
        if (this.timeCount === 5) {
            this.timeCount = 0;
            this.time++;
            this.game.setTime(this.time);
            this.socket.emit("time", this.time);
        }
    }

    generateType() {
        return Math.ceil(Math.random() * 7) - 1;
    }

    generateDir() {
        return Math.ceil(Math.random() * 4) - 1;
    }

    start() {
        let doms = {
            gameDiv: document.getElementById("local_game"),
            nextDiv: document.getElementById("local_next"),
            timeDiv: document.getElementById("local_time"),
            scoreDiv: document.getElementById("local_score"),
            resultDiv: document.getElementById("local_gameover")
        };
        this.game = new Game();
        let type = this.generateType();
        let dir = this.generateDir();
        this.game.init(doms, type, dir);
        this.socket.emit("init", {type: type, dir: dir});
        this.bindKeyEvent();
        let t = this.generateType();
        let d = this.generateDir();
        this.game.performNext(t, d);
        this.socket.emit("next", {type: t, dir: d});
        this.move();
    }

    bindKeyEvent() {
        document.onkeydown = (e) => {
            if (e && e.keyCode === 37) {//left
                this.game.left();
                this.socket.emit("left");
            } else if (e.keyCode === 38) {//up
                this.game.rotate();
                this.socket.emit("rotate");
            } else if (e.keyCode === 39) {//right
                this.game.right();
                this.socket.emit("right");
            } else if (e.keyCode === 40) {//down
                this.game.down();
                this.socket.emit("down");
            } else if (e.keyCode === 32) {//space
                this.game.fall();
                this.socket.emit("fall");
            }
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        document.onkeydown = null;
    }

    generateBottomLine(lineNum) {
        let lines = [];
        for (let i = 0; i < lineNum; i++) {
            let line = [];
            for (let j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1);
            }
            lines.push(line);
        }
        return lines;
    }
}