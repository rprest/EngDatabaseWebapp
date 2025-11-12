from flask import Flask, jsonify
from flask_cors import CORS
from notion_client import Client
import requests

NOTION_API_KEY = "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"
DATASOURCE_ID = "0c93df58-d43c-48d8-860a-9680898e47ca"
page_id = ""

app = Flask(__name__)

CORS(app)


@app.route("/api/recentpage")
def recentpage():

    global page_id

    notion = Client(auth=NOTION_API_KEY)

    response = notion.data_sources.query(
        data_source_id=DATASOURCE_ID,
        sorts=[{"property": "Last Edited", "direction": "descending"}],
        page_size=1,
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
