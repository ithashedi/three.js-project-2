// Create an AudioContext in response to a user gesture

document.querySelector('#box').addEventListener('click', function() {	
	const synth = new Tone.Synth().toMaster();
	// adding the start of the audio
	const now = Tone.now();
	synth.triggerAttackRelease("g5", "2n", now); // now + 1 is used to control the start of the note
	synth.triggerAttackRelease("e5", "2n", now+1); 	
	synth.triggerAttackRelease("c5", "2n", now+2); 	
	synth.triggerAttackRelease("g4", "2n", now+3); 	
	synth.triggerAttackRelease("A4", "4n", now+4); 	
	synth.triggerAttackRelease("b5", "4n", now+4.5); 	
});

document.querySelector('#info').addEventListener('click', function() {	
	const context = new AudioContext();
  	this.style.display = "none";

});

