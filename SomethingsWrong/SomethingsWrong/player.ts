class Player 
{
	private name: string;
	private WALKING : boolean; // Whether or not we are walking at the moment
	private FACE_LEFT : boolean;
	private ANIMATION_NUM : number;
	private width: number;
	private height: number;
	constructor(_name : string)
	{
		this.WALKING = false;
		this.FACE_LEFT = false;
		console.log("Player created, name: " + _name);
	}
	
	// Draws the character according to his current
	// animation style and frame number
	Draw()
	{
		if(this.WALKING == true)
		{
			if(this.FACE_LEFT)
			{
				switch(this.ANIMATION_NUM)
				{
					case 0: break;
					case 1: break;
					case 2: break;
					case 3: break;
				}
			}
			else 
			{
				switch(this.ANIMATION_NUM)
				{
					switch(this.ANIMATION_NUM)
					{
						case 0: break;
						case 1: break;
						case 2: break;
						case 3: break;
					}
				}
			}
		} // end if idling
		else if(this.WALKING == false)
		{
			if(this.FACE_LEFT)
			{
				switch(this.ANIMATION_NUM)
				{
					case 0: break;
					case 1: break;
					case 2: break;
					case 3: break;
				}
			}
			else
			{
				switch(this.ANIMATION_NUM)
				{
					case 0: break;
					case 1: break;
					case 2: break;
					case 3: break;
				}
			}
		} // end if we're walking
	}
	
	
}