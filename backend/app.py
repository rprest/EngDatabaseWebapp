from flask import Flask, jsonify
from flask_cors import CORS
from notion_client import Client
import requests
import os

NOTION_API_KEY = os.environ.get("NOTION_API_KEY")
DATASOURCE_ID = os.environ.get("DATASOURCE_ID")

app = Flask(__name__)

CORS(
    app,
    origins=[
        "http://localhost:5173",  # Local development
        "https://rprest.github.io",  # Production
    ],
)


@app.route("/api/recentpage")
def recentpage():

    global page_id

    notion = Client(auth=NOTION_API_KEY)

    response = notion.data_sources.query(
        data_source_id=DATASOURCE_ID,
        sorts=[{"property": "Last Edited", "direction": "descending"}],
        page_size=1,
    )

    if response["results"]:
        page = response["results"][0]

        title_prop = None
        checkbox_properties = {}
        NeedToReview = None

        for prop_name, prop_value in page["properties"].items():
            if prop_value["type"] == "title":
                title_property = prop_value["title"]
            elif prop_value["type"] == "checkbox":
                checkbox_properties[prop_name] = prop_value["checkbox"]

        if title_property and len(title_property) > 0:
            title = title_property[0]["plain_text"]
        else:
            title = "None Found"

        if checkbox_properties:
            print(checkbox_properties)

        page_id = page["id"]

        page_id_clean = page_id.replace("-", "")
        page_url = f"https://notion.so/{page_id_clean}"

        print(checkbox_properties)

        return jsonify(
            {
                "most_recent_title": title,
                "created_time": page["created_time"],
                "page_id": page_id,
                "page_id_clean": page_id_clean,
                "notion_url": page_url,
                "checkbox_properties": checkbox_properties,
            }
        )
    else:
        return jsonify({"most_recent_title": "No pages found"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
