"use strict";
Vue.config.devtools = true;
Vue.use(window.vuelidate.default);
Vue.use(window["v-calendar"],
    {
        componentPrefix: 'vc',
        locales: {
            'en-US': {
                firstDayOfWeek: 1,
                masks: {
                    L: 'DD/MM/YYYY',
                    data: "DD/MM/YYYY",
                    input: "DD/MM/YYYY"
                    // ...optional 'title', 'weekdays', 'navMonths', etc
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
    el: '#facilities-list',
    data: {
        companyId: null,
        accountId: null,
        statuses: ["Active", "Decommissioned"],
        employees: [],
        uploadFiles: [],
        items: [],
        error: null,
        page: 1,
        pages: [],
        loader: false,
        holdScreen: false,
        q: null,
        qStatuses: [],
        qEmployees: [],
        createFromDate: new Date(new Date().getFullYear(), 0, 1),
        createThruDate: new Date(),
        updateFromDate: null, //new Date(new Date().getFullYear(), 0, 1),
        updateThruDate: null, //new Date(),
        SortBy: "Created",
        SortAsc: false,
        checkAll: false,
        checked: {},
        deleteAllLoader: false,
        decommissionAllLoader: false,
        deleteAllError: null,
        listAllItems: [],
        listAllDecommissionedItems: [],
        decommisionAllLoader: false,
        decommisionAllError: null,
        downloadAllLoader: false,
        downloadAllError: null,
    },
    watch: {
        createFromDate: function (val) {
            var self = this;
            self.search();
        },
        createThruDate: function (val) {
            var self = this;
            self.search();
        },
        updateFromDate: function (val) {
            var self = this;
            self.search();
        },
        updateThruDate: function (val) {
            var self = this;
            self.search();
        }
    },
    methods: {
        debounceInput: _.debounce(function (e) {
            this.q = e.target.value;
            this.search();
        }, 1000),
        sort: function (column) {
            var self = this;
            self.SortBy = column;
            self.SortAsc = !self.SortAsc;
            self.search();
        },
        search: function () {
            var self = this;
            self.loader = true;
            var data = {
                admin: null,
                q: this.q,
                page: this.page,
                Statuses: this.qStatuses,
                Employees: this.qEmployees,
                CreateFromDate: this.createFromDate != null ? moment(this.createFromDate).format() : null,
                CreateThruDate: this.createThruDate != null ? moment(this.createThruDate).format() : null,
                UpdateFromDate: this.updateFromDate != null ? moment(this.updateFromDate).format() : null,
                UpdateThruDate: this.updateThruDate != null ? moment(this.updateThruDate).format() : null,
                SortBy: this.SortBy,
                SortAsc: this.SortAsc
            };
            axios.post('/facilities/search', data)
                .then(function (response) {
                    self.items = response.data.items;
                    self.page = response.data.page;
                    self.pages = response.data.pages;
                    self.loader = false;
                })
                .catch(function (error) {
                    console.log(error);
                    self.loader = false;
                });
        },
        setPage: function (page) {
            if (page === this.page) return;
            this.page = page;
            this.search();
        },
        loadEmployees() {
            var self = this;
            axios.get('/files/employees').then(function (response) {
                self.employees = response.data;
                var nullEmployee = { value: '00000000-0000-0000-0000-000000000000', name: "N/A" };//https://monosnap.com/file/4IccBgNp9ygsEUOEmcdW8QyI2ATa31 
                self.employees.push(nullEmployee);
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
        deleteApproval(item) {
            Vue.set(item, "delete", true);
        },
        decommissionApproval(item) {
            Vue.set(item, "decommission", true);
        },
        deleteApprovalAll() {
            var self = this;
            var deleteIds = [];
            for (var key in self.checked) {
                if (self.checked[key] === true) {
                    deleteIds.push(key);
                }
            }
            var deletedItems = [];
            for (var i = 0; i < self.items.length; i++) {
                if (deleteIds.indexOf(self.items[i].id) !== -1) {
                    deletedItems.push(self.items[i]);
                }
            }
            self.listAllItems = deletedItems;
            $("#delete-dialog-all").modal("show");

        },
        decommissionApprovalAll() {
            var self = this;
            var decommissionIds = [];
            for (var key in self.checked) {
                if (self.checked[key] === true) {
                    decommissionIds.push(key);
                }
            }
            var decommissionedItems = [];
            for (var i = 0; i < self.items.length; i++) {
                if (decommissionIds.indexOf(self.items[i].id) !== -1) {
                    decommissionedItems.push(self.items[i]);
                }
            }
            self.listAllDecommissionedItems = decommissionedItems;
            $("#decommission-dialog-all").modal("show");
        },
        downloadList() {
            var self = this;
            self.downloadAllLoader = true;
            var listIds = [];
            if (self.ifAnySelected()) {
                for (var key in self.checked) {
                    if (self.checked[key] === true) {
                        listIds.push(key);
                    }
                }
            } else {
                for (var i=0; i<self.items.length; i++) {
                    listIds.push(self.items[i].id);
                }
            }
            axios.post('/facilities/GenerateList/', listIds).then(function (response) {
                self.checked = {};
                self.checkAll = false;
                window.location.href = "/facilities/downloadList/" + response.data;
                setTimeout(function() {
                        self.removeTempList(response.data);
                }, 5000);
                self.downloadAllLoader = false;
            }).catch(function (error) {
                self.checked = {};
                self.checkAll = false;
                self.downloadAllLoader = false;
            });
        },
        removeTempList() {
            axios.post('/facilities/RemoveTempList/').then(function(response) {})
                .catch(function(error) {});
        },
        deleteItem: function (item) {
            var self = this;
            Vue.set(item, "deleteLoader", true);
            axios.post('/facilities/delete/' + item.id, {}).then(function (response) {
                var filesIndex = self.items.indexOf(item);
                if (filesIndex !== -1) {
                    self.items.splice(filesIndex, 1);
                }
                item.deleteLoader = false;
                item.delete = false;
                $("#delete-dialog").modal('hide');

            }).catch(function (error) {
                item.deleteLoader = false;
                item.delete = false;
                $("#delete-dialog").modal('hide');
            });
        },
        deleteDocument: function deleteDocument(file) {
            var self = this;
            Vue.set(file, "deleteLoader", true);
            axios.post('/files/delete/' + file.id, {}).then(function (response) {
                var filesIndex = self.items.indexOf(file);
                if (filesIndex !== -1) {
                    self.items.splice(filesIndex, 1);
                }
                var uploadedIndex = self.uploadFiles.indexOf(file);
                if (uploadedIndex !== -1) {
                    self.uploadFiles.splice(uploadedIndex, 1);
                }
                file.deleteLoader = false;
                file.delete = false;
                $("#delete-dialog").modal('hide');

            }).catch(function (error) {
                file.deleteLoader = false;
                file.delete = false;
                $("#delete-dialog").modal('hide');
            });
        },
        deleteAllDocuments: function deleteDocument() {
            var self = this;
            Vue.set(self, "deleteAllLoader", true);
            self.deleteAllError = null;
            var deleteIds = [];
            for (var key in self.checked) {
                if (self.checked[key] === true) {
                    deleteIds.push(key);
                }
            }
            axios.post('/facilities/deleteall/', deleteIds).then(function (response) {
                var deletedItems = [];
                for (var i = 0; i < self.items.length; i++) {
                    if (deleteIds.indexOf(self.items[i].id) !== -1) {
                        deletedItems.push(self.items[i]);
                    }
                }
                for (var j = 0; j < deletedItems.length; j++) {
                    var index = self.items.indexOf(deletedItems[j]);
                    if (index !== -1) {
                        self.items.splice(index, 1);
                    }
                }
                self.checked = {};
                self.checkAll = false;
                self.deleteAllLoader = false;
                $("#delete-dialog-all").modal('hide');

            }).catch(function (error) {
                self.deleteAllLoader = false;
                self.deleteAllError = error.responce.data;

            });
        },
        decommisionAllItems: function decommisionAllItems() {
            var self = this;
            Vue.set(self, "decommisionAllLoader", true);
            self.decommisionAllError = null;
            var decomissionIds = [];
            for (var key in self.checked) {
                if (self.checked[key] === true) {
                    decomissionIds.push(key);
                }
            }
            axios.post('/facilities/decommisionall/', decomissionIds).then(function (response) {
                for (var i = 0; i < self.items.length; i++) {
                    if (decomissionIds.indexOf(self.items[i].id) !== -1) {
                        //TODO: Setup employee null
                        self.items[i].employee = null;
                        self.items[i].employeeId = null;
                        self.items[i].status = "Decommissioned";
                    }
                }
                self.checked = {};
                self.checkAll = false;
                self.decommisionAllLoader = false;
                $("#decommission-dialog-all").modal('hide');

            }).catch(function (error) {
                self.decommisionAllLoader = false;
                self.decommisionAllError = error.responce.data;

            });
        },
        downloadAllDocuments: function downloadAllDocuments() {
            var self = this;
            Vue.set(self, "downloadAllLoader", true);
            self.downloadAllError = null;
            var downloadIds = [];
            for (var key in self.checked) {
                if (self.checked[key] === true) {
                    downloadIds.push(key);
                }
            }
            axios.post('/files/downloadall/', downloadIds).then(function (response) {
                self.checked = {};
                self.checkAll = false;
                self.downloadAllLoader = false;
                window.location.href = "/files/downloadallzip/" + response.data;
            }).catch(function (error) {
                self.downloadAllLoader = false;
                self.downloadAllError = error.responce.data;

            });
        },
        ifAnySelected: function ifAnySelected() {
            var self = this;
            var anySelected = false;
            for (var key in self.checked) {
                if (self.checked[key] === true) {
                    anySelected = true;
                    break;
                }
            }
            return anySelected;
        },
        checkUncheckAll: function checkUncheckAll(value) {
            var self = this;
            if (self.checkAll) {
                for (var i = 0; i < self.items.length; i++) {
                    self.checked[self.items[i].id] = true;
                }
            } else {
                self.checked = {};
            }
        },
        resetUploads: function resetUploads() {
            var self = this;
            self.uploadFiles = [{ id: null, progressBarPercent: 0, isLoading: false, employees: [], categories: [] }];
            self.refreshSelectBox();
        },
        addNewUpload() {
            var self = this;
            self.uploadFiles.push({ id: null, progressBarPercent: 0, isLoading: false, employees: [], categories: [] });
            self.refreshSelectBox();
        },
        init: function init() {
            var self = this;
            self.resetUploads();
            self.loadEmployees();
            self.loadCategories();
            self.search();
        },
        refreshSelectBox: function refreshSelectBox(parameters) {
            setTimeout(function () {
                $(".selectpicker").selectpicker('refresh');
            }, 50);
        },
    },
    mounted: function () {
        var self = this;
        self.companyId = window.companyId;
        self.accountId = window.accountId;
        self.admin = window.admin;
        self.init();
        setTimeout(function () {
            $(".datepicker").datepicker({
                format: "dd/mm/yyyy"
            });
        }, 100);
    }
});
