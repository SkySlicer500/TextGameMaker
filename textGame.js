var inventory = {};
var allAreas = [];
var currentArea = 0;
var currentRoom = "";
var currentInventory = "";
var maxHealth = 100;

function formatInventory(inventoryName) {
	var out = "";
    for (let x=0; x<inventory[inventoryName].length; x++) {
		out = out + "\n" + inventory[inventoryName][x][0] + ": " + inventory[inventoryName][x][1] + " ATTACK: " + str(inventory[inventoryName][x][3]) + " DEFENSE: " + str(inventory[inventoryName][x][4]);
	}
    return(out);
}

function listToText(listIn) {
    var out = listIn[0]
    for (let x=0; x<listIn.length-1; x++) {
        out = out + ", " + listIn[x+1];
    }
    return(out);
}

function interact() {
    output();
    var playerIn = input().split(" ");
    output();
    try {
        var keyword = playerIn[0]
        if (keyword == "help") {
            output("here - observe your current surroundings\ngoto [PATH] - take a path to a different room (only paths)\ngrab [ITEM] - pickup an item that you find in a room (only items)\ntalkto [PERSON] - have a conversation with someone in a room (only characters)\ninspect [STRUCTURE] - inspects a specified structure (only structures)\ninv [INVENTORY TYPE] - opens the specified inventory\nuse [INVENTORY ITEM] - use an item in your inventory\nsave [FILE NAME] - save to a save file\nload [FILE NAME] - load from a save file");
        } else if (keyword == "here") {
            output(allAreas[currentArea][currentRoom]["room"][0]);
            output("People:");
            for (let x=0; x<allAreas[currentArea][currentRoom]["characters"].length; x++) {
                output("--", allAreas[currentArea][currentRoom]["characters"][x][0], allAreas[currentArea][currentRoom]["characters"][x][1]);
            }
            output("Items:");
            for (let x=0; x<allAreas[currentArea][currentRoom]["items"].length; x++) {
                output("--", allAreas[currentArea][currentRoom]["items"][x][0]);
            }
            output("Paths:");
            for (let x=0; x<allAreas[currentArea][currentRoom]["room"][1].length; x++) {
                output("--", allAreas[currentArea][currentRoom]["room"][1][x]);
            }
            output("Structures:");
            for (let x=0; x<allAreas[currentArea][currentRoom]["structures"]; x++) {
                output("--", allAreas[currentArea][currentRoom]["structures"][x][0]);
            }
        } else if (keyword == "goto") {
            try {
                var location = playerIn[1];
                for (let x=0; x<allAreas[currentArea][currentRoom]["room"][1].length; x++) {
                    if (allAreas[currentArea][currentRoom]["room"][1][x] == location) {
                        currentRoom = allAreas[currentArea][currentRoom]["room"][1][x];
                        output("You went to", currentRoom);
                        try {
                            if (allAreas[currentArea][currentRoom]["room"][2] != None) {
                                triggerEvent(allAreas[currentArea][currentRoom]["room"][2]);
                            }
                        } catch (Exception) {}
                        break;
                    }
                    if (x == allAreas[currentArea][currentRoom]["room"][1].length-1) {
                        output("You searched, but found no such place.");
                    } 
                }
            } catch(Exception) {
                output("Go to where?");
            }
        } else if (keyword == "grab") {
            try {
                var item = playerIn[1]
                for (let x=0; x<allAreas[currentArea][currentRoom]["items"]; x++) {
                    if (allAreas[currentArea][currentRoom]["items"][x][0] == item) {
                        inventory[allAreas[currentArea][currentRoom]["items"][x][2]].push(allAreas[currentArea][currentRoom]["items"][x]);
                        output(allAreas[currentArea][currentRoom]["items"][x][0], "was added to your inventory!");
                        try {
                            if (allAreas[currentArea][currentRoom]["items"][x][5]["on-grab"] != None) {
                                triggerEvent(allAreas[currentArea][currentRoom]["items"][x][5]["on-grab"]);
                            }
                        } catch(Exception) {}
                        allAreas[currentArea][currentRoom]["items"].splice(x, 1)
                        break;
                    }
                    if (x == len(allAreas[currentArea][currentRoom]["items"])-1) {
                        output("You searched, but found no such item.");
                    }
                }
            } catch(Exception) {
                output("Grab what?");
            }
        } else if (keyword == "talkto") {
            try {
                var person = playerIn[1];
                for (let x=0; x<allAreas[currentArea][currentRoom]["characters"]; x++) {
                    if (allAreas[currentArea][currentRoom]["characters"][x][0] == person) {
                        output(allAreas[currentArea][currentRoom]["characters"][x][0], ":", allAreas[currentArea][currentRoom]["characters"][x][2]);
                        try {
                            if (allAreas[currentArea][currentRoom]["characters"][x][3] != None) {
                                triggerEvent(allAreas[currentArea][currentRoom]["characters"][x][3]);
                            }
                        } catch(Exception) {}
                        break;
                    }
                    if (x == len(allAreas[currentArea][currentRoom]["characters"])-1) {
                        output("You searched, but were unable to find anyone by that name.");
                    }
                }
            } catch (Exception) {
                output("Talk to who?");
            }
        } else if (keyword == "inv") {
            try {
                output(formatInventory(playerIn[1]));
                currentInventory = playerIn[1];
            } catch {
                output("You checked everywhere, but you don't have an inventory by that name.\nYou do find the following inventory types:", listToText(inventory.keys()));
            }
        } else if (keyword == "inspect") {
            try {
                var structure = playerIn[1];
                for (let x=0; x<allAreas[currentArea][currentRoom]["structures"]; x++) {
                    if (allAreas[currentArea][currentRoom]["structures"][x][0] == structure) {
                        output(allAreas[currentArea][currentRoom]["structures"][x][1]);
                        try {
                            if (allAreas[currentArea][currentRoom]["structures"][x][2] != None) {
                                triggerEvent(allAreas[currentArea][currentRoom]["structures"][x][2]);
                            }
                        } catch(Exception) {}
                        break;
                    }
                    if (x == allAreas[currentArea][currentRoom]["structures"].length-1) {
                        output("You searched, but were unable to find anything by that name.");
                    }
                }
            } catch (Exception) {
                output("Inspect what?");
            }
        } else if (keyword == "use") {
            try {
                if (0 == len(inventory[currentInventory])) {
                    output("You couldn't find any items in your", currentInventory, "inventory.");
                } else {
                    var item = playerIn[1]
                    for (let x=0; x<inventory[currentInventory].length; x++) {
                        if (inventory[currentInventory][x][0] == item) {
                            triggerEvent(inventory[currentInventory][x][4]["on-use"]);
                            break;
                        }
                        if (x == len(inventory[currentInventory])-1) {
                            output("You couldn't find an item like that in your", currentInventory, "inventory.");
                        }
                    }
                }
            } catch(Exception) {
                output("Use what? That didn't seem to work...");
            }         
        } else if (keyword == "save") {
            saveFile()
        } else if (keyword == "load") {
            loadFile()
        } else {
            output("You were too lost in thought to do anything, you consider looking for \"help\" to remember what you were doing.");
        }
    } catch (Exception) {
        output("You were too lost in thought to do anything, you consider looking for \"help\" to remember what you were doing.");
    }
}

