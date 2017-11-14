$(document).ready(function() {
  console.log("ready!");
  var crop_max_width = 800;
  var crop_max_height = 800;
  var jcrop_api;
  var context;
  var canvas;
  var image;

  var prefsize;

  $("#file").change(function() {
    loadImage(this);
  });



  function loadImage(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      canvas = null;
      reader.onload = function(e) {
        image = new Image();
        image.onload = validateImage;
        image.src = e.target.result;
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  function validateImage() {
    if (canvas != null) {
      image = new Image();
      image.onload = restartJcrop;
      image.src = canvas.toDataURL('image/png');
    } else restartJcrop();
  }

  function restartJcrop() {
    if (jcrop_api != null) {
      jcrop_api.destroy();
    }
    $("#views").empty();
    $("#views").append("<canvas id=\"canvas\">");
    canvas = $("#canvas")[0];
    context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    $("#canvas").Jcrop({
      onSelect: selectcanvas,
      onRelease: clearcanvas,
      boxWidth: crop_max_width,
      boxHeight: crop_max_height
    }, function() {
      jcrop_api = this;
    });
    clearcanvas();
  }

  function clearcanvas() {
    prefsize = {
      x: 0,
      y: 0,
      w: canvas.width,
      h: canvas.height,
    };
  }

  function selectcanvas(coords) {
    prefsize = {
      x: Math.round(coords.x),
      y: Math.round(coords.y),
      w: Math.round(coords.w),
      h: Math.round(coords.h)
    };
  }

  function dataURLtoBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {
        type: contentType
      });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {
      type: contentType
    });
  }

  function applyCrop() {
    canvas.width = prefsize.w;
    canvas.height = prefsize.h;
    context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 0, 0, canvas.width, canvas.height);
    validateImage();
  }

  $("#cropbutton").click(function(e) {
    applyCrop();
  });

  $.get("http://localhost:3000/getData", function(data) {
    console.log(data);

    $(".result").html(data);
  });







  $("#readbutton").click(function(e) {
    e.preventDefault();
    formData = new FormData($(this)[0]);
    var blob = dataURLtoBlob(canvas.toDataURL('image/png'));
    console.log(blob);
    //---Add file blob to the form data
    formData.append("cropped_image[]", blob);

    console.log(formData);
    $.ajax({
      url: "http://localhost:3000/calculate",
      type: "POST",
      data: formData,
      contentType: false,
      cache: false,
      processData: false,
      success: function(data) {
        $(".result").html(data);
        //alert("Success");
      },
      error: function(data) {
        alert("Error");
      },
      complete: function(data) {}
    });
  });









});
