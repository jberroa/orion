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
