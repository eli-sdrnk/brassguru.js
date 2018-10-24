
(function() {
    
	
	


	
// Create audio (context) container
var audioCtx = new (AudioContext || webkitAudioContext)();
var audioContext = new AudioContext();	

var vcf1= audioCtx.createBiquadFilter();
var vcf2= audioCtx.createBiquadFilter();
var filterType = document.querySelector('.filtertype'),
    filterFreq = document.querySelector('.freq'),
    filterFreqSlider = document.querySelector('.filter-slider'),
	filterQ = document.querySelector('.filter-q-value'),
    filterQSlider = document.querySelector('.filter-q-slider'),
	filterGain = document.querySelector('.filter-gain-value'),
    filterGainSlider = document.querySelector('.filter-gain-slider');

var	vcf_eg = document.querySelector('.egF-amount'),
	vcf_a = document.querySelector('.egF-attack'),
    vcf_d = document.querySelector('.egF-decay'),
    vcf_s = document.querySelector('.egF-sustain'),
    vcf_r = document.querySelector('.egF-release'),
	DlyTime = document.querySelector('.dly-time'),
	
	vcfDisplay_eg = document.querySelector('.egFam-display'),
    vcfDisplay_a = document.querySelector('.egFa-display'),
    vcfDisplay_d = document.querySelector('.egFd-display'),
    vcfDisplay_s = document.querySelector('.egFs-display'),
    vcfDisplay_r = document.querySelector('.egFr-display'),
	delayDisplay = document.querySelector('.dly-display'),
	filt_a = 0.1, 
	filt_d = 0.1, 
	filt_r = 0.1, 
	filt_s = 1, 
	filt_amount = 1, dlyTime = 0, initFreq=2500;
	
	
	vca = audioCtx.createGain(),
	master = audioCtx.createGain(),
	a = d = r = 0.1, s = 1, egMode = 1, velocity = 1;
var masterGain = document.querySelector('.amp-slider'),
	Attack = document.querySelector('.egA-attack'),
    Decay = document.querySelector('.egA-decay'),
    Sustain = document.querySelector('.egA-sustain'),
    Release = document.querySelector('.egA-release'),
    attackDisplay = document.querySelector('.egAa-display'),
    decayDisplay = document.querySelector('.egAd-display'),
    sustainDisplay = document.querySelector('.egAs-display'),
    releaseDisplay = document.querySelector('.egAr-display');
    //masterGainDisplay = document.querySelector('.master-gain-display'),
	
// keep track of active keys
var activeKeys = {};
	
	var vco1 = audioCtx.createOscillator();
	vco1.frequency.value=110;
	vco1.type = 'sawtooth';
	vco1.start(0);
	
	var vco2 = audioCtx.createOscillator();
	vco2.frequency.value=110;
	vco2.type = 'sawtooth';
	vco2.detune.setValueAtTime(1200, audioCtx.currentTime);
	vco2.start(0);
	
	master.gain.value=0.5;
	vca.gain.value=0;
	
	var delay = audioCtx.createDelay();	
	
	var vcf1EG = envGenOn(vcf1,filt_a,filt_d,filt_s,filt_amount); 
	var	vcf2EG = envGenOn(vcf2,filt_a,filt_d,filt_s,filt_amount); 

	vco1.connect(vcf1EG);
	vco2.connect(vcf1EG);
	vcf1EG.connect(vcf2EG);
  	vcf2EG.connect(vca);
	vca.connect(master);
	master.connect(audioCtx.destination);
	
	
					
    //vcf2EG.connect(delay);
    //delay.connect(audioCtx.destination);
	
	
// EG function
function vcaEnvOn(vcaGain, a, d, s) {
    var now = audioContext.currentTime;
    vcaGain.cancelScheduledValues(0);
    vcaGain.setValueAtTime(0, now);
    vcaGain.linearRampToValueAtTime(1, now + a);
    vcaGain.linearRampToValueAtTime(s, now + a + d);
}

function vcaEnvOff(vcaGain, r) {
    var now = audioContext.currentTime;
    vcaGain.cancelScheduledValues(0);
    vcaGain.setValueAtTime(vcaGain.value, now);
    vcaGain.linearRampToValueAtTime(0, now + r);
}
	
	
function envGenOn(input, filt_a, filt_d, filt_s, filt_amount) {
  var currentTime = audioContext.currentTime;	
  input.frequency.cancelScheduledValues(0);
  input.frequency.setValueAtTime(filterFreqSlider.value, currentTime);
  input.frequency.exponentialRampToValueAtTime(input.frequency.value+filt_amount, currentTime + filt_a);
  input.frequency.exponentialRampToValueAtTime(input.frequency.value+(filt_s*filt_amount), currentTime + filt_d);
	console.log("F_SUSTAIN: "+(filt_s*filt_amount)+"Hz");
  //input.frequency.setValueAtTime(initFreq, currentTime + filt_a+ filt_d);
	return input;
}			
	//---------------------------------
	
	
function envGenOff(input, filt_r){
	var now = audioContext.currentTime;
    input.frequency.cancelScheduledValues(0);
    input.frequency.setValueAtTime(input.frequency.value, now);
    input.frequency.exponentialRampToValueAtTime(initFreq, now + filt_r);
}	
	/*
	
function createNoteTable() {
  let noteFreq = [];
  for (let i=0; i< 9; i++) {
    noteFreq[i] = [];
  }

  noteFreq[0]["A"] = 27.500000000000000;
  noteFreq[0]["A#"] = 29.135235094880619;
  noteFreq[0]["B"] = 30.867706328507756;

  noteFreq[1]["C"] = 32.703195662574829;
  noteFreq[1]["C#"] = 34.647828872109012;
  noteFreq[1]["D"] = 36.708095989675945;
  noteFreq[1]["D#"] = 38.890872965260113;
  noteFreq[1]["E"] = 41.203444614108741;
  noteFreq[1]["F"] = 43.653528929125485;
  noteFreq[1]["F#"] = 46.249302838954299;
  noteFreq[1]["G"] = 48.999429497718661;
  noteFreq[1]["G#"] = 51.913087197493142;
  noteFreq[1]["A"] = 55.000000000000000;
  noteFreq[1]["A#"] = 58.270470189761239;
  noteFreq[1]["B"] = 61.735412657015513;
  noteFreq[2]["C"] = 65.406391325149658;
  noteFreq[2]["C#"] = 69.295657744218024;
  noteFreq[2]["D"] = 73.416191979351890;
  noteFreq[2]["D#"] = 77.781745930520227;
  noteFreq[2]["E"] = 82.406889228217482;
  noteFreq[2]["F"] = 87.307057858250971;
  noteFreq[2]["F#"] = 92.498605677908599;
  noteFreq[2]["G"] = 97.998858995437323;
  noteFreq[2]["G#"] = 103.826174394986284;
  noteFreq[2]["A"] = 110.000000000000000;
  noteFreq[2]["A#"] = 116.540940379522479;
  noteFreq[2]["B"] = 123.470825314031027;

  noteFreq[3]["C"] = 130.812782650299317;
  noteFreq[3]["C#"] = 138.591315488436048;
  noteFreq[3]["D"] = 146.832383958703780;
  noteFreq[3]["D#"] = 155.563491861040455;
  noteFreq[3]["E"] = 164.813778456434964;
  noteFreq[3]["F"] = 174.614115716501942;
  noteFreq[3]["F#"] = 184.997211355817199;
  noteFreq[3]["G"] = 195.997717990874647;
  noteFreq[3]["G#"] = 207.652348789972569;
  noteFreq[3]["A"] = 220.000000000000000;
  noteFreq[3]["A#"] = 233.081880759044958;
  noteFreq[3]["B"] = 246.941650628062055;

  noteFreq[4]["C"] = 261.625565300598634;
  noteFreq[4]["C#"] = 277.182630976872096;
  noteFreq[4]["D"] = 293.664767917407560;
  noteFreq[4]["D#"] = 311.126983722080910;
  noteFreq[4]["E"] = 329.627556912869929;
  noteFreq[4]["F"] = 349.228231433003884;
  noteFreq[4]["F#"] = 369.994422711634398;
  noteFreq[4]["G"] = 391.995435981749294;
  noteFreq[4]["G#"] = 415.304697579945138;
  noteFreq[4]["A"] = 440.000000000000000;
  noteFreq[4]["A#"] = 466.163761518089916;
  noteFreq[4]["B"] = 493.883301256124111;

  noteFreq[5]["C"] = 523.251130601197269;
  noteFreq[5]["C#"] = 554.365261953744192;
  noteFreq[5]["D"] = 587.329535834815120;
  noteFreq[5]["D#"] = 622.253967444161821;
  noteFreq[5]["E"] = 659.255113825739859;
  noteFreq[5]["F"] = 698.456462866007768;
  noteFreq[5]["F#"] = 739.988845423268797;
  noteFreq[5]["G"] = 783.990871963498588;
  noteFreq[5]["G#"] = 830.609395159890277;
  noteFreq[5]["A"] = 880.000000000000000;
  noteFreq[5]["A#"] = 932.327523036179832;
  noteFreq[5]["B"] = 987.766602512248223;

  noteFreq[6]["C"] = 1046.502261202394538;
  noteFreq[6]["C#"] = 1108.730523907488384;
  noteFreq[6]["D"] = 1174.659071669630241;
  noteFreq[6]["D#"] = 1244.507934888323642;
  noteFreq[6]["E"] = 1318.510227651479718;
  noteFreq[6]["F"] = 1396.912925732015537;
  noteFreq[6]["F#"] = 1479.977690846537595;
  noteFreq[6]["G"] = 1567.981743926997176;
  noteFreq[6]["G#"] = 1661.218790319780554;
  noteFreq[6]["A"] = 1760.000000000000000;
  noteFreq[6]["A#"] = 1864.655046072359665;
  noteFreq[6]["B"] = 1975.533205024496447;
  noteFreq[7]["C"] = 2093.004522404789077;
  noteFreq[7]["C#"] = 2217.461047814976769;
  noteFreq[7]["D"] = 2349.318143339260482;
  noteFreq[7]["D#"] = 2489.015869776647285;
  noteFreq[7]["E"] = 2637.020455302959437;
  noteFreq[7]["F"] = 2793.825851464031075;
  noteFreq[7]["F#"] = 2959.955381693075191;
  noteFreq[7]["G"] = 3135.963487853994352;
  noteFreq[7]["G#"] = 3322.437580639561108;
  noteFreq[7]["A"] = 3520.000000000000000;
  noteFreq[7]["A#"] = 3729.310092144719331;
  noteFreq[7]["B"] = 3951.066410048992894;

  noteFreq[8]["C"] = 4186.009044809578154;
  return noteFreq;	
}
noteFreq = createNoteTable();
	
	var notesByKeyCode = {
		90: { noteName: 'c'+octCur, frequency: noteFreq[octCur]["C"], keyName: 'z' },
        88: { noteName: 'd'+octCur, frequency: noteFreq[octCur]["D"], keyName: 'x' },
        67: { noteName: 'e'+octCur, frequency: noteFreq[octCur]["E"], keyName: 'c' },
        86: { noteName: 'f'+octCur, frequency: noteFreq[octCur]["F"], keyName: 'v' },
        66: { noteName: 'g'+octCur, frequency: noteFreq[octCur]["G"], keyName: 'b' },
        78: { noteName: 'a'+octCur, frequency: noteFreq[octCur]["A"], keyName: 'n' },
        77: { noteName: 'b'+octCur, frequency: noteFreq[octCur]["B"], keyName: 'm' },
        81: { noteName: 'c'+(octCur+1), frequency: noteFreq[octCur+1]["C"], keyName: 'q' },
        87: { noteName: 'd'+(octCur+1), frequency: noteFreq[octCur+1]["D"], keyName: 'w' },
        69: { noteName: 'e'+(octCur+1), frequency: noteFreq[octCur+1]["E"], keyName: 'e' },
        82: { noteName: 'f'+(octCur+1), frequency: noteFreq[octCur+1]["F"], keyName: 'r' },
        84: { noteName: 'g'+(octCur+1), frequency: noteFreq[octCur+1]["G"], keyName: 't' },
        89: { noteName: 'a'+(octCur+1), frequency: noteFreq[octCur+1]["A"], keyName: 'y' },
        85: { noteName: 'b'+(octCur+1), frequency: noteFreq[octCur+1]["B"], keyName: 'u' },
        73: { noteName: 'c'+(octCur+2), frequency: noteFreq[octCur+2]["C"], keyName: 'i' },
        79: { noteName: 'd'+(octCur+2), frequency: noteFreq[octCur+2]["D"], keyName: 'o' },
        80: { noteName: 'e'+(octCur+2), frequency: noteFreq[octCur+2]["E"], keyName: 'p' },
		
		83: { noteName: 'c#'+(octCur), frequency: noteFreq[octCur]["C#"], keyName: 's' },
        68: { noteName: 'd#'+(octCur), frequency: noteFreq[octCur]["D#"], keyName: 'd' },
        71: { noteName: 'f#'+(octCur), frequency: noteFreq[octCur]["F#"], keyName: 'g' },
        72: { noteName: 'g#'+(octCur), frequency: noteFreq[octCur]["G#"], keyName: 'h' },
        74: { noteName: 'a#'+(octCur), frequency: noteFreq[octCur]["A#"], keyName: 'j' },
        50: { noteName: 'c#'+(octCur+1), frequency: noteFreq[octCur+1]["C#"], keyName: '2' },
        51: { noteName: 'd#'+(octCur+1), frequency: noteFreq[octCur+1]["D#"], keyName: '3' },
        53: { noteName: 'f#'+(octCur+1), frequency: noteFreq[octCur+1]["F#"], keyName: '5' },
        54: { noteName: 'g#'+(octCur+1), frequency: noteFreq[octCur+1]["G#"], keyName: '6' },
        55: { noteName: 'a#'+(octCur+1), frequency: noteFreq[octCur+1]["A#"], keyName: '7' },
        57: { noteName: 'c#'+(octCur+2), frequency: noteFreq[octCur+2]["C#"], keyName: '9' },
        48: { noteName: 'd#'+(octCur+2), frequency: noteFreq[octCur+2]["D#"], keyName: '0' },
		
		187: {noteName: "OCT+", frequency: null, keyName:'+'},
		189: {noteName: "OCT-", frequency: null, keyName:'-'}
    };
function Key(keyCode, noteName, keyName, frequency) {
		
    var keySound = new Sound(frequency, 'sawtooth');
	return 	{sound: keySound};
}


	
function Sound(frequency, type){
		
        this.osc = audioCtx.createOscillator(); // Create oscillator node	
        this.pressed = false; // flag to indicate if sound is p
        if(typeof frequency !== 'undefined') {
            this.osc.frequency.value = frequency/4;
        }

        this.osc.type = type || 'Square';
		
        /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
        piped to output (AKA your speakers). 
        this.osc.start(0);
    };

    Sound.prototype.play = function() {
        if(!this.pressed) {
            this.pressed = true;
            //this.osc.connect(vcf1);
			//vcf1.connect(vcf2);
			//vcf2.connect(audioCtx.destination);
			
			
			var vcf1EG = envGenOn(vcf1,a,d,0,amount); 
			var	vcf2EG = envGenOn(vcf2,a,d,0,amount); 
			
			this.osc.connect(vcf1EG);
			vcf1EG.connect(vcf2EG);
  			//vcf2EG.connect(audioCtx.destination);
					
   			delay.delayTime.value = dlyTime/500;
			console.log("DLY_TIME: " + delay.delayTime.value + " ms;");
			
    		vcf2EG.connect(delay);
    		//delay.connect(audioCtx.destination);

			
	
	
	

// Manipulate the Biquad filter
			
        }
    };
    Sound.prototype.stop = function() {
        this.pressed = false;
        this.osc.disconnect();
    };

function createKeyboard(notes, containerId) {
	
	
	
        
        var waveFormSelector = document.getElementById('soundType');

        for(var keyCode in notes) {
            var note = notes[keyCode];
            /* Generate playable key 
            note.key = new Key(keyCode, note.noteName, note.keyName, note.frequency);
        }
	

        var playNote = function(event) {
            event.preventDefault();
            
            var keyCode = event.keyCode || event.target.getAttribute('data-key');

			
				
				if(typeof notesByKeyCode[keyCode] !== 'undefined' ) {
					
					// Pipe sound to output (AKA speakers)
					notesByKeyCode[keyCode].key.sound.play();
					
					}
			
				
				
        };

        var endNote = function(event) {
            var keyCode = event.keyCode || event.target.getAttribute('data-key');

            if(typeof notesByKeyCode[keyCode] !== 'undefined') {
                // Kill connection to output
                notesByKeyCode[keyCode].key.sound.stop();

				
				console.log("CUTOFF_STOP: "+vcf2.frequency.value);
				//filterFreq.innerHTML = +vcf2.frequency.value + ' Hz';
            }
        };

		var setWaveform = function(event) {
			for(var keyCode in notes) {
			notes[keyCode].key.sound.osc.type = this.value;
			}
			// Unfocus selector so value is not accidentally updated again while playing keys
			this.blur();
		};

        // Check for changes in the waveform selector and update all oscillators with the selected type
        waveFormSelector.addEventListener('change', setWaveform);
        window.addEventListener('keydown', playNote);
        window.addEventListener('keyup', endNote);
        window.addEventListener('touchstart', playNote);
        window.addEventListener('touchend', endNote);
    }

    window.addEventListener('load', function() {
        createKeyboard(notesByKeyCode, 'keyboard');
    });
	

	
	
	
	
	*/
	
filterType.oninput = function () {
    changeFilterType(filterType.value);
};

filterFreqSlider.oninput = function () {
    changeFilterFreq(filterFreqSlider.value);
	
};

filterQSlider.oninput = function () {
    changeFilterQ(filterQSlider.value);
};

filterGainSlider.oninput = function () {
    changeFilterGain(event.target.value);
};
	
	
// change filter type and enable / disable controls depending on filter type
function changeFilterType(type) {
    vcf1.type = type;
	vcf2.type = type;
    switch (type) {
        case 'peaking':
            filterQSlider.disabled = false;
            filterGainSlider.disabled = false;
            break;
        case 'lowpass':
        case 'highpass':
        case 'bandpass':
            break;
    }
}

// change filter frequency and update display 
function changeFilterFreq(freq) {
	freq = logslider(freq/4.5);
	
    vcf1.frequency.value = +freq;
	vcf2.frequency.value = +freq;
    filterFreq.innerHTML = +freq + ' Hz';
	
	 initFreq = vcf2.frequency.value;
}
// change filter Q and update display
function changeFilterQ(Q) {
    vcf1.Q.value = Q;
	vcf2.Q.value = Q;
    filterQ.innerHTML = (Q*1).toFixed(1);
}

// change filter Gain and update display
function changeFilterGain(gain) {
    vcf1.gain.value = gain;
	vcf2.gain.value = gain;
    filterGain.innerHTML = gain + 'dB';
}	
	
vcf_eg.oninput = function () {changeFAmount(vcf_eg.value);};
vcf_a.oninput = function () {changeFAttack(vcf_a.value);};
vcf_d.oninput = function () {changeFDecay(vcf_d.value);};
vcf_s.oninput = function () {changeFSustain(vcf_s.value);};
vcf_r.oninput = function () {changeFRelease(vcf_r.value);};
DlyTime.oninput = function () {changeDelay(DlyTime.value); delay.delayTime.value = dlyTime/1000;};

function changeFAmount(val) {
    filt_amount = +val;
    vcfDisplay_eg.innerHTML = val + "Hz";
}	
function changeFAttack(val) {
	filt_a = +logslider(val)/1000;
    //a = +val;
    vcfDisplay_a.innerHTML = +logslider(val)+" ms";
}
function changeFDecay(val) {
    filt_d = +logslider(val)/1000;
    //a = +val;
    vcfDisplay_d.innerHTML = +logslider(val)+" ms";
}
function changeFSustain(val) {
    filt_s = +val;
    vcfDisplay_s.innerHTML = val+filt_amount+ " Hz";
}
function changeFRelease(val) {
    filt_r = +logslider(val)/1000;
    //a = +val;
    vcfDisplay_r.innerHTML = +logslider(val)+" ms";
}	
function changeFDelay(val) {
    dlyTime = +val;
    delayDisplay.innerHTML = val+" ms";
	
	console.log("DLY_TIME:  " + dlyTime/1000 + " ms;");
	
}	

	
	
Attack.oninput = function () {
    changeAttack(Attack.value);
}
Decay.oninput = function () {
    changeDecay(Decay.value);
}
Sustain.oninput = function () {
    changeSustain(Sustain.value);
}
Release.oninput = function () {
    changeRelease(Release.value);
}


function changeAttack(val) {
    a = +logslider(val)/1000;
    attackDisplay.innerHTML = +logslider(val)+" ms";
}

function changeDecay(val) {
    d = +logslider(val)/1000;
    decayDisplay.innerHTML = +logslider(val)+" ms";
}

function changeSustain(val) {
    s = +val;
    sustainDisplay.innerHTML = val;
}

function changeRelease(val) {
    r = +logslider(val)/1000;
    releaseDisplay.innerHTML = +logslider(val)+" ms";
}

function changeMaster(vol) {
    master.gain.value = vol;
    masterGain.value = vol;
    //masterGainDisplay.innerHTML = vol;
	document.getElementById("led").style.opacity = vol;
}

masterGain.oninput = function () {
    changeMaster(masterGain.value);
}	
	
	
	
	
	
	
	
	
	

function logslider(position) {
  // position will be between 0 and 100
  var minp = 0;
  var maxp = 1000;

  // The result should be between 100 an 10000000
  var minv = Math.log(10);
  var maxv = Math.log(5000);
  // calculate adjustment factor
  var scale = (maxv-minv) / (maxp-minp);
  return Math.exp(minv + scale*(position-minp)).toFixed(2);
	
}	
		
	
	
	
	
	
	
	
	
	
function frequencyFromNote(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}
	
	
	
//MIDI-CONNECTION
var midi, data, cmd, channel, type, note, velocity;
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
    sysex: false
    }).then(MIDISuccess, MIDIFailure);
	}
