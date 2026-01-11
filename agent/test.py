import json

f = open("aa_data.json")
aa = json.load(f)

print(aa[1])