var dataService = require('./data-service').dataService;

const allowedScents = ['sewage', 'fishy', 'stale', 'sulfur', 'peppery', 'trash'];
const allowedVeg = ['dead', 'wilting', 'rotting'];
const allowedAlgae = ['green', 'brown', 'red'];
const allowedAnimals = ['pelicans', 'seagulls', 'crabs', 'dolphins', 'manatees', 'other'];
const allowedGarbage = ['plastic', 'paper', 'metal', 'mixed', 'other'];
const allowedQuant = ['little', 'medium', 'alot'];
const allowedHealth = ['cough', 'eyes-watery', 'eyes-itchy', 'eyes-blurry', 'breathing', 'heart', 'other'];
const allowedSeverity = ['mild', 'moderate', 'severe'];
const lngFrom = -80.185518;
const lngTo = -80.850019;
const latFrom = 27.180349;
const latTo = 28.794953;
const catsumIpsum = "Chill on the couch table it's 3am, time to create some chaos, " +
    "claw at curtains stretch and yawn nibble on tuna ignore human bite human hand. " +
    "Dead stare with ears cocked eat too much then proceed to regurgitate all over living " +
    "room carpet while humans eat dinner lies down purr yet if it fits, i sits plays league " +
    "of legends. Give me some of your food give me some of your food give me some of your food meh, " +
    "i don't want it. Milk the cow open the door, let me out, let me out, let me-out, let me-aow, " +
    "let meaow, meaow! rub against owner because nose is wet. Hiding behind the couch until lured out " +
    "by a feathery toy climb a tree, wait for a fireman jump to fireman then scratch his face and gnaw " +
    "the corn cob lie on your belly and purr when you are asleep and furrier and even more furrier hairball. " +
    "Fall asleep on the washing machine chase red laser dot. Need to check on human, " +
    "have not seen in an hour might be dead oh look, human is alive, hiss at human, " +
    "feed me adventure always fall asleep on the washing machine for meoooow. When in doubt, " +
    "wash scratch me there, elevator butt kitty loves pigs, but if human is on laptop sit on the " +
    "keyboard sweet beast use lap as chair, or bite nose of your human. Always ensure to lay down " +
    "in such a manner that tail can lightly brush human's nose asdflkjaertvlkjasntvkjn (sits on keyboard). " +
    "Lick butt and sometimes switches in french and say 'miaou' just because well why not, " +
    "or howl uncontrollably for no reason. Lick plastic bags mice mrow who's the baby, so my water bowl is " +
    "clean and freshly replenished, so i'll drink from the toilet. Cough furball into food bowl then " +
    "scratch owner for a new one ptracy, yet eat the rubberband, for lick the curtain just to be " +
    "annoying eat too much then proceed to regurgitate all over living room carpet while humans eat dinner " +
    "yet chase dog then run away you are a captive audience while sitting on the toilet, pet me. " +
    "Get suspicious of own shadow then go play with toilette paper furrier and even more furrier hairball " +
    "for scratch the box yet the fat cat sat on the mat bat away with paws or sleep so i can haz. " +
    "Scratch the box pushes butt to face or fight an alligator and win. Drink water out of the faucet " +
    "purr when being pet yet meow go back to sleep owner brings food and water tries to pet on head, " +
    "so scratch get sprayed by water because bad cat destroy the blinds. Russian blue scratch at fleas, " +
    "meow until belly rubs, hide behind curtain when vacuum cleaner is on scratch strangers and poo on " +
    "owners food purr. Stand with legs in litter box, but poop outside hunt anything that moves, or show belly. " +
    "Immediately regret falling into bathtub step on your keyboard while you're gaming and then turn in a circle yet " +
    "chew foot. Have secret plans. Knock over christmas tree refuse to drink water except out of someone's glass " +
    "pounce on unsuspecting person hiiiiiiiiii feed me now jumps off balcony gives owner dead mouse at present " +
    "then poops in litter box snatches yarn and fights with dog cat chases laser then plays in grass finds tiny " +
    "spot in cupboard and sleeps all day jumps in bathtub and meows when owner fills food dish the cat knocks over " +
    "the food dish cat slides down the water slide and into pool and swims even though it does not like water. " +
    "Cereal boxes make for five star accommodation . Purr like an angel making sure that fluff gets into the " +
    "owner's eyes so refuse to drink water except out of someone's glass for pet me pet me don't pet me but lay on " +
    "arms while you're using the keyboard and sniff all the things.";

