from flask  import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "secrets"

boggle_game = Boggle()

@app.route("/")

def home_page():
    """Display Board"""

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    plays = session.get('plays', 0)

    return render_template("index.html", board = board, highscore= highscore, plays = plays)

@app.route("/valid-word")

def valid_word():
    """Checks to se if word is in dictionary"""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'results': response})

@app.route("/post-score", method = ["POST"])
def record_score():
    """Records score, and updates highscore when necessary. Also udates plays"""

    score = json["score"]
    highscore = session.get("highscore", 0)
    plays = session.get("plays", 0)

    session["plays"]= plays + 1
    session["highscore"]= max(score, highscore)

    return jsonify(beatHighscore = score > highscore)