function triggerEvent(eventKey) {
    for (let x=0; x<allAreas[currentArea][currentRoom]["events"].length; x++) {
        if (eventKey == allAreas[currentArea][currentRoom]["events"][x][0]) {
            output(allAreas[currentArea][currentRoom]["events"][x][1]);
            for (let y=0; y<allAreas[currentArea][currentRoom]["events"][x][2].length; y++) {
                var action = allAreas[currentArea][currentRoom]["events"][x][2][y][0];
                var location = allAreas[currentArea][currentRoom]["events"][x][2][y][1];
                var key = allAreas[currentArea][currentRoom]["events"][x][2][y][2];
                if (action == "add") {
                    if (location == "inventory") {
                        var effect = allAreas[currentArea][currentRoom]["events"][x][2][y][3];
                        inventory[key].push(effect);
                    } else { 
                        var effect = allAreas[currentArea][currentRoom]["events"][x][2][y][3];
                        if (key == "room") {
                            allAreas[currentArea][location]["room"][1].push(effect);
                        } else {
                            allAreas[currentArea][location][key].push(effect);
                        }
                    }
                } else if (action == "del") {
                    if (location == "inventory") {
                        var effect = allAreas[currentArea][currentRoom]["events"][x][2][y][3];
                        for (let z=0; z<inventory[key].length; z++) {
                            if (inventory[key][z][0] == effect) {
                                inventory[key].splice(z, 1);
                            }
                        }
                    } else {
                        var effect = allAreas[currentArea][currentRoom]["events"][x][2][y][3];
                        if (key == "room") {
                            for (let z=0; z<allAreas[currentArea][location]["room"][1].length; z++) {
                                if (allAreas[currentArea][location]["room"][1][z] == effect) {
                                    allAreas[currentArea][location]["room"][1].splice(z, 1);
                                }
                            }
                        } else {
                            for (let z=0; z<allAreas[currentArea][location][key]; z++) {
                                if (allAreas[currentArea][location][key][z][0] == effect) {
                                    allAreas[currentArea][location][key].splice(z, 1);
                                }
                            }
                        }
                    }
                } else if (action == "go") {
                    var effect = allAreas[currentArea][currentRoom]["events"][x][2][y][1];
                    var roomEffect = allAreas[currentArea][currentRoom]["events"][x][2][y][2];
                    try {
                        for (let x=0; x<allAreas.length; x++) {
                            if (allAreas[x]["area"][0] == effect) {
                                currentArea = x;
                                break;
                            }
                        }
                        try {
                            currentRoom = roomEffect;
                            currentInventory = allAreas[currentArea]["area"][2][0];
                            for (let x=0; x<allAreas[currentArea]["area"][2].length; x++) {
                                try {
                                    inventory[allAreas[currentArea]["area"][2][x]];
                                } catch {    
                                    inventory[allAreas[currentArea]["area"][2][x]] = [];
                                }
                            }
                            output("You have entered:", allAreas[currentArea]["area"][0]);
                            output(allAreas[currentArea][currentRoom]["room"][0]);
                        } catch(Exception) {
                            output("No area files were found");
                        }
                    } catch(Exception) {
                        output("Your loader.json file could not be found");
                    }
                } else if (action == "mod") {
                    var inventoryType = allAreas[currentArea][currentRoom]["events"][x][2][y][1];
                    for (let z=0; z<inventory[inventoryType].length; z++) {
                        var f = false;
                        for (let w=0; w<key.length; w++) {
                            if (key[w] == inventory[inventoryType][z][0]) {
                                if (allAreas[currentArea][currentRoom]["events"][x][2][y][4] == "pre") { //Prefix
                                    inventory[inventoryType][z][allAreas[currentArea][currentRoom]["events"][x][2][y][3]] = allAreas[currentArea][currentRoom]["events"][x][2][y][5] + inventory[inventoryType][z][allAreas[currentArea][currentRoom]["events"][x][2][y][3]];
                                } else if (allAreas[currentArea][currentRoom]["events"][x][2][y][4] == "suf") { //Suffix
                                    inventory[inventoryType][z][allAreas[currentArea][currentRoom]["events"][x][2][y][3]] = inventory[inventoryType][z][allAreas[currentArea][currentRoom]["events"][x][2][y][3]] + allAreas[currentArea][currentRoom]["events"][x][2][y][5];
                                } else if (allAreas[currentArea][currentRoom]["events"][x][2][y][4] == "alt") { //Alter
                                    inventory[inventoryType][z][allAreas[currentArea][currentRoom]["events"][x][2][y][3]] = allAreas[currentArea][currentRoom]["events"][x][2][y][5];
                                }
                                f = true; 
                                break;
                            }
                        } if (f) {
                            continue;
                        }
                        break;
                    }
                }
            }
        }
    }
}
    
