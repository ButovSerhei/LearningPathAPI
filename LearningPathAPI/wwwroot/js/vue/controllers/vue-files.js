"use strict";
Vue.use(window.vuelidate.default);
Vue.use(window["v-calendar"],
    {
         componentPrefix: 'vc',
         locales: {
             'en-US': {
                 firstDayOfWeek: 1,
                 masks: {
                     L: 'DD/MM/YYYY',
                     data:"DD/MM/YYYY",
                     input:"DD/MM/YYYY"
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
    el: '#files-item',
    data: {
        employeeId: null,
        employeeRole:null,
        categories: [],
        employees: [],
        uploadFiles: [],
        items: [],
        error: null,
        page: 1,
        pages: [],
        loader: false,
        holdScreen: false,
        q: null,
        qCategories:[],
        qEmployees:[],
        qFromDate:null,
        qThruDate:null,
        SortBy:"Created",
        SortAsc:false,
        checkAll:false,
        checked: {},
        deleteAllLoader:false,
        deleteAllError:null,
        deleteAllItems:[],
        downloadAllLoader:false,
        downloadAllError:null,
        datepickerAttrs: {
            key: 'today',
            highlight: true,
            dates: new Date(),
        }
    },
    watch: {
        qFromDate: function (val) {
            var self = this;
            self.search();
        },
        qThruDate: function (val) {
            var self = this;
            self.search();
        }
    },
    methods: {
        debounceInput: _.debounce(function (e) {
            this.q = e.target.value;
            this.search();
        }, 1000),
        sort: function(column) {
            var self = this;
            self.SortBy = column;
            self.SortAsc = !self.SortAsc;
            self.search();
        },
        search: function () {
            var self = this;
            self.loader = true;
            var data = {
                q: this.q,
                page: this.page,
                Categories: this.qCategories,
                Employees: this.qEmployees,
                FromDate: self.qFromDate != null ? moment(self.qFromDate).format() : null,
                ThruDate: self.qThruDate != null ? moment(self.qThruDate).format() : null,
                SortBy:this.SortBy,
                SortAsc:this.SortAsc
            };
            axios.post('/files/search', data)
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
                    self.items.push(response.data);
                    //Vue.set(item, "progressBarPercent", 0);
                    //Vue.set(item, "isLoading", false);
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
        deleteApproval(item) {
            Vue.set(item, "delete", true);
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
                    deletedItems.push(self.items[i].name);
                }
            }
            self.deleteAllItems = deletedItems;
            $("#delete-dialog-all").modal("show");

        },
        deleteDocument: function deleteDocument(file) {
            var self = this;
            Vue.set(file, "deleteLoader", true);
            axios.post(`/files/delete/` + file.id, {}).then(function (response) {
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
            axios.post(`/files/deleteall/`, deleteIds).then(function (response) {
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
            axios.post(`/files/downloadall/`, downloadIds).then(function (response) {
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
            self.uploadFiles=[{ id: null, progressBarPercent: 0, isLoading: false, employees: [], categories: [] }];
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
        self.employeeRole = window.employeeRole;
        self.employeeId = window.employeeId;
        self.init();
        setTimeout(function () {
            $(".datepicker").datepicker({
                format: "dd/mm/yyyy"
            });
        }, 100);
    }
});

