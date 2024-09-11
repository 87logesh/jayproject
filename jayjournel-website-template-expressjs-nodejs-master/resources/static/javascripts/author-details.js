$(document).ready(function() {
	//preventing form submit, since not required.

	$('#student_search_results tfoot th').each( function () {
		var title = $(this).text();
		$(this).html( '<input type="text" placeholder="Search '+title+'" />' );
	} );

	$('#search_author_details_form').bind('keydown',
		function(e) {
			if (e.keyCode == 13) {
				e.preventDefault();
			}
	});
	$.fn.dataTable.ext.errMode = 'none';
    $('#author_results').on( 'error.dt', function ( e, settings, techNote, message ) {
    //console.log( 'An error has been reported by DataTables: ', message );
    } ) ;
	
	//unblocking UI once ajax finish work
	$(document).ajaxStop($.unblockUI);
	
	$( "#search_author_manuscript" ).change(function() {
		global_query();
		
		});
	$( "#search_author_designation_input" ).change(function() {
		global_query();
		
		});
	
		$("#search_author_manuscript").click(function(event) {
			// Prevent the form from submitting via the browser.
			event.preventDefault();
			$( "#search_author_status_panel" ).addClass( "invisible" )
			if(user_input_validations()){
			$( "#search_author_details_containerr" ).addClass( "invisible" )
			//Blocking UI to avoid submitting duplicate request
			$.blockUI({ message: '<img src="/static/images/loader.gif" />' });
			search_author($("#search_author_manuscript").val());
			}
		});
	

		function user_input_validations(){
			var search_author_manuscript = $("#search_author_manuscript").val();
			var search_author_designation_input = $("#search_author_designation_input").val();
			
			if($.isEmptyObject(search_author_manuscript) &&  $.isEmptyObject(search_author_designation_input) ){
				$( "#search_author_status_panel" ).removeClass( "invisible" )
				$('#search_author_status_panel').text('Please fill any one of them.');
				return false;
			}else{
				return true;
			}
		}
	function global_query(){
		if(!$.isEmptyObject($("#search_author_manuscript").val()) 
		|| !$.isEmptyObject($("#search_author_designation_input").val()) 
		 ){
			
			search_author();
			
		}else{
			$( "#author_results_container" ).addClass( "invisible" )
			$('#author_results').DataTable().destroy();
		}
	}
	function search_author()
	
	{
		$.ajax({
			
			type : 'POST',
			data : JSON.stringify({search_author_manuscript:$("#search_author_manuscript").val(),
				search_author_designation_input:$("#search_author_designation_input").val(),
				}),
							contentType : 'application/json',
			url : window.location,
			success : function(items) {
				if ($.isEmptyObject(items.error_code)) {
					/*
					 * Clear table body before adding search
					 * results
					 */
					$( "#search_author_status_panel" ).addClass( "invisible" )
					$( "#author_results_container" ).removeClass( "invisible" )
					$('#author_results').DataTable().destroy();
					$("#author_results tbody").empty();
						
					
					$('#author_results')
							.DataTable({
								data:items,
								deferRender: true,
								paging: false,
								deferRender:true,
								responsive:true,
								// "scrollY": "200px",
						        "order": [[ 0, "asc" ]],
						        "columns":            [

						            {
						            "data": "Serial",
						            render: function (data, type, row, meta) {
						            return meta.row + meta.settings._iDisplayStart + 1;
						            }
						            },
									{"data": "idno",
					                "render": function(data, type, row, meta){
						                   return data;										  
						                },
										"visible": false
									},
						                
									{"data": "authname",
					                "render": function(data, type, row, meta){
										   return data;
										   
						                }
						            },
									{"data": "ptitle",
					                "render": function(data, type, row, meta){
										   return data;
										   
						                }
						            },
						            {"data": "manuscriptname",
					                "render": function(data, type, row, meta){
										   return data;
										   
						                }
						            },
									{"data": "manuscriptno",
					                "render": function(data, type, row, meta){
										   return data;
										  },
										  "visible": false
									},


									{"data": "uploadfilepaper", "name":"uploadfilepaper" , "aTargets":[4],
									"render": function(data, type, row, meta){
										
										var imgsrc = 'data:image/jpeg;base64,' +data;
										// var imgsrc = 'data:image/jpg;base64,'+this.getBase64Image(data);
										return '<img class="img-responsive" src="' + imgsrc +'" alt="PDF" height="100px" width="100px"/><br/><a target="_blank" href="download/student/image/'+row["idno"]+'">download</a>';
										 }
									},

									{"data": "createtime",
					                "render": function(data, type, row, meta){
										   return data;
										  }
										 
									},
						            
										
								  ],
								  
								//   columnDefs: [{
								// 	"targets": [3,4],
								// 	"visible": false
								//   }],

						          dom: 'lBfrtip',
						          buttons: [
						              $.extend( true, {}, buttonCommon, {
						                  extend: 'excelHtml5',
						                  text: 'EXCEL',
						                  title: 'Government Arts & Science College' + '\n' + 'Arakkonam ',
						                  className: 'btn btn-primary pull-left btn-submit search_author_btn',
						                  
						                	  exportOptions: {
						                          columns: [ 0, 1, 2 ]
						                      }
						              } ),
						              $.extend( true, {}, buttonCommon, {
										  extend: 'pdfHtml5',
										  orientation: 'portrait',
										  text: 'PDF',
										  message:'EDITORS REPORT',
						                					                   
										  className: 'btn btn-primary pull-left btn-submit search_author_btn',
										  alignment: 'center',
											header: true,
											footer: true,
						                  exportOptions: {
						                      columns: [ 0, 1, 2 ],
									  
											 
											  
										  },
										  
									

										  customize: function (doc) {
											pdfMake.fonts = {
												Bamini: {
												  normal: 'Bamini.ttf',
												  bold: 'Bamini.ttf',
												  italics: 'Bamini.ttf',
												  bolditalics: 'Bamini.ttf'
												},
												Roboto: {
												  normal: 'Roboto-Regular.ttf',
												  bold: 'Roboto-Regular.ttf',
												  italics: 'Roboto-Regular.ttf',
												  bolditalics: 'Roboto-Regular.ttf'
												}
											  };
											//   $(doc.document.body).find('tr:nth-child(2) td') = "Bamini";
											  // modify the PDF to use a different default font:
											  doc.defaultStyle.font = "Roboto";
											doc.content.splice(1, 0,
												{
													margin: [10,-35,10,10],
													alignment: 'center',
													width:200,
													image: imagevar,
													
												}
											);
											
	
											doc.styles.table = {
												alignment: 'center',
												width: '100%',
											};	
											doc.pageMargins = [10, 10, 10, 40];
											doc.defaultStyle.fontSize = 10;
											doc.styles.tableHeader.fontSize = 13;
											doc.defaultStyle.alignment = "center";
											doc.styles.tableHeader.fillColor = '#007bff';
											doc.styles.tableFooter.fillColor = '#007bff';
											doc.styles.tableHeader.alignment = 'center';
											doc.styles.tableBodyOdd.alignment = 'center';
											doc.styles.tableBodyEven.alignment = 'center';
											doc.content[0].text = doc.content[0].text.trim();
											
										
										
										
											// Create a footer
											doc['footer'] = (function (page, pages) {
												return {
													// canvas: [ { type: 'line', x1: 40, y1: 0, x2: 595-40, y2: 0, lineWidth: 10 } ],
													
													columns: [
														//This is left column
														{
															alignment: 'left',
															text: '',
															fontSize: 15
														},
														//This is middle column
														{
															alignment: 'center',
															text: '',
															fontSize: 15
														},
														{
															// This is the right column
															alignment: 'right',
															text: ['page ', { text: page.toString() }, ' of ', { text: pages.toString() }]
														}
													],
													margin: [0, 0]
	
												}
											});

										
												// Styling the table: create style object
												var objLayout = {};
												// Horizontal line thickness
												objLayout['hLineWidth'] = function(i) { return 20; };
												// Vertikal line thickness
												objLayout['vLineWidth'] = function(i) { return 20; };
												// Horizontal line color
												objLayout['hLineColor'] = function(i) { return '#00FFFF'; };
												// Vertical line color
												objLayout['vLineColor'] = function(i) { return '#00FFFF'; };
												// Left padding of the cell
												objLayout['paddingLeft'] = function(i) { return 8; };
												// Right padding of the cell
												objLayout['paddingRight'] = function(i) { return 8; };
												// Inject the object in the document
												doc.content[1].layout = objLayout;
												
									}

								
									
								}),
								$.extend(true, {}, buttonCommon, {
										
									extend: 'print',
									autoPrint: false,
									className: 'btn btn-primary pull-left btn-submit search_author_btn',
									exportOptions: {
										columns: ':visible'
									}
								}),
								
								]
								});
									
								calculatestudstrength();
				} else {
					$( "#search_author_status_panel" ).removeClass( "invisible" )
					$('#search_author_status_panel').text(items.error_message);
					$( "#author_results_container" ).addClass( "invisible" )
					$('#author_results').DataTable().destroy();
				}
			},
			error : function(error) {
					$( "#search_author_status_panel" ).removeClass( "invisible" )
					$('#search_author_status_panel').text(items.error_message);
					$( "#author_results_container" ).addClass( "invisible" )
					$('#author_results').DataTable().destroy();
			}
		});
		
		
	}
	
	
	

	
	var title = 'My title' + '\n' + 'by John';
	
	var buttonCommon = {
	        exportOptions: {
	            format: {
	                body: function ( data, row, column, node ) {
	                        return data;
	                }
	            }
	        }
		};

		

	
	

		function calculatestudstrength(){
			var data = $("#author_results tbody tr");
			var totalNetPay = 0;
			data.each(function () {
				const payEligible = $(this).find("td:eq(5)").text();
				if (!$.isEmptyObject(payEligible) && $.isNumeric(payEligible) && Number(payEligible) > 0) {
					totalNetPay = totalNetPay + Number(payEligible);
				}
			});
			$("#totalstrength").text(totalNetPay);
		
		}



		var imagevar = "data:image/png;base64,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"

}); 





