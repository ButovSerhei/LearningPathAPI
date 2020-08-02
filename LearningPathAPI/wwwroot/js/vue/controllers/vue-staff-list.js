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
    el: '#files-item',
    data: {
        admin: null,
        former: window.location.search !== "" ? new URLSearchParams(window.location.search).get("former").toLowerCase() : false,
        companyId: null,
        accountId: null,
        workloadTypes: ["Fulltime", "Part-time", "Project based"],
        positions: [],
        items: [],
        error: null,
        page: 1,
        pages: [],
        loader: false,
        holdScreen: false,
        q: null,
        qWorkloads: [],
        qPositions: [],
        SortBy: "FullName",
        SortAsc: false,
        checkAll: false,
        checked: {},
        deleteAllLoader: false,
        deleteAllError: null,
        deleteAllItems: [],
        downloadAllLoader: false,
        downloadAllError: null,
        hireAgainType: [{ name: "Yes", value: true }, { name: "No", value: false }],
        hireAgain: null
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
        setFormer: function setFormer(type) {
            var self = this;
            self.former = type;
            this.search();
        },
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
                q: this.q,
                Former: this.former,
                HireAgain: this.hireAgain === "null" ? null : this.hireAgain,
                page: this.page,
                Workloads: this.qWorkloads,
                Positions: this.qPositions,
                SortBy: this.SortBy,
                SortAsc: this.SortAsc
            };
            axios.post('/staff/search', data)
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
        loadPositions() {
            var self = this;
            axios.get('/staff/positions').then(function (response) {
                self.positions = response.data;
                self.refreshSelectBox();
            }).catch(function (error) {
                self.error = error.response.data;
            });
        },

        deleteApproval(item) {
            Vue.set(item, "delete", true);
        },
        archiveApproval(item) {
            Vue.set(item, "archive", true);
        },
        deleteItem: function deleteItem(item) {
            var self = this;
            Vue.set(item, "deleteLoader", true);
            axios.post(`/staff/delete/` + item.id, {}).then(function (response) {
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
        archiveItem: function archiveItem(item) {
            var self = this;
            Vue.set(item, "archiveLoader", true);
            var data = {
                Id: item.id,
                Archive: !self.former,
                ArchiveReason: item.archiveReason,
                DateFinish: item.DateFinish != null ? moment(item.DateFinish).format() : item.DateFinish,
                HireAgain: item.hireAgain
            }
            axios.post(`/staff/archiveRestore/`, data).then(function (response) {
                var filesIndex = self.items.indexOf(item);
                if (filesIndex !== -1) {
                    self.items.splice(filesIndex, 1);
                }
                item.archiveLoader = false;
                item.archive = false;
                $("#archive-dialog").modal('hide');

            }).catch(function (error) {
                item.archiveLoader = false;
                item.archive = false;
                $("#archive-dialog").modal('hide');
            });
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
                    deletedItems.push(self.items[i].fullName);
                }
            }
            self.deleteAllItems = deletedItems;
            $("#delete-dialog-all").modal("show");

        },
        deleteAllEmployees: function deleteAllEmployees() {
            var self = this;
            Vue.set(self, "deleteAllLoader", true);
            self.deleteAllError = null;
            var deleteIds = [];
            for (var key in self.checked) {
                if (self.checked[key] === true) {
                    deleteIds.push(key);
                }
            }
            axios.post(`/staff/deleteall/`, deleteIds).then(function (response) {
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
                    if (self.items[i].id !== self.admin) {
                        self.checked[self.items[i].id] = true;
                    }
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
            self.loadPositions();
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
