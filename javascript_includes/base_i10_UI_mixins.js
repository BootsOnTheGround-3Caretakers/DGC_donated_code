/* eslint-disable */

var PageTemplate = {
  data() {
    return {
      isInitiailized: false,
      activeSubpage: "",
      params: {},
      subItemsList: [],
      subItemIndex: 0,
      subItemsLoaded: false,
      subPageSubItemLists: {},
      overrideAuthCallbacks: false
    }
  },
  props: ['subModals'],
  methods: {
    eventSubItemsLoaded() {
      this.subItemsLoaded = true;
      this.$emit('event-sub-items-loaded')
      this.updateUrl();
    },
    eventSubItemsChange(new_sub_items_list) {
      if (!new_sub_items_list) {
        return;
      }
      this.subItemsList = JSON.parse(JSON.stringify(new_sub_items_list));
      this.subPageSubItemLists[this.activeSubpage] = JSON.parse(JSON.stringify(new_sub_items_list));
      this.updateUrl();
    },
    eventParamsChange(new_params) {
      for (var key in new_params) {
        if (new_params[key] === null) {
          delete new_params[key];
        }
      }
      this.params = new_params;
      this.updateUrl();
    },
    selectSubpage(tabId) {
      this.activeSubpage = tabId;
      if (tabId in this.subPageSubItemLists === false) {
        this.subPageSubItemLists[tabId] = [tabId];
      }
      var new_sub_items_list = JSON.parse(JSON.stringify(this.subPageSubItemLists[tabId]));
      new_sub_items_list[this.subItemIndex] = tabId;

      this.eventSubItemsChange(new_sub_items_list)
    },
    restoresubModals() {
      if (!this.subModals) {
        this.selectSubpage(this.defaultSubpage)
        return;
      }
      var new_sub_items_list = this.subModals.split('~')
      //the last entry will be an empty one
      new_sub_items_list.pop()
      this.subItemsList = new_sub_items_list

      if (this.subItemsList.length > this.subItemIndex) {
        this.subPageSubItemLists[this.subItemsList[this.subItemIndex]] = this.subItemsList;
        this.selectSubpage(this.subItemsList[this.subItemIndex])
      }
      if (this.subItemsList.length === this.subItemIndex - 1) {
        this.eventSubItemsLoaded()
      }
    },
    updateUrl() {
      if (!this.subItemsLoaded || this.dontRebuildUrlOnchange) {
        return;
      }
      var modals = ""
      var params_string = ""
      var query = Object.assign({}, this.$route.query);
      for (var index in this.subItemsList) {
        if (typeof this.subItemsList[index] !== 'string' || this.subItemsList[index].length === 0) {
          continue;
        }
        modals += this.subItemsList[index] + '~'
      }

      var params_array = [];
      for (var key in this.params) {
        if (this.params[key] === null) {
          continue;
        }
        params_array.push(key);
      }
      params_array.sort();
      for (index in params_array) {
        var param_name = params_array[index].split('-')[1];
        params_string += '/' + param_name + '/' + this.params[params_array[index]]
      }

      var path = this.baseUrl + "/" + modals + params_string
      this.$router.push({ path: path, query: query});
    },
    waitWatchdogReady() {
      //we have to make sure the firebase DB is actually connected since the page will sometimes request it before firebase can connect
      if (window.vue_instance.$data.watchdog.watchdogDbConnected === true) {
        this.isInitiailized = true;
        if (this.waitWatchdogReadyCallback) {
          this.waitWatchdogReadyCallback();
        }
      } else {
        setTimeout(this.waitWatchdogReady, 200);
      }
    },
    signingInFeedback() {
      let notification = "Verifying account.";
      this.$store.commit("updateNotifications", notification);
      this.$awn.info(notification);
    },
    signedInFeedback() {
      let notification = " Account Verified.";
      this.$store.commit("updateNotifications", notification);
      this.$awn.info(notification);
    },
    signInFailedFeedback(error) {
      localStorage.clear();
      localStorage.removeItem('vuex');
      location.assign(window.location.origin + '/login');
    },
    login() {
      localStorage.clear();
      localStorage.removeItem('vuex');
      location.assign(window.location.origin + '/login');
    },
    logout() {
      window.G_firebase_auth.bi5SignOut()
    },
  },
  watch: {
    subItemsList() {
      var submodalsValue = JSON.parse(JSON.stringify(this.subItemsList.filter(x => x)));
      var cachedSubmodalsValue = JSON.parse(JSON.stringify(this.subItemsList.filter(x => x)));
      cachedSubmodalsValue.pop();

      var submodalsAsString = JSON.stringify(submodalsValue);
      var lastSelectedSubmodal = window.vue_instance.$data.selectedSubModals[window.vue_instance.$data.selectedSubModals.length - 1];
      if (!lastSelectedSubmodal) {
        window.vue_instance.$data.selectedSubModals.push(submodalsValue);
        return;
      }
      var lastSelectedSubmodalAsString = JSON.stringify(lastSelectedSubmodal);

      if (submodalsAsString === lastSelectedSubmodalAsString) {
        return;
      } else if (
        submodalsValue[submodalsValue.length -1] === 'default' && 
        JSON.stringify(cachedSubmodalsValue) === lastSelectedSubmodalAsString
      ) {
        lastSelectedSubmodal.push('default');
        return;
      } else {
        window.vue_instance.$data.selectedSubModals.push(submodalsValue);
      }
    },
    '$root.backForwardUrlRequest': {
      handler() {

        var selectedSubmodals = window.vue_instance.$data.selectedSubModals;
        var currentPosition = selectedSubmodals.length - 1;

        if (selectedSubmodals.length && currentPosition) {
          var homeParts = ['home', 'about', 'downloads'];

          this.eventSubItemsChange(selectedSubmodals[currentPosition - 1]);
          this.selectSubpage(selectedSubmodals[currentPosition - 1][0]);
          if (homeParts.includes(selectedSubmodals[currentPosition - 1][0])) {
            this.$router.push(`/${selectedSubmodals[currentPosition - 1][0]}~`);
          }
          window.vue_instance.$data.selectedSubModals.pop();
        } else if (this.$route.fullPath === '/dashboard' && currentPosition) {
          this.$router.push(`/${selectedSubmodals[currentPosition - 1][0]}~`);
          window.vue_instance.$data.selectedSubModals.pop();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(function () {
      if (this.overrideAuthCallbacks !== true) {
        window.G_firebase_auth.bi5SetSitePageCallbacks(
          this.signingInFeedback,
          this.signedInFeedback,
          this.signInFailedFeedback
        );
      }
      this.waitWatchdogReady();
      this.restoresubModals();
    });
  }
};

var SubpageTemplate = {
  data() {
    return {
      isInitiailized: false,
      params: {},
      subItemsLoaded: false,
      activeModal: "default"
    }
  },
  props: ['subItemIndex', 'subItemsList', 'parentParams'],
  mounted() {
    this.$nextTick(function () {
      this.params = this.parentParams;
      this.waitWatchdogReady();
      this.restoresubModals();
    });
  },
  methods: {
    eventCloseModal() {
      this.showModal(this.defaultModal);
    },
    eventSubItemsLoaded() {
      this.subItemsLoaded = true;
      this.$emit('event-sub-items-loaded', true);
    },
    eventSubItemsChange(new_sub_items_list) {
      if (new_sub_items_list === null || new_sub_items_list === undefined) {
        return;
      }
      this.subItemsList = new_sub_items_list;
      this.$emit('event-sub-items-change', new_sub_items_list);
    },
    eventParamsChange(new_params) {
      this.params = new_params;
      this.$emit('event-parameter-change', this.params);
    },
    restoresubModals() {
      if (this.subItemsList.length > this.subItemIndex) {
        this.showModal(this.subItemsList[this.subItemIndex]);
      } else {
        this.showModal(this.defaultModal);
      }
      if (this.subItemsList.length === this.subItemIndex + 1) {
        this.eventSubItemsLoaded()
      }
    },
    showModal(modalId) {
      this.activeModal = modalId;
      var new_sub_items_list = this.subItemsList;
      if (this.subItemsList.length < this.subItemIndex + 1) {
        new_sub_items_list.push(modalId);
      } else {
        new_sub_items_list[this.subItemIndex] = modalId;
      }
      
      //keep modal close requests from getting into the browswer URL history
      if (new_sub_items_list[new_sub_items_list.length -1] === 'close_modal') {
        new_sub_items_list.pop();
      }
      
      this.eventSubItemsChange(new_sub_items_list);
    },
    updateParams() {
      this.$emit('event-parameter-change', this.params);
    },
    waitWatchdogReady() {
      //we have to make sure the firebase DB is actually connected since the page will sometimes request it before firebase can connect
      if (window.vue_instance.$data.watchdog.watchdogDbConnected === true) {
        this.isInitiailized = true;
        if (this.waitWatchdogReadyCallback) {
          this.waitWatchdogReadyCallback();
        }
      } else {
        setTimeout(this.waitWatchdogReady, 200);
      }
    },
    parseRouteParams(param_list) {
      //this checks if the prop name is in the route params and then calls the functions in the dictionary using the value associated with the prop name in the router params.
      for (var index in param_list) {
        if (param_list[index].prop_name in this.$route.params) {
          for (var index2 in param_list[index].functions)
            param_list[index].functions[index2](this.$route.params[param_list[index].prop_name]);
        }
      }
    },
  },
  watch: {
    '$root.backForwardUrlRequest': {
      handler() {
        this.restoresubModals();
      },
      deep: true
    }
  }
}


var modalTemplate = {
  data() {
    return {
      isInitiailized: false,
      params: {},
      subItemsLoaded: false,
      activeModal: "default",
      actualModalTitle: ''
    }
  },
  props: ['subItemIndex', 'subItemsList', 'parentTitle', 'isModal', 'disableUrlHistory', 'parentParams'],
  mounted() {
    this.$nextTick(function () {
      this.params = this.parentParams;
      this.setModalTitle();
      this.waitWatchdogReady();
      this.restoresubModals();
    });
  },
  watch: {
    subItemsList() {
      if (this.subItemsList[this.subItemIndex] === 'close_modal') {
        this.selfClose();
        return;
      }
      if (
        typeof this.subItemsList[this.subItemIndex] === 'string' &&
        this.activeModal !== this.subItemsList[this.subItemIndex]
      ) {
        this.showModal(this.subItemsList[this.subItemIndex])
      }
    }
  },
  methods: {
    eventCloseChildModals(selectedModal) {
      if (this.actualModalTitle.trim() !== selectedModal.trim()) {
        this.$emit("event-close-child-modals", selectedModal);
        this.selfClose();
      }
    },
    selfClose() {
      if (!this.disableUrlHistory) {
        var new_sub_items_list = this.subItemsList;
        while (new_sub_items_list.length > this.subItemIndex) {
          new_sub_items_list.pop()
        }
        this.eventSubItemsChange(new_sub_items_list);
      }
      
      this.$emit("event-close-modal");
    },
    eventCloseModal() {
      this.showModal(this.defaultModal);
    },
    eventSubItemsLoaded() {
      this.subItemsLoaded = true;
      this.$emit('event-sub-items-loaded', true);
    },
    eventSubItemsChange(new_sub_items_list) {
      if (this.disableUrlHistory || !this.isModal || !new_sub_items_list) {
        return;
      }
      this.subItemsList = new_sub_items_list;
      this.$emit('event-sub-items-change', new_sub_items_list);
    },
    eventParamsChange(new_params) {
      if (this.disableUrlHistory || !new_params) {
        return;
      }
      this.$emit('event-parameter-change', new_params)
    },
    restoresubModals() {
      if (!this.subItemsList || this.subItemIndex === null || this.subItemIndex === undefined) {
        return;
      }
      if (this.subItemsList.length > this.subItemIndex) {
        this.showModal(this.subItemsList[this.subItemIndex]);
      } else {
        this.showModal(this.defaultModal);
      }
      if (this.subItemsList.length === this.subItemIndex + 1) {
        this.eventSubItemsLoaded();
      }
    },
    showModal(modalId) {
      this.activeModal = modalId;
      if (this.disableUrlHistory) {
        return;
      }
      var new_sub_items_list = this.subItemsList;
      if (this.subItemsList && this.subItemsList.length < this.subItemIndex + 1) {
        new_sub_items_list.push(modalId)
      } else {
        new_sub_items_list[this.subItemIndex] = modalId
      }
      
      //keep modal close requests from getting into the browswer URL history
      if(new_sub_items_list[new_sub_items_list.length - 1] === 'close_modal') {
        new_sub_items_list.pop();
      }

      this.eventSubItemsChange(new_sub_items_list);
    },
    setModalTitle() {
      if (this.isModal) {
        this.actualModalTitle = this.modalTitle;
      }
      if (this.parentTitle &&
        typeof this.parentTitle === 'string' &&
        this.parentTitle.length > 0 &&
        this.modalTitle &&
        typeof this.modalTitle === 'string' &&
        this.modalTitle.length > 0
      ) {
        this.modalTitle = this.parentTitle + ' > ' + this.modalTitle;
      }
    },
    updateParams() {
      this.$emit('event-parameter-change', this.params);
    },
    waitWatchdogReady() {
      //we have to make sure the firebase DB is actually connected since the page will sometimes request it before firebase can connect
      if (window.vue_instance.$data.watchdog.watchdogDbConnected) {
        this.isInitiailized = true;
        if (this.waitWatchdogReadyCallback) {
          this.waitWatchdogReadyCallback();
        }
      } else {
        setTimeout(this.waitWatchdogReady, 200);
      }
    },
    parseRouteParams(param_list) {
      //this checks if the prop name is in the route params and then calls the functions in the dictionary using the value associated with the prop name in the router params.
      for (var index in param_list) {
        if (param_list[index].prop_name in this.$route.params) {
          for (var index2 in param_list[index].functions)
            param_list[index].functions[index2](this.$route.params[param_list[index].prop_name]);
        }
      }
    },
  }
}

var orgPermissionsCheck = {
  data() {
    return {
      userHasOrgEditPermissions: false,
      userHasSystemEditPermissions: false,
      userHasPermissionsFlag: false,
      userPermissionsObject: null,
      userPermissions: '',
    }
  },
  watch: {
    userPermissionsObject: {
      handler() {
        this.bi10UpdateUserPermissions();
      },
      deep: true
    }
  },
  methods: {
    bi10GetOrgPermissions(org_uid,attempt_count) {
      if (window.vue_instance.$data.watchdog.watchdogDbConnected === false ||
        typeof (org_uid) !== 'string' ||
        org_uid in window.G_watchdog_data.IV_org_permissions === false ||
        'permissions' in window.G_watchdog_data.IV_org_permissions[org_uid] === false
      ) {
        if(attempt_count === undefined || attempt_count === null) { attempt_count = 0; }
        attempt_count += 1;
        //only retry for 30 seconds
        if (attempt_count > 150) { return; }
        setTimeout(function () { this.bi10GetOrgPermissions(org_uid,attempt_count); }.bind(this), 200);
        return;
      }

      this.userPermissionsObject = window.G_watchdog_data.IV_org_permissions[org_uid];
      this.userHasPermissionsFlag = true;
      this.bi10UpdateUserPermissions();
    },

    bi10UpdateUserPermissions() {
      this.userPermissions = this.userPermissionsObject['permissions'];
      var org_edit_permissions = 'adefijkn';

      var user_has_org_edit_permissions = false;
      for (var index in org_edit_permissions) {
        if (this.userPermissions.includes(org_edit_permissions[index])) {
          user_has_org_edit_permissions = true;
          break;
        }
      }
      this.userHasOrgEditPermissions = user_has_org_edit_permissions;

      var user_has_system_edit_permissions = false;
      var system_edit_permisions = 'aopqgh';
      for (var index in system_edit_permisions) {
        if (this.userPermissions.includes(system_edit_permisions[index])) {
          user_has_system_edit_permissions = true;
          break;
        }
      }
      this.userHasSystemEditPermissions = user_has_system_edit_permissions;
    }
  }
}

class getSortingNames {
  static objectName(object_uid) {
    if(object_uid in window.G_watchdog_data.IV_objects_meta_data === false) {
      window.G_watchdog_data.initObjectMetaDataListener(object_uid);
    }
    if(window.G_watchdog_data.IV_objects_meta_data[object_uid] && 
      'name' in window.G_watchdog_data.IV_objects_meta_data[object_uid]
      ) {
      return window.G_watchdog_data.IV_objects_meta_data[object_uid]['name']
    } else {
      return null;
    }
  }

  static objectAttributeName(object_attribute_uid) {
    if(object_attribute_uid in window.G_watchdog_data.IV_object_attributes_meta_data === false) {
      window.G_watchdog_data.initObjectAttributeMetaDataListener(object_attribute_uid);
    }
    if(window.G_watchdog_data.IV_object_attributes_meta_data[object_attribute_uid] && 
      'name' in window.G_watchdog_data.IV_object_attributes_meta_data[object_attribute_uid]
      ) {
      return window.G_watchdog_data.IV_object_attributes_meta_data[object_attribute_uid]['name']
    } else {
      return null;
    }
  }

  static orgName(org_uid) {
    if(org_uid in window.G_watchdog_data.IV_org_meta_data === false) {
      window.G_watchdog_data.initOrgMetaDataListener(org_uid);
    }
    if(window.G_watchdog_data.IV_org_meta_data[org_uid] &&
      'name' in window.G_watchdog_data.IV_org_meta_data[org_uid]
      ) {
      return window.G_watchdog_data.IV_org_meta_data[org_uid]['name']
    } else {
      return null;
    }
  }
}

var ReportingSpecific = {
  props: ['orgUid', 'systemUid'],
  data() {
    return {
      actualOrgUid: null,
      actualSystemUid: null,
      actualObjectUid: null,
      actualObjectAttributeUid: null,
      defaultModal:'default',
      DV_selectedRangePicker: 'picker',
      DV_invalidDateRange: false,
      DV_pickerStartDate: null,
      DV_pickerEndDate: null,
      DV_selectedRange: [],
      DV_isFetchingData: false,
      DV_loadingStates: {},
      DV_itemsCount: {},
      DV_showWarning: true,
      DV_objectsCount: 0,
      DV_attributesCount: 0,
      DV_showWarning: true,
      DV_nameFilterText: '',
      DV_selectedDataOption: 'history',
      DV_nameFilterOptions: [
        {label: 'Attribute Name Equals', value: 'equals'}, 
        {label: 'Attribute Name Contains', value: 'contains'}
      ],
      DV_valueFilterOptions: [
        {label: 'Attribute Value Contains', value: 'contains'},
        {label: 'Attribute Value Does Not Contain', value: 'not_contains'},
        {label: 'Attribute Value Greater Than', value: 'greater'},
        {label: 'Attribute Value Less Than', value: 'less'},
        {label: 'Attribute Value Equals', value: 'equals'},
      ],
      DV_selectedNameFilter: 'equals',
      DV_selectedValueFilter: 'contains',
      DV_valueFilterText: ''
    }
  },
  mounted() {
    this.loadURLParams();
    this.setInitialSelectedDateRange();
  },
  computed: {
    C_brandColor() {
      return window.G_brand_color;
    },
    C_isNameFilterTextPresent() {
      return typeof(this.DV_nameFilterText) === 'string' && 
             this.DV_nameFilterText.length > 0;
    },
    C_isValueFilterTextPresent() {
      return typeof(this.DV_valueFilterText) === 'string' && 
             this.DV_valueFilterText.length > 0;
    },
    C_isNameFilterPresent() {
      return this.C_isNameFilterTextPresent && 
             typeof(this.DV_selectedNameFilter) === 'string' &&
             this.DV_selectedNameFilter.length > 0
    },
    C_isValueFilterPresent() {
      return this.C_isValueFilterTextPresent && 
             typeof(this.DV_selectedValueFilter) === 'string' &&
             this.DV_selectedValueFilter.length > 0
    }
  },
  methods: {
    validateDateRange() {
      if (this.DV_pickerStartDate === null && this.DV_pickerEndDate === null) {
        this.setInitialPickerDateRange();
        return;
      }
      if (this.DV_pickerStartDate > this.DV_pickerEndDate) {
        this.DV_invalidDateRange = true;
        this.$awn.warning("Please choose correct date range.");
        return;
      } else {
        this.DV_invalidDateRange = false;
        let newArray = [
          new Date(this.DV_pickerStartDate).getTime(),
          new Date(this.DV_pickerEndDate).getTime()
        ]
        this.DV_selectedRange = newArray;
      }
    },
    setInitialSelectedDateRange() {
      let query = Object.assign({}, this.$route.query);

      if (query["range_start"] !== null && query["range_start"] !== undefined &&
          query["range_end"] !== null && query["range_end"] !== undefined) {
        if (query["range_end"] === "now") {
          // it means the end date is from current time to query["range_start"] miliseconds before.
          this.DV_selectedRangePicker = (+query["range_start"] / (60*60*1000));
        } else if (query["range_end"] === "all") {
          this.DV_selectedRangePicker = "all";
        } else {
          this.DV_selectedRangePicker = "picker";
          this.DV_pickerStartDate = new Date(+query["range_start"]).toISOString();
          this.DV_pickerEndDate = new Date(+query["range_end"]).toISOString();
        }
      } else {
        this.DV_selectedRange = [
          new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)).getTime(),
          new Date().getTime()
        ]

        this.setInitialPickerDateRange();
      }
    },
    setInitialPickerDateRange() {
      this.DV_pickerStartDate = new Date(
          new Date().getTime() - (30 * 24 * 60 * 60 * 1000)
          ).toISOString();
      this.DV_pickerEndDate = new Date().toISOString();
    },
    setUrlParams(type, value) {
      let query = Object.assign({}, this.$route.query);

      switch(type) {
        case "data_type":
          query['data_type'] = value;
          this.$router.push({query: query});
          break;
        case "value_mode":
          query['value_mode'] = value;
          this.$router.push({query: query});
          break;
        case "name_mode":
          query['name_mode'] = value;
          this.$router.push({query: query});
          break;
        case "name_string":
          if (value.length < 1) {
            delete query["name_string"]
            this.$router.push({query: query});
            break;
          }
          query["name_string"] = btoa(value);
          this.$router.push({query: query});
          break;
        case "value_string":
          if (value.length < 1) {
            delete query["value_string"]
            this.$router.push({query: query});
            break;
          }
          query["value_string"] = btoa(value);
          this.$router.push({query: query});
          break;
        case "range_start":
          query["range_start"] = value;
          this.$router.push({query: query});
          break;
        case "range_end":
          query["range_end"] = value;
          this.$router.push({query: query});
          break;
      }
    },
    loadURLParams() {
      let query = Object.assign({}, this.$route.query);

      if (query["data_type"] !== null && query["data_type"] !== undefined) {
        this.DV_selectedDataOption = query["data_type"];
      }
      if (query["value_mode"] !== null && query["value_mode"] !== undefined) {
        this.DV_selectedValueFilter = query["value_mode"];
      }
      if (query["name_mode"] !== null && query["name_mode"] !== undefined) {
        this.DV_selectedNameFilter = query["name_mode"];
      }
      if (query["name_string"] !== null && query["name_string"] !== undefined) {
        this.DV_nameFilterText = atob(decodeURIComponent(query["name_string"]));
      }
      if (query["value_string"] !== null && query["value_string"] !== undefined) {
        this.DV_valueFilterText = atob(decodeURIComponent(query["value_string"]));
      }
    },
    formatFiltersData() {
      let filters = {};

      if (this.C_isNameFilterPresent === true) {
        filters['name'] = {mode: this.DV_selectedNameFilter, search_text: this.DV_nameFilterText};
      }
      if (this.C_isValueFilterPresent === true) {
        filters['value'] = {mode: this.DV_selectedValueFilter, search_text: this.DV_valueFilterText};
      }

      return filters;
    }
  },
  watch: {
    DV_selectedRangePicker() {
      this.DV_invalidDateRange = false;
      if (this.DV_selectedRangePicker === 'picker') {
        this.validateDateRange();
      } else if (this.DV_selectedRangePicker === 'all') {
        this.DV_selectedRange = [0, new Date().getTime()];
      } else {
        let before = (+this.DV_selectedRangePicker * 60 * 60 * 1000)
        this.DV_selectedRange = [(new Date().getTime() - before), new Date().getTime()];
      }
    },
    DV_pickerStartDate() {
      this.validateDateRange();
    },
    DV_pickerEndDate() {
      this.validateDateRange();
    },
    DV_loadingStates: {
      handler: function(val) {
        this.DV_isFetchingData = this.DV_loadingStates['c2m9_c2m10_OrgReporting'] === true;
      },
      deep: true
    },
    DV_itemsCount: {
      handler: function() {
        if (this.DV_isFetchingData !== true) {return}

        if (this.DV_itemsCount['objects'] !== undefined && this.DV_itemsCount['objects'] !== null) {
          this.DV_objectsCount = this.DV_itemsCount['objects'];
        }

        if (this.DV_itemsCount['attributes'] !== undefined && this.DV_itemsCount['attributes'] !== null) {
          this.DV_attributesCount = this.DV_itemsCount['attributes'];
        }
      }, deep: true
    },
    DV_selectedDataOption() {
      this.setUrlParams('data_type', this.DV_selectedDataOption);
    },
    DV_selectedNameFilter() {
      this.setUrlParams('name_mode', this.DV_selectedNameFilter);
    },
    DV_selectedValueFilter() {
      this.setUrlParams('value_mode', this.DV_selectedValueFilter);
    },
    DV_valueFilterText() {
      this.setUrlParams('value_string', this.DV_valueFilterText);
    },
    DV_nameFilterText() {
      this.setUrlParams('name_string', this.DV_nameFilterText);
    },
    DV_selectedRange: {
      handler: function() {
        if (this.DV_selectedRangePicker === 'picker') {
          this.setUrlParams('range_start', this.DV_selectedRange[0]);
          this.setUrlParams('range_end', this.DV_selectedRange[1]);
        } else if (this.DV_selectedRangePicker === 'all') {
          this.setUrlParams('range_start', "start");
          this.setUrlParams('range_end', "all");
        } else {
          let before = (+this.DV_selectedRangePicker * 60 * 60 * 1000)

          this.setUrlParams('range_start', before);
          this.setUrlParams('range_end', "now");
        }
      }, deep: true
    }
  },
  beforeDestroy() {
    let query = {};
    this.$router.push({query: query});
  }
}

export {
  PageTemplate as bi10PageTemplate,
  SubpageTemplate as bi10SubpageTemplate,
  modalTemplate as bi10ModalTemplate,
  orgPermissionsCheck as bi10OrgPermissions,
  getSortingNames as bi10GetSortingNames,
  ReportingSpecific as bi10ReportingSpecific
}