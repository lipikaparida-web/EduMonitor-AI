from config.database import db
from bson import ObjectId

# Get first student from the students collection
students = db["students"]
users = db["users"]

first_student = students.find_one()
if not first_student:
    print("❌ No student records found")
    exit(1)

student_id = first_student["_id"]
print(f"✅ Found student: {first_student.get('name', 'Unknown')} (ID: {student_id})")

# Update the test student user to link to this profile
result = users.update_one(
    {"email": "student@college.edu"},
    {"$set": {"linked_record_id": str(student_id)}}
)

if result.modified_count > 0:
    print(f"✅ Linked student@college.edu to student profile {student_id}")
else:
    print("❌ Failed to link student account")
    exit(1)

# Verify the link
user = users.find_one({"email": "student@college.edu"})
print(f"✅ User linked_record_id: {user.get('linked_record_id')}")
