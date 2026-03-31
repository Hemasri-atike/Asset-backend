from sqlalchemy import text

# 🔹 COMMON SELECT COLUMNS
SELECT_COLUMNS = """
"AssetID", "AssetSubNumber", "AssetDesc", "Status", "Location"
"""

# 🔹 TOTAL ASSETS
def get_total_assets():
    return text('SELECT COUNT(*) FROM "AssetMaster"')


# 🔹 COUNT QUERIES
def count_damaged():
    return text("""
        SELECT COUNT(*) FROM "AssetMaster"
        WHERE LOWER(TRIM("Status")) IN ('dmg', 'damaged')
    """)

def count_available():
    return text("""
        SELECT COUNT(*) FROM "AssetMaster"
        WHERE LOWER(TRIM("Status")) IN ('aval', 'available')
    """)

def count_in_use():
    return text("""
        SELECT COUNT(*) FROM "AssetMaster"
        WHERE LOWER(TRIM("Status")) IN ('in_use', 'working', 'allocated')
    """)

def count_retired():
    return text("""
        SELECT COUNT(*) FROM "AssetMaster"
        WHERE LOWER(TRIM("Status")) IN ('ret', 'retired', 'scrap')
    """)


# 🔹 TABLE (SHOW) QUERIES
def show_damaged():
    return text(f"""
        SELECT {SELECT_COLUMNS}
        FROM "AssetMaster"
        WHERE UPPER(TRIM("Status")) = 'DMG'
        LIMIT 10
    """)

def show_available():
    return text(f"""
        SELECT {SELECT_COLUMNS}
        FROM "AssetMaster"
        WHERE UPPER(TRIM("Status")) = 'AVAL'
        LIMIT 10
    """)

def show_in_use():
    return text(f"""
        SELECT {SELECT_COLUMNS}
        FROM "AssetMaster"
        WHERE UPPER(TRIM("Status")) = 'IN_USE'
        LIMIT 10
    """)

def show_retired():
    return text(f"""
        SELECT {SELECT_COLUMNS}
        FROM "AssetMaster"
        WHERE UPPER(TRIM("Status")) = 'RET'
        LIMIT 10
    """)

def show_ltrf():
    return text(f"""
        SELECT {SELECT_COLUMNS}
        FROM "AssetMaster"
        WHERE UPPER(TRIM("Status")) = 'LTRF'
        LIMIT 10
    """)


# 🔹 SHOW ALL ASSETS
def show_all_assets():
    return text("""
        SELECT "AssetID", "AssetSubNumber", "AssetDesc", "Status", "Location"
        FROM "AssetMaster"
        ORDER BY "AssetID"
        LIMIT 50
    """)
# 🔹 SHOW DAMAGED BUT REPAIRED
def show_dmg_repaired():
    return text(f"""
        SELECT {SELECT_COLUMNS}
        FROM "AssetMaster"
        WHERE UPPER(TRIM("Status")) = 'DMG-REP'
        LIMIT 10
    """)
