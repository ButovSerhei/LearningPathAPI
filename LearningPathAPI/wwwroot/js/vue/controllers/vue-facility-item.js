Vue.use(window.vuelidate.default);
Vue.config.devtools = true;
Vue.use(BootstrapVue);
var _window$validators = window.validators,
    required = _window$validators.required,
    helpers = _window$validators.helpers,
    minLength = _window$validators.minLength,
    isNumValidation = helpers.regex('isNumValidation', /^(\d*\.)?\d+$/);

//var isNumValidation = helpers.RegExp("^(\d*\.)?\d+$"); 

var app = new Vue({
    el: "#facility-item",
    data: {
        init: true,
        loader: false,
        error: null,
        success: null,
        id: null,
        customId: null,
        title: null,
        price: null,
        status: null,
        statuses: ["Active", "Decommissioned"],
        employee: null,
        employeeItem: null,
        employees: null,
        category:null,
        facilityError: null,

        uploadFiles: [],
        files: [],
        fileLoader: false,
        deletedFile: null,
        checkAllFiles: false,
        checkedFiles: {},
        deleteAllFileLoader: false,
        deleteAllFileError: null,
        deleteAllFileItems: [],
        downloadAllFileLoader: false,
        downloadAllFileError: null,

        events: [],
        facilityId: null,
        currencyTypes: ["EUR", "GBP", "UAH", "USD"],
        currency: "USD",
        isCopied: false
    },
    validations: {
        customId: {
            required: required
        },
        title: {
            required: required
        },
        price: {
            isNum: isNumValidation
            //required: required //SR: according to https://qcode.atlassian.net/browse/SLN-69 
        },
        status: {
            required: required
        }
    },
    methods: {
        create: function create() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            var self = this;
            self.error = null;
            self.loader = true;
            var data = self.fillModel();
            data.Created = new Date();
            axios.post('/facilities/create', data).then(function (response) {
                if (response.data) {
                    self.success = response.data.success;
                    setTimeout(function () { window.location.href = response.data.redirectUrl }, 1000);
                }
            }).catch(function (error) {
                self.error = error.response.data;
                self.facilityError = error.response.data;
                self.loader = false;
            });
        },
        deleteFacility: function deleteFacility() {
            var self = this;
            var data = {};
            axios.post('/facilities/deleteFacility', data).then(function (response) {

            }).catch(function (error) {
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
            data.Created = self.created;
            data.Updated = new Date();
            axios.post('/facilities/update', data).then(function (response) {
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
            if (model != null) {
                self.id = model.Id;
                self.customId = model.CustomId;
                self.title = model.Title;
                self.price = model.Price;
                self.status = model.Status;
                self.created = model.Created;
                self.updated = model.Updated;
                self.employee = model.EmployeeId;
                self.employeeItem = model.Employee;
                self.events = model.Events;
                self.currency = model.Currency;
            } else {
                self.status = "Active";
            }
            self.loadCategories();
            self.loadEmployees();
            self.loadFiles();
            //self.resetUploads(); SR: we don't need new entry in uploadFiles with empty fie ids -- for now switch it off
            self.refreshSelectBox();
        },
        fillModel: function fillModel() {
            var self = this;

            var uploadedFilesIdsList = [];
            for (var i = 0; i < self.uploadFiles.length; i++) {

                uploadedFilesIdsList.push(self.uploadFiles[i].id);
            }
            var item = {
                Id: self.id,
                CustomId: self.customId,
                Title: self.title,
                Price: self.price,
                Status: self.status,
                Currency: self.currency,
                EmployeeId: self.employee,
                UploadedFilesIds: uploadedFilesIdsList.length !== 0 ? uploadedFilesIdsList : null
            };
            return item;
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
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].name === "Facilities") {
                        self.category = response.data[i].value;
                        break;
                    }
                }
            }).catch(function (error) {
                self.error = error.response.data;
            });
        },
        loadFiles: function loadFiles() {
            var self = this;
            self.fileLoader = true;
            axios.get('/facilities/loadFiles/' + self.id)
                .then(function (response) {
                    self.files = response.data.items;
                    self.fileLoader = false;
                })
                .catch(function (error) {
                    console.log(error);
                    self.fileLoader = false;
                });
        },
        deleteApprovalFile(item) {
            Vue.set(item, "delete", true);
        },
        deleteApprovalAllFiles() {
            var self = this;
            var deleteIds = [];
            for (var key in self.checkedFiles) {
                if (self.checkedFiles[key] === true) {
                    deleteIds.push(key);
                }
            }
            var deletedItems = [];
            for (var i = 0; i < self.files.length; i++) {
                if (deleteIds.indexOf(self.files[i].id) !== -1) {
                    deletedItems.push(self.files[i].name);
                }
            }
            self.deleteAllFileItems = deletedItems;
            $("#delete-dialog-all").modal("show");

        },
        deleteDocument: function deleteDocument(file) {
            var self = this;
            Vue.set(file, "deleteLoader", true);
            axios.post(`/files/delete/` + file.id, {}).then(function (response) {
                var filesIndex = self.files.indexOf(file);
                if (filesIndex !== -1) {
                    self.files.splice(filesIndex, 1);
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
            Vue.set(self, "deleteAllFileLoader", true);
            self.deleteAllFileError = null;
            var deleteIds = [];
            for (var key in self.checkedFiles) {
                if (self.checkedFiles[key] === true) {
                    deleteIds.push(key);
                }
            }
            axios.post(`/files/deleteall/`, deleteIds).then(function (response) {
                var deletedItems = [];
                for (var i = 0; i < self.files.length; i++) {
                    if (deleteIds.indexOf(self.files[i].id) !== -1) {
                        deletedItems.push(self.files[i]);
                    }
                }
                for (var j = 0; j < deletedItems.length; j++) {
                    var index = self.files.indexOf(deletedItems[j]);
                    if (index !== -1) {
                        self.files.splice(index, 1);
                    }
                }
                self.checkedFiles = {};
                self.checkAllFiles = false;
                self.deleteAllFileLoader = false;
                $("#delete-dialog-all").modal('hide');

            }).catch(function (error) {
                self.deleteAllFileLoader = false;
                self.deleteAllError = error.responce.data;

            });
        },
        downloadAllDocuments: function downloadAllDocuments() {
            var self = this;
            Vue.set(self, "downloadAllLoader", true);
            self.downloadAllError = null;
            var downloadIds = [];
            for (var key in self.checkedFiles) {
                if (self.checkedFiles[key] === true) {
                    downloadIds.push(key);
                }
            }
            axios.post(`/files/downloadall/`, downloadIds).then(function (response) {
                self.checkedFiles = {};
                self.checkAllFiles = false;
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
            for (var key in self.checkedFiles) {
                if (self.checkedFiles[key] === true) {
                    anySelected = true;
                    break;
                }
            }
            return anySelected;
        },
        checkUncheckAll: function checkUncheckAll(value) {
            var self = this;
            if (self.checkAllFiles) {
                for (var i = 0; i < self.files.length; i++) {
                    self.checkedFiles[self.files[i].id] = true;
                }
            } else {
                self.checkedFiles = {};
            }
        },
        // ===================== File's methods section  ================= 
        addNewUpload() {
            var self = this;
            if (self.selectedNote == null) {
                self.uploadFiles.push({
                    id: null,
                    progressBarPercent: 0,
                    isLoading: false,
                    employees: self.employee == null ? null : [self.employee.value],
                    categories: []
                });
            } else {
                self.uploadFiles.push({ id: null, progressBarPercent: 0, isLoading: false, employees: self.employee == null ? null : [self.employee.value], categories: [self.selectedNote.data.categoryId] });
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
                files.append("categories", [self.category]);
                files.append("employees", item.employees);
                files.append("facility", [self.id]);
                item.progressBarPercent = 0;
                axios.post('/files/upload/',
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
                    self.files.push(response.data);
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
        resetUploads: function resetUploads() {
            var self = this;
            if (self.selectedNote == null) {
                self.uploadFiles = [
                    { id: null, progressBarPercent: 0, isLoading: false, employees: self.employee == null ? null : [self.employee.value], categories: [] }
                ];
            } else {
                self.uploadFiles = [{ id: null, progressBarPercent: 0, isLoading: false, employees: self.employee == null ? null : [self.employee.value], categories: [self.selectedNote.data.categoryId] }];
            }
            self.refreshSelectBox();
        },
        //======================= Copy info section ======================================================================== 
        copyFacilityInfo: function copyFacilityInfo() {
            var self = this;
            var text =
                "Id: " +
                self.customId +
                '\n' +
                "Title: " +
                self.title +
                '\n' +
                "Price: " +
                self.price +
                '\n' +
                "Status: " +
                self.status +
                '\n' +
                "Owner: " +
                self.employee.name +
                '\n' + 
                "Events:" + '\n';
            for (var i = 0; i < self.events.length; i++) {
                text += self.events[i].DateString + ' ' + (self.events[i].Reporter == null ? 'N/A' : self.events[i].Reporter) + ' ' + self.events[i].Event +'\n';
            }
            self.copyText(text);
        },
        copyText: function copyText(text) {
            var self = this;
            if (!navigator.clipboard) {
                fallbackCopyTextToClipboard(text);
                return;
            }
            navigator.clipboard.writeText(text).then(function () {
                self.isCopied = true;
                setTimeout(function() { self.isCopied = false }, 3000);
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
        refreshSelectBox: function refreshSelectBox(parameters) {
            setTimeout(function () {
                $(".selectpicker").selectpicker('refresh');
            }, 50);
        }
    },
    mounted: function () {
        var self = this;
        this.initModel(window.model);
        $(function () {
            $('[data-toggle="popover"]').popover();
        });
        self.refreshSelectBox();
    }
}); 
