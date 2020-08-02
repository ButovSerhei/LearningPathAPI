"use strict";
Vue.use(window.vuelidate.default);
var _window$validators = window.validators,
    required = _window$validators.required,
    helpers = _window$validators.helpers,
    email = _window$validators.email,
    requiredTrue = _window$validators.requiredTrue,
    sameAs = _window$validators.sameAs,
    requiredTrue = (bool) => bool === true,
    minLength = _window$validators.minLength;
var app = new Vue({
    el: '#fogot-item',
    data: {
        email: null,
        password: null,
        rememberMe: false,
        success: false,
        error: null,
        loader: false
    },
    validations: {
        email: {
            required: required,
            email: email
        }
    },
    methods: {
        login: function login() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            var self = this;
            self.error = null;
            self.loader = true;
            var data = {
                Email: this.email,
                Password: this.password,
                RememberMe: this.rememberMe
            };
            axios.post('/auth/fogot', data).then(function (response) {
                if (response.data) {
                    self.success = response.data.success;
                }
                self.loader = false;
            }).catch(function (error) {
                self.error = error.response.data;
                self.loader = false;
            });
        }
    }
});
