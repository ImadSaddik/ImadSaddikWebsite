import json

try:
    with open("./goaccess_data.json", "r") as f:
        data = json.load(f)
except FileNotFoundError:
    print("Error: Could not find 'goaccess_data.json'. Did you export it?")
    exit()

hosts = data.get("hosts", {}).get("data", [])

print(f"{'IP Address':<20} {'Hits':<10} {'% of Traffic':<15}")
print("-" * 45)

for host in hosts[:10]:
    ip = host.get("data")
    hits = host.get("hits", {}).get("count")
    percent = host.get("hits", {}).get("percent")

    print(f"{ip:<20} {hits:<10} {percent:<15}")

print("-" * 45)
print("Recommendation: If the top IP has thousands of hits and")
print("everyone else has 50, that is your bot. Ban it!")
