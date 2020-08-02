Vue.use(window.vuelidate.default);
Vue.use(window.SlVueTree);
Vue.use(window.VueTheMask);
Vue.use(window["vue-tel-input"]);
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
    requiredIf = _window$validators.requiredIf,
    requiredUnless = _window$validators.requiredUnless,
    helpers = _window$validators.helpers,
    email = _window$validators.email,
    requiredTrue = _window$validators.requiredTrue,
    sameAs = _window$validators.sameAs,
    requiredTrue = (bool) => bool === true,
    minLength = _window$validators.minLength,
    numeric = _window$validators.numeric,
    alphaNum = _window$validators.alphaNum,
    url = _window$validators.url;


var app = new Vue({
    el: "#staff-item",
    components: { SlVueTree },
    data: {
        init: true,
        loader: false,
        error: null,
        success: false,
        id: null,
        avatar: "/css/images/avatar-default.jpg",
        avatarLoader: false,
        avatarProgressBarPercent: 0,
        email: null,
        firstName: null,
        lastName: null,
        cityAndCountry: null,
        address: null,
        universityAndGrades: null,
        dateOfGraduation: null,
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
        archive: null,
        archiveReason: null,
        hireAgain: null,
        dateFinish: null,
        dateFinishString: null,
        archiveLoader: false,
        //==========================================
        contractTypes: ["Monthly salary", "Hourly rate", "Project work"],
        contractType: null,
        salaryAmount: 0,
        currencyTypes: ["EUR", "GBP", "UAH", "USD"],
        workloadTypes: ["Fulltime", "Part-time", "Project based"],
        workload: null,
        currency: null,
        vacations: null,
        daysOff: null,
        sickLeaves: null,
        holidays: null,
        weekends: null,
        overtimes: null,
        filesLoader: false,
        files: [],
        selectedNote: null,
        deletedFile: null,
        uploadFiles: [],
        categories: [],
        employees: [],
        types: [],
        checkLists: {},
        stepName: null,
        stepResponsible: null,
        checklistStepLoader: null,
        checklistStepError: null,
        checklistLoader: null,
        isCheckListEditable: false,
        showChecklists: false,
        sendInvite: true,
        empChecklists: [],
        //==========================================
        paymentsMethod: ["MoneyGram", "Payoneer", "PayPal", "SWIFT payment", "TransferWise", "Western Union", "Other"],
        paymentMethod: null,
        moneyGram: {
            id: null,
            employeeId: null,
            title: null,
            address: null,
            email: null,
            phone: null
        },
        payoneer: {
            id: null,
            employeeId: null,
            title: null,
            email: null,
            phone: null
        },
        payPal: {
            id: null,
            employeeId: null,
            title: null,
            email: null,
            phone: null
        },
        swift: {
            id: null,
            employeeId: null,
            title: null,
            address: null,
            email: null,
            phone: null,
            beneficiaryBankCardOrAccountNumber: null,
            beneficiaryBankIBAN: null,
            beneficiaryBankNameOrAddress: null,
            correspondentBankCardOrAccountNumber: null,
            correspondentBankIBAN: null,
            correspondentBankNameOrAddress: null,
            correspondentBank2CardOrAccountNumber: null,
            correspondentBank2IBAN: null,
            correspondentBank2NameOrAddress: null
        },
        transferWise: {
            id: null,
            employeeId: null,
            title: null,
            address: null,
            email: null,
            phone: null,
            card: null
        },
        westernUnion: {
            id: null,
            employeeId: null,
            title: null,
            address: null,
            email: null,
            phone: null,
            cardOrAccount: null
        },
        otherPaymentMethod: {
            id: null,
            employeeId: null,
            title: null,
            requisites: null
        },
        moneyGramMethods: [],
        moneyGramMethodsBackup: [],
        payoneerMethods: [],
        payoneerMethodsBackup: [],
        payPalMethods: [],
        payPalMethodsBackup: [],
        swiftMethods: [],
        swiftMethodsBackup: [],
        transferWiseMethods: [],
        transferWiseMethodsBackup: [],
        westernUnionMethods: [],
        westernUnionMethodsBackup: [],
        otherPaymentMethods: [],
        otherPaymentMethodsBackup: [],
        paymentMethodLoader: false,
        paymentMethodError: false
    },

    computed: {
        isOptional() {
            return false; // some conditional logic here...
        }
    },

    validations: {
        email: {
            required: required,
            email: email
        },
        firstName: {
            required: required
        },
        lastName: {
            required: required
        },
        linkedin: {
            url: url
        },
        github: {
            url: url
        },
        facebook: {
            url: url
        },
        stackOverflow: {
            url: url
        },
        twitter: {
            url: url
        },
        website: {
            url: url
        },
        slack: {
            alphaNum: alphaNum
        },
        viber: {
            numeric: numeric
        },
        phone: {
            numeric: numeric
        },
        mobile: {
            numeric: numeric
        },
        moneyGram: {
            title: {
                required: requiredIf(function() {
                    return this.paymentMethod === 'MoneyGram';
                })
            },
            address: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'MoneyGram';
                })
            },
            email: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'MoneyGram';
                }),
                email: email
            },
            phone: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'MoneyGram';
                })
            }
        },
        payoneer: {
            title: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Payoneer';
                })
            }, email: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Payoneer';
                }),
                email: email
            }, phone: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Payoneer';
                })
            }
        },
        payPal: {
            title: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'PayPal';
                })
            }, email: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'PayPal';
                }),
                email: email
            }, phone: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'PayPal';
                })
            }
        },
        swift: {
            title: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                })
            },
            address: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                })
            },
            email: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                }),
                email: email
            },
            phone: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                })
            },
            beneficiaryBankCardOrAccountNumber: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                })
            },
            beneficiaryBankIBAN: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                })
            },
            beneficiaryBankNameOrAddress: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                }) },
            correspondentBankCardOrAccountNumber: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                }) },
            correspondentBankIBAN: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                }) },
            correspondentBankNameOrAddress: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'SWIFT payment';
                }) }
        },

        transferWise: {
            title: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'TransferWise';
                })
            },
            email: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'TransferWise';
                }),
                email: email
            },
            phone: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'TransferWise';
                })
            },
            address: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'TransferWise';
                })
            },
            card: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'TransferWise';
                })
            }
        },
        westernUnion: {
            title: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Western Union';
                })
            },
            email: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Western Union';
                }),
                email: email
            },
            phone: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Western Union';
                })
            },
            address: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Western Union';
                })
            },
            cardOrAccount: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Western Union';
                })
            }
        },
        otherPaymentMethod: {
            title: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Other';
                })
            },
            requisites: {
                required: requiredIf(function () {
                    return this.paymentMethod === 'Other';
                })
            }
        }
    },
    methods: {
        getComponentData() {
            var self = this;
            return {
                on: {
                    end: function (env) {

                        //Reordering according sequence
                        //self.refreshOrder();
                        //var setBlockToId = $(env.to).attr("data-id");
                        //var setBlockFromId = $(env.from).attr("data-id");

                        //self.updateStudySetBlockUnits(setBlockToId);
                        //self.updateStudySetBlockUnits(setBlockFromId);
                    }
                }
            }
        },
        createChecklistStep: function createChecklist(list) {
            var self = this;
            self.checklistStepLoader = true;
            self.checklistStepError = null;
            var data = {
                Name: self.stepName,
                ResponsibleEmployeeId: self.stepResponsible,
                EmployeeId: self.id,
                ChecklistId: list.id
            };
            axios.post('/staff/createChecklistStep', data).then(function (response) {
                if (response.data) {
                    self.checklistStepLoader = false;
                    list.steps.push(response.data);
                    Vue.set(list, "revert", JSON.parse(JSON.stringify(list.steps)));
                    self.stepName = null;
                    self.stepResponsible = null;
                    self.refreshSelectBox();

                }
            }).catch(function (error) {
                self.checklistStepError = error.response.data;
                self.checklistStepLoader = false;

            });
        },
        deleteChecklistStep: function deleteChecklistStep(list, step) {
            var self = this;
            Vue.set(step, "checklistStepLoader", true);
            step.checklistStepError = null;
            var data = {
                Id: step.id,
                Name: step.name,
                ResponsibleEmployeeId: step.responsibleEmployeeId,
                ChecklistId: step.checklistId
            };
            axios.post('/staff/deleteChecklistStep', data).then(function (response) {
                if (response.data.success) {
                    Vue.set(step, "checklistStepLoader", false);
                    var stepIndex = list.steps.indexOf(step);
                    list.steps.splice(stepIndex, 1);
                    Vue.set(list, "revert", JSON.parse(JSON.stringify(list.steps)));
                    //Vue.set(list, "steps", );
                    $("#delete-dialog").modal('hide');
                }
            }).catch(function (error) {
                step.checklistStepError = error.response.data;
                Vue.set(step, "checklistStepLoader", false);
            });
        },
        updateChecklistStep: function updateChecklistStep(step) {
            var self = this;
            Vue.set(step, "checklistStepLoader", true);
            step.checklistStepError = null;
            var data = {
                Id: step.id,
                Name: step.name,
                ResponsibleEmployeeId: step.responsibleEmployeeId,
                ChecklistId: step.checklistId,
                FinishDate: step.finishDate,
                Done: step.done
            };
            axios.post('/staff/updateChecklistStep', data).then(function (response) {
                if (response.data) {
                    Vue.set(step, "checklistStepLoader", false);
                    step.edit = false;
                    self.refreshSelectBox();
                }
            }).catch(function (error) {
                step.checklistStepError = error.response.data;
                Vue.set(step, "checklistStepLoader", false);
            });
        },
        updateChecklistSteps: function updateChecklistSteps(list) {
            var self = this;
            Vue.set(list, "checklistStepLoader", true);
            list.checklistStepError = null;

            axios.post('/staff/UpdateChecklistSteps', list.steps).then(function (response) {
                if (response.data.success) {
                    Vue.set(list, "checklistStepLoader", false);
                    Vue.set(list, "revert", null);
                    Vue.set(list, "edit", false);
                    for (var i = 0; i < list.steps.length; i++) {
                        if (list.steps[i].responsibleEmployeeId != null) {
                            for (var j = 0; j < self.employees.length; j++) {
                                if (self.employees[j].value == list.steps[i].responsibleEmployeeId) {
                                    list.steps[i].responsibleEmployee = { fullName: self.employees[j].name };
                                }
                            }
                        } else {
                            list.steps[i].responsibleEmployee = null;
                        }
                    }
}
            }).catch(function (error) {
                list.checklistStepError = error.response.data;
                Vue.set(list, "checklistStepLoader", false);
            });
        },
        editStep: function editStep(step) {
            var self = this;
            //Vue.set(step, "edit", true);
            Vue.set(step, "revertName", step.name);
            Vue.set(step, "revertResponsible", step.responsibleEmployeeId);
            self.refreshSelectBox();
        },
        deleteStep: function deleteStep(step) {
            var self = this;
            Vue.set(step, "delete", true);
            $("#delete-dialog").modal('show');
        },
        revertStep: function revertStep(step) {
            var self = this;
            Vue.set(step, "edit", false);
            Vue.set(step, "name", step.revertName);
            Vue.set(step, "responsibleEmployeeId", step.revertResponsible);
            Vue.set(step, "revertName", null);
            Vue.set(step, "revertResponsible", null);
        },
        finishStep: function finishStep(step) {
            var self = this;
            Vue.set(step, "finishDate", step.done ? new Date() : null);
            Vue.set(step, "finishDateString", step.done ? moment(step.finishDate).format("DD/MM/YYYY") : null);
            self.updateChecklistStep(step);
            self.refreshSelectBox();
        },
        loadChecklists: function loadChecklists() {
            var self = this;
            axios.get('/company/checklists').then(function (response) {
                self.types = response.data.types;
                for (var i = 0; i < self.types.length; i++) {
                    if (!(self.types[i].type in self.checkLists)) {
                        self.checkLists[self.types[i].type] = null;
                    }
                }
                self.refreshSelectBox();
            }).catch(function (error) {
                self.error = error.response.data;
            });
        },
        loadEmpChecklists: function loadEmpChecklists() {
            var self = this;
            axios.get('/staff/checklists/'+self.id).then(function (response) {
                self.empChecklists = response.data;
                self.refreshSelectBox();
            }).catch(function (error) {
                self.error = error.response.data;
            });
        },
        configureChecklist: function configureChecklist(list) {
            var self = this;
            Vue.set(list, "edit", true);
            Vue.set(list, "revert", JSON.parse(JSON.stringify(list.steps)));
            self.refreshSelectBox();
        },
        revertChecklist: function configureChecklist(list) {
            var self = this;
            Vue.set(list, "edit", false);
            Vue.set(list, "steps", JSON.parse(JSON.stringify(list.revert)));
            Vue.set(list, "revert", null);
            self.refreshSelectBox();
        },
        create: function create() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            var self = this;
            self.error = null;
            self.loader = true;
            var data = self.fillModel();
            axios.post('/staff/create', data).then(function (response) {
                if (response.data) {
                    self.success = response.data.success;
                    setTimeout(function () { window.location.href = response.data.redirectUrl }, 1000);
                }
            }).catch(function (error) {
                self.error = error.response.data;
                self.loader = false;
            });
        },
        update: function update() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            var self = this;
            self.error = null;
            self.loader = true;
            var data = self.fillModel();
            axios.post('/staff/update', data).then(function (response) {
                if (response.data) {
                    self.success = response.data.success;

                    setTimeout(function () { window.location.href = response.data.redirectUrl }, 1000);
                }
            }).catch(function (error) {
                self.error = error.response.data;
                self.loader = false;
            });
        },
        initModel: function initModel(model) {
            var self = this;
            self.id = model.Id;
            if (model.Avatar != null) {
                self.avatar = model.Avatar;
            }
            self.email = model.Email;
            self.firstName = model.FirstName;
            self.lastName = model.LastName;
            self.cityAndCountry = model.CityAndCountry;
            self.address = model.Address;
            self.universityAndGrades = model.UniversityAndGrades;
            if (model.DateOfGraduation != null) {
                self.dateOfGraduation = moment(model.DateOfGraduation).toDate();
            }
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
            self.archive = model.Archive;
            self.archiveReason = model.ArchiveReason;
            self.hireAgain = model.HireAgain;
            if (model.DateFinish != null) {
                self.dateFinish = moment(model.DateFinish).toDate();
            }
            self.dateFinishString = model.DateFinishString;
            self.workload = model.Workload;
            self.contractType = model.ContractType;
            self.salaryAmount = model.SalaryAmount;
            self.currency = model.Currency;
            self.vacations = model.Vacations;
            self.daysOff = model.DaysOff;
            self.sickLeaves = model.SickLeaves;
            self.holidays = model.Holidays;
            self.weekends = model.Weekends;
            self.overtimes = model.Overtimes;
            if (model.CheckLists != null && model.CheckLists.length > 0) {
                for (var i = 0; i < model.CheckLists.length; i++) {
                    self.checkLists[model.CheckLists[i].Type] = model.CheckLists[i].Id;
                }
            }
            self.loadPaymentMethods();
            self.loadChecklists();
            self.loadFiles();
            self.loadEmployees();
            self.loadCategories();
            self.loadEmpChecklists();
            self.refreshSelectBox();
        },
        fillModel: function fillModel() {
            var self = this;
            var item = {
                Id: self.id,
                Avatar: self.avatar,
                Email: self.email,
                FirstName: self.firstName,
                LastName: self.lastName,
                CityAndCountry: self.cityAndCountry,
                Address: self.address,
                UniversityAndGrades: self.universityAndGrades,
                DateOfGraduation: self.dateOfGraduation,
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
                AgreementNumber: self.agreementNumber,
                //==================================
                Workload: self.workload,
                ContractType: self.contractType,
                SalaryAmount: self.salaryAmount,
                Currency: self.currency,
                Vacations: self.vacations,
                DaysOff: self.daysOff,
                SickLeaves: self.sickLeaves,
                Holidays: self.holidays,
                Weekends: self.weekends,
                Overtimes: self.overtimes,
                CheckLists: [],
                //=====================================
                SendInvite: self.sendInvite,
                //================= Payment ================
                PaymentMethods: {
                    PaymentMoneyGramModels: self.moneyGramMethods,
                    PaymentPayoneerModels: self.payoneerMethods,
                    PaymentPaypalModels: self.payPalMethods,
                    PaymentSwiftModels: self.swiftMethods,
                    PaymentTransferWiseModels: self.transferWiseMethods,
                    PaymentWesternUnionModels: self.westernUnionMethods,
                    PaymentCustomMethods: self.otherPaymentMethods
                }
            }
            for (var key in self.checkLists) {
                if(self.checkLists[key]==null) continue;
                item.CheckLists.push({ Id: self.checkLists[key], companyId:"00000000-0000-0000-0000-000000000000" });
            }
            return item;
        },
        loadFiles: function loadFiles() {
            var self = this;
            self.filesLoader = true;
            axios.post('/files/employeeFiles/' + self.id, {}).then(function (response) {
                if (response.data) {
                    self.files = response.data;
                    self.filesLoader = false;
                }
            }).catch(function (error) {
                self.error = error.response.data;
                self.filesLoader = false;
            });
        },
        folderSelected: function folderSeleted(node) {
            var self = this;
            var nodeItem = node[0];
            if (nodeItem.isLeaf) return;
            Vue.set(self, 'selectedNote', node[0]);
        },
        approveDelete: function approveDelete(node) {
            var self = this;
            self.deletedFile = node;
            setTimeout(function () {
                $("#delete-file-dialog").modal("show");
            },
                100);
        },
        deleteFileLink: function deleteFileLink(node) {
            var self = this;
            Vue.set(self.deletedFile, 'deleteLoader', true);
            axios.post('/staff/unlinkFile/' + self.id + '&linkId=' + node.data.linkId, { Id: self.id, linkId: node.data.linkId }).then(function (response) {
                if (response.data) {
                    Vue.set(self.deletedFile, 'deleteLoader', false);
                    self.$refs.slVueTree.remove([node.path]);
                    $("#delete-file-dialog").modal("hide");
                }
            }).catch(function (error) {
                self.error = error.response.data;
                Vue.set(self.deletedFile, 'deleteLoader', false);
            });
        },
        resetUploads: function resetUploads() {
            var self = this;
            if (self.selectedNote == null) {
                self.uploadFiles = [
                    { id: null, progressBarPercent: 0, isLoading: false, employees: [self.id], categories: [] }
                ];
            } else {
                self.uploadFiles = [{ id: null, progressBarPercent: 0, isLoading: false, employees: [self.id], categories: [self.selectedNote.data.categoryId] }];
            }
            self.refreshSelectBox();
        },
        addNewUpload() {
            var self = this;
            if (self.selectedNote == null) {
                self.uploadFiles.push({
                    id: null,
                    progressBarPercent: 0,
                    isLoading: false,
                    employees: [self.id],
                    categories: []
                });
            } else {
                self.uploadFiles.push({ id: null, progressBarPercent: 0, isLoading: false, employees: [self.id], categories: [self.selectedNote.data.categoryId] });
            }
            self.refreshSelectBox();
        },
        uploadDocument(target, item) {
            var self = this;
            item.error = null;
            var fileList = target.files;
            if (fileList.length === 0) {
                return;
            }
            var fileOversized = fileList[0].size > 29360128;
            if (!fileOversized) {
                var files = new FormData();
                files.append("file", fileList[0], fileList[0].name);
                files.append("categories", item.categories);
                files.append("employees", item.employees);
                item.progressBarPercent = 0;
                axios.post(`/files/upload/`,
                    files,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: function (progressEvent) {
                            item.progressBarPercent =
                                parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                        }.bind(this)
                    }
                ).then(function (response) {
                    item.id = response.data.id;
                    item.name = response.data.name;
                    self.loadFiles();
                    self.refreshSelectBox();
                }).catch(function (error) {
                    Vue.set(item, "error", error.response.data);
                    Vue.set(item, "progressBarPercent", 0);
                    Vue.set(item, "isLoading", false);
                    $(target).val('');
                });
            } else {
                Vue.set(item, "error", "File size is exceeded (Max size: 20 Mb)");
            }
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

        copyText: function copyText(text) {
            if (!navigator.clipboard) {
                fallbackCopyTextToClipboard(text);
                return;
            }
            navigator.clipboard.writeText(text).then(function () {
                console.log('Async: Copying to clipboard was successful!');
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });
        },

        fallbackCopyTextToClipboard: function fallbackCopyTextToClipboard(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;

            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        },

        loadEmployees() {
            var self = this;
            axios.get('/files/employees').then(function (response) {
                self.employees = response.data;
                self.refreshSelectBox();
            }).catch(function (error) {
                self.error = error.response.data;
            });
        },
        loadCategories() {
            var self = this;
            axios.get('/files/categories').then(function (response) {
                self.categories = response.data;
                self.refreshSelectBox();
            }).catch(function (error) {
                self.error = error.response.data;
            });
        },


        //======================== Payment Section ============================

        loadPaymentMethods() {
            var self = this;
            axios.get('/staff/paymentMethods?employeeId=' + self.id).then(function (response) {
                    if (response.data !== null) {
                        self.moneyGramMethods = response.data.paymentMoneyGramModels;
                        self.payoneerMethods = response.data.paymentPayoneerModels;
                        self.payPalMethods = response.data.paymentPaypalModels;
                        self.swiftMethods = response.data.paymentSwiftModels;
                        self.transferWiseMethods = response.data.paymentTransferWiseModels;
                        self.westernUnionMethods = response.data.paymentWesternUnionModels;
                        self.otherPaymentMethods = response.data.paymentCustomMethods;
                    }
                }).catch
                (function (error) {
                    self.error = error;
                });
        },


        addNewPaymentMethod(paymentMethod, methodType) {
            this.$v.$touch();

            var self = this;
            paymentMethod.employeeId = self.id;
            switch (methodType) {
                case "MoneyGram":
                    if (this.$v.moneyGram.$invalid) {
                        return;
                    }
                    self.moneyGramMethods.push(self.jsonCopy(paymentMethod));
                    break;
                case "Payoneer":
                    if (this.$v.payoneer.$invalid) {
                        return;
                    }
                    self.payoneerMethods.push(self.jsonCopy(paymentMethod));
                    break;
                case "PayPal":
                    if (this.$v.payPal.$invalid) {
                        return;
                    }
                    self.payPalMethods.push(self.jsonCopy(paymentMethod));
                    break;
                case "SWIFT payment":
                    if (this.$v.swift.$invalid) {
                        return;
                    }
                    self.swiftMethods.push(self.jsonCopy(paymentMethod));
                    break;
                case "TransferWise":
                    if (this.$v.transferWise.$invalid) {
                        return;
                    }
                    self.transferWiseMethods.push(self.jsonCopy(paymentMethod));
                    break;
                case "Western Union":
                    if (this.$v.westernUnion.$invalid) {
                        return;
                    }
                    self.westernUnionMethods.push(self.jsonCopy(paymentMethod));
                    break;
                case "Other":
                    if (this.$v.otherPaymentMethod.$invalid) {
                        return;
                    }
                    self.otherPaymentMethods.push(self.jsonCopy(paymentMethod));
                    default:
                        return;
            }
        },

        //=========================== End payment section ===================================




        archiveEmp: function archiveEmp() {
            var self = this;
            Vue.set(self, "archiveLoader", true);
            var data = {
                Id: self.id,
                Archive: !self.archive,
                ArchiveReason: self.archiveReason,
                DateFinish: self.dateFinish != null ? moment(self.dateFinish).format() : self.dateFinish,
                HireAgain: self.hireAgain
            }
            axios.post(`/staff/archiveRestore/`, data).then(function (response) {
                self.archiveLoader = false;
                self.archive = !self.archive;
                $("#archive-dialog").modal('hide');
            }).catch(function (error) {
                self.archiveLoader = false;
                $("#archive-dialog").modal('hide');
            });
        },

        jsonCopy (src) {
            return JSON.parse(JSON.stringify(src));
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