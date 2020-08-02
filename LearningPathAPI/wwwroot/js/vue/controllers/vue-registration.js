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
    el: '#register-item',
    data: {
        firstName: null,
        lastName: null,
        email: null,
        company: null,
        password: null,
        confirmPassword: null,
        isAgree: false,
        isAgreeError: false,
        success: false,
        error: null,
        loader: false,
        partial: false
    },
    validations: {
        firstName: {
            required: required
        },
        lastName: {
            required: required
        },
        email: {
            required: required,
            email: email
        },
        company: {
            required: required
        },
        password: {
            minLength: minLength(6),
            required: required
        },
        confirmPassword: {
            required: required,
            sameAsPassword: sameAs('password')
        },
        isAgree: {
            requiredTrue: requiredTrue
        }
    },
    methods: {
        init: function init(model) {
            var self = this;
            self.email = model.Email;
            self.firstName = model.FirstName;
            self.lastName = model.LastName;
        },
        registration: function registration() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            var self = this;
            self.error = null;
            self.loader = true;
            var data = {
                FirstName: this.firstName,
                LastName: this.lastName,
                Email: this.email,
                CompanyName: this.company,
                Password: this.password
            };
            axios.post('/auth/registration', data).then(function (response) {
                if (response.data) {
                    window.location.href = response.data.redirectUrl;
                    self.success = response.data.success;

                }
            }).catch(function (error) {
                self.error = error.response.data;
                self.loader = false;
            });
        }
    },
    mounted: function mounted() {
        if (window.model != null) {
            this.partial = true;
            this.init(window.model);
        }
    }
});

