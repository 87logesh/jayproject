$(document).ready(function() {
	//initializing Date Picker Date picker 
	// $('#dob').datepicker({autoclose: true});
	
	if($("#member_details_status_panel") !== undefined && !$.isEmptyObject($("#member_details_status_panel").text())){
		alert($("#member_details_status_panel").text());
		// $("#member_details_panel").dialog();

	}
	
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	    document.getElementById('studentimagefile').addEventListener('change', handleFileSelect, false);
	} else {
	    alert('The File APIs are not fully supported in this browser.');
	}
	
	function handleFileSelect(e) {
		var files = e.target.files;
		var filesArr = Array.prototype.slice.call(files);
		filesArr.forEach(function(f) {
			var reader = new FileReader();
			reader.onload = function (readerEvent) {
				 $('#studentimage').attr('src', readerEvent.target.result);
                 //.width(120)
                 //.height(100);
				$('#studentimage').removeClass("invisible");
				$('#studentimagebase64').val(readerEvent.target.result)
			}
			reader.readAsDataURL(f); 
		});
	}
	
	//block the ui after form submission
	$("form").submit(function() {
		
		$.blockUI({ message: '<img src="/static/images/loader.gif" />' });
	});
	
	

	
	


   function agecalculate(){

			
	$("#dob").datepicker();
	$("#dob").on("change",function(){
		var selected = $(this).val();
		// alert(selected);
		dob = new Date(selected);
		var today = new Date();
		var age = Math.floor((today-dob) / (365.25 * 24 * 60 * 60 * 1000));
		if(age < 16){
			alert("Please select valid DOB.");
		} else {
			
			$("#ageasondate").val(age);
		}
	});
  
}
 			
}); 


		