from flask import Flask, render_template, url_for
app = Flask(__name__)

posts = [

]


@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', posts=posts)

@app.route("/single")
def single():
    return render_template('single.html', title='Single')

@app.route("/about")
def about():
    return render_template('about.html', title='About')

@app.route("/history")
def history():
    return render_template('history.html', title='History')

@app.route("/movies")
def movies():
    return render_template('movies.html', title='Tutorial')

@app.route("/classroom")
def classroom():
    return render_template('movies.html', title='Classroom')

@app.route("/ask")
def ask():
    return render_template('ask.html', title='Ask')

if __name__ == '__main__':
    app.run(debug=True)