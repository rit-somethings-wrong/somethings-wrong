class Player
{
	var name :String;
	var inventory : {};

	//-- movement states
	var animationType : enum
	{
		IDLE, 
		WALKLEFT, 
		WALKRIGHT,
	}
	
	var animationFrame:number = 0;
	
	// Draws player at specified screen location.
	function Draw(screenlocation)
	{
		// draw at the screen location whichever animation frame we need or whatever
		if(this.animationType == 0)
		{
			// Draw the idling animation in the appropriate direction
		}
		else if(this.animationType == 1)
		{
		}
		else if(this.animationType == 2)
		{
		}
	}

}
