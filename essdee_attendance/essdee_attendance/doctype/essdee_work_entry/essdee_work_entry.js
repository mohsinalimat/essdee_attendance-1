frappe.ui.form.on("Essdee Work Entry", {
	employee:function(frm) {
        if(frm.doc.employee){
            frappe.call({
                method:'essdee_attendance.essdee_attendance.doctype.essdee_work_entry.essdee_work_entry.get_employee_operations',
                args:{
                    employee : frm.doc.employee
                },
                callback:function(response){
                    if(response.message){
                        console.log(response.message)
                        frm.doc.details =[]
                        $.each(response.message,function(i,d){
                            console.log(d)
                            const operation_details = frm.add_child('details')
                            operation_details.operation = d.operation
                            operation_details.rate = d.rate
                            operation_details.quantity = 0
                        })
                        frm.refresh_field('details');
                    }
                }
            })
        }
        else{
            frm.doc.details = []
            frm.refresh_field('details');
        }
    },
});
frappe.ui.form.on("Essdee Work Entry Detail",{
    operation:function(frm, cdt, cdn){
        if(!frm.doc.employee){
            frappe.msgprint('Please Set Employee')
            return;
        }
        let row = frappe.get_doc(cdt,cdn)
        if(!row.operation){
            return;
        }
        frappe.call({
            method:'essdee_attendance.essdee_attendance.doctype.essdee_work_entry.essdee_work_entry.get_operation_rate',
            args:{
                employee:frm.doc.employee,
                operation: row.operation,
            },
            callback:function(response){
                if(response.message){
                    row.rate = response.message;
                    frm.refresh_field('details');
                }
            }
        })
    }
})
