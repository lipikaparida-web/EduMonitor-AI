import unittest
from unittest.mock import patch
from bson import ObjectId

from services.dashboard_service import get_dashboard_data


class DashboardServiceTests(unittest.TestCase):
    @patch("services.dashboard_service.semester_collection")
    @patch("services.dashboard_service.placements_collection")
    @patch("services.dashboard_service.faculty_collection")
    @patch("services.dashboard_service.students_collection")
    def test_get_dashboard_data_returns_metrics_and_recent_items(
        self,
        students_collection,
        faculty_collection,
        placements_collection,
        semester_collection,
    ):
        students_collection.find.return_value = [
            {"name": "Ada", "cgpa": 9.2, "attendance": 95.0, "department": "Computer Science"},
            {"name": "Grace", "cgpa": 5.4, "attendance": 74.0, "department": "Information Technology"},
        ]
        faculty_collection.find.return_value = [{"name": "Dr. Smith"}]
        placements_collection.find.return_value = [
            {"Student_Name": "Ada", "Placement_Ready": "Yes"},
            {"Student_Name": "Grace", "Placement_Ready": "No"},
        ]
        semester_collection.find.return_value = [
            {"SGPA": 8.6, "Attendance_Avg_Pct": 91.0},
            {"SGPA": 7.2, "Attendance_Avg_Pct": 80.5},
        ]

        result = get_dashboard_data()

        self.assertEqual(result["students"], 2)
        self.assertEqual(result["faculty"], 1)
        self.assertEqual(result["placements"], 2)
        self.assertEqual(result["placement_ready"], 1)
        self.assertEqual(result["average_cgpa"], 7.3)
        self.assertEqual(result["average_attendance"], 84.5)
        self.assertEqual(result["average_sgpa"], 7.9)
        self.assertEqual(result["latest_students"][0]["name"], "Ada")
        self.assertEqual(result["alerts"][0]["type"], "academic")


if __name__ == "__main__":
    unittest.main()
