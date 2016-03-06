from flask import Flask, render_template
app = Flask(__name__, template_folder='dist')
app.config['STATIC_FOLDER'] = 'dist'

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run()
