<template>
  <div class="calendar">
    <x-calendar  ref="calendar_list" list="ss"></x-calendar>
  </div>
</template>
<script>
import xCalendar from "./calendar";
export default {
  name: "caledar",
  data() {
    return {
      msg: "日历",
      isWeek:true
    };
  },
  components: {
    xCalendar
  },
  mounted() {
    console.log('子组件的值',this.$refs.calendar_list._data);
  },
};
</script>