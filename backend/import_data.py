import pandas as pd
from dotenv import load_dotenv
from config.database import db

load_dotenv()


def import_csv(filepath, collection_name):
    df = pd.read_csv(filepath)

    records = df.to_dict(orient="records")

    collection = db[collection_name]

    collection.insert_many(records)

    print(f"✅ Imported {len(records)} records into {collection_name}")


# -------------------------
# Students
# -------------------------
import_csv(
    "datasets/students_dataset_generated.csv",
    "students"
)

# -------------------------
# Placement
# -------------------------
import_csv(
    "datasets/placement_dataset.csv",
    "placements"
)

# -------------------------
# Semester Data
# -------------------------

semester_files = [
    ("datasets/semester1_marks.csv", 1),
    ("datasets/semester2_marks.csv", 2),
    ("datasets/semester3_marks.csv", 3),
    ("datasets/semester4_marks.csv", 4),
    ("datasets/semester5_marks.csv", 5),
    ("datasets/semester6_marks.csv", 6),
    ("datasets/semester7_marks.csv", 7),
    ("datasets/semester8_marks.csv", 8),
]

collection = db["semester_results"]

for file, sem in semester_files:

    df = pd.read_csv(file)

    df["semester"] = sem

    collection.insert_many(df.to_dict("records"))

    print(f"✅ Semester {sem} imported")


print("\n🎉 All datasets imported successfully.")