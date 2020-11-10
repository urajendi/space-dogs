import json

dogsJson = []
count = 0

dogs_file_ptr = open('data/dogs.json',"r") 
data = json.load(dogs_file_ptr) 
for i in data: 
	record = {}
	mission = 0
	gender = str(i['Gender'])
	fate = i['Fate']
	note = i['Notes']
	# Dog has travelled in multiple flights
	if "," in i["Flights"]:
		flights = i["Flights"].split(",")
		mission = len(flights)
		for flight in flights:
			record = {}
			if "/" in i["Name (Latin)"]:
				name = i["Name (Latin)"].split(" / ")[0]
			else:
				name = i["Name (Latin)"]
			count += 1
			record["id"] = count
			record["name"] = name
			record["flight"] = flight
			record["gender"] = gender
			record["fate"] = fate
			record["mission"] = mission
			record["note"] = note
			dogsJson.append(record)

	# Dog has travelled only in one flight
	else:
		mission = 1
		if "/" in i["Name (Latin)"]:
			name = i["Name (Latin)"].split(" / ")[0]
		else:
			name = i["Name (Latin)"]
		count += 1
		record["id"] = count
		record["name"] = name
		record["flight"] = flight
		record["gender"] = gender
		record["fate"] = fate
		record["mission"] = mission
		record["note"] = note
		dogsJson.append(record)

dogs_file_ptr.close()
dogs_file_ptr = open('data/dogs-final.json',"w")
json.dump(dogsJson, dogs_file_ptr)
dogs_file_ptr.close()

flightsJson = []
count = 0
flights_file_ptr = open('data/flights.json',"r") 
data = json.load(flights_file_ptr) 
for i in data:
	record = {}
	date = i["Date"]
	altitude = i["Altitude (km)"]
	result = i["Result"]
	note = i["Notes"]
	dog = i["Dogs"]
	rocket = i["Rocket"]
	# If more than one dog travelled in a rocket
	if "," in dog:
		dogs = dog.split(",")
		for d in dogs:
			# If dog has travelled in more than one rocket
			if "," in rocket:
				rockets = rocket.split(", ")
				for r in rockets:
					if not r == "unknown":
						record = {}
						count += 1
						record["id"] = count
						record["date"] = date
						if "/" in d:
							record["dog"] = d.split(" / ")[0]
						else:
							record["dog"] = d
						record["rocket"] = r
						record["altitude"] = altitude
						record["result"] = result
						record["note"] = note
						flightsJson.append(record)
			# If dog has travelled in only one rocket
			else:
				if not rocket == "unknown":
					record = {}
					count += 1
					record["id"] = count
					record["date"] = date
					if "/" in d:
						record["dog"] = d.split(" / ")[0]
					else:
						record["dog"] = d
					record["rocket"] = rocket
					record["altitude"] = altitude
					record["result"] = result
					record["note"] = note
					flightsJson.append(record)


	# If only one dog travelled in a rocket
	else:
		# If dog has travelled in more than one rocket
		if "," in rocket:
			rockets = rocket.split(", ")
			for r in rockets:
				if not r == "unknown":
					record = {}
					count += 1
					record["id"] = count
					record["date"] = date
					if "/" in dog:
						record["dog"] = dog.split(" / ")[0]
					else:
						record["dog"] = dog
					record["rocket"] = r
					record["altitude"] = altitude
					record["result"] = result
					record["note"] = note
					flightsJson.append(record)
		# If dog has travelled in only one rocket
		else:
			if not rocket == "unknown":
				record = {}
				count += 1
				record["id"] = count
				record["date"] = date
				if "/" in dog:
					record["dog"] = dog.split(" / ")[0]
				else:
					record["dog"] = dog
				record["rocket"] = rocket
				record["altitude"] = altitude
				record["result"] = result
				record["note"] = note
				flightsJson.append(record)

flights_file_ptr.close()
flights_file_ptr = open('data/flights-final.json',"w")
json.dump(flightsJson, flights_file_ptr)
flights_file_ptr.close()

def removeAlias(flights):
	output = []
	for i in flights:
		temp = set()
		if "/" in i:
			for x in i.split(","):
				if "/" in x:
					temp.add(x.split(" / ")[0])
				else:
					temp.add(x)
			output.append(temp)
		else:
			for x in i.split(","):
				temp.add(x)
			output.append(temp)
	return output

clusterJson = []
dogs = []
flights = []
count = 0

# Loading dogs names
dogs_file_ptr = open('data/dogs-final.json',"r")
data = json.load(dogs_file_ptr) 
for i in data: 
	if i["name"] not in dogs:
		dogs.append(i["name"])
dogs_file_ptr.close()

# Loading flight info
flights_file_ptr = open('data/flights.json',"r") 
data = json.load(flights_file_ptr)
for i in data:
	flights.append(i["Dogs"])
flights_file_ptr.close()
flights = removeAlias(flights)

def findFriends(dog):
	output = set()
	for i in flights:
		if dog in i:
			for temp in i:
				output.add(temp)
	return output

def dogInCluster(dog):
	for i in clusterJson:
		if dog in i:
			return True
	return False

def printList(cluster):
	print("List size = ", len(cluster))
	for i in cluster:
		print(i)

def intersectionChecK(cluster):
	output = []
	for setA in cluster:
		temp = set()
		temp = setA
		for setB in cluster:
			if setA.intersection(setB):
				temp = temp.union(setB)
		output.append(temp)
	return output

def removeExcessItems(cluster):
	count = 0
	# Removing duplicates
	for setA in cluster:
		count = 0
		for setB in cluster:
			if setA == setB:
				count += 1
				if count > 1:
					cluster.remove(setA)
	cluster.remove({'Belka', 'Strelka', 'Damka-2', 'Modnitsa', 'Kozyavka', 'Ryzhaya'})
	cluster.remove({'Belka', 'Damka-2', 'Dzhoyna', 'Kozyavka', 'Ryzhaya'})
	cluster.remove({'Belka', 'Damka-2', 'Albina', 'Kozyavka', 'Ryzhaya'})
	cluster.remove({'Zhulba', 'Knopka', 'Malyshka'})
	cluster.remove({'Rita', 'Linda'})
	cluster.append({'Zhulba', 'Knopka', 'Malyshka', 'Rita', 'Linda'})
	return cluster

# Grouping dogs based on travel together
for i in dogs:
	if not clusterJson:
		record = set()
		record.add(i)
		temp = findFriends(i)
		clusterJson.append(temp)
	else:
		if not dogInCluster(i):
			record = set()
			record.add(i)
			temp = findFriends(i)
			clusterJson.append(temp)

clusterJson = intersectionChecK(clusterJson)
clusterJson = removeExcessItems(clusterJson)

clusters = []

i = 0
n = len(clusterJson)
while i < n:
	record = {}
	record["clusterID"] = i+1
	record["clusterItems"] = list(clusterJson[i])
	clusters.append(record)
	i += 1

printList(clusters)

cluster_file_ptr = open('data/clusters-final.json',"w")
json.dump(clusters, cluster_file_ptr)
cluster_file_ptr.close()