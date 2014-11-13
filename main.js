var fs = require('fs');
var soap = require('soap');
var md5 = require('MD5');

var config = JSON.parse(fs.readFileSync('config.json'));

console.log(config);

soap.createClient(config.wsdl, function(e, client) {
  var now = (new Date()).toJSON();
  client.inbound_interface({
    user: {
      now: now,
      company: config.user.company,
      login: config.user.login,
      auth_string: md5(now + md5(config.user.password))
    },
    head: {
      upload_type: 'incremental',
      id: "IB2014.11.03",
      appointment: {
        keys: {
          field: ['appt_number']
        }
      },
      inventory: {
        keys: {
          field: ['invtype_label']
        }
      }
    },
    data: {
      commands: {
        command: [{
          date: "2014-11-04",
          type: "update_inventory",
          external_id: "55015",
          inventories: {
            inventory: [{
              properties: {
                property: [{
                    label: "invsn",
                    value: "12456ABC_9$%^"
                  }, {
                    label: "invtype_label",
                    value: "AT"
                }]
              }
            }, {
              properties: {
                property: [{
                  label: "invtype_label",
                  value: "HD12"
                }, {
                  label: "quantity",
                  value: "2"
                }]
              }
            }]
          }
        }]
      }
    }
  }, function(e, result) {
    var dir = process.cwd();
    process.chdir('./tmp');
    fs.writeFileSync('./error.json', JSON.stringify(e, null, 2));
    fs.writeFileSync('./response.json', JSON.stringify(result, null, 2));
    process.chdir(dir);
  },
  {
    // uri: "http://localhost:8088/mockInboundInterfaceBinding",
    // proxy: "http://localhost:8888"
  });
});
