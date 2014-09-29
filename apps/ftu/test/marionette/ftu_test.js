/* global require */
'use strict';

var assert = require('assert');

marionette('First Time Use >', function() {
  var FTU = 'app://ftu.gaiamobile.org';

  var client = marionette.client();
  var wifiPassword64 =
    'e93FSJpMGMxRnWHs2vJYyMud5h6u7yEhSC445cz7RdHVxXrj2LCTZPAphzaYuyy2';

  var clickThruPanel = function(panel_id, button_id) {
    if (panel_id == '#wifi') {
      // The wifi panel will bring up a screen to show it is scanning for
      // networks. Not waiting for this to clear will blow test timing and cause
      // things to fail.
      client.helper.waitForElementToDisappear('#loading-overlay');
    }

    if (panel_id == '#date_and_time') {
      client.findElement('#dt_skip', function(err, element) {
        if (err) {
          console.error(err);
          return;
        }

        var scroll = function() {
          document.getElementById('dt_skip').scrollIntoView(false);
          return { success: true };
        };

        client.executeJsScript(
          scroll, 
          [], 
          function(err, value) {
            if (err || !value.success) {
              console.error(err + ' with value ' + value);
              return;
            }
            var button = client.helper.waitForElement('#dt_skip');
            button.tap();
          }
        );
      });
    } else {
      // waitForElement is used to make sure animations and page changes have
      // finished, and that the panel is displayed.
      client.helper.waitForElement(panel_id);
      if (button_id) {
        var button = client.helper.waitForElement(button_id);
        button.tap();
      }
    }
  };

  test('FTU comes up on profile generation', function() {
    client.apps.switchToApp(FTU);
  });

  test('FTU click thru', function() {
    client.apps.switchToApp(FTU);
    clickThruPanel('#languages', '#languages .nav-item');
    clickThruPanel('#wifi', '#wifi .forward');
    clickThruPanel('#date_and_time', '#date_and_time .forward');
    clickThruPanel('#geolocation', '#disable-geolocation');
    clickThruPanel('#import_contacts', '#import_contacts .forward');
    clickThruPanel('#firefox_accounts', '#fxa-wo-account li.forward');
    clickThruPanel('#welcome_browser', '#welcome_brower .forward');
    clickThruPanel('#browser_privacy', '#browser_privacy .forward');
    clickThruPanel('#finish-screen', undefined);
  });

  suite('FTU Languages', function() {
    var quickly;

    setup(function() {
      // allow findElement to fail quickly
      quickly = client.scope({ searchTimeout: 50 });
      quickly.helper.client = quickly;
    });

    test('FTU Languages without pseudo localization', function() {
      quickly.settings.set('devtools.qps.enabled', false);
      quickly.apps.switchToApp(FTU);
      quickly.helper.waitForElement('#languages');
      // the input is hidden so we can't use waitForElement
      quickly.findElement('input[value="en-US"]');
      quickly.helper.waitForElementToDisappear('input[value="qps-ploc"]');
    });

    test('FTU Languages with pseudo localization', function() {
      quickly.settings.set('devtools.qps.enabled', true);
      quickly.apps.switchToApp(FTU);
      quickly.helper.waitForElement('#languages');
      quickly.findElement('input[value="en-US"]');
      quickly.findElement('input[value="qps-ploc"]');
    });
  });

  test('FTU Wifi Scanning Tests', function() {
    client.apps.switchToApp(FTU);
    clickThruPanel('#languages', '#forward');
    clickThruPanel('#wifi', '#forward');
    clickThruPanel('#date_and_time', '#back');
    clickThruPanel('#wifi', undefined);
  });

  test('Wi-Fi hidden network password 64 characters', function() {
    client.apps.switchToApp(FTU);
    clickThruPanel('#languages', '#forward');
    clickThruPanel('#wifi', '#join-hidden-button');

    var input = client.findElement('#hidden-wifi-password');
    var password = input.getAttribute('value');
    assert.equal(password.length, 0);
    input.sendKeys(wifiPassword64);
    password = input.getAttribute('value');
    assert.equal(password.length, 63);
  });
});
