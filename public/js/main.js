// table search
$(document).ready(function () {
  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#searchTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

// list search
$(document).ready(function () {
  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#searchList li").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

// local time
// function localTime() {
//   let d = new Date();
//   let h = d.getHours();
//   let m = d.getMinutes();
//   let s = d.getSeconds();

//   let ampm = "AM";
//   if (h > 12) {
//     h = h - 12;
//     ampm = "PM";
//   }
//   if (h < 12) {
//     h = "0" + h;
//   }
//   if (m < 10) {
//     m = "0" + m;
//   }

//   const time = document.getElementById('attendance_time_in');
//   time.value = h + " : " + m + " : " + s + " : " + ampm;
// }