var taskName = 'test',
    navSync = navigator.sync;

var data = {
  accountIds: ['one', 'two']
};

if (!navSync) {
  console.error('!!!!!! navigator.sync does not exist');
}

// Entry point to the app when being awoken by the request-sync
navigator.mozSetMessageHandler('request-sync', function(evt) {
  console.log('SUCCESS: mozSetMessageHandler request-sync called with:');
  Object.keys(evt).forEach(function(key) {
    console.log(key + ': ' + evt[key]);
  });
});

// Button actions, wired to the buttons with the IDs matching the object keys.
var actions = {
  listsync: function(evt) {
    navSync.registrations().then(function(registrations) {
      console.log('REGISTRATIONS RETURNED ' + registrations.length + ' items');
      registrations.forEach(function(reg) {
        console.log('REGISTRATION ITEM:');
        Object.keys(reg).forEach(function(key) {
          console.log(key + ': ' + reg[key]);
        });
        console.log('------------------');
      });
    }).catch(function(e) {
      console.error('registrations() failed with: ' + e);
    });
  },

  dosync: function(evt) {
    navSync.registrations().then(function(registrations) {
      var existingReg;
      registrations.some(function(reg) {
        if (reg.task === taskName) {
          return !!(existingReg = reg);
        }
      });

      if (existingReg) {
        console.log('REQUEST SYNC TASK ALREADY EXISTS FOR: ' + taskName);
        return;
      }

      console.log('REGISTERING SYNC FOR TASK NAME: ' + taskName);

      navSync.register(taskName, {
        // minInterval is in seconds.
        minInterval: 100,
        oneShot: true,
        data: data,
        wifiOnly: false,
        wakeUpPage: location.href })
      .then(function() {
        console.log('SUCCESS: navigator.sync.register for ' + taskName);
      }).catch(function(err) {
        console.error('ERROR: navigator.sync.register for ' + taskName +
                      err);
      });
    }).catch(function(e) {
      console.error('registrations() failed with: ' + e);
    });
  },

  removesync: function(evt) {
    navSync.unregister(taskName)
    .then(function() {
      console.log('SUCCESS: navigator.sync.unregister for ' + taskName);
    }).catch(function(err) {
      console.error('ERROR: navigator.sync.unregister for ' + taskName +
                    ': ' + err);
    });
  }
};

// Wiring event handlers to the buttons.
Object.keys(actions).forEach(function(key) {
  var node = document.getElementById(key);
  node.addEventListener('click', actions[key], false);
});


