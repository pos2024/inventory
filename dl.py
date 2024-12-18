import requests

# URL of the database export
url = 'https://auth-db1668.hstgr.io/index.php?route=/database/export&db=369860774_cmdc&lang=en'

# Send a GET request to fetch the data
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Save the content to a file (e.g., database_export.sql)
    with open('database_export.sql', 'wb') as file:
        file.write(response.content)
    print("Database exported successfully.")
else:
    print(f"Failed to download the database. Status code: {response.status_code}")
