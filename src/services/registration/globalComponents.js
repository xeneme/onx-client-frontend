import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import vSelect from 'vue-select'
import VueWaypoint from 'vue-waypoint'
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';

import Panel from '../../components/views/wallet/Panel.vue'
import FontAwesomeIcon from './fa-registration'

exportingInit(Highcharts);

Vue.use(HighchartsVue, { tagName: 'chart' });
Vue.use(VueAxios, axios)
Vue.use(VueWaypoint)

Vue.component('fa', FontAwesomeIcon)
Vue.component('v-select', vSelect)
Vue.component('v-panel', Panel)