const spawner = {};
/**
 * Finds a latitude and longitude combination within range of the IRL.
 * @returns [latitude, longitude]
 */
function randomLocation() {
    var latitude = (Math.random() * (latTo - latFrom) + latFrom).toFixed(6) * 1;
    m = (lngFrom - lngTo) / (latFrom - latTo);
    var longitude = (m * (latitude - latTo) + lngTo) + (((Math.random() > 0.5) ? -1 : 1) * (Math.random() / 10));
    return [latitude, longitude];
}
// Spawn scent observations
spawner.createTestScents = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        params.observation = allowedScents[Math.floor(Math.random() * 5 )];
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postScentData(params, function(error, results) {});
    }
};
// Spawn water clarity observations
spawner.createTestWaterClarities = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        params.observation = Math.random();
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postWaterClarityData(params, function(error, results) {});
    }
};
// Spawn vegetation observations
spawner.createTestVegetations = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        params.observation = allowedVeg[Math.floor(Math.random() * 2 )];
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postVegetationData(params, function(error, results) {});
    }
};
// Spawn algae observations
spawner.createTestAlgaes = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        params.observation = {
            color: allowedAlgae[Math.floor(Math.random() * 2 )],
            onShore: Math.random() > 0.5
        };
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postAlgaeData(params, function(error, results) {});
    }
};
// Spawn microorganisms observations
spawner.createTestMicroorganisms = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        params.observation = true;
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postMicroorganismsData(params, function(error, results) {});
    }
};
// Spawn dead fish observations
spawner.createTestDeadFishes = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        params.observation = Math.floor(Math.random() * 100) + 1;
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postDeadFishData(params, function(error, results) {});
    }
};
// Spawn dead animals observations
spawner.createTestDeadAnimals = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        params.observation = {
            type: allowedAnimals[Math.floor(Math.random() * 6 )],
            quantity: Math.floor(Math.random() * 100) + 1
        };
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postDeadAnimalsData(params, function(error, results) {});
    }
};
// Spawn garbage observations
spawner.createTestGarbage = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        params.observation = {
            type: allowedGarbage[Math.floor(Math.random() * 4 )],
            quantity: allowedQuant[Math.floor(Math.random() * 2 )],
        };
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postGarbageData(params, function(error, results) {});
    }
};
// Spawn health effects observations
spawner.createTestHealthEffects = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        params.observation = {
            type: allowedHealth[Math.floor(Math.random() * 6 )],
            severity: allowedSeverity[Math.floor(Math.random() * 2 )],
        };
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postHealthEffectsData(params, function(error, results) {});
    }
};
// Spawn other observations
spawner.createTestOther = function(iterations) {
    iterations = iterations || 1;
    for (var i = 0; i < iterations; i++) {
        var location = randomLocation();
        var params = { latitude: location[0], longitude: location[1] };
        var startIndex = Math.floor(Math.random() * 200);
        params.observation = catsumIpsum.substring(startIndex, (startIndex + Math.floor(Math.random() * 210)));
        var start = new Date();
        start = new Date(start.setDate(start.getDate() - 31));
        params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
        dataService.postOtherData(params, function(error, results) {});
    }
};
// Starts off the interval that creates an observation every inputted number of milliseconds.
spawner.makeThatFakeData = function(milSecs) {
    setInterval(spawner.spawnEverything, milSecs);
};

spawner.spawnEverything = function() {
    
    // Easier to use a randomized index value to choose which observation to make, than a giant switch statement.
    var spawnChoices = [
        spawner.createTestScents,
        spawner.createTestWaterClarities,
        spawner.createTestVegetations,
        spawner.createTestAlgaes,
        spawner.createTestMicroorganisms,
        spawner.createTestDeadFishes,
        spawner.createTestDeadAnimals,
        spawner.createTestGarbage,
        spawner.createTestHealthEffects,
        spawner.createTestOther
    ];
    spawnChoices[Math.floor(Math.random() * 10)]();
    // spawner.createTestScents(180);
    // spawner.createTestWaterClarities(180);
    // spawner.createTestVegetations(180);
    // spawner.createTestAlgaes(180);
    // spawner.createTestMicroorganisms(90);
    // spawner.createTestDeadFishes(180);
    // spawner.createTestDeadAnimals(180);
    // spawner.createTestGarbage(180);
    // spawner.createTestHealthEffects(180);
    // spawner.createTestOther(45);
};

module.exports.spawner = spawner;