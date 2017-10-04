class Remote {

    constructor(socket) {
        this.game = null;
        this.socket = socket;
        this.bindEvents();
    }

    bindEvents() {
        this.socket.on("init", (data) => {
            this.start(data.type, data.dir);
        });
        this.socket.on("next", (data) => {
            this.game.performNext(data.type, data.dir);
        });
        this.socket.on("rotate", (data) => {
            this.game.rotate();
        });
        this.socket.on("right", (data) => {
            this.game.right();
        });
        this.socket.on("left", (data) => {
            this.game.left();
        });
        this.socket.on("down", (data) => {
            this.game.down();
        });
        this.socket.on("fall", (data) => {
            this.game.fall();
        });
        this.socket.on("line", (data) => {
            this.game.checkClear();
            this.game.addScore(data);
        });
        this.socket.on("fix", (data) => {
            this.game.fix();
        });
        this.socket.on("time", (data) => {
            this.game.setTime(data);
        });
        this.socket.on("lose", (data) => {
            this.game.gameover(false);
        });
        this.socket.on("addTailLines", (data) => {
            this.game.addTailLines(data);
        });
    }

    start(type, dir) {
        let doms = {
            gameDiv: document.getElementById("remote_game"),
            nextDiv: document.getElementById("remote_next"),
            timeDiv: document.getElementById("remote_time"),
            scoreDiv: document.getElementById("remote_score"),
            resultDiv: document.getElementById("remote_gameover")
        };
        this.game = new Game();
        this.game.init(doms, type, dir);
    }

}