function combat() {
    var enemy = allAreas[currentArea][currentRoom]["enemies"][0];
    var health = maxHealth;
    var enemyHealth = enemy[2];
    var weaponInventories = allAreas[currentArea]["area"][3];
    while(enemyHealth > 0 && health > 0) {
        var enemyTempAttack = enemy[3];
        var playerAttack = 0;
        var playerTempAttack = 0;
        output("\nYou are being attacked by a " + enemy[0] + "!\nHealth: "+str(enemyHealth)+"\n\nHealth: " + str(health) + "\na - Attack\nb - Block");
        var playerIn = input(); //Player input
        var mode = 0;
        if (playerIn == "a" || playerIn == "Attack" || playerIn == "attack") {
            mode = 1;
            output("What will you attack with? (Type Item Name)\n", formatInventory(weaponInventories[0]));
        } else if (playerIn == "b" || playerIn == "Block" || playerIn == "block") {
            mode = 2;
            output("What will you block with? (Type Item Name)\n", formatInventory(weaponInventories[1]));
        } else {
            output("You were too confused to do anything!");
        }
        playerIn = input(); //Player input
        for (let x=0; x<inventory[weaponInventories[(mode+1)%2]].length; x++) {
            if (playerIn == inventory[weaponInventories[(mode+1)%2]][x][0]) {
                playerAttack = inventory[weaponInventories[(mode+1)%2]][x][3];
                playerTempAttack = playerAttack;
                if (playerTempAttack >= enemy[4]) {
                    playerTempAttack -= enemy[4];
                } else {
                    playerTempAttack = 0;
                }
                if (enemyTempAttack >= inventory[weaponInventories[(mode+1)%2]][x][3]) {
                    enemyTempAttack -= inventory[weaponInventories[(mode+1)%2]][x][3];
                }
                else {
                    enemyTempAttack = 0;
                }
            } else {
                output("You fumbled your items!");
            }
            var enemyIn = Math.round(Math.random());
            if (enemyIn == 0) {
                if (mode == 1) {
                    health -= enemy[3];
                    enemyHealth -= playerAttack;
                    output("The", enemy[0], "did", enemy[3], "damage!");
                    output("You did", playerAttack, "damage!");
                } else if (mode == 2) {
                    health -= enemyTempAttack;
                    output("You blocked! The", enemy[0], "only did", enemyTempAttack, "damage!");
                }
            } else {
                if (mode == 1) {
                    enemyHealth -= playerTempAttack;
                    output("The", enemy[0], "blocked! You only did", playerTempAttack, "damage!");
                } else if (mode == 2) {
                    output("Both sides blocked nothing!");
                }
            }
        }
    }
    if (enemyHealth <= 0) {
        output("You destroyed the", enemy[0] + "!");
        try {
            if (allAreas[currentArea][currentRoom]["enemies"][0][5] != None) {
                triggerEvent(allAreas[currentArea][currentRoom]["enemies"][0][5]);
            }
        } catch(Exception) {}
        allAreas[currentArea][currentRoom]["enemies"].splice(0, 1);
    } else {
        output("Prepare yourself! The", enemy[0], "is coming again!");
    }
}

