class Square {
    constructor() {
        this.data = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.dir = 0;
        this.origin = {x: 0, y: 0};
        this.rotates = [];
    }

    canRotate(isValid) {
        let d = (this.dir + 1) % 4;
        let test = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                test[i][j] = this.rotates[d][i][j];
            }
        }
        return isValid(this.origin, test);
    }

    rotate(num = 1) {
        this.dir = (this.dir + num) % 4;
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                this.data[i][j] = this.rotates[this.dir][i][j];
            }
        }
    }

    canDown(isValid) {
        let test = {};
        test.x = this.origin.x + 1;
        test.y = this.origin.y;
        return isValid(test, this.data);
    }

    down() {
        this.origin.x += 1;
    }

    canLeft(isValid) {
        let test = {};
        test.x = this.origin.x;
        test.y = this.origin.y - 1;
        return isValid(test, this.data);
    }

    left() {
        this.origin.y -= 1;
    }

    canRight(isValid) {
        let test = {};
        test.x = this.origin.x;
        test.y = this.origin.y + 1;
        return isValid(test, this.data);
    }

    right() {
        this.origin.y += 1;
    }

}