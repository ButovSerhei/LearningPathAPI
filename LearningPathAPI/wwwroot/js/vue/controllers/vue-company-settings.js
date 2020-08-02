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
                    data: "DD/MM/YYYY",
                    input: "DD/MM/YYYY"
                    // ...optional `title`, `weekdays`, `navMonths`, etc
                }
            }
        }

    });
Vue.use(window.vuedraggable);
var _window$validators = window.validators,
    required = _window$validators.required,
    helpers = _window$validators.helpers,
    email = _window$validators.email,
    requiredTrue = _window$validators.requiredTrue,
    sameAs = _window$validators.sameAs,
    requiredTrue = (bool) => bool === true,
    dublicate = (item, vm) => item == null || vm.types.map(function (tpl) { return tpl.type.toLowerCase() }).indexOf(item.toLowerCase()) || !vm.checklistTypeNew,
    minLength = _window$validators.minLength;

var app = new Vue({
    el: '#company-settings',
    data: {
        checklistType: null,
        checklistTypeNew: false,
        checklistName: null,
        types: [],
        checklistLoader: false,
        checklistError: null,
        checklists: [],
        init: true,
        employees: [],
        stepName: null,
        stepResponsible: null,
        checklistStepLoader: false,
        checklistStepError: null
    },
    watch: {
        checklistTypeNew: function (newval, val) {
            var self = this;
            if (newval === false) {
                self.checklistType = null;
            }
            self.refreshSelectBox();
        },
    },
    validations: {
        checklistType: {
            dublicate: dublicate
        }
    },
    methods: {
        getComponentData() {
            var self = this;
            return {
                on: {
                    end: function (env) {
                        var listId = $(env.to).attr("data-list-id");
                        var list = self.getListById(listId);
                        self.reorderSteps(list.steps)
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
        loadChecklists: function loadChecklists() {
            var self = this;
            axios.get('/company/checklists').then(function (response) {
                self.types = response.data.types;
                if (self.types.length === 0) {
                    self.checklistTypeNew = true;
                }
                self.refreshSelectBox();
            }).catch(function (error) {
                self.error = error.response.data;
            });
        },
        createChecklist: function createChecklist() {
            var self = this;
            self.checklistLoader = true;
            var data = {
                Type: self.checklistType,
                Name: self.checklistName
            };
            axios.post('/company/createChecklist', data).then(function (response) {
                if (response.data) {
                    if (self.types.map(function (tpl) { return tpl.type.toLowerCase() }).indexOf(response.data.type.toLowerCase()) === -1) {
                        self.types.push({ type: response.data.type, lists: [], active: true });
                    }

                    if (self.types.length > 0) {
                        self.checklistTypeNew = false;
                    }
                    self.checklistLoader = false;
                    var type = self.getTypeByName(response.data.type);
                    var list = response.data;
                    type.lists.push(list);
                    self.setActive(type, list);
                    self.checklistType = null;
                    self.checklistName = null;
                    self.refreshSelectBox();
                }
            }).catch(function (error) {
                self.checklistError = error.response.data;
                self.checklistLoader = false;
            });
        },
        deleteChecklist: function deleteChecklist(type, list) {
            var self = this;
            Vue.set(list, "deleteLoader", true);
            axios.post('/company/deleteChecklist', list).then(function (response) {
                if (response.data.success) {
                
                    Vue.set(list, "deleteLoader", false);
                    $("#delete-dialog-list" + list.id).modal('hide');
                    var listIndex = type.lists.indexOf(list);
                    type.lists.splice(listIndex, 1);
                    if (type.lists.length === 0) {
                        var typeIndex = self.types.indexOf(type);
                        self.types.splice(typeIndex, 1);
                        self.refreshSelectBox();
                    } else {
                        self.setActive(type, type.lists[type.lists.length - 1]);
                    }
                    if (self.types.length === 0) {
                        self.checklistTypeNew = true;
                    } else {

                        if (self.types[self.types.length - 1].lists.length > 0) {
                            self.setActive(self.types[self.types.length - 1], self.types[self.types.length - 1].lists[self.types[self.types.length - 1].lists.length - 1]);
                        } else {
                            self.types[self.types.length - 1].active = true;
                        }
                    }
                    

                }
            }).catch(function (error) {
                list.checklistError = error.response.data;
                Vue.set(list, "deleteLoader", false);
            });
        },
        setActive: function setActive(type, list) {
            var self = this;
            for (var i = 0; i < self.types.length; i++) {
                self.types[i].active = false;
                for (var j = 0; j < self.types[i].lists.length; j++) {
                    self.types[i].lists[j].active = false;
                }
            }
            type.active = true;
            list.active = true;
        },
        createChecklistStep: function createChecklist(list) {
            var self = this;
            self.checklistStepLoader = true;
            self.checklistStepError = null;
            var data = {
                Name: self.stepName,
                ResponsibleEmployeeId: self.stepResponsible,
                ChecklistId: list.id
            };
            axios.post('/company/createChecklistStep', data).then(function (response) {
                if (response.data) {
                    self.checklistStepLoader = false;
                    list.steps.push(response.data);
                    self.stepName = null;
                    self.stepResponsible = null;
                    self.refreshSelectBox();

                }
            }).catch(function (error) {
                self.checklistStepError = error.response.data;
                self.checklistStepLoader = false;

            });
        },
        updateChecklistStep: function createChecklist(step) {
            var self = this;
            Vue.set(step, "checklistStepLoader", true);
            step.checklistStepError = null;
            var data = {
                Id: step.id,
                Name: step.name,
                ResponsibleEmployeeId: step.responsibleEmployeeId,
                ChecklistId: step.checklistId
            };
            axios.post('/company/updateChecklistStep', data).then(function (response) {
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
            axios.post('/company/deleteChecklistStep', data).then(function (response) {
                if (response.data.success) {
                    Vue.set(step, "checklistStepLoader", false);
                    var stepIndex = list.steps.indexOf(step);
                    list.steps.splice(stepIndex, 1);
                    //Vue.set(list, "steps", );
                    $("#delete-dialog").modal('hide');
                }
            }).catch(function (error) {
                step.checklistStepError = error.response.data;
                Vue.set(step, "checklistStepLoader", false);
            });
        },
        editStep: function editStep(step) {
            var self = this;
            Vue.set(step, "edit", true);
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
        reorderSteps: function reorderSteps(steps) {
            axios.post('/company/reorderChecklistStep', steps).then(function (response) {
                if (response.data) {
                    //Just ignore :)
                }
            }).catch(function (error) {
                self.checklistStepError = error.response.data;
                self.checklistStepLoader = false;

            });
        },
        getTypeByName: function getTypeByName(type) {
            var self = this;
            for (var i = 0; i < self.types.length; i++) {
                if (self.types[i].type === type) {
                    return self.types[i];
                }
            }
        },
        getListById: function getListById(id) {
            var self = this;
            for (var i = 0; i < self.types.length; i++) {
                for (var j = 0; j < self.types[i].lists.length; j++) {
                    if (self.types[i].lists[j].id === id) {
                        return self.types[i].lists[j];
                    }
                }
            }
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
        refreshSelectBox: function refreshSelectBox(parameters) {
            setTimeout(function () {
                $(".selectpicker").selectpicker('refresh');
            }, 50);
        },
    },
    mounted: function () {
        var self = this;
        self.loadChecklists();
        self.loadEmployees();
    }
});
