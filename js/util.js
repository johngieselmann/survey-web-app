/**
 * Assign some utilities to the window that can be accessed as needed. It
 * contains some common checks and actions I like to use without relying 
 * on plugins.
 *
 * @author JohnG <john.gieselmann@gmail.com>
 */
(function(window, document, undefined) {

    function jgUtil() {
        var self = this;

        // the navigator and user agent
        this.na = window.navigator;
        this.ua = self.na.userAgent;

        /**
         * Browser and device checks
         */
        this.isOpera = window.opera && opera.buildNumber
            ? true : false;

        this.isWebkit = /WebKit/.test(self.ua);

        this.isIE = !self.isWebKit && !self.isOpera 
            && (/MSIE/gi).test(self.ua) 
            && (/Explorer/gi).test(self.na.appName);

        this.isIE6 = self.isIE && /MSIE [56]/.test(self.ua);

        this.isIE7 = self.isIE && /MSIE [7]/.test(self.ua);

        this.isIE8 = self.isIE && /MSIE [8]/.test(self.ua);

        this.isIE9 = self.isIE && /MSIE [9]/.test(self.ua);

        this.isGecko = !self.isWebKit && /Gecko/.test(self.ua);

        this.isMac = self.ua.indexOf('Mac') != -1;

        this.isAir = /adobeair/i.test(self.ua);

        this.isIDevice = /(iPad|iPhone|iPod)/.test(self.ua);

        this.isIOS5 = self.isIDevice && self.ua.match(/AppleWebKit\/(\d*)/)[1]>=534

    }

    // assign the class to the window
    window.jgUtil = jgUtil;

    /**
     * No console log?? No problem.
     *
     * @author JohnG <john.gieselmann@gmail.com>
     */
    if (typeof window.console === undefined) {
        window.console = {
            log:   function(input) { alert("THIS BROWSER HAS NO CONSOLE"); },
            warn:  function() {},
            error: function() {}
        };
    }

})(window, document, undefined);
