
// Everything that can possibly pop up a dialog screen

var speakingType : enum =
{
	PC_SPEAKING, // Player character
	NPC_SPEAKING,
	TEXT,
	TEXT_BOLD,
	THOUGHT
};


var dialogue =
[

/* intro */

	{id: 0,
	dialog:"Recently, my penpal Jenny stopped answering to my letters and emails.\nActually, her last few letters were quite short and kind of weird, so I grew worried about her.\nI even found out her number and tried to phone her, but she wouldn’t pick up on me.\nWhen my last letter got returned, I decided to check what’s going on and booked a flight for her home city Paderborn.", type: speakingType.THOUGHT,
	connection: undefined},
	
 /* at the airport */

	
	{id: 1,
     dialog: "Finally, I've arrived at the airport!\nNow all I have to do is find out how to get to my hotel.", type: speakingType.PC_SPEAKING,
	 connection: undefined},
	{id: 2,
	dialog: "I don’t need to go to the loo right now.", type: speakingType.THOUGHT,
	connection: undefined},
	{id: 3,
	dialog: "I doubt I’ll find the bus schedules in there." /*restrooms while searching for the bus schedules */, type: speakingType.THOUGHT,
	connection: undefined},
	{id: 4,
	dialog: "I’m pretty sure I won’t have to take a plane to the hotel.", type: speakingType.THOUGHT,
	connection: undefined},
	{id: 5,
	dialog: "These are no bus schedules.", type: speakingType.THOUGHT,
	connection: undefined},
//additional content for this scene at the end of the list
// searching for a way to the hotel	
	 {id: 6, //French Guy
     dialog: "Excuse me! I need to get to the Holiday Inn in the city. How can I get there fast?", type: speakingType.PC_SPEAKING,
	 connection: 7},
	 {id: 7,
     dialog: "Sorry, je no speak Anglais.", type: speakingType.NPC_SPEAKING,
	 connection: 8},
	 {id: 8,
     dialog: "... eh? Gracias, no problemo.",  type: speakingType.PC_SPEAKING,
	 connection: undefined},
	 {id: 9, //Person in a hurry
     dialog: "Excuse me--", type: speakingType.PC_SPEAKING,
	 connection: 10},
	 {id: 10,
     dialog: "Sorry! I'm in a hurry!", type: speakingType.NPC_SPEAKING,
	 connection: 11},
	 {id: 11,
     dialog: "What an unfriendly person...", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 12, // foreigner, Question ID: 95
     dialog: "I'm not local, sorry. Maybe ask that guy over there?", type: speakingType.NPC_SPEAKING,
	 connection: 13},
	 {id: 13,
     dialog: "Hmmph, thanks anyway.", type: speakingType.PC_SPEAKING,
	 connection: undefined},
	 {id: 14, //mom with child, Question ID: 96
     dialog: "I think you have to take the bus.\nThe Holiday Inn should be near the Heartbleed Hospital, although I don't know which bus goes by it...", type: speakingType.NPC_SPEAKING,
	 connection: 15},
	 {id: 15,
     dialog: "Damn, where can I find bus schedules...", type: speakingType.THOUGHT, link:16,
	 connection: undefined},
	 {id: 16,
     dialog: "Thank you.", type: speakingType.PC_SPEAKING, link: 97,
	 connection: undefined},
	 {id: 17,
     dialog: "You are a lovely beauty, like one of my porcelain dolls~", type: speakingType.PC_SPEAKING,
	 connection: undefined},
// searching for the bus schedules	 
	 {id: 18, // guy in a hurry
     dialog: "Excuse me again, I am searching for the bus schedules, have you seen them by any chance?", type: speakingType.PC_SPEAKING,
	 connection: 20},
	 {id: 19, //when clicking on the French guy
     dialog: "I think there's no point in asking him.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 20,
     dialog: "Didn't you hear me, I'm in a hurry!", type: speakingType.NPC_SPEAKING,
	 connection: undefined},
	 {id: 21, //Foreigner Question ID: 98
     dialog: "Hmm... Yes I think I've seen those somewhere in the hall... try near the restrooms or entrance?", type: speakingType.NPC_SPEAKING,
	 connection: undefined},
// figuring out the right schedule
	 {id: 22, // dialogue showing up at the same time as the picture with the bus time tables
     dialog: "That woman said the hotel is near Heartbleed Hospital...", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 23, // when selecting the wrong schedule
     dialog: "No, this one doesn't seem right.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 24, // when selecting the right schedule
     dialog: "There it is - line 86! ... Aaaand the last one is already gone for today.\nDamn this!", type: speakingType.THOUGHT,
	 connection: undefined},
	 
/* at Jenny's house */
// opening scene dialogue
	 {id: 25,
     dialog: "And thus I took a cab, and decided to stop by Jenny's house directly.~", type: speakingType.THOUGHT, link:32,
	 connection: undefined},
// looking around at the house
	 {id: 26, //clicking on blinds
	 dialog: "Most blinds seem to be closed.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 27, // window with open blinds
	 dialog: "This window is the only one with open blinds.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 28, //toolshed entrance
	 dialog: "Scary and dark and lots of tools inside.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 29, //Car / Carport
	 dialog: "Considering the amount of tools and the tyres lying around here, I assume this car won't go anywhere anytime soon.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 30, //Crowbar BEFORE searching for a tool
	 dialog: "Phew, many stuff lying around here.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 31, // tree
	 dialog: "....weeeeeeell, look at this. A tree.", type: speakingType.THOUGHT,
	 connection: undefined},
// main door
	 {id: 32, 
     dialog: "So let's see if she's home~ <3", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 33, //when interacting with the front door
     dialog: "The blinds are closed and there's no lights - maybe she's sleeping already.\nLet's ring the bell.", type: speakingType.THOUGHT,
	 connection: 34},
	 {id: 34,
     dialog: "Rrrrrring. RRRRRRRRRRRRRRing!", type: speakingType.TEXT,
	 connection: 35},
	 {id: 35,
	 dialog: "Ring ring ring ring ring banana phone…~", type: speakingType.THOUGHT, link:36,
	 connection: undefined},
	 {id: 36,
	 dialog: "RRRRRRRRRRRRRRRRRRRRRRRRRing!", type: speakingType.TEXT,
	 connection: 37},
	 {id: 37,
	 dialog: "She’s not opening. I’d better take a look inside.", type: speakingType.THOUGHT,
	 connection: 38},
	 {id: 38,
	 dialog: "....\n....\n....\nDamn, the door won't open, I guess it's locked.", type: speakingType.THOUGHT, link:39,
	 connection: 39},
	 {id: 39,
	 dialog: "Lemme see if there’s any open windows or doors.", type: speakingType.PC_SPEAKING,
	 connection: undefined},
// searching for a way inside
	 {id: 40,
	 dialog: "This won't open.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 41,
	 dialog: "Closed tight. No chance.",, type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 42,
	 dialog: "God dammit!", type: speakingType.PC_SPEAKING,
	 connection: undefined},
	 {id: 43, // window with open blinds
	 dialog: "Ah, those blinds aren't shut. I may be able to break in here.\nBut I need to find a tool to do that.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 44, 
	 dialog: "This won't open.", type: speakingType.THOUGHT,
	 connection: undefined},
// searching for tools
//picking up a tool
	 {id: 45,
	 dialog: "Maybe this one will work!", type: speakingType.THOUGHT,
	 connection: undefined},
	{id: 46,
	 dialog: "Let me pick this up!", type: speakingType.THOUGHT,
	 connection: undefined}, 
	{id: 47,
	 dialog: "I'll try this.", type: speakingType.THOUGHT,
	 connection: undefined},
// trying to use the wrong tool on the window	 
	 {id: 48,
	 dialog: "Dammit, this isn't working.", type: speakingType.PC_SPEAKING,
	 connection: undefined},
	 {id: 49,
	 dialog: "Well, this was a bad idea...", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 50,
	 dialog: "Why did I bother picking this up?", type: speakingType.THOUGHT,
	 connection: undefined},
//picking up the crowbar
	 {id: 51,
	 dialog: "What about this? Let's try.", type: speakingType.THOUGHT,
	 connection: undefined},
//using the crowbar on the window
	{id: 52,
	 dialog: "Finally....", type: speakingType.PC_SPEAKING,
	 connection: undefined},
	 	 
/* inside the house */

//entering scene	
	{id: 53,
	 dialog: "Whee, I’m excited to discover what her place looks like!~ <3", type: speakingType.THOUGHT,
	 connection: undefined},
// exploring the house
	 {id: 54, //bathroom sink
	 dialog: "A clean sink with a tidy cabinet.\nI need to shave.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 55, //basement
	 dialog: "It's dark down there. I don't think Jenny is in the basement.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 56, // TV in the living room
	 dialog: "She has a harddrive connected to the TV! Can't find the remote, though, what a pity...", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 57, // fridge in the kitchen
	 dialog: "Not much in the fridge... cute photos of her playing with her dogs on the door, though.", type: speakingType.THOUGHT,
	 connection: 58},
	 {id: 58, 
	 dialog: "...It's been a while since they passed away.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 59, // dog food bowls in the kitchen
	 dialog: "She never removed the bowls, she really loved her dogs- they even had name labels on the bowls.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 60, // bed in the bedroom
	 dialog: "She didn’t make her bed, that doesn’t seem to be like her at all.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 61, // PC in the bedroom
	 dialog: "Well, I assume she’s not pulled a Tron on us.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 62, //rotten strawberries in the kitchen
	 dialog: "Urgh. These strawberries nauseate me.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 63, //dirty dishes in the kitchen
	 dialog: "These dishes look like she’s been away for a couple of days already.", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 64, // dialogue ON ENTERING the bedroom
	 dialog: "This room looks like she left in a hurry!", type: speakingType.THOUGHT,
	 connection: undefined},
	 {id: 65, //triggered after the player used the rotten strawberries, the dishes, the fridge and has been to the bedroom.
	 dialog: "It seems like she was in a hurry to leave here, I wonder where she did take off to.\nMaybe I find some clues where she went if I look around one more time.", type: speakingType.THOUGHT,
	 connection: 66},
	 {id: 66,
	 dialog: "I should try her PC and take a look at her last actions on the internet.", type: speakingType.THOUGHT,
	 connection: 67},
	 {id: 67,
	 dialog: "Of course it’s password protected…\nLet me see if I can figure it out nevertheless.\nB.R. ...well that's easy! Black Rose, one of her dogs.", type: speakingType.THOUGHT,
	 connection: undefined}, // this is where the player will see a picture of the browser cache
	 {id: 68, //triggered after the player has seen the browser cache
	 dialog: "I guess that’s all I can find out today, I should return to the hotel now and get some sleep.\nI’ll continue to follow her trail tomorrow after breakfast.", type: speakingType.THOUGHT,
	 connection: undefined},
	 
/* at the hotel*/
// beginning of the scene
	{id: 69,
	 dialog: "Well then, let’s see if I can track mny dear Jenny down~ <3 \nIf she took the train, she probably went to the train station.\nI’d simply ask the receptionist, he might know the bus schedules by heart or have an overview. ", type: speakingType.THOUGHT,
	 connection: undefined},
//dialogue with the receptionist
	 {id: 70, 
	 dialog: "Good morning! I wonder if you could help me out.", type: speakingType.PC_SPEAKING, link:71,
	 connection: undefined},
	 {id: 71,
	 dialog: "Geez those glasses look horrible. They’re reminding me of hipster puns.", type: speakingType.THOUGHT,
	 connection: 72},
	 {id: 72,
	 dialog: "*mumbles*\n", type: speakingType.TEXT, link:73,
	 connection: undefined},
	 {id: 73,
	 dialog: "What can I do for you?", type: speakingType.NPC_SPEAKING,
	 connection: 74},
	 {id: 74,
	 dialog: "I want to continue my travel in the direction of Bielefeld by bus.\nI wondered if you could tell me which bus I need to take to get to the main bus station.\n", type: speakingType.PC_SPEAKING, link:75,
	 connection: undefined},
	 {id: 75,
	 dialog: "Oh my god. This isn’t helping!", type: speakingType.THOUGHT,
	 connection: 76},
	 {id: 76,
	 dialog: "Ah, what you're searching for is called \"Zentralstation\".", type: speakingType.NPC_SPEAKING,
	 connection: 77},
	 {id: 77,
	 dialog: "Well thank you! Can you tell me which bus I’d need to take?", type: speakingType.PC_SPEAKING, link:78,
	 connection: undefined},
	 {id: 78,
	 dialog: "Here we go...what do you call a hipster with a speech impediment?", type: speakingType.THOUGHT,
	 connection: 79},
	 {id: 79,
	 dialog: "Just check the schedules at the bus stop, most of the buses stop there.", type: speakingType.NPC_SPEAKING,
	 connection: 80},
	 {id: 80,
	 dialog: "Thank you very much", type: speakingType.PC_SPEAKING, link:81,
	 connection: undefined},
	 {id: 81,
	 dialog: "That’s right, a mumblr! Bwahahaha.", type: speakingType.THOUGHT,
	 connection: 82},
	  {id: 82,
	 dialog: "Okay nevermind. Back to work, let's go outside to catch the next bus.", type: speakingType.THOUGHT,
	 connection: undefined},
// the moment the player moves away from the reception
	 {id: 83,
	 dialog: "BFBS Radio Germany broadcast. *music plays*", type: speakingType.TEXT_BOLD,
	 connection: 84},
	 {id: 84,
	 dialog: "*sound plays*\n...tib tib tiiib...!", type: speakingType.TEXT,
	 connection: 85},
	 {id: 85,
	 dialog: "\nNewstime!\n\nLast night, a single-family home burned down in the Riemeke quarter.\nAccording to local police the fire was probably caused by a malfunctioning power supply.\nThe house owner apparently obliviously left the house without shutting down his PC, so fortunately there were no victims.", type: speakingType.NPC_SPEAKING,
	 connection: 86},
	 {id: 86,
	 dialog: "...Damn it. Thank god I took one of the pictures from the fridge with me.", type: speakingType.THOUGHT,
	 connection: undefined},
	
/* at the bus station */

	{id: 87,
	 dialog: "...6 more minutes until the bus arrives.", type: speakingType.THOUGHT, link:88,
	 connection: undefined},
	 {id: 88,
	 dialog: "*yawn*", type: speakingType.TEXT,
	 connection: 89},
	 {id: 89,
	 dialog: "*mumble*", type: speakingType.TEXT, link:90,
	 connection: undefined},
	 {id: 90,
	 dialog: "Hickery Pickery, in a row\nWhere will this young man go?\nHe'll go east, he'll go west,\nnever ever give it a rest.\nHe’ll go whisper, he’ll go shout\nhe'll go find the girl’s hide-out.\nHickery Pickery, Hickery Pickery...", type: speakingType.THOUGHT,
	 connection: undefined},

/* Bielefeld */

	 {id: 91,
	 dialog: "Time for some window shopping <3", type: speakingType.PC_SPEAKING, link:92,
	 connection: undefined},
	 {id: 92,
	 dialog: "If she’s here, I might be lucky and bump into Jenny.", type: speakingType.THOUGHT,
	 connection: undefined},
// when Jenny leaves the store right in front of the player
	 {id: 93,
	 dialog: "Oh my gosh! Speak of the devil~\nFinally! I found her! <3 <3", type: speakingType.THOUGHT,
	 connection: 94},
	 {id: 94,
	 dialog: "She’s walking off! I’d better follow her and see where she goes.", type: speakingType.THOUGHT,
	 connection: undefined},

// additional stuff
	 {id: 95, // foreigner
     dialog: "Excuse me! I need to get to the Holiday Inn in the city. How can I get there fast?", type: speakingType.PC_SPEAKING,
	 connection: 12},
	  {id: 96, //mom with child
     dialog: "Excuse me! I need to get to the Holiday Inn in the city. How can I get there fast?", type: speakingType.PC_SPEAKING,
	 connection: 14},
	  {id: 97, //talking to the girl
     dialog: "*turning to the girl*", type: speakingType.TEXT, link:17,
	 connection: undefined},
	 {id: 98,
     dialog: "Excuse me again, I am searching for the bus schedules, have you seen them by any chance?", type: speakingType.PC_SPEAKING,
	 connection: 21},
	 {id: 99,
     dialog: "Excuse me again, I am searching for the bus schedules, have you seen them by any chance?", type: speakingType.PC_SPEAKING,
	 connection: undefined},
	
// when Jenny flees into the side street
	{id: 100,
	dialog: "Omg! Leave me alone you creep! Hel---", type: speakingType.NPC_SPEAKING,
	connection: undefined},
	
];