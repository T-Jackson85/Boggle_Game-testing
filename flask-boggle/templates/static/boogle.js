class BoggleGame {
    constructor(boardId, sec= 60) {
        this.sec= sec
        this.displayTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId)

        this.timer = setInterval(this.countDown.bind(this), 1000);
        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));

    }

    newWord(word) {
        $(".words", this.board).append($("<li>", {text: word}));
    }

    showScore() {
        $(".score", this.board).text(this.score);
    }

    showMessages(msg, cls) {
        $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }
async handleSubmit(evt) {
    evt.preventDefault();
    const $word = $(".word", this.board);

    let word = $word.val();
    if (!word) return;

    if (this.word.has(word)) {
        this.showMessages(`Already found ${word}. Try Again`, "err");
        return;
    }

    const response = await axios.get("/valid-word", {params: {word : word}});
    if(response.data.result ==="not-word") {
        this.showMessages(`${word} is not a valid word in the dictionary`, "err");
    }else if (response.data.result === "not-on-board") {
        this.showMessages(`${word} is not vaild for this board`, "err");
    }else {

        this.newWord(word);
        this.score += word.length;
        this.showScore();
        this.words.add(word);

        this.showMessages(`${word} was added!`);
    }
}

showTimer() {
    $(".timer", this.board).text(this.sec);
}

async tick() {
    this.sec -= 1;
    this.showTimer();

    if(this.sec === 0) {
        clearInterval(this.timer);
        await this.board.gameScore();
    }

}
async gameScore() {
    $(".add-word", this.board).hide();
    const resp = await axios.post("/post-score", {score: this.score});

    if(resp.data.beatHighscore) {
        this.showMessages(`New High Score ${this.score}`, "ok");
    }else {
        this.showMessages(`Final Score: ${this.score}`, "ok");
    }
}
}