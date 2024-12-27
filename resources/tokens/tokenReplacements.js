//const os = require('os');
import os from 'os'
import { app } from "electron";
// const TokenReplaceHelper = require('./tokenReplaceHelper.js');
import TokenReplaceHelper  from "./tokenReplaceHelper.js";
import path from 'path';

// noinspection JSUnusedLocalSymbols
export const tokenReplacements = [
    {
        token: /{{activityCenterServices}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.tomcat1}/activity-center-services`;
        },
    },
    {
        token: /{{appRole}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vaultForDb.appRole;
        },
    },
    {
        token: /{{authentication}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.authentication}/authentication-services`;
        },
    },
    {
        token: /{{Backend}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.backend;
        },
    },
    {
        token: /{{BASE_DIR}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return 'jorgePathToRepos';
        },
    },
    {
        token: /{{BhAdmin}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.jrun}/BullhornAdmin/`;
        },
    },
    {
        token: /{{BhStaffing}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.jrun}`;
        },
    },
    {
        token: /{{ClientId}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.other.clientId;
        },
    },
    {
        token: /{{ClientIdSecret}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.other.clientIdSecret;
        },
    },
    {
        token: /{{CondorClientId}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.other.condorClientId;
        },
    },
    {
        token: /{{CONF_DIR}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
             return path.join(
                  app.isPackaged ? process.resourcesPath : process.cwd(),
                  "resources",
                  "conf"
                );
        },
    },
    {
        token: /{{database\.databases\.clientstore\.hostname}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.clientstore.hostname;
        },
    },
    {
        token: /{{database\.databases\.clientstore\.password}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.clientstore.password;
        },
    },
    {
        token: /{{database\.databases\.clientstore\.port}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.clientstore.port;
        },
    },
    {
        token: /{{database\.databases\.clientstore\.username}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.clientstore.username;
        },
    },
    {
        token: /{{database\.databases\.instances\.hostname}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.instances.hostname;
        },
    },
    {
        token: /{{database\.databases\.instances\.password}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.instances.password;
        },
    },
    {
        token: /{{database\.databases\.instances\.port}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.instances.port;
        },
    },
    {
        token: /{{database\.databases\.instances\.username}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.instances.username;
        },
    },
    {
        token: /{{database\.databases\.local_master\.hostname}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.localMaster.hostname;
        },
    },
    {
        token: /{{database\.databases\.local_master\.password}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.localMaster.password;
        },
    },
    {
        token: /{{database\.databases\.local_master\.port}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.localMaster.port;
        },
    },
    {
        token: /{{database\.databases\.local_master\.username}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.localMaster.username;
        },
    },
    {
        token: /{{database\.databases\.master_master\.hostname}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.masterMaster.hostname;
        },
    },
    {
        token: /{{database\.databases\.master_master\.password}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.masterMaster.password;
        },
    },
    {
        token: /{{database\.databases\.master_master\.port}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.masterMaster.port;
        },
    },
    {
        token: /{{database\.databases\.master_master\.username}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.masterMaster.username;
        },
    },
    {
        token: /{{databaseCredentialName}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.credentialName;
        },
    },
    {
        token: /{{daytonaUrl}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.daytonaUrl;
        },
    },
    {
        token: /{{daytonaConsumerV1Host}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return TokenReplaceHelper.findUrl(config, selectedPackages, 'Daytona Consumer v1', selectedMachine.daytonaConsumer1);
        },
    },
    {
        token: /{{daytonaConsumerV2Host}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return TokenReplaceHelper.findUrl(config, selectedPackages, 'Daytona Consumer v2', selectedMachine.daytonaConsumer2);
        },
    },
    {
        token: /{{Domain}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.domain;
        },
    },
    {
        token: /{{eventConflationServices}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.tomcat3}/event-conflation-services`;
        },
    },
    {
        token: /{{HornetQ}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.hornetQ;
        },
    },
    {
        token: /{{InstanceDBHost}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.instances.host;
        },
    },
    {
        token: /{{JamesSMTPServer\.host}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.james;
        },
    },
    {
        token: /{{JamesSMTPServer\.port}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.jamesPort;
        },
    },
    {
        token: /{{KafkaForwarder}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.kafkaForwarder}/kafka-forwarder`;
        },
    },
    {
        token: /{{KafkaPort}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.kafkaPort;
        },
    },
    {
        token: /{{KafkaServer}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.kafkaServer;
        },
    },
    {
        token: /{{MachineName}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return os.hostname();
        },
    },
    {
        token: /{{RemoteMachineName}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.machineName;
        },
    },
    {
        token: /{{MasterMasterDBHost}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.databases.masterMaster.host;
        },
    },
    {
        token: /{{MessagingService}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.messagingServices}/messaging-services`;
        },
    },
    {
        token: /{{MetaService}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.metaServices}/meta-services`;
        },
    },
    {
        token: /{{MongoPort}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.mongoPort;
        },
    },
    {
        token: /{{MongoServer}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.mongoServer;
        },
    },
    {
        token: /{{password}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.tomcat.users.password;
        },
    },
    {
        token: /{{privateKey}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.keyPair.privateKey;
        },
    },
    {
        token: /{{privateKeyName}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.keyPair.privateKeyName;
        },
    },
    {
        token: /{{publicKey}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.keyPair.publicKey;
        },
    },
    {
        token: /{{publicKeyName}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.keyPair.publicKeyName;
        },
    },
    {
        token: /{{PublicRestService}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            var baseUrl = TokenReplaceHelper.findUrl(config, selectedPackages, 'RestService', selectedMachine.tomcat2);
            return "http://public-" + baseUrl + "/rest-services"
        },
    },
    {
        token: /{{Redis_IP}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.redis;
        },
    },
    {
        token: /{{Redis_Port}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.redisPort;
        },
    },
    {
        token: /{{reportingServices}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.reportingServices}/reporting-services`;
        },
    },
    {
        token: /{{roles}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.tomcat.users.roles;
        },
    },
    {
        token: /{{SamlEncryptionKey}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.saml.encryptionKey;
        },
    },
    {
        token: /{{samlServices}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.samlServices}/saml-services`;
        },
    },
    {
        token: /{{SelfSignup}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.selfSignup}/selfsignup`;
        },
    },
    {
        token: /{{shackleton}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return `http://${selectedMachine.shackleton}/shackleton-services`;
        },
    },
    {
        token: /{{StaffingService}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.tomcat1;
        },
    },
    {
        token: /{{StandardSMTPServer\.host}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.standardSMTPServer.host;
        },
    },
    {
        token: /{{StandardSMTPServer\.port}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.standardSMTPServer.port;
        },
    },
    {
        token: /{{Tomcat1}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.tomcat1;
        },
    },
    {
        token: /{{Tomcat2}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.tomcat2;
        },
    },
    {
        token: /{{Tomcat3}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.tomcat3;
        },
    },
    {
        token: /{{Tycho}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return selectedMachine.tomcat1;
        },
    },
    {
        token: /{{TychoClientId}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.other.tychoClientId;
        },
    },
    {
        token: /{{TychoClientIdSecret}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.other.tychoClientIdSecret;
        },
    },
    {
        token: /{{username}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.tomcat.users.username;
        },
    },
    {
        token: /{{useVasForDatabasePassword}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vaultForDb.useForDbPassword;
        },
    },
    {
        token: /{{useVasForFieldEncryptionPassword}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vaultForDb.useForFieldEncryptionPassword;
        },
    },
    {
        token: /{{VAS}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vas.url;
        },
    },
    {
        token: /{{vaultToken}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vault.token;
        },
    },
    {
        token: /{{vaultUrl}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vault.url;
        },
    },
    {
        token: /{{vaultForDbAddress}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vaultForDb.address;
        },
    },
    {
        token: /{{vaultForDbDomain}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vaultForDb.domain;
        },
    },
    {
        token: /{{vaultForDbPort}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vaultForDb.port;
        },
    },
    {
        token: /{{vaultForDbToken}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vaultForDb.token;
        },
    },
    {
        token: /{{vaultForDbUrl}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vaultForDb.url;
        },
    },
    {
        token: /{{vaultForDbUrlParams}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.vaultForDb.urlparams;
        },
    },
    {
        token: /{{WebCaptureClientId}}/g,
        replacement: function (config, selectedMachine, selectedPackages) {
            return config.other.webCaptureClientId;
        },
    },
];

export default {
  findUrl(config, selectedPackages, packageName, defaultValue) {
    for (let i = 0; i < selectedPackages.length; i++) {
      let val = selectedPackages[i];
      if (val.name === packageName) {
        if (val.tomcatNumber === 1) {
          return `${config.tomcat.instance1.server}:${config.tomcat.instance1.port}`;
        } else if (val.tomcatNumber === 2) {
          return `${config.tomcat.instance2.server}:${config.tomcat.instance2.port}`;
        } else if (val.tomcatNumber === 3) {
          return `${config.tomcat.instance3.server}:${config.tomcat.instance3.port}`;
        } else if (val.tomcatNumber === 4) {
          return `${config.tomcat.instance4.server}:${config.tomcat.instance4.port}`;
        } else if (val.tomcatNumber === 5) {
          return `${config.tomcat.instance5.server}:${config.tomcat.instance5.port}`;
        }
      }
    }
    return defaultValue;
  }
}
