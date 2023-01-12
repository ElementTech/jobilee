from flask_cors import CORS

# Import Libraries 
from flask import Flask

# Define app.
app = Flask(__name__)
config = yaml.load(open('database.yaml'))
client = MongoClient(config['uri'])
# db = client.lin_flask
db = client['jobilee']
CORS(app)

# Import the __init__.py from modules which had imported all files from the folder.
import modules