function MIDISuccess(midi) {
    var inputs = midi.inputs,
        device = {};
    inputs.forEach(function (port) {
        port.onmidimessage = onMIDIMessage;
		
		//console.log("connection: " + port.name + " " + port.connection + " " + port.state );
    });
}
function MIDIFailure() {
    console.log('Your browser does not support Web MIDI');
}
	
function onMIDIMessage(message) {
    console.log('MIDI Message', message.data);
    data = message.data,
    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0,
    note = data[1],
    velocity = data[2];

    // Step: Patch from the Keyboard note output into the VCO CV input
    if (velocity == 0) {
		noteOff();
    } else {
        switch (type) {
            case 144:
				noteOn(note, velocity);
                break;
            case 128:
				noteOff(note);
                break;
        }
    }
}

	function noteOn(note, velocity) {
    var now = audioCtx.currentTime;
    activeKeys[note] = true;
    vco1.frequency.cancelScheduledValues(0);
    vco1.frequency.setValueAtTime(frequencyFromNote(note), now);
	vco2.frequency.cancelScheduledValues(0);
    vco2.frequency.setValueAtTime(frequencyFromNote(note), now);
	envGenOn(vcf1,filt_a,filt_d,filt_s,filt_amount); 	
	envGenOn(vcf2,filt_a,filt_d,filt_s,filt_amount); 
		
    vcaEnvOn(vca.gain, a, d, s);
		
    //changeMaster(+(velocity/127).toFixed(2));
}

function noteOff() {
    var now = audioCtx.currentTime;
    delete activeKeys[note];
    vco1.frequency.cancelScheduledValues(0);
    vco1.frequency.setValueAtTime(frequencyFromNote(note), now);
	vco2.frequency.cancelScheduledValues(0);
    vco2.frequency.setValueAtTime(frequencyFromNote(note), now);
    if(isEmptyObj(activeKeys)){
      vcaEnvOff(vca.gain, r);
	  envGenOff(vcf1,filt_r); 	
	  envGenOff(vcf2,filt_r); 
    }    
}

function bend(note, velocity) {
    console.log('bend', note, velocity);
}

function pressure(note, velocity) {
    console.log('pressure', note, velocity);
}

	
function isEmptyObj(obj){
    return Object.keys(obj).length === 0;
}
	
	
	
	
	

})();



