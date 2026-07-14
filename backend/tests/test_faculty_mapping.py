import os
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.auth_service import resolve_user_for_token_identity


class FacultyMappingTests(unittest.TestCase):
    def test_resolves_user_by_user_id_before_fallback_to_email(self):
        with patch("services.auth_service.users_collection") as users_collection:
            users_collection.find_one.side_effect = [
                {"_id": "user-1", "email": "faculty@college.edu", "user_id": "FAC001", "role": "faculty"},
                None,
            ]

            user = resolve_user_for_token_identity({"user_id": "FAC001", "sub": "faculty@college.edu"})

            self.assertEqual(user["user_id"], "FAC001")
            self.assertEqual(user["role"], "faculty")

    def test_falls_back_to_email_lookup_when_user_id_is_missing(self):
        with patch("services.auth_service.users_collection") as users_collection:
            users_collection.find_one.return_value = {"_id": "user-2", "email": "faculty@college.edu", "user_id": "FAC002", "role": "faculty"}

            user = resolve_user_for_token_identity({"sub": "faculty@college.edu"})

            self.assertEqual(user["email"], "faculty@college.edu")
            self.assertEqual(user["user_id"], "FAC002")


if __name__ == "__main__":
    unittest.main()