function start() {
    output("\nWelcome to Text Game, type \"help\" for usable commands.\n");
    try {
        var loader = fetch("./loader.json").then(response => {return(response.json());})
        for (let x=0; x<loader["areas"].length; x++) {
            try { //Try normal folder typing
                allAreas.push(fetch("./areas\\" + loader["areas"][x]).then(response => {return(response.json());}));
                if (loader["areas"][x] == loader["start"]) {
                    currentArea = allAreas.length-1;
                }
            } catch(Exception) {
                try { //Try alt folder typing
                    allAreas.push(fetch("./areas/" + loader["areas"][x]).then(response => {return(response.json());}));
                    if (loader["areas"][x] == loader["start"]) {
                        currentArea = x;
                    }
                } catch (Exception) {
                    output(loader["areas"][x], "in your loader.json was not added");
                }
            }
        }
        try {
            currentInventory = allAreas[currentArea]["area"][2][0];
            for (let x=0; x<allAreas[currentArea]["area"][2].length; x++) {
                try {
                    inventory[allAreas[currentArea]["area"][2][x]];
                } catch {    
                    inventory[allAreas[currentArea]["area"][2][x]] = [];
                }
            }
            currentRoom = allAreas[currentArea]["area"][4];
            output("You have entered:", allAreas[currentArea]["area"][0]);
            output(allAreas[currentArea][currentRoom]["room"][0]);
        } catch(Exception) {
            output("No area files were found")
            return(1);
        }
    } catch (Exception) {
        output("Your loader.json file could not be found");
        return(1);
    }
    return(0);
}

function input() {
    var playerInput = "";
    return(playerInput);
}

function output(out) {
    output(out);
}

function saveFile() {
    try {
        var name = playerIn[1];
        var file = 0;
        try {
            file = open("saves/"+name + ".json", "w");
        } catch(Exception) {
            try {
                file = open("saves\\"+name + ".json", "w");
            } catch(Exception) {
                output("File failed to open");
            }
        }
        var toWrite = {
            "inventory": inventory,
            "allAreas": allAreas,
            "currentArea": currentArea,
            "currentRoom": currentRoom,
            "currentInventory": currentInventory
        };
        json.dump(toWrite, file);
        file.close();
        output("Save was successful");
    } catch(Exception) {
        output("No name was provided for the save or the file failed to write");
    }
}

function loadFile() {
    try {
        var name = playerIn[1]
        try {
            var file = json.load(open("saves\\"+name+".json"));
            inventory = file["inventory"];
            allAreas = file["allAreas"];
            currentArea = file["currentArea"];
            currentRoom = file["currentRoom"];
            currentInventory = file["currentInventory"];
            output("Load was successful");
        } catch(Exception) {
            try {
                var file = json.load(open("saves/"+name+".json"));
                inventory = file["inventory"];
                allAreas = file["allAreas"];
                currentArea = file["currentArea"];
                currentRoom = file["currentRoom"];
                currentInventory = file["currentInventory"];
                output("Load was successful");
            } catch(Exception) {
                output("File failed to be read");;
            }
        }
    } catch(Exception) {
        output("No name was provided for the save or the file failed to be read");
    }
    return;
}

function update() {
    if (allAreas[currentArea][currentRoom]["enemies"].length > 0) {
        combat();
    } else {
        interact();
    }
    return(0);
}

function end(errorCode) {
    output("Error:", errorCode);
}

function main() {
    var num = start();
    while(num == 0) {
        num = update();
    }
    end(num);
}

main()
