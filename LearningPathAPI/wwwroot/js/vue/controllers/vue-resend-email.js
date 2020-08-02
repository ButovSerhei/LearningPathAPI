"use strict";
var app = new Vue({
    el: '#resend-item',
    data: {
        resendSuccess: false,
        resendLoader: false,
        resendInterval: null
    },
    methods: {
        resend: function resend() {
            var self = this;
            self.error = null;
            self.resendLoader = true;
            var interval = 30;
            axios.post('/auth/resendEmail').then(function (response) {
                if (response.data) {
                    self.resendSuccess = response.data.success;
                    self.resendInterval = interval;
                    var x = setInterval(function() {
                        interval--;
                        if (interval === 0) {
                            clearInterval(x);
                            self.resendInterval = null;
                        } else {
                            self.resendInterval = interval;
                        }
                    }, 1000);
                }
                self.resendLoader = false;
            }).catch(function (error) {
                //self.error = error.response.data;
                self.resendLoader = false;
            });
        }
    }
});
