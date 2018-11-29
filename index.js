const fs = require('fs');
const { remote } = require('electron');
var path = require('path');
const currentWindow = remote.getCurrentWindow();


const basePath = process.env.APP_PATH;
alert(basePath);

var vueApp = new Vue({
  el: '#app',
  data: {
    players: [
      {
        name: '',
        score: 0
      },
      {
        name: '',
        score: 0
      }
    ],
    label: '',
    autoUpdate: false,
    alwaysOnTop: true
  },
  created: function () {
    this.load();
  },
  methods: {
    resetScore: function() {
      this.players[0].score = this.players[1].score = 0;
      this.onChanged();
    },
    clearPlayerName: function(id) {
      this.players[id].name = '';
      this.onChanged();
    },

    clearPlayers: function() {
      this.players[0].name = this.players[1].name = this.players[0].score = this.players[1].score = '';
      this.label = '';
      this.onChanged();
    },
    switchPlayers: function () {
      this.players.push(this.players.shift());
      this.onChanged();
    },
    clearLabel: function () {
      this.label = '';
      this.onChanged();
    },
    onChanged: function () {
      if (this.autoUpdate) {
        this.update();
      }
    },
    load: function () {
      const outputPath = 'output';
      const files = {
        'p1name.txt': 'this.players[0].name',
        'p1score.txt': 'this.players[0].score',
        'p2name.txt': 'this.players[1].name',
        'p2score.txt': 'this.players[1].score',
        'label.txt': 'this.label'
      };
      
      for (let filename in files) {
        let filePath = path.join(basePath, outputPath, filename);
        fs.readFile(filePath, 'utf8', (err, data) => {
          if(err) { return console.log(err); }
          eval(files[filename] + "='" + data + "'");
        });
      }
    },
    update: function () {
      var basepath = '.';
      const outputPath = 'output';
      const files = {
        'p1name.txt': this.players[0].name,
        'p1score.txt': this.players[0].score,
        'p2name.txt': this.players[1].name,
        'p2score.txt': this.players[1].score,
        'label.txt': this.label
      };
      
      for (let filename in files) {
        var filePath = path.join(basePath, outputPath, filename);
        fs.writeFile(filePath, files[filename], function(err) {
          if(err) { return console.log(err); }
        });
      }
    },
    modifyScore: function (playerId, diff) {
      if (this.players[playerId].score === '') {
        this.players[playerId].score = 0;
      }
      this.players[playerId].score = parseInt(this.players[playerId].score) + diff;
      if (this.players[playerId].score < 0)
        this.players[playerId].score = 0;

      this.onChanged();
    },
    toggleAlwaysOnTop: function () {
      this.alwaysOnTop = !this.alwaysOnTop;
      currentWindow.setAlwaysOnTop(this.alwaysOnTop);
    }
  }
});


/*
var midi, data;
// start talking to MIDI controller
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser")
}

// on success
function onMIDISuccess(midiData) {
  // this is all our MIDI data
  midi = midiData;
  var allInputs = midi.inputs.values();
  // loop over all available inputs and listen for any MIDI input
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    // when a MIDI value is received call the onMIDIMessage function
    input.value.onmidimessage = gotMIDImessage;
  }
}
var dataList = document.querySelector('#midi-data ul')

function gotMIDImessage(messageData) {
  //var newItem = document.createElement('li');
  //newItem.appendChild(document.createTextNode(messageData.data));
  //dataList.appendChild(newItem);

  // Just on click
  if (messageData.data[2] === 127) {
    switch (messageData.data[1]) {
      case 33: {
        vueApp.modifyScore(0, -1);
      } break;
      case 23: {
        vueApp.modifyScore(0, 1);
      } break;
      case 34: {
        vueApp.modifyScore(1, -1);
      } break;
      case 24: {
        vueApp.modifyScore(1, 1);
      } break;
      case 44: {
        vueApp.clearPlayers();
      } break; 
      case 46: {
        vueApp.resetScore();
      } break;
      case 49: {
        vueApp.switchPlayers();
      } break;
      case 31: {
        document.getElementById('image').style.display = 'block'
      } break;
    }  
  }

}

// on failure
function onMIDIFailure() {
  console.warn("Not recognising MIDI controller")
}



*/