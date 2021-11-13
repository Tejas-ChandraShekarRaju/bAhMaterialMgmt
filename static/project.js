// In your Javascript (external .js resource or <script> tag)
$(document).ready(function() {
    $('.select2').select2();

    $(".update_trades_for_project").on('change', function(){
        const project_id = $(this).val()

        if (project_id) {
            $('.select_trade_for_bill').removeClass('d-none')
            $.ajax({
              url: '/material/update_trades_for_project',
              type: "POST",
              dataType: 'json',
              data: {'project_id': project_id},
              success: function(data){
                  console.log(data)
                  for(const trade of data) {
                    $(".select_trade_for_bill select").append($("<option></option>")
                    .attr("value", trade)
                    .text(trade))
                  }
              }
            });
        } else {
            $('.select_trade_for_bill').addClass('d-none')
        }
        $(".select_trade_for_bill select").select2()
   })

   $(".select_trade_for_bill select").on('change', function(){
        const trade = $(this).val()
        if (trade) {
            project_id = $("#project").val()
            $('.select_payment_stage').removeClass('d-none')
            $.ajax({
              url: '/material/update_payment_stages',
              type: "POST",
              dataType: 'json',
              data: {'project_id': project_id, 'trade': trade},
              success: function(data){
                  $('.total_wo_value').text(data['work_order_value'])
                  $('.vendor_name').text(data['vendor_name'])
                  $('.vendor_code').text(data['vendor_code'])
                  $('.vendor_pan').text(data['vendor_pan'])
                  for(const stage of Object.keys(data['stages'])) {
                    $(".select_payment_stage select").append($("<option></option>")
                    .attr("value", data['stages'][stage])
                    .text(stage))
                  }
              }
            });
        } else {
            $('.select_payment_stage').addClass('d-none')
        }
        $(".select_payment_stage select").select2()
   })

   $(".select_payment_stage select").on('change', function(){
        let payment_percentage = $(this).val()
        if (payment_percentage) {
            $(".final_details").removeClass('d-none')
            $(".payment_percentage").text(payment_percentage.toString()+"%")
            let work_order_value = parseFloat($('.total_wo_value').text())
            payment_percentage = parseFloat(payment_percentage)
            const bill_amount = (work_order_value * (payment_percentage /  100)) + work_order_value
            $(".bill_amount").text('₹ '+bill_amount.toString())
        } else {
            $(".final_details").addClass('d-none')
        }
   })

   $(".create_bill").on('click', function(){
        const project_id = $("#project").val()
        $('input[name="project_id"]').val(project_id)

        const trade = $("#trade").val()
        $('input[name="trade"]').val(trade)

        const stage = $(".select_payment_stage select").find('option:selected').text()
        $('input[name="stage"]').val(stage)

        const payment_percentage = $(".select_payment_stage select").find('option:selected').val()
        $('input[name="payment_percentage"]').val(payment_percentage)

        const amount = $('.total_wo_value').text()
        $('input[name="amount"]').val(amount)

        const vendor_name = $('.vendor_name').text()
        $('input[name="vendor_name"]').val(vendor_name)

        const vendor_code = $('.vendor_code').text()
        $('input[name="vendor_code"]').val(vendor_code)

        const vendor_pan = $('.vendor_pan').text()
        $('input[name="vendor_pan"]').val(vendor_pan)

        $("#create_bill_form").submit()
   })

});

