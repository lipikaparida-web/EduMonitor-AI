from bson import ObjectId


def serialize_doc(document):

    if document:
        document["_id"] = str(document["_id"])

    return document


def serialize_list(documents):

    result = []

    for doc in documents:

        doc["_id"] = str(doc["_id"])

        result.append(doc)

    return result