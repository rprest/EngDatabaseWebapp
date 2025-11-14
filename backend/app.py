from flask import Flask, jsonify
from flask_cors import CORS
from notion_client import Client
import requests
import os

from dotenv import load_dotenv

load_dotenv()

NOTION_API_KEY = os.environ.get("NOTION_API_KEY")
DATASOURCE_ID = os.environ.get("DATASOURCE_ID")
NOTION_VERSION = "2025-09-03"

# print(NOTION_API_KEY)
# print(DATASOURCE_ID)

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "https://rprest.github.io"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"],
        }
    },
)


@app.route("/")
def health():
    return jsonify({"status": "healthy"})


@app.route("/api/notion/blocks/<pageID>")
def get_blocks(pageID):
    def fetch_blocks_recursive(block_id):

        url = f"https://api.notion.com/v1/blocks/{block_id}/children"

        headers = {
            "Authorization": f"Bearer {NOTION_API_KEY}",
            "Notion-Version": NOTION_VERSION,
        }

        response = requests.get(url, headers=headers)
        data = response.json()

        if "results" not in data:
            return []

        blocks = data["results"]

        for block in blocks:
            if block.get("has_children", False):
                block["children"] = fetch_blocks_recursive(block["id"])

        return blocks

    blocks = fetch_blocks_recursive(pageID)

    # print(blocks)

    return jsonify({"results": blocks})


@app.route("/api/notion/subitems/<pageID>")
def get_subitems(pageID):

    try:
        notion = Client(auth=NOTION_API_KEY)

        page = notion.pages.retrieve(page_id=pageID)

        relation_property_name = None
        related_pages = []

        for prop_name, prop_value in page["properties"].items():
            if prop_value["type"] == "relation":

                if "sub item" in prop_name.lower() or "subitem" in prop_name.lower():
                    relation_property_name = prop_name
                    related_pages = prop_value["relation"]
                    break

        if not relation_property_name:
            return jsonify({"error": "No subitem prop found", "subitems": []})

        subitem_ids = [item["id"] for item in related_pages]

        return jsonify(
            {
                "relation_property": relation_property_name,
                "subitem_ids": subitem_ids,
                "subitem_count": len(subitem_ids),
            }
        )

    except Exception as e:
        return jsonify({"error": str(e), "subitems": []}), 500


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

        # if checkbox_properties:
        #     print(checkbox_properties)

        page_id = page["id"]

        page_id_clean = page_id.replace("-", "")
        page_url = f"https://notion.so/{page_id_clean}"

        # print(checkbox_properties)

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
