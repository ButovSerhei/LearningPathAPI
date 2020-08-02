Vue.use(window.vuelidate.default);
Vue.use(window.SlVueTree);
Vue.use(window["v-calendar"],
    {
        componentPrefix: 'vc',
        locales: {
            'en-US': {
                firstDayOfWeek: 1,
                masks: {
                    L: 'DD/MM/YYYY',
                    data: "DD/MM/YYYY"
                    // ...optional `title`, `weekdays`, `navMonths`, etc
                }
            }
        }
    });
var _window$validators = window.validators,
    required = _window$validators.required,
    helpers = _window$validators.helpers,
    email = _window$validators.email,
    requiredTrue = _window$validators.requiredTrue,
    sameAs = _window$validators.sameAs,
    requiredTrue = (bool) => bool === true,
    minLength = _window$validators.minLength;
var app = new Vue({
    el: "#account-settings",
    components: { SlVueTree },
    data: {
        init: true,
        loader: false,
        success: false,
        error: null,
        id: null,
        avatar: "/css/images/avatar-default.jpg",
        avatarLoader: false,
        avatarProgressBarPercent: 0,
        account: {
            email: null,
            firstName: null,
            lastName: null,
        },
        cityAndCountry: null,
        address: null,
        universityAndGrades: null,
        gender: "Male",
        datepickerAttrs: {
            key: 'today',
            highlight: true,
            dates: new Date(),
        },
        maxDate: moment().add(-16, 'y').toDate(),
        dob: null,
        dobString: null,
        //==========================================
        linkedin: null,
        facebook: null,
        twitter: null,
        website: null,
        skype: null,
        slack: null,
        viber: null,
        telegram: null,
        github: null,
        stackOverflow: null,
        phone: null,
        mobile: null,
        //===========================================
        position: null,
        experience: null,
        dateStart: null,
        dateStartString: null,
        updated: null,
        updatedString: null,
        agreementNumber: null,
        //=============================================
        passwordChange: {
            oldPassword: null,
            password: null,
            confirmPassword: null,
        }
    },
    validations: {
        account: {
            email: {
                required: required,
                email: email
            },
            firstName: {
                required: required
            },
            lastName: {
                required: required
            }
        },
        passwordChange: {
            oldPassword: {
                minLength: minLength(6),
                required: required
            },
            password: {
                minLength: minLength(6),
                required: required
            },
            confirmPassword: {
                required: required,
                sameAsPassword: sameAs('password')
            }
        }
    },
    methods: {
        initModel: function initModel(model) {
            var self = this;
            self.id = model.Id;
            if (model.Avatar != null) {
                self.avatar = model.Avatar;
            }
            self.account.email = model.Email;
            self.account.firstName = model.FirstName;
            self.account.lastName = model.LastName;
            self.cityAndCountry = model.CityAndCountry;
            self.address = model.Address;
            self.universityAndGrades = model.UniversityAndGrades;
            self.gender = model.Gender;
            self.dobString = model.DoBString;
            if (model.DoB != null) {
                self.dob = moment(model.DoB).toDate();
            }
            self.updatedString = model.UpdatedString;
            if (model.Updated != null) {
                self.updated = moment(model.Updated).toDate();
            }
            self.linkedin = model.Linkedin;
            self.facebook = model.Facebook;
            self.twitter = model.Twitter;
            self.website = model.Website;
            self.skype = model.Skype;
            self.slack = model.Slack;
            self.viber = model.Viber;
            self.telegram = model.Telegram;
            self.github = model.Github;
            self.stackOverflow = model.StackOverflow;
            self.phone = model.Phone;
            self.mobile = model.Mobile;
            self.position = model.Position;
            self.experience = model.Experience;
            self.dateStartString = model.DateStartString;
            if (model.DateStart != null) {
                self.dateStart = moment(model.DateStart).toDate();
            }
            self.agreementNumber = model.AgreementNumber;
            self.refreshSelectBox();
        },
        fillModel: function fillModel() {
            var self = this;
            var item = {
                Id: self.id,
                Avatar: self.avatar,
                Email: self.account.email,
                FirstName: self.account.firstName,
                LastName: self.account.lastName,
                CityAndCountry: self.cityAndCountry,
                Address: self.address,
                UniversityAndGrades: self.universityAndGrades,
                Gender: self.gender,
                DoB: self.dob != null && self.dob !== '' ? moment(self.dob).format() : null,
                //=================================
                Linkedin: self.linkedin,
                Facebook: self.facebook,
                Twitter: self.twitter,
                Website: self.website,
                Skype: self.skype,
                Slack: self.slack,
                Viber: self.viber,
                Telegram: self.telegram,
                Github: self.github,
                StackOverflow: self.stackOverflow,
                Phone: self.phone,
                Mobile: self.mobile,
                //==================================
                Position: self.position,
                Experience: self.experience,
                DateStart: self.dateStart != null && self.dateStart !== '' ? moment(self.dateStart).format() : null,
                AgreementNumber: self.agreementNumber
                //==================================
            }
            return item;
        },
        save: function save() {
            this.$v.account.$touch();
            if (this.$v.account.$invalid) {
                return;
            }
            var self = this;
            self.error = null;
            self.loader = true;
            var data = self.fillModel();
            axios.post('/account/save', data).then(function (response) {
                if (response.data) {
                    self.success = response.data.success;
                    self.loader = false;
                    if (response.data.redirectUrl != null) {
                        window.location.href = response.data.redirectUrl; //need to relogin for current account
                    }
                    setTimeout(function () { self.success = false; }, 2000);
                }
            }).catch(function (error) {
                self.error = error.response.data;
                self.loader = false;
            });
        },
        changePwd: function changePwd() {
            this.$v.passwordChange.$touch();
            if (this.$v.passwordChange.$invalid) {
                return;
            }
            var self = this;
            self.error = null;
            self.loader = true;
            var data = { oldPassword: self.passwordChange.oldPassword, password: self.passwordChange.password };
            axios.post('/auth/changePassword', data).then(function (response) {
                if (response.data) {
                    self.success = response.data.success;
                    self.loader = false;
                    setTimeout(function () { self.success = false; }, 2000);
                }
            }).catch(function (error) {
                self.error = error.response.data;
                self.loader = false;
            });
        },
        uploadAvatar(target) {
            var self = this;
            var fileList = target.files;
            if (fileList.length === 0) {
                return;
            }
            var files = new FormData();
            files.append("file", fileList[0], fileList[0].name);
            self.avatarProgressBarPercent = 0;
            axios.post(`/files/uploadAvatar/`,
                files,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: function (progressEvent) {
                        self.avatarProgressBarPercent =
                            parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                    }.bind(this)
                }
            ).then(function (response) {
                self.avatar = response.data;
                self.avatarLoader = false;
            }).catch(function (error) {
                Vue.set(self, "avatarProgressBarPercent", 0);
                Vue.set(self, "avatarLoader", false);
                $(target).val('');
            });
        },
        refreshSelectBox: function refreshSelectBox(parameters) {
            setTimeout(function () {
                $(".selectpicker").selectpicker('refresh');
            }, 50);
        },
    },
    mounted: function () {
        var self = this;
        if (window.model != null) {
            this.initModel(window.model);
        }
        $(function () {
            $('[data-toggle="popover"]').popover();
        });
        self.refreshSelectBox();
    }
})