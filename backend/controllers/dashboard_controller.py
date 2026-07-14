from services.dashboard_service import get_dashboard_data


def dashboard():
    try:
        return get_dashboard_data()
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "error": str(e)